const stats = [
  { value: '7', label: 'Kelas Lesi Kulit', desc: 'melanoma, bcc, akiec, bkl, df, nv, vasc', accent: '#6CD0F6' },
  { value: '2', label: 'Tahap Analisis', desc: 'kuesioner + analisis gambar terintegrasi', accent: '#BACED9' },
  { value: '90%+', label: 'Akurasi Model', desc: 'EfficientNet-B3 pada dataset HAM10000', accent: '#6CD0F6' },
  { value: '< 10s', label: 'Waktu Deteksi', desc: 'hasil analisis real-time di browser Anda', accent: '#BACED9' },
]

const diseases = [
  { code: 'MEL', name: 'Melanoma', risk: 'Tinggi', dot: 'bg-red-400' },
  { code: 'BCC', name: 'Basal Cell Carcinoma', risk: 'Tinggi', dot: 'bg-red-400' },
  { code: 'AKIEC', name: 'Actinic Keratoses', risk: 'Sedang', dot: 'bg-orange-400' },
  { code: 'BKL', name: 'Benign Keratosis', risk: 'Rendah', dot: 'bg-emerald-400' },
  { code: 'DF', name: 'Dermatofibroma', risk: 'Rendah', dot: 'bg-emerald-400' },
  { code: 'NV', name: 'Melanocytic Nevi', risk: 'Rendah', dot: 'bg-emerald-400' },
  { code: 'VASC', name: 'Vascular Lesions', risk: 'Rendah', dot: 'bg-emerald-400' },
]

export default function StatsSection() {
  return (
    <section className="px-[8%] py-16 lg:py-24 bg-white">

      {/* Heading */}
      <div className="text-center mb-10 lg:mb-16">
        <span className="text-[#6CD0F6] text-sm font-semibold tracking-widest uppercase">
          Kemampuan Sistem
        </span>
        <h2 className="font-['Kalnia'] text-[30px] sm:text-[36px] lg:text-[42px] font-medium text-[#12283A] leading-[1.2] mt-3">
          Didukung Data & Ilmu Pengetahuan
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10 lg:mb-16">
        {stats.map((s, i) => (
          <div
            key={i}
            className="text-center p-6 lg:p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300"
            style={{
              backgroundColor: '#F2F8FC',
              borderBottom: `4px solid ${s.accent}`,
            }}
          >
            <div
              className="font-['Kalnia'] text-[40px] lg:text-[52px] font-medium leading-none mb-2"
              style={{ color: s.accent === '#BACED9' ? '#5A8FA8' : s.accent }}
            >
              {s.value}
            </div>
            <div className="text-[#12283A] font-semibold text-[13px] lg:text-[15px] mb-1">{s.label}</div>
            <div className="text-[#4A6070] text-[12px] lg:text-[13px] leading-normal hidden sm:block">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* 7 Kelas Penyakit */}
      <div className="rounded-3xl p-6 lg:p-10" style={{ backgroundColor: '#F2F8FC' }}>
        <h3 className="font-['Kalnia'] text-[22px] lg:text-[26px] font-medium text-[#12283A] mb-2">
          7 Kelas yang Dapat Dideteksi
        </h3>
        <p className="text-[#4A6070] text-[14px] lg:text-[15px] mb-6 lg:mb-8">
          Model EfficientNet-B3 dilatih pada dataset HAM10000 untuk mengenali ketujuh kategori lesi kulit berikut.
        </p>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          {diseases.map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-3 lg:px-5 py-2 lg:py-3 flex items-center gap-2 lg:gap-3 shadow-sm"
              style={{ border: '1px solid #E2EDF5' }}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${d.dot}`} />
              <span className="font-['Kalnia'] text-[13px] lg:text-[15px] font-medium text-[#12283A]">{d.code}</span>
              <span className="text-[#4A6070] text-[12px] lg:text-[14px] hidden sm:inline">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
