import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db_connection import get_db_connection, create_database_if_not_exists

def migrate():
    create_database_if_not_exists()
    conn = get_db_connection()
    if conn is not None:
        cursor = conn.cursor()

        # ==========================================
        # RESET TABEL (urutan penting karena ada FK)
        # ==========================================
        cursor.execute("DROP TABLE IF EXISTS riwayat_tahap2")
        cursor.execute("DROP TABLE IF EXISTS riwayat_tahap1")
        cursor.execute("DROP TABLE IF EXISTS saran_risiko")
        cursor.execute("DROP TABLE IF EXISTS users")

        # ==========================================
        # TABEL USERS
        # ==========================================
        cursor.execute("""
        CREATE TABLE users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            nama_lengkap VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # ==========================================
        # TABEL SARAN RISIKO (3 Level)
        # ==========================================
        cursor.execute("""
        CREATE TABLE saran_risiko (
            hasil_risiko VARCHAR(50) PRIMARY KEY,
            saran TEXT NOT NULL
        )
        """)

        # ==========================================
        # TABEL RIWAYAT TAHAP 1
        # ==========================================
        cursor.execute("""
        CREATE TABLE riwayat_tahap1 (
            id_riwayat INT AUTO_INCREMENT PRIMARY KEY,
            id_user INT NOT NULL,
            waktu_deteksi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            usia INT,
            gender VARCHAR(10),
            tipe_kulit VARCHAR(20),
            paparan_uv VARCHAR(20),
            riwayat_keluarga VARCHAR(10),
            jumlah_tahi_lalat INT,
            asimetris VARCHAR(10),
            tepi_kasar VARCHAR(10),
            warna_bervariasi VARCHAR(10),
            diameter_mm FLOAT,
            evolusi VARCHAR(10),
            gatal VARCHAR(10),
            berdarah VARCHAR(10),
            skor_rf FLOAT,
            hasil_risiko VARCHAR(50),
            FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
        )
        """)

        # ==========================================
        # TABEL RIWAYAT TAHAP 2
        # ==========================================
        cursor.execute("""
        CREATE TABLE riwayat_tahap2 (
            id_riwayat_t2 INT AUTO_INCREMENT PRIMARY KEY,
            id_user INT NOT NULL,
            waktu_analisis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            nama_file_gambar VARCHAR(255) NOT NULL,
            prediksi_kelas VARCHAR(100) NOT NULL,
            confidence_score FLOAT NOT NULL,
            FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
        )
        """)

        # ==========================================
        # DATA SARAN PER LEVEL RISIKO (RF Threshold)
        # Threshold: skor_rf >= 0.65 → TINGGI
        #            skor_rf >= 0.35 → SEDANG
        #            skor_rf <  0.35 → RENDAH
        # ==========================================
        saran_data = [
            (
                'RISIKO TINGGI',
                'Model AI mendeteksi probabilitas keganasan yang tinggi pada kondisi kulit Anda. '
                'Segera periksakan ke Dokter Spesialis Kulit (Sp.KK) untuk evaluasi klinis dan kemungkinan biopsi. '
                'Jangan tunda pemeriksaan meskipun gejala terasa ringan.'
            ),
            (
                'RISIKO SEDANG',
                'Model AI mendeteksi beberapa indikator yang perlu diwaspadai. '
                'Disarankan untuk berkonsultasi dengan dokter dalam waktu dekat dan melakukan pemeriksaan mandiri secara rutin setiap bulan. '
                'Gunakan tabir surya SPF 30+ dan hindari paparan sinar matahari berlebih.'
            ),
            (
                'RISIKO RENDAH',
                'Model AI tidak mendeteksi indikator berisiko tinggi pada kondisi kulit Anda saat ini. '
                'Tetap jaga kesehatan kulit dengan penggunaan tabir surya setiap hari dan lakukan pemeriksaan mandiri rutin. '
                'Kunjungi dokter secara berkala untuk skrining preventif.'
            ),
        ]

        cursor.executemany(
            "INSERT INTO saran_risiko (hasil_risiko, saran) VALUES (%s, %s)",
            saran_data
        )

        conn.commit()
        print("✅ Migrasi database berhasil!")
        print("   - Tabel users          ✓")
        print("   - Tabel saran_risiko   ✓ (3 level risiko)")
        print("   - Tabel riwayat_tahap1 ✓")
        print("   - Tabel riwayat_tahap2 ✓")
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()