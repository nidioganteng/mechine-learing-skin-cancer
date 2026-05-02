import { useState, useRef } from 'react'
import { submitImageAnalysis } from '../../services/api'
import { CLASS_INFO } from './Atoms'

export default function StepUploadFoto({ onResult }) {
  const fileRef   = useRef()
  const dropRef   = useRef()
  const [file,      setFile]      = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [dragging,  setDragging]  = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result,    setResult]    = useState(null)
  const [errMsg,    setErrMsg]    = useState('')

  function handleFile(chosen) {
    if (!chosen) return
    setFile(chosen)
    setPreview(URL.createObjectURL(chosen))
    setResult(null)
    setErrMsg('')
    analyze(chosen)
  }

  async function analyze(chosen) {
    setAnalyzing(true)
    try {
      const res = await submitImageAnalysis(chosen)
      if (res.status === 'success') {
        setResult(res)
        onResult(res)
      } else if (res.status === 'error_confidence') {
        setErrMsg('Gambar kurang jelas untuk dianalisis. Pastikan foto fokus dan cukup dekat.')
      } else {
        setErrMsg(res.pesan || 'Analisis gagal.')
      }
    } catch {
      setErrMsg('Terjadi kesalahan saat menganalisis. Coba lagi.')
    } finally {
      setAnalyzing(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }

  const info         = result ? (CLASS_INFO[result.kelas] ?? null) : null
  const confidencePct = result ? Math.round(result.confidence * 100 * 10) / 10 : 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-[20px] font-bold text-[#12283A] mb-2">Analisis citra kanker kulit</h3>
        <p className="text-[13px] text-[#4A6070] leading-relaxed max-w-2xl">
          Halaman ini dikhususkan untuk anda yang mendapatkan hasil berisiko tinggi pada tahap
          sebelumnya, silahkan unggah foto area kulit (lesi/tahi lalat) yang mencurigakan untuk dianalisis
        </p>
        <div className="w-64 h-px bg-gray-300 mt-4" />
      </div>

      <p className="text-[14px] font-bold text-[#12283A]">
        Unggah foto kulit anda &nbsp;<span className="font-bold">(Format: JPG &amp; PNG)</span>
      </p>

      <div
        ref={dropRef}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex items-center justify-between px-6 py-5 rounded-2xl cursor-pointer transition-colors ${
          dragging ? 'bg-blue-100 border-2 border-dashed border-[#7B9DB8]' : 'bg-[#D8E8F4]'
        }`}
      >
        <div className="flex items-center gap-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7B9DB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          <div>
            <p className="text-[14px] font-semibold text-[#12283A]">
              {file ? file.name : 'Drag and drop file here'}
            </p>
            <p className="text-[12px] text-gray-500">Limit 200MB per file</p>
          </div>
        </div>
        <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
          className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#4A3020] shrink-0"
          style={{ backgroundColor: '#F0DEC8' }}>
          Upload File
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </div>

      {analyzing && (
        <div className="flex items-center gap-3 text-[13px] text-[#7B9DB8]">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Menganalisis gambar...
        </div>
      )}

      {errMsg && (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errMsg}</p>
      )}

      {preview && result && info && (
        <div className="flex gap-6 mt-2">
          <div className="shrink-0 w-60 h-60 rounded-2xl overflow-hidden bg-gray-100">
            <img src={preview} alt="preview kulit" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[#12283A]">Hasil Deteksi AI</span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-white bg-[#12283A]">
                {result.kelas}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[13px] text-[#4A6070] mb-1.5">
                <span>Tingkat Keyakinan (Confidence)</span>
                <span className="font-semibold text-[#12283A]">{confidencePct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${confidencePct}%`, backgroundColor: '#7B9DB8' }} />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex justify-between text-[13px]">
              <div className="flex flex-col gap-1 text-[#4A6070]">
                <span>Kategori Lesi</span>
                <span>Tingkat Bahaya</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="font-bold text-[#12283A]">{info.kategori}</span>
                <span className="flex items-center gap-1.5 font-bold text-[#12283A]">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: info.dot }} />
                  {info.bahaya}
                </span>
              </div>
            </div>

            <div className={`rounded-xl px-4 py-3 text-[12px] leading-relaxed flex gap-2 ${
              info.mendesak ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 text-[#4A6070]'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: info.dot }} />
              {info.pesan}
            </div>

            <p className="text-[11px] text-gray-400 italic">*Disclaimer</p>
          </div>
        </div>
      )}
    </div>
  )
}
