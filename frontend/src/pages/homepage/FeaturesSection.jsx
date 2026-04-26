const features = [
  {
    icon: '📋',
    title: 'Skrining Kuesioner',
    tag: 'Tahap 1 · Random Forest',
    desc: 'Isi kuesioner gejala kulit — asimetris, tepi, warna, diameter, evolusi, gatal, dan riwayat keluarga. Model Random Forest menghitung skor risiko Anda secara instan.',
    accent: '#6CD0F6',
  },
  {
    icon: '🔬',
    title: 'Analisis Gambar AI',
    tag: 'Tahap 2 · EfficientNet-B3',
    desc: 'Upload foto lesi kulit Anda. EfficientNet-B3 menganalisis dan mengklasifikasi ke 7 kategori diagnosis dengan preprocessing CLAHE untuk hasil yang presisi.',
    accent: '#BACED9',
  },
  {
    icon: '📊',
    title: 'Hasil & Rekomendasi',
    tag: 'Risiko Rendah · Sedang · Tinggi',
    desc: 'Dapatkan laporan lengkap — tingkat risiko, kelas lesi terdeteksi, skor kepercayaan model, dan saran medis yang disesuaikan dengan hasil analisis Anda.',
    accent: '#1B3A4B',
  },
]

export default function FeaturesSection() {
  return (
    <section className="px-[8%] py-16 lg:py-24" style={{ backgroundColor: '#F2F8FC' }}>

      {/* Heading */}
      <div className="text-center mb-10 lg:mb-16">
        <span className="text-[#6CD0F6] text-sm font-semibold tracking-widest uppercase">
          Fitur Utama
        </span>
        <h2 className="font-['Kalnia'] text-[30px] sm:text-[36px] lg:text-[42px] font-medium text-[#12283A] leading-[1.2] mt-3">
          Mengapa YourSKIN?
        </h2>
        <p className="text-[#4A6070] text-[14px] lg:text-[16px] leading-[1.6] mt-4 max-w-xl mx-auto">
          Dua tahap analisis yang saling melengkapi untuk deteksi dini
          kanker kulit yang lebih akurat dan terpercaya.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 lg:p-8 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(18,40,58,0.1)] transition-all duration-300 flex flex-col"
            style={{ borderTop: `4px solid ${f.accent}` }}
          >
            <div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-xl lg:text-2xl mb-5 lg:mb-6"
              style={{ backgroundColor: `${f.accent}20` }}
            >
              {f.icon}
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: f.accent === '#BACED9' ? '#5A8FA8' : f.accent }}>
              {f.tag}
            </span>
            <h3 className="font-['Kalnia'] text-[19px] lg:text-[22px] font-medium text-[#12283A] mb-3">
              {f.title}
            </h3>
            <p className="text-[#4A6070] text-[14px] lg:text-[15px] leading-[1.65]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}
