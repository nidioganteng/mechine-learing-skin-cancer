import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['KERAS_BACKEND'] = 'tensorflow'

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import pickle
import cv2
import traceback
import numpy as np
from werkzeug.utils import secure_filename
import keras
from PIL import Image

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database.db_connection import get_db_connection

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'yourskin_secret_key_super_aman')
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        from flask import Response
        res = Response()
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return res

MONTHS_ID = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
             'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

def get_current_user_id():
    if 'id_user' in session:
        return session['id_user']
    user_id = request.headers.get('X-User-Id')
    if user_id and str(user_id).isdigit():
        return int(user_id)
    return None

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
        model_tahap2 = keras.models.load_model(model_path_t2, compile=False)
        print("✅ Model Tahap 2 (EfficientNet-B3) berhasil dimuat!")
    else:
        print(f"❌ File model Tahap 2 tidak ditemukan di: {model_path_t2}")
        model_tahap2 = None
except Exception as e:
    print(f"❌ Gagal memuat model Tahap 2: {e}")
    traceback.print_exc()
    model_tahap2 = None

# ==========================================
# API FORM OPTIONS — kembalikan keys encoding map
# ==========================================
@app.route('/api/form_options')
def api_form_options():
    if not encoding_maps:
        return jsonify({"status": "error", "message": "Encoding maps tidak tersedia."}), 500
    return jsonify({
        "status": "success",
        "genders":      sorted(encoding_maps.get('Gender', {}).keys()),
        "skin_types":   list(encoding_maps.get('Skin_Type', {}).keys()),
        "sun_exposures": list(encoding_maps.get('Sun_Exposure', {}).keys()),
    })


# ==========================================
# API PREDIKSI TAHAP 1 — JSON (React frontend)
# ==========================================
@app.route('/api/prediksi_tahap1', methods=['POST'])
def api_prediksi_tahap1():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "pesan": "Sesi berakhir, silakan login kembali."}), 401

    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "pesan": "Data tidak valid."}), 400

    try:

        usia                 = int(data.get('usia', 0))
        gender_raw           = data.get('gender', '')
        tipe_kulit_raw       = data.get('tipe_kulit', '')
        paparan_uv_raw       = data.get('paparan_uv', '')
        riwayat_keluarga_raw = data.get('riwayat_keluarga', '')
        jumlah_tahi_lalat    = int(data.get('jumlah_tahi_lalat', 0))
        diameter_mm          = float(data.get('diameter_mm', 0.0))
        asimetris_raw        = data.get('asimetris', '')
        tepi_kasar_raw       = data.get('tepi_kasar', '')
        warna_bervariasi_raw = data.get('warna_bervariasi', '')
        evolusi_raw          = data.get('evolusi', '')
        gatal_raw            = data.get('gatal', '')
        berdarah_raw         = data.get('berdarah', '')

        def encode_binary(val):
            return 1 if val == 'Yes' else 0

        asimetris        = encode_binary(asimetris_raw)
        tepi_kasar       = encode_binary(tepi_kasar_raw)
        warna_bervariasi = encode_binary(warna_bervariasi_raw)
        evolusi          = encode_binary(evolusi_raw)
        gatal            = encode_binary(gatal_raw)
        berdarah         = encode_binary(berdarah_raw)
        riwayat_keluarga = encode_binary(riwayat_keluarga_raw)

        gender     = encoding_maps.get('Gender', {}).get(gender_raw, 0)
        tipe_kulit = encoding_maps.get('Skin_Type', {}).get(tipe_kulit_raw, 3)
        paparan_uv = encoding_maps.get('Sun_Exposure', {}).get(paparan_uv_raw, 1)

        if rf_model is None or not encoding_maps:
            return jsonify({"status": "error", "pesan": "Model Random Forest tidak tersedia."}), 500

        input_df = pd.DataFrame([[
            usia, gender, tipe_kulit, paparan_uv, riwayat_keluarga,
            jumlah_tahi_lalat, gatal, berdarah, asimetris, tepi_kasar,
            warna_bervariasi, diameter_mm, evolusi
        ]], columns=encoding_maps['feature_names'])

        prediksi     = int(rf_model.predict(input_df)[0])
        skor_rf      = float(rf_model.predict_proba(input_df)[0][1])
        hasil_risiko = "BERISIKO" if prediksi == 1 else "TIDAK BERISIKO"

        # Probabilitas yang ditampilkan ke user
        if hasil_risiko == "TIDAK BERISIKO":
            probabilitas_persen = round((1 - skor_rf) * 100, 1)
            probabilitas_label  = "Probabilitas Aman"
        else:
            probabilitas_persen = round(skor_rf * 100, 1)
            probabilitas_label  = "Probabilitas Berisiko"

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
            "status":              "success",
            "hasil_risiko":        hasil_risiko,
            "saran":               saran_teks,
            "skor_rf":             round(skor_rf * 100, 2),
            "probabilitas_persen": probabilitas_persen,
            "probabilitas_label":  probabilitas_label,
        })

    except Exception as e:
        return jsonify({"status": "error", "pesan": str(e)}), 400


