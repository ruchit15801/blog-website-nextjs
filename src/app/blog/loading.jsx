export default function Loading() {
  const placeholders = Array.from({ length: 9 });
  return (
    <div className="relative bg-[#020C17] text-white min-h-screen pt-12 pb-24 overflow-hidden">
      <div className="bg-hero-container" aria-hidden="true">
        <div className="bg-hero-gradient" />
        <div className="bg-hero-grid" />
        <div className="bg-hero-noise" />
      </div>
      <div className="relative px-[20.2rem] media_resp max-lg:px-5 z-[1]">
        <div className="mb-6">
          <div className="h-8 w-48 bg-[#0b1622] rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-8 max-xxl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {placeholders.map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden poster-container">
              <div className="aspect-[5/3] bg-[#0b1622] animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-[#0b1622] rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


