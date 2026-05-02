import { Label, YaTidak, DiameterStepper } from './Atoms'

export default function StepGejala({ form, set }) {
  return (
    <div className="flex gap-0">
      <div className="flex-1 flex flex-col gap-6 pr-8">
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Apakah terasa gatal?</p>
          <YaTidak value={form.gatal} onChange={set('gatal')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Apakah sering berdarah?</p>
          <YaTidak value={form.berdarah} onChange={set('berdarah')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Bentuknya tidak simetris (asimetris)?</p>
          <YaTidak value={form.asimetris} onChange={set('asimetris')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Apakah tepiannya tidak beraturan?</p>
          <YaTidak value={form.tepi_kasar} onChange={set('tepi_kasar')} />
        </div>
      </div>

      <div className="w-px bg-gray-200 self-stretch" />

      <div className="flex-1 flex flex-col gap-6 pl-8">
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Apakah warna tidak merata/bervariasi?</p>
          <YaTidak value={form.warna_bervariasi} onChange={set('warna_bervariasi')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">Apakah ukuran / bentuk berubah seiring waktu?</p>
          <YaTidak value={form.evolusi} onChange={set('evolusi')} />
        </div>
        <div>
          <Label>Diameter lesi/tahi lalat (mm)</Label>
          <DiameterStepper value={form.diameter_mm} onChange={set('diameter_mm')} />
        </div>
      </div>
    </div>
  )
}
