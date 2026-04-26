export default function HeroSection() {
  return (
    <div className="bg-white overflow-x-hidden font-['Poppins']">

      {/* Header */}
      <header className="px-[8%] h-12.5 mt-5 flex items-center">
        <div className="font-['Kalnia'] text-[26px] text-black">
          YourSKIN
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between px-[8%] overflow-hidden gap-8 py-12 lg:py-0"
        style={{ minHeight: 'calc(100vh - 100px)' }}
      >

        {/* Background shape — disembunyikan di mobile, muncul lg+ */}
        <div
          className="hidden lg:block absolute bg-[#BACED9] z-0"
          style={{
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            width: '45%',
            height: '75%',
            borderTopLeftRadius: '800px',
            borderBottomLeftRadius: '800px',
          }}
        />

        {/* Mobile: lingkaran kecil di pojok kanan atas */}
        <div
          className="lg:hidden absolute top-0 right-0 w-48 h-48 rounded-full bg-[#BACED9] opacity-40 -translate-y-1/4 translate-x-1/4 pointer-events-none"
        />

        {/* Kiri - Teks */}
        <div className="flex-[0_0_auto] lg:flex-[0_0_45%] w-full lg:max-w-150 pb-0 lg:pb-12.5 z-10 text-center lg:text-left">
          <h1 className="font-['Kalnia'] text-[36px] sm:text-[44px] lg:text-[56px] font-medium leading-[1.15] mb-4 lg:mb-6 text-black tracking-[-0.5px]">
            Intelligent Early<br />
            Skin Cancer<br />
            Detection
          </h1>
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-[#333333] mb-8 lg:mb-10 max-w-sm mx-auto lg:mx-0">
            Lindungi kesehatan Anda dengan sistem pakar canggih kami.
            Algoritme kami menggabungkan EfficientNet B3 untuk analisis
            lesi kulit berbasis deep learning, dengan logika Forward Chaining
            interaktif yang didukung oleh Random Forest untuk skrining dan
            panduan yang presisi.
          </p>
          <a
            href="/login"
            className="inline-flex items-center bg-[#6CD0F6] text-white text-[15px] lg:text-[16px] font-semibold no-underline px-7 lg:px-9 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:bg-[#55BFE5] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(108,208,246,0.4)]"
          >
            Mulai Sekarang →
          </a>
        </div>

        {/* Kanan - Gambar (disembunyikan di sm, muncul lg+) */}
        <div className="hidden lg:flex flex-[0_0_55%] relative h-full justify-center items-end" style={{ minHeight: 'calc(100vh - 100px)' }}>

          {/* Gambar dokter */}
          <img
            src="/homepage/vektor-dokter.png"
            alt="Ilustrasi Dokter"
            className="relative z-10 max-h-[67%] w-auto object-contain object-bottom"
            style={{ marginRight: '-48%', marginBottom: '13%' }}
          />

          {/* Kotak Scan Image */}
          <img
            src="/homepage/kotak-scan.png"
            alt="Scan Image"
            className="absolute z-20 w-35 transition-transform duration-300 hover:-translate-y-1.25"
            style={{ top: '25%', left: '23%' }}
          />

          {/* Kotak Decision Rules */}
          <img
            src="/homepage/kotak-rules.png"
            alt="Decision Rules"
            className="absolute z-20 w-35 transition-transform duration-300 hover:-translate-y-1.25"
            style={{ bottom: '15%', left: '18%' }}
          />

          {/* Kotak AI Diagnostics */}
          <img
            src="/homepage/kotak-ai.png"
            alt="AI Diagnostics"
            className="absolute z-20 w-35 transition-transform duration-300 hover:-translate-y-1.25"
            style={{ top: '10%', right: '5%' }}
          />

        </div>
      </section>

    </div>
  )
}
