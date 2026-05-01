import { Label, TextInput, SelectInput, SkinTypeSelect, AdaTidakAda } from './Atoms'

export default function StepDataDiri({ form, options, onInput, set }) {
  const genderOptions = options.genders.length
    ? options.genders.map(g => ({ value: g, label: g }))
    : [{ value: 'Male', label: 'Pria' }, { value: 'Female', label: 'Wanita' }]

  const sunOptions = options.sun_exposures.length
    ? options.sun_exposures.map(s => ({ value: s, label: s }))
    : [
        { value: 'Low',      label: 'Jarang (Low)' },
        { value: 'Moderate', label: 'Sedang (Moderate)' },
        { value: 'High',     label: 'Sering (High)' },
      ]

  return (
    <div className="flex gap-0">
      <div className="flex-1 flex flex-col gap-5 pr-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Nama</Label>
            <TextInput name="nama" value={form.nama} onChange={onInput} placeholder="masukkan nama anda..." readOnly />
          </div>
          <div className="flex-1">
            <Label>Umur</Label>
            <TextInput name="usia" value={form.usia} onChange={onInput} placeholder="masukkan umur anda..." type="number" />
          </div>
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <SelectInput value={form.gender} onChange={set('gender')} options={genderOptions} placeholder="Pria / Wanita" />
        </div>

        <div>
          <Label>Tipe kulit (skala Fitzpatrick)</Label>
          <SkinTypeSelect
            value={form.tipe_kulit}
            onChange={set('tipe_kulit')}
            options={options.skin_types.length ? options.skin_types : ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V']}
          />
        </div>
      </div>

      <div className="w-px bg-gray-200 self-stretch" />

      <div className="flex-1 flex flex-col gap-5 pl-8">
        <div>
          <Label>Seberapa sering anda terpapar matahari?</Label>
          <SelectInput value={form.paparan_uv} onChange={set('paparan_uv')} options={sunOptions} placeholder="Pilih frekuensi..." />
        </div>

        <div>
          <Label>Apakah ada riwayat kanker kulit di keluarga anda?</Label>
          <AdaTidakAda value={form.riwayat_keluarga} onChange={set('riwayat_keluarga')} />
        </div>

        <div>
          <Label>Perkiraan jumlah tahi lalat?</Label>
          <TextInput name="jumlah_tahi_lalat" value={form.jumlah_tahi_lalat} onChange={onInput}
            placeholder="masukkan jumlah tahi lalat." type="number" />
        </div>
      </div>
    </div>
  )
}
