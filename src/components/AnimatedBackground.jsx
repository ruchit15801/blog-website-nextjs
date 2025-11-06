export default function AnimatedBackground() {
  return (
    <div className="bg-hero-container" aria-hidden="true">
      <div className="bg-hero-gradient" />
      {/* light beams */}
      <div className="bg-hero-beam beam-1" />
      <div className="bg-hero-beam beam-2" />

      <svg className="bg-hero-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="heroGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(66,128,191,0.12)" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#heroGrid)" />
      </svg>

      <div className="bg-hero-noise" />

      <div className="bg-hero-orb orb-a" />
      <div className="bg-hero-orb orb-b" />
      <div className="bg-hero-orb orb-c" />
      <div className="bg-hero-orb orb-d" />

      {/* large illustration silhouettes */}
      <div className="bg-hero-illustration ill-left" />
      <div className="bg-hero-illustration ill-right" />

      {/* parallax floats - layer 1 */}
      <div className="bg-float f1 depth-1">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="9" width="18" height="8" rx="3" stroke="#7db3ff" strokeWidth="1.4" fill="rgba(66,128,191,0.12)" />
          <path d="M8 12v2M7 13h2" stroke="#DCF836" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="12.5" r="1.1" fill="#DCF836" />
          <circle cx="18" cy="14.5" r="1.1" fill="#DCF836" />
        </svg>
      </div>
      <div className="bg-float f2 depth-2">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l2.3 4.7 5.2.8-3.75 3.6.9 5.2L12 15.8 7.35 17.3l.9-5.2L4.5 8.5l5.2-.8L12 3z" fill="#DCF836" />
        </svg>
      </div>
      <div className="bg-float f3 depth-3">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="6.5" fill="#7db3ff" />
        </svg>
      </div>
      <div className="bg-float f4 depth-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3l-1 5 4 1-5 12 1-6-4-1 5-11z" fill="#DCF836" />
        </svg>
      </div>
      <div className="bg-float f5 depth-1">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l2 2 2-2 2 2-2 2 2 2-2 2-2-2-2 2-2-2 2-2-2-2 2-2z" fill="#DCF836"/>
        </svg>
      </div>
      <div className="bg-float f6 depth-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="11" width="12" height="6" rx="3" stroke="#7db3ff" strokeWidth="1.2" fill="rgba(66,128,191,0.12)" />
          <path d="M12 7v5" stroke="#DCF836" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="6" r="1.8" fill="#DCF836" />
        </svg>
      </div>

      {/* subtle vignette */}
      <div className="bg-hero-vignette" />
      <div className="bg-hero-scanline" />
    </div>
  );
}


