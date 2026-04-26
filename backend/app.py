from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import pickle
import cv2
import os
import sys
import numpy as np
from werkzeug.utils import secure_filename
import tensorflow as tf
from keras.models import load_model
from PIL import Image

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database.db_connection import get_db_connection

app = Flask(__name__)
app.secret_key = 'yourskin_secret_key_super_aman'

# ==========================================
# LOAD MODEL TAHAP 1 (Random Forest)
# ==========================================
MODEL_PATH = 'models/model_tahap1_rf.pkl'
ENCODING_PATH = 'models/encoding_maps_tahap1.pkl'

try:
    with open(MODEL_PATH, 'rb') as f:
        rf_model = pickle.load(f)
    with open(ENCODING_PATH, 'rb') as f:
        encoding_maps = pickle.load(f)
    print("✅ Model Random Forest dan Encoding Maps berhasil dimuat!")
except Exception as e:
    print(f"⚠️ Gagal memuat model Tahap 1. Error: {e}")
    rf_model = None
    encoding_maps = {}

# ==========================================
# LOAD MODEL TAHAP 2 (EfficientNet-B3)
# ==========================================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model_path_t2 = os.path.join(BASE_DIR, 'models', 'model_tahap2_en.keras')
    if os.path.exists(model_path_t2):
        model_tahap2 = load_model(model_path_t2, compile=False)
        print("✅ Model Tahap 2 (EfficientNet-B3) berhasil dimuat!")
    else:
        print(f"❌ File model Tahap 2 tidak ditemukan di: {model_path_t2}")
        model_tahap2 = None
except Exception as e:
    print(f"❌ Gagal memuat model Tahap 2: {e}")
    model_tahap2 = None

# ==========================================
# ROUTING PUBLIC
# ==========================================
@app.route('/')
def index():
    return render_template('index.html')

