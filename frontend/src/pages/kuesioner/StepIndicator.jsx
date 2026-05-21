import { CheckMark } from './Atoms'

const TOTAL_STEPS = 5

export default function StepIndicator({ step }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s, idx) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
              s < step   ? 'bg-[#7B9DB8] border-[#7B9DB8]' :
              s === step ? 'bg-white border-[#7B9DB8]' :
                           'bg-white border-gray-300'
            }`}>
              {s < step
                ? <CheckMark />
                : <span className={`text-[10px] sm:text-[12px] font-semibold ${s === step ? 'text-[#7B9DB8]' : 'text-gray-400'}`}>{s}</span>
              }
            </div>
            <span className="hidden sm:block text-[11px] mt-1.5 text-gray-500">Step {s}</span>
          </div>
          {idx < TOTAL_STEPS - 1 && (
            <div className={`flex-1 h-px mb-5 mx-1 ${s < step ? 'bg-[#7B9DB8]' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
