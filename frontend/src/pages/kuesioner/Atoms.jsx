import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export const SKIN_SWATCHES = ['#FFE8D6', '#E8C49A', '#C4884C', '#8B6234', '#3C1E0A', '#1A0A04']

export const CLASS_INFO = {
  'Actinic keratoses (akiec)': { key: 'akiec', dot: '#F59E0B', mendesak: false },
  'Basal cell carcinoma (bcc)': { key: 'bcc',  dot: '#EF4444', mendesak: true },
  'Benign keratosis-like (bkl)': { key: 'bkl', dot: '#10B981', mendesak: false },
  'Dermatofibroma (df)': { key: 'df',           dot: '#10B981', mendesak: false },
  'Melanoma (mel)': { key: 'mel',               dot: '#DC2626', mendesak: true },
  'Melanocytic nevi (nv)': { key: 'nv',         dot: '#10B981', mendesak: false },
  'Vascular lesions (vasc)': { key: 'vasc',     dot: '#10B981', mendesak: false },
}

export function useClassInfo(kelasName) {
  const { t } = useTranslation()
  const raw = CLASS_INFO[kelasName]
  if (!raw) return null
  return {
    ...raw,
    kategori: t(`diseases.${raw.key}.kategori`),
    pesan:    t(`diseases.${raw.key}.pesan`),
  }
}

export function CheckMark({ color = 'white' }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function Label({ children }) {
  return <p className="text-[13px] font-semibold text-[#12283A] mb-1.5">{children}</p>
}

export function TextInput({ name, value, onChange, placeholder, type = 'text', readOnly = false }) {
  return (
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} readOnly={readOnly}
      className={`w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all focus:border-[#7B9DB8] focus:ring-2 focus:ring-[#7B9DB8]/15 ${readOnly ? 'bg-gray-50 cursor-default' : 'bg-white'}`}
    />
  )
}

export function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] bg-white outline-none appearance-none cursor-pointer focus:border-[#7B9DB8] focus:ring-2 focus:ring-[#7B9DB8]/15"
        style={{ color: value ? '#12283A' : '#A8BEC9' }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ color: '#12283A' }}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

export function SkinTypeSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const selectedIdx = options.findIndex(o => o === value)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] bg-white outline-none flex items-center justify-between focus:border-[#7B9DB8]">
        <span className={`flex items-center gap-3 ${!value ? 'text-[#A8BEC9]' : 'text-[#12283A]'}`}>
          {value || placeholder || 'Pilih tipe kulit anda'}
          {selectedIdx >= 0 && (
            <span className="w-8 h-4 rounded-sm inline-block border border-gray-200"
              style={{ backgroundColor: SKIN_SWATCHES[selectedIdx] ?? '#ccc' }} />
          )}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
          <polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8E8F0] rounded-xl shadow-lg z-20 overflow-hidden">
          {options.map((opt, idx) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-[14px] text-[#12283A]">
              <span>{opt}</span>
              <span className="w-12 h-5 rounded-sm border border-gray-200"
                style={{ backgroundColor: SKIN_SWATCHES[idx] ?? '#ccc' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function YaTidak({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-8 mt-2">
      <button type="button" onClick={() => onChange('Yes')} className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          value === 'Yes' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 hover:border-gray-400'
        }`}>
          {value === 'Yes' && <CheckMark />}
        </div>
        <span className="text-[14px] text-[#12283A]">{t('questionnaire.symptoms.yes')}</span>
      </button>
      <button type="button" onClick={() => onChange('No')} className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          value === 'No' ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300 hover:border-gray-400'
        }`}>
          {value === 'No' && <CheckMark />}
        </div>
        <span className="text-[14px] text-[#12283A]">{t('questionnaire.symptoms.no')}</span>
      </button>
    </div>
  )
}

export function AdaTidakAda({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-8 mt-2">
      <button type="button" onClick={() => onChange('Yes')} className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          value === 'Yes' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 hover:border-gray-400'
        }`}>
          {value === 'Yes' && <CheckMark />}
        </div>
        <span className="text-[14px] text-[#12283A]">{t('questionnaire.personal.exists')}</span>
      </button>
      <button type="button" onClick={() => onChange('No')} className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          value === 'No' ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300 hover:border-gray-400'
        }`}>
          {value === 'No' && <CheckMark />}
        </div>
        <span className="text-[14px] text-[#12283A]">{t('questionnaire.personal.notExists')}</span>
      </button>
    </div>
  )
}

export function DiameterStepper({ value, onChange }) {
  const num = parseFloat(value) || 0

  function adjust(delta) {
    const next = Math.max(0, parseFloat((num + delta).toFixed(2)))
    onChange(String(next))
  }

  return (
    <div className="flex items-stretch border border-[#D8E8F0] rounded-xl overflow-hidden bg-white">
      <input
        type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder="5,00" min="0" step="0.5"
        className="flex-1 px-4 py-3 text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none"
      />
      <div className="flex border-l border-[#D8E8F0] divide-x divide-[#D8E8F0]">
        <button type="button" onClick={() => adjust(0.5)}
          className="px-3 text-[15px] text-gray-500 hover:bg-gray-50 transition-colors">+</button>
        <button type="button" onClick={() => adjust(-0.5)}
          className="px-3 text-[17px] text-gray-500 hover:bg-gray-50 transition-colors">−</button>
      </div>
    </div>
  )
}