# ==========================================
# API AUTH (JSON — untuk React frontend)
# ==========================================
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Request tidak valid."}), 400

    nama_lengkap = data.get('nama_lengkap', '').strip()
    email        = data.get('email', '').strip()
    password     = data.get('password', '')

    if not nama_lengkap or not email or not password:
        return jsonify({"status": "error", "message": "Semua field wajib diisi."}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Gagal terhubung ke database."}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_user FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": "Email sudah terdaftar. Gunakan email lain atau login."}), 409

    cursor.execute(
        "INSERT INTO users (nama_lengkap, email, password) VALUES (%s, %s, %s)",
        (nama_lengkap, email, hashed_password)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success", "message": "Pendaftaran berhasil! Silakan login."})


@app.route('/api/dashboard')
def api_dashboard():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "message": "Belum login."}), 401

    nama_lengkap = ''
    total_pengecekan = 0
    status_terakhir = None
    riwayat_singkat = []

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT nama_lengkap FROM users WHERE id_user = %s", (id_user,))
        user_row = cursor.fetchone()
        if user_row:
            nama_lengkap = user_row['nama_lengkap']

        cursor.execute("SELECT COUNT(*) as total FROM riwayat_tahap1 WHERE id_user = %s", (id_user,))
        row = cursor.fetchone()
        total_pengecekan = row['total'] if row else 0

        cursor.execute(
            "SELECT skor_rf, hasil_risiko FROM riwayat_tahap1 WHERE id_user = %s ORDER BY waktu_deteksi DESC LIMIT 1",
            (id_user,)
        )
        last = cursor.fetchone()
        if last:
            status_terakhir = {
                "skor": round(float(last['skor_rf']) * 100),
                "label": last['hasil_risiko']
            }

        cursor.execute("""
            SELECT r1.waktu_deteksi, r1.hasil_risiko,
                   (SELECT prediksi_kelas FROM riwayat_tahap2
                    WHERE id_user = r1.id_user
                      AND DATE(waktu_analisis) = DATE(r1.waktu_deteksi)
                    ORDER BY waktu_analisis DESC LIMIT 1) AS prediksi_kelas
            FROM riwayat_tahap1 r1
            WHERE r1.id_user = %s
            ORDER BY r1.waktu_deteksi DESC
            LIMIT 5
        """, (id_user,))
        rows = cursor.fetchall()

        keterangan_map = {
            'BERISIKO':      'Perlu pemeriksaan segera',
            'TIDAK BERISIKO': 'Kondisi baik',
        }
        for r in rows:
            dt = r['waktu_deteksi']
            waktu_str = (
                f"{dt.day} {MONTHS_ID[dt.month]} {dt.year}/{dt.strftime('%H:%M')} Wita"
                if dt else '-'
            )
            riwayat_singkat.append({
                'waktu': waktu_str,
                'tahap1': r['hasil_risiko'],
                'tahap2': r['prediksi_kelas'] or '-',
                'keterangan': keterangan_map.get(r['hasil_risiko'], '-'),
            })

        cursor.close()
        conn.close()

    return jsonify({
        "status": "success",
        "nama_lengkap": nama_lengkap,
        "total_pengecekan": total_pengecekan,
        "status_terakhir": status_terakhir,
        "riwayat_singkat": riwayat_singkat,
    })