# ==========================================
# ROUTING AUTH
# ==========================================
@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'id_user' in session:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        nama_lengkap = request.form['nama_lengkap']
        email = request.form['email']
        password = request.form['password']
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                flash("Email sudah terdaftar. Silakan gunakan email lain atau Login.", "danger")
            else:
                cursor.execute("INSERT INTO users (nama_lengkap, email, password) VALUES (%s, %s, %s)",
                               (nama_lengkap, email, hashed_password))
                conn.commit()
                flash("Pendaftaran berhasil! Silakan Login.", "success")
                cursor.close()
                conn.close()
                return redirect(url_for('login'))
            cursor.close()
            conn.close()
    return render_template('users/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'id_user' in session:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        email = request.form['email']
        password_input = request.form['password']
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            cursor.close()
            conn.close()
            if user and check_password_hash(user['password'], password_input):
                session['id_user'] = user['id_user']
                session['nama_lengkap'] = user['nama_lengkap']
                return redirect(url_for('dashboard'))
            else:
                flash("Email atau Password salah!", "danger")
    return render_template('users/login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ==========================================
# ROUTING DASHBOARD
# ==========================================
@app.route('/dashboard')
def dashboard():
    if 'id_user' not in session:
        flash("Silakan login terlebih dahulu untuk mengakses Dashboard.", "danger")
        return redirect(url_for('login'))
    id_user = session['id_user']
    total_riwayat = 0
    status_terakhir = "Belum ada analisis"
    waktu_terakhir = "-"
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as total FROM riwayat_tahap1 WHERE id_user = %s", (id_user,))
        result_total = cursor.fetchone()
        if result_total:
            total_riwayat = result_total['total']
        cursor.execute(
            "SELECT hasil_risiko, DATE_FORMAT(waktu_deteksi, '%%d-%%m-%%Y %%H:%%i') as waktu "
            "FROM riwayat_tahap1 WHERE id_user = %s ORDER BY waktu_deteksi DESC LIMIT 1",
            (id_user,)
        )
        result_last = cursor.fetchone()
        if result_last:
            status_terakhir = result_last['hasil_risiko']
            waktu_terakhir = result_last['waktu']
        cursor.close()
        conn.close()
    return render_template('users/dashboard.html',
                           total_riwayat=total_riwayat,
                           status_terakhir=status_terakhir,
                           waktu_terakhir=waktu_terakhir)

# ==========================================
# ROUTING KUESIONER
# ==========================================
@app.route('/kuesioner')
def kuesioner():
    if 'id_user' not in session:
        flash("Silakan login terlebih dahulu untuk melakukan analisis.", "danger")
        return redirect(url_for('login'))
    return render_template('kuesioner.html')

# ==========================================
# PREDIKSI TAHAP 1 — RULE BASE + RF
# ==========================================
@app.route('/prediksi_tahap1', methods=['POST'])
def prediksi_tahap1():
    if 'id_user' not in session:
        return jsonify({"status": "error", "pesan": "Sesi telah berakhir, silakan login kembali."}), 401

    try:
        id_user = session['id_user']
        data = request.form

        # Ambil data mentah
        usia                 = int(data.get('usia', 0))
        gender_raw           = data.get('gender')
        tipe_kulit_raw       = data.get('tipe_kulit')
        paparan_uv_raw       = data.get('paparan_uv')
        riwayat_keluarga_raw = data.get('riwayat_keluarga')
        jumlah_tahi_lalat    = int(data.get('jumlah_tahi_lalat', 0))
        diameter_mm          = float(data.get('diameter_mm', 0.0))
        asimetris_raw        = data.get('asimetris')
        tepi_kasar_raw       = data.get('tepi_kasar')
        warna_bervariasi_raw = data.get('warna_bervariasi')
        evolusi_raw          = data.get('evolusi')
        gatal_raw            = data.get('gatal')
        berdarah_raw         = data.get('berdarah')

        # Encode binary
        def encode_binary(val):
            return 1 if val == 'Yes' else 0

        asimetris        = encode_binary(asimetris_raw)
        tepi_kasar       = encode_binary(tepi_kasar_raw)
        warna_bervariasi = encode_binary(warna_bervariasi_raw)
        evolusi          = encode_binary(evolusi_raw)
        gatal            = encode_binary(gatal_raw)
        berdarah         = encode_binary(berdarah_raw)
        riwayat_keluarga = encode_binary(riwayat_keluarga_raw)

        # Encode untuk RF
        gender     = encoding_maps.get('Gender', {}).get(gender_raw, 0)
        tipe_kulit = encoding_maps.get('Skin_Type', {}).get(tipe_kulit_raw, 3)
        paparan_uv = encoding_maps.get('Sun_Exposure', {}).get(paparan_uv_raw, 1)

        # ==========================================
        # PREDIKSI RANDOM FOREST
        # ==========================================
        if rf_model is None or not encoding_maps:
            return jsonify({"status": "error", "pesan": "Model Random Forest tidak tersedia."}), 500

        input_df = pd.DataFrame([[
            usia, gender, tipe_kulit, paparan_uv, riwayat_keluarga,
            jumlah_tahi_lalat, gatal, berdarah, asimetris, tepi_kasar,
            warna_bervariasi, diameter_mm, evolusi
        ]], columns=encoding_maps['feature_names'])
        skor_rf = float(rf_model.predict_proba(input_df)[0][1])

        # Threshold: >= 0.65 → TINGGI, >= 0.35 → SEDANG, < 0.35 → RENDAH
        if skor_rf >= 0.65:
            hasil_risiko = "RISIKO TINGGI"
        elif skor_rf >= 0.35:
            hasil_risiko = "RISIKO SEDANG"
        else:
            hasil_risiko = "RISIKO RENDAH"

        # Ambil saran dari database & simpan riwayat
        saran_teks = "Tidak ada saran ditemukan."
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT saran FROM saran_risiko WHERE hasil_risiko = %s", (hasil_risiko,))
            saran_row = cursor.fetchone()
            if saran_row:
                saran_teks = saran_row['saran']

            cursor.execute("""
            INSERT INTO riwayat_tahap1 (
                id_user, usia, gender, tipe_kulit, paparan_uv, riwayat_keluarga,
                jumlah_tahi_lalat, asimetris, tepi_kasar, warna_bervariasi, diameter_mm,
                evolusi, gatal, berdarah, skor_rf, hasil_risiko
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                id_user, usia, gender_raw, tipe_kulit_raw, paparan_uv_raw,
                riwayat_keluarga_raw, jumlah_tahi_lalat, asimetris_raw, tepi_kasar_raw,
                warna_bervariasi_raw, diameter_mm, evolusi_raw, gatal_raw, berdarah_raw,
                skor_rf, hasil_risiko
            ))
            conn.commit()
            session['last_riwayat_tahap1_id'] = cursor.lastrowid
            session.pop('last_riwayat_tahap2_id', None)
            cursor.close()
            conn.close()

        return jsonify({
            "status": "success",
            "hasil_risiko": hasil_risiko,
            "saran": saran_teks,
            "skor_rf": round(skor_rf * 100, 2),
            "redirect_hasil": url_for('hasil')
        })

    except Exception as e:
        return jsonify({"status": "error", "pesan": str(e)}), 400

# ==========================================
# ROUTING ANALISIS GAMBAR TAHAP 2
# ==========================================
@app.route('/analisis_gambar')
def analisis_gambar():
    if 'id_user' not in session:
        flash("Silakan login terlebih dahulu.", "danger")
        return redirect(url_for('login'))
    return render_template('image_detector.html')

@app.route('/prediksi_tahap2', methods=['POST'])
def prediksi_tahap2():
    if 'id_user' not in session:
        return jsonify({'status': 'error', 'pesan': 'Sesi berakhir, silakan login kembali.'}), 401
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'pesan': 'Tidak ada file gambar yang diunggah.'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'pesan': 'Pilih file gambar yang valid.'})
    if model_tahap2 is None:
        return jsonify({'status': 'error', 'pesan': 'Model AI Tahap 2 belum tersedia di server.'})

    try:
        upload_folder = os.path.join('static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        filename = secure_filename(file.filename)
        filename = f"{session['id_user']}_{filename}"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        target_size = (300, 300)
        img = Image.open(filepath).resize(target_size)
        img_array = np.array(img).astype(np.uint8)

        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        img_clahe = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB).astype(np.float32)
        img_final = np.expand_dims(img_clahe, axis=0)

        prediksi = model_tahap2.predict(img_final)
        confidence = float(np.max(prediksi))
        kelas_idx = int(np.argmax(prediksi))

        if os.path.exists(filepath):
            os.remove(filepath)

        if confidence < 0.60:
            return jsonify({'status': 'error_confidence'})

        daftar_kelas = [
            'Actinic keratoses (akiec)',
            'Basal cell carcinoma (bcc)',
            'Benign keratosis-like (bkl)',
            'Dermatofibroma (df)',
            'Melanoma (mel)',
            'Melanocytic nevi (nv)',
            'Vascular lesions (vasc)'
        ]
        kelas_hasil = daftar_kelas[kelas_idx]

        # ==========================================
        # SIMPAN HASIL TAHAP 2 KE DATABASE
        # ==========================================
        id_user = session['id_user']
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO riwayat_tahap2 (id_user, nama_file_gambar, prediksi_kelas, confidence_score) "
                "VALUES (%s, %s, %s, %s)",
                (id_user, filename, kelas_hasil, confidence)
            )
            conn.commit()
            id_riwayat_t2 = cursor.lastrowid
            session['last_riwayat_tahap2_id'] = id_riwayat_t2
            cursor.close()
            conn.close()

        return jsonify({
            'status': 'success',
            'kelas': kelas_hasil,
            'confidence': confidence,
            'redirect_hasil': url_for('hasil')  # URL redirect ke halaman hasil
        })

    except Exception as e:
        print(f"❌ Error Tahap 2: {str(e)}")
        return jsonify({'status': 'error', 'pesan': f'Terjadi kesalahan: {str(e)}'})

# ==========================================
# ROUTING HALAMAN HASIL AKHIR
# ==========================================
@app.route('/hasil')
def hasil():
    if 'id_user' not in session:
        flash("Silakan login terlebih dahulu.", "danger")
        return redirect(url_for('login'))

    id_user = session['id_user']
    tahap1_data = None
    tahap2_data = None
    saran = None

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)

        # Ambil riwayat tahap 1 terakhir user ini
        # (bisa dari session ID atau query terbaru)
        id_riwayat_t1 = session.get('last_riwayat_tahap1_id')
        if id_riwayat_t1:
            cursor.execute(
                "SELECT * FROM riwayat_tahap1 WHERE id_riwayat = %s AND id_user = %s",
                (id_riwayat_t1, id_user)
            )
        else:
            cursor.execute(
                "SELECT * FROM riwayat_tahap1 WHERE id_user = %s ORDER BY waktu_deteksi DESC LIMIT 1",
                (id_user,)
            )
        tahap1_data = cursor.fetchone()

        # Ambil saran dari saran_risiko
        if tahap1_data:
            cursor.execute(
                "SELECT saran FROM saran_risiko WHERE hasil_risiko = %s",
                (tahap1_data['hasil_risiko'],)
            )
            saran_row = cursor.fetchone()
            if saran_row:
                saran = saran_row['saran']

        # Ambil riwayat tahap 2 terakhir user ini (jika ada)
        id_riwayat_t2 = session.get('last_riwayat_tahap2_id')
        if id_riwayat_t2:
            cursor.execute(
                "SELECT * FROM riwayat_tahap2 WHERE id_riwayat_t2 = %s AND id_user = %s",
                (id_riwayat_t2, id_user)
            )
        else:
            cursor.execute(
                "SELECT * FROM riwayat_tahap2 WHERE id_user = %s ORDER BY waktu_analisis DESC LIMIT 1",
                (id_user,)
            )
        tahap2_data = cursor.fetchone()

        cursor.close()
        conn.close()

    return render_template('hasil.html',
                           tahap1=tahap1_data,
                           tahap2=tahap2_data,
                           saran=saran)

# ==========================================
# JALANKAN SERVER
# ==========================================
if __name__ == '__main__':
    app.run(debug=True, port=5001)