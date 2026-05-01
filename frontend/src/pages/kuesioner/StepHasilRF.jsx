export default function StepHasilRF({ result }) {
  const isBerisiko = result.hasil_risiko === 'BERISIKO'
  const warna      = isBerisiko ? '#EF4444' : '#22C55E'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[13px] font-semibold text-[#12283A] mb-2">Hasil Deteksi Random Forest</p>
        <h2 className="font-['Kalnia'] text-[48px] font-bold leading-none" style={{ color: warna }}>
          {result.hasil_risiko}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="font-semibold text-[#12283A]">{result.probabilitas_label}</span>
          <span className="font-bold" style={{ color: warna }}>{result.probabilitas_persen}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${result.probabilitas_persen}%`, backgroundColor: warna }} />
        </div>
      </div>

      {result.saran && (
        <div className="rounded-2xl px-5 py-4 flex gap-3" style={{ backgroundColor: '#D8E8F4' }}>
          <span className="text-[18px] mt-0.5">💡</span>
          <p className="text-[13px] text-[#12283A] leading-relaxed">
            <span className="font-semibold">Saran: </span>
            {result.saran}
          </p>
        </div>
      )}

      {isBerisiko && (
        <p className="text-[13px] text-[#4A6070] bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          Hasil menunjukkan risiko tinggi. Lanjutkan ke <strong>Tahap 2</strong> untuk analisis citra menggunakan EfficientNet-B3.
        </p>
      )}
    </div>
  )
}
