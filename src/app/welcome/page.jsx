"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function WelcomeSplash() {
  const [countdown, setCountdown] = useState(5);
  const [target, setTarget] = useState("/");

  // Allow override via env: comma-separated URLs
  const redirectUrls = useMemo(() => {
    if (typeof process.env.NEXT_PUBLIC_SPLASH_REDIRECTS === "string" && process.env.NEXT_PUBLIC_SPLASH_REDIRECTS.trim()) {
      return process.env.NEXT_PUBLIC_SPLASH_REDIRECTS.split(",").map(u => u.trim()).filter(Boolean);
    }
    // Default sample list (replace with your 20-23 URLs)
    return [
      "/all",
      "/",
      // "/aboutus",
      // "/developer",
      // "/affiliates",
      // "/contactus",
      // "/privacy-policy",
    ];
  }, []);

  useEffect(() => {
    // Preselect a target for display consistency
    const urls = redirectUrls && redirectUrls.length > 0 ? redirectUrls : ["/"];
    const index = Math.floor(Math.random() * urls.length);
    const chosen = urls[index];
    setTarget(chosen);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.href = chosen;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [redirectUrls]);

  // Hide global header/footer while splash is visible
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020C17] text-white overflow-hidden">
      {/* Animated ambient background (matches theme) */}
      <div className="bg-hero-container" aria-hidden="true">
        <div className="bg-hero-gradient" />
        <div className="bg-hero-grid" />
        <div className="bg-hero-noise" />
        <div className="bg-hero-orb orb-a" />
        <div className="bg-hero-orb orb-b" />
        <div className="bg-hero-orb orb-c" />
        <div className="bg-hero-orb orb-d" />
        <div className="bg-hero-beam beam-1" />
        <div className="bg-hero-beam beam-2" />
      </div>

      <div className="relative z-[1] flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        {/* Brand row (Blogcafeai only) */}
        <div className="flex items-center gap-6 mb-8">
          <span className="logo-spark-wrap">
            <Image
              src="/BlogCafe_Logo.svg"
              alt="Blogcafeai"
              width={140}
              height={90}
              priority
              className="logo-glow h-[84px] w-auto object-contain transition-transform duration-500 will-change-transform"
            />
            <span className="logo-spark s1" />
            <span className="logo-spark s2" />
            <span className="logo-spark s3" />
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold heading-glow mb-4 tracking-wide">
          Welcome to Blogcafeai
        </h1>
        <p className="text-[#abb7c4] max-w-3xl text-lg md:text-xl leading-relaxed">
          <span className="text-white font-semibold">Premium</span>{" "}performance,{" "}
          <span className="text-white font-semibold">silky-smooth</span>{" "}gameplay,{" "}and{" "}a{" "}
          <span className="text-[#DCF836] font-semibold">luxury</span>{" "}arena built for those who play to win.
        </p>

        <div className="mt-4 h-[2px] w-32 underline-shine mx-auto" />

        {/* Feature badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="badge-glow border rounded-full px-4 py-2 text-sm text-[#abb7c4]">No downloads</span>
          <span className="badge-glow border rounded-full px-4 py-2 text-sm text-[#abb7c4]">One-tap play</span>
          <span className="badge-glow border rounded-full px-4 py-2 text-sm text-[#abb7c4]">Handpicked picks</span>
        </div>

        {/* Countdown + progress */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="relative px-7 py-4 rounded-full bg-[#0b1622] border border-[#2a3644] text-[#DCF836] text-xl font-extrabold tracking-wider">
            <span className="relative z-[1]">{countdown}s</span>
            <span className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 0 0 rgba(220,248,54,0.35)', animation: 'ring 2.4s ease-in-out infinite' }} />
          </div>
          <div className="w-[420px] max-w-full h-2.5 rounded-full bg-[#0b1622] border border-[#2a3644] overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#DCF836,#b9ec3b,#DCF836)]"
              style={{ width: `${((5 - countdown) / 5) * 100}%`, transition: 'width 0.9s ease' }}
            />
          </div>
          <div className="text-sm md:text-base text-[#abb7c4]">
            Loading your experience…
          </div>
        </div>

        {/* Decorative floating accents */}
        <div className="mt-16 relative w-full max-w-2xl h-24 opacity-60">
          <span className="poster-spark spark-1" />
          <span className="poster-spark spark-2" />
          <span className="poster-spark spark-3" />
          <div className="poster-float float-1 depth-1">
            <Image src="/BlogCafe_Logo.svg" alt="Blogcafeai" width={54} height={36} className="opacity-70" />
          </div>
          <div className="poster-float float-2 depth-2">
            <div className="w-10 h-10 rounded-full bg-[#DCF836]/20 border border-[#DCF836]/40" />
          </div>
          <div className="poster-float float-3 depth-3">
            <div className="w-8 h-8 rounded-full bg-[#6aa9ff]/20 border border-[#6aa9ff]/40" />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-hero-scanline rounded-2xl" />
        </div>
      </div>
    </div>
  );
}


