import { CLASS_INFO } from './Atoms'

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-0 shadow-sm">
      <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-3">{title}</p>
      <div className="w-full h-px bg-gray-100 mb-4" />
      {children}
    </div>
  )
}

function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className={`text-[13px] font-bold text-[#12283A] ${valueClass}`}>{value}</span>
    </div>
  )
}

function YaBadge({ val }) {
  return val === 'Yes'
    ? <span className="text-[13px] font-bold text-red-500">Ya</span>
    : <span className="text-[13px] font-bold text-green-500">Tidak Ada</span>
}

export default function StepRingkasan({ form, result, imageResult }) {
  const isBerisiko    = result?.hasil_risiko === 'BERISIKO'
  const confidencePct = imageResult ? Math.round(imageResult.confidence * 100 * 10) / 10 : 0
  const classInfo     = imageResult ? (CLASS_INFO[imageResult.kelas] ?? null) : null
  const diameterNum   = parseFloat(form.diameter_mm) || 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <h2 className="text-[22px] font-bold text-[#12283A]">Laporan Hasil Analisis</h2>
        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold text-white ${isBerisiko ? 'bg-red-500' : 'bg-green-500'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
          {isBerisiko ? 'RESIKO TINGGI' : 'TIDAK BERISIKO'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* DATA DEMOGRAFI */}
        <SectionCard title="Data Demografi">
          <Row label="Nama"          value={form.nama || '-'} />
          <Row label="Usia"          value={form.usia ? `${form.usia} Tahun` : '-'} />
          <Row label="Jenis Kelamin" value={form.gender || '-'} />
          <Row label="Tipe Kulit"    value={form.tipe_kulit || '-'} />
          <Row label="Paparan UV"    value={form.paparan_uv || '-'} />
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-500">Riwayat Keluarga</span>
            {form.riwayat_keluarga === 'Yes'
              ? <span className="text-[13px] font-bold text-red-500">Ada</span>
              : <span className="text-[13px] font-bold text-green-500">Tidak Ada</span>}
          </div>
        </SectionCard>

        {/* SKOR AI (EfficientNet-B3) */}
        <SectionCard title="Skor AI — EfficientNet-B3">
          {imageResult ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[15px] font-bold text-[#12283A]">Hasil Deteksi AI</span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-white bg-[#12283A]">
                  {imageResult.kelas}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-[13px] text-gray-500 mb-1.5">
                  <span>Tingkat Keyakinan (Confidence)</span>
                  <span className="font-bold text-[#12283A]">{confidencePct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${confidencePct}%`, backgroundColor: '#7B9DB8' }} />
                </div>
              </div>
              {classInfo && (
                <div className={`rounded-xl px-4 py-3 text-[12px] leading-relaxed flex gap-2 mb-3 ${
                  classInfo.mendesak ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-blue-50 text-[#4A6070]'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: classInfo.dot }} />
                  {classInfo.pesan}
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-[13px] text-gray-500">Gatal Spontan</span>
                <YaBadge val={form.gatal} />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] text-gray-500">Berdarah Tersebar</span>
                <YaBadge val={form.berdarah} />
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-[13px] text-gray-400">
              Analisis gambar tidak dilakukan
            </div>
          )}
        </SectionCard>

        {/* GEJALA KLINIS */}
        <SectionCard title="Gejala Klinis">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">A – Asimetris</span>
            <YaBadge val={form.asimetris} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">B – Tepian Kasar</span>
            <YaBadge val={form.tepi_kasar} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">C – Warna Bervariasi</span>
            <YaBadge val={form.warna_bervariasi} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">D – Diameter &gt; 6mm</span>
            {diameterNum > 6
              ? <span className="text-[13px] font-bold text-red-500">Ya</span>
              : <span className="text-[13px] font-bold text-green-500">Tidak Ada</span>}
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-500">E – Evolusi / Perubahan</span>
            <YaBadge val={form.evolusi} />
          </div>
        </SectionCard>

        {/* SKOR RANDOM FOREST */}
        <SectionCard title="Skor Random Forest (Tahap 1)">
          <div className="mb-3">
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="text-gray-500">{result?.probabilitas_label ?? 'Probabilitas'}</span>
              <span className="font-bold" style={{ color: isBerisiko ? '#EF4444' : '#10B981' }}>
                {result?.probabilitas_persen ?? 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${result?.probabilitas_persen ?? 0}%`, backgroundColor: isBerisiko ? '#EF4444' : '#10B981' }} />
            </div>
          </div>
          <Row label="Skor RF"          value={`${result?.skor_rf ?? 0}%`} />
          <Row label="Jumlah Tahi Lalat" value={form.jumlah_tahi_lalat || '-'} />
          <Row label="Diameter Lesi"     value={form.diameter_mm ? `${form.diameter_mm} mm` : '-'} />
        </SectionCard>

      </div>
    </div>
  )
}
