export default function AnimatedPoster({ className = "", height = "45vh", title = "PLAY GAMES" }) {
  return (
    <div
      className={`poster-container relative overflow-hidden ${className}`}
      style={{ height }}
      aria-label="animated poster"
      role="img"
    >
      <svg
        className="poster-grid absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(66,128,191,0.15)" strokeWidth="0.2" />
          </pattern>
          <linearGradient id="glowStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2a598a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7db3ff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <circle cx="80" cy="25" r="12" fill="none" stroke="url(#glowStroke)" strokeWidth="0.6" />
        <circle cx="15" cy="70" r="18" fill="none" stroke="url(#glowStroke)" strokeWidth="0.6" />
      </svg>

      <div className="poster-noise absolute inset-0" aria-hidden="true" />

      <div className="poster-orb orb-1" aria-hidden="true" />
      <div className="poster-orb orb-2" aria-hidden="true" />
      <div className="poster-orb orb-3" aria-hidden="true" />

      {/* hanging playful game icons */}
      <div className="poster-hang" aria-hidden="true">
        {/* line + controller */}
        <div className="hang-item left-1">
          <div className="hang-line" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="9" width="18" height="8" rx="3" stroke="#7db3ff" strokeWidth="1.5" fill="rgba(66,128,191,0.15)" />
            <path d="M7 13h2M8 12v2" stroke="#DCF836" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="15.5" cy="12.5" r="1" fill="#DCF836" />
            <circle cx="17.5" cy="14.5" r="1" fill="#DCF836" />
          </svg>
        </div>

        {/* line + star */}
        <div className="hang-item mid-1">
          <div className="hang-line" />
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3l2.3 4.7 5.2.8-3.75 3.6.9 5.2L12 15.8 7.35 17.3l.9-5.2L4.5 8.5l5.2-.8L12 3z" fill="#DCF836" stroke="#a7ff3a" strokeWidth="0.6" />
          </svg>
        </div>

        {/* line + joystick */}
        <div className="hang-item right-1">
          <div className="hang-line" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="11" width="12" height="6" rx="3" stroke="#7db3ff" strokeWidth="1.2" fill="rgba(66,128,191,0.12)" />
            <path d="M12 7v5" stroke="#DCF836" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="6" r="1.8" fill="#DCF836" />
          </svg>
        </div>

        {/* line + trophy */}
        <div className="hang-item far-right">
          <div className="hang-line" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5h8v2a3 3 0 01-3 3h-2a3 3 0 01-3-3V5z" stroke="#7db3ff" strokeWidth="1.2" fill="rgba(66,128,191,0.12)" />
            <path d="M7 7H5a2 2 0 002 2" stroke="#7db3ff" strokeWidth="1.2" />
            <path d="M17 7h2a2 2 0 01-2 2" stroke="#7db3ff" strokeWidth="1.2" />
            <rect x="10" y="10" width="4" height="2" fill="#DCF836" />
          </svg>
        </div>

        {/* line + sword */}
        <div className="hang-item left-2">
          <div className="hang-line" />
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 19l3-3 8-8 2 2-8 8-3 3H5v-2z" fill="#7db3ff" opacity="0.7"/>
            <path d="M16 6l2-2 2 2-2 2-2-2z" fill="#DCF836"/>
          </svg>
        </div>

        {/* line + shield */}
        <div className="hang-item mid-2">
          <div className="hang-line" />
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3l7 3v5c0 4.5-3.2 8.7-7 10-3.8-1.3-7-5.5-7-10V6l7-3z" stroke="#7db3ff" strokeWidth="1.2" fill="rgba(66,128,191,0.12)"/>
            <path d="M9 12l2 2 4-4" stroke="#DCF836" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* line + coin */}
        <div className="hang-item right-2">
          <div className="hang-line" />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="7" fill="#DCF836"/>
            <circle cx="12" cy="12" r="7" fill="none" stroke="#a7ff3a" strokeWidth="0.8"/>
          </svg>
        </div>

        {/* line + heart */}
        <div className="hang-item far-left">
          <div className="hang-line" />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21s-6.5-3.9-8.5-7.1C1.6 11.1 3 8 6 8c1.5 0 2.4.7 3 1.5C9.6 8.7 10.5 8 12 8c3 0 4.4 3.1 2.5 5.9C18.5 17.1 12 21 12 21z" fill="#ff4d6d"/>
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-[1]">
        <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-[rgba(2,12,23,0.45)] backdrop-blur-sm border border-[rgba(66,128,191,0.25)]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="drop-shadow-[0_0_6px_rgba(66,128,191,0.6)]"
          >
            <path d="M7 12h2m-1-1v2M14.5 10.5h.01M17.5 13.5h.01" stroke="#DCF836" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 16l2.5-2.5h7L18 16c1.933 0 3.5-1.567 3.5-3.5S19.933 9 18 9h-2.5l-2-2h-3l-2 2H6C4.067 9 2.5 10.567 2.5 12.5S4.067 16 6 16z" stroke="#7db3ff" strokeOpacity="0.9" strokeWidth="1.2"/>
          </svg>
          <span className="poster-title text-[#dcf836]">{title}</span>
        </div>
      </div>

      {/* ambient sparks */}
      <div className="poster-spark spark-1" aria-hidden="true" />
      <div className="poster-spark spark-2" aria-hidden="true" />
      <div className="poster-spark spark-3" aria-hidden="true" />

      {/* floating icons */}
      <div className="poster-float float-1" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3l-1 5 4 1-5 12 1-6-4-1 5-11z" fill="#DCF836"/>
        </svg>
      </div>
      <div className="poster-float float-2" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="6" fill="#7db3ff"/>
        </svg>
      </div>
      <div className="poster-float float-3" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4l2 2 2-2 2 2-2 2 2 2-2 2-2-2-2 2-2-2 2-2-2-2 2-2z" fill="#DCF836"/>
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none poster-fade" aria-hidden="true" />
    </div>
  );
}