# ==========================================
# API RIWAYAT LENGKAP
# ==========================================
@app.route('/api/riwayat')
def api_riwayat():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "message": "Belum login."}), 401
    riwayat = []

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT r1.id_riwayat, r1.waktu_deteksi, r1.hasil_risiko, r1.skor_rf,
                   r1.usia, r1.gender, r1.tipe_kulit, r1.paparan_uv, r1.riwayat_keluarga,
                   r1.jumlah_tahi_lalat, r1.diameter_mm,
                   r1.asimetris, r1.tepi_kasar, r1.warna_bervariasi, r1.evolusi,
                   r1.gatal, r1.berdarah,
                   (SELECT prediksi_kelas FROM riwayat_tahap2
                    WHERE id_user = r1.id_user
                      AND DATE(waktu_analisis) = DATE(r1.waktu_deteksi)
                    ORDER BY waktu_analisis DESC LIMIT 1) AS prediksi_kelas,
                   (SELECT confidence_score FROM riwayat_tahap2
                    WHERE id_user = r1.id_user
                      AND DATE(waktu_analisis) = DATE(r1.waktu_deteksi)
                    ORDER BY waktu_analisis DESC LIMIT 1) AS confidence_score
            FROM riwayat_tahap1 r1
            WHERE r1.id_user = %s
            ORDER BY r1.waktu_deteksi DESC
        """, (id_user,))
        rows = cursor.fetchall()
        for r in rows:
            dt = r['waktu_deteksi']
            waktu_str = (
                f"{dt.day} {MONTHS_ID[dt.month]} {dt.year}, {dt.strftime('%H:%M')} Wita"
                if dt else '-'
            )
            riwayat.append({
                'id':            r['id_riwayat'],
                'waktu':         waktu_str,
                'hasil_risiko':  r['hasil_risiko'],
                'skor_rf':       round(float(r['skor_rf']) * 100, 1) if r['skor_rf'] else 0,
                'tahap2_kelas':  r['prediksi_kelas'] or None,
                'tahap2_conf':   round(float(r['confidence_score']) * 100, 1) if r['confidence_score'] else None,
                'usia':          r['usia'],
                'gender':        r['gender'],
                'tipe_kulit':    r['tipe_kulit'],
                'paparan_uv':    r['paparan_uv'],
                'riwayat_keluarga': r['riwayat_keluarga'],
                'jumlah_tahi_lalat': r['jumlah_tahi_lalat'],
                'diameter_mm':   str(r['diameter_mm']) if r['diameter_mm'] else '-',
                'asimetris':     r['asimetris'],
                'tepi_kasar':    r['tepi_kasar'],
                'warna_bervariasi': r['warna_bervariasi'],
                'evolusi':       r['evolusi'],
                'gatal':         r['gatal'],
                'berdarah':      r['berdarah'],
            })
        cursor.close()
        conn.close()

    return jsonify({"status": "success", "riwayat": riwayat, "total": len(riwayat)})


# ==========================================
# API PROFIL
# ==========================================
@app.route('/api/profil')
def api_profil():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "message": "Belum login."}), 401
    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Gagal koneksi database."}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_user, nama_lengkap, email FROM users WHERE id_user = %s", (id_user,))
    user = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as total FROM riwayat_tahap1 WHERE id_user = %s", (id_user,))
    total_row = cursor.fetchone()
    total_pengecekan = total_row['total'] if total_row else 0

    cursor.execute(
        "SELECT hasil_risiko FROM riwayat_tahap1 WHERE id_user = %s ORDER BY waktu_deteksi DESC LIMIT 1",
        (id_user,)
    )
    last = cursor.fetchone()
    status_terakhir = last['hasil_risiko'] if last else None

    cursor.close()
    conn.close()

    return jsonify({
        "status": "success",
        "user": {
            "id_user":      user['id_user'],
            "nama_lengkap": user['nama_lengkap'],
            "email":        user['email'],
        },
        "stats": {
            "total_pengecekan": total_pengecekan,
            "status_terakhir":  status_terakhir,
        }
    })


@app.route('/api/profil/update', methods=['POST'])
def api_profil_update():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "message": "Belum login."}), 401

    data = request.get_json()
    nama_baru = (data.get('nama_lengkap') or '').strip()
    if not nama_baru:
        return jsonify({"status": "error", "message": "Nama tidak boleh kosong."}), 400
    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Gagal koneksi database."}), 500

    cursor = conn.cursor()
    cursor.execute("UPDATE users SET nama_lengkap = %s WHERE id_user = %s", (nama_baru, id_user))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success", "message": "Nama berhasil diperbarui."})


@app.route('/api/profil/password', methods=['POST'])
def api_profil_password():
    id_user = get_current_user_id()
    if not id_user:
        return jsonify({"status": "error", "message": "Belum login."}), 401

    data = request.get_json()
    password_lama  = data.get('password_lama', '')
    password_baru  = data.get('password_baru', '')
    if not password_lama or not password_baru:
        return jsonify({"status": "error", "message": "Semua field wajib diisi."}), 400
    if len(password_baru) < 6:
        return jsonify({"status": "error", "message": "Password baru minimal 6 karakter."}), 400
    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Gagal koneksi database."}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password FROM users WHERE id_user = %s", (id_user,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user['password'], password_lama):
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": "Password lama salah."}), 401

    hashed = generate_password_hash(password_baru, method='pbkdf2:sha256')
    cursor.execute("UPDATE users SET password = %s WHERE id_user = %s", (hashed, id_user))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success", "message": "Password berhasil diperbarui."})


@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Request tidak valid."}), 400

    email          = data.get('email', '').strip()
    password_input = data.get('password', '')

    if not email or not password_input:
        return jsonify({"status": "error", "message": "Email dan password wajib diisi."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Gagal terhubung ke database."}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password'], password_input):
        return jsonify({"status": "error", "message": "Email atau password salah."}), 401

    session['id_user']      = user['id_user']
    session['nama_lengkap'] = user['nama_lengkap']
    return jsonify({
        "status": "success",
        "message": "Login berhasil.",
        "user": {"nama_lengkap": user['nama_lengkap']},
    })


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
        prediksi     = int(rf_model.predict(input_df)[0])
        skor_rf      = float(rf_model.predict_proba(input_df)[0][1])
        hasil_risiko = "BERISIKO" if prediksi == 1 else "TIDAK BERISIKO"

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
    id_user = get_current_user_id()
    if not id_user:
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
        filename = f"{id_user}_{filename}"
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

        if confidence < 0.10:
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