"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function SplashPage() {
    // Edit this array with your target URLs (20-23 items recommended)
    const urls = useMemo<string[]>(() => [
        "/all-posts",
        // "/about",
        // "/privacy-policy",
        // "/cookie-policy",
        // "/disclaimer",
        "/",
    ], []);

    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);
        const timeout = setTimeout(() => {
            const list = urls.filter(Boolean);
            const next = list[Math.floor(Math.random() * Math.max(1, list.length))] || "/";
            window.location.replace(next);
        }, 5000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [urls]);

    return (
        <div className="min-h-dvh w-full relative overflow-hidden flex items-center justify-center" style={{ background: "radial-gradient(1200px 600px at 50% -10%, rgba(153,149,255,.12), transparent 60%), linear-gradient(180deg, #f6f7ff 0%, #ffffff 100%)" }}>
            {/* Soft background accents */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 -left-24 w-[34rem] h-[34rem] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle at 30% 30%, #c7c6ff 0%, transparent 60%)" }} />
                <div className="absolute -bottom-24 -right-20 w-[32rem] h-[32rem] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle at 70% 70%, #9895ff 0%, transparent 60%)" }} />
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#5559d1 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            </div>

            {/* Centerpiece */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-8 py-14 rounded-[28px] text-center shadow-xl animate-fadeUp" style={{ background: "linear-gradient(180deg, #ffffff, #fbfbff)", boxShadow: "0 28px 60px -28px rgba(114,114,255,.35)" }}>
                {/* Logo with subtle rotating ring */}
                <div className="relative mx-auto mb-7 w-20 h-20">
                    <div className="absolute inset-0 rounded-full animate-rotateSlow" style={{ boxShadow: "inset 0 0 0 2px rgba(121,119,237,.25)", background: "conic-gradient(from 0deg, #7b78ed, #9895ff, #c7c6ff, #7b78ed)" }} />
                    <div className="absolute inset-2 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(180deg, #eef2ff, #ffffff)", boxShadow: "inset 0 1px 0 rgba(0,0,0,.04), 0 10px 26px -12px rgba(114,114,255,.45)" }}>
                        <Image src="/images/BlogCafe_Logo.svg" alt="BlogCafeAI Logo" width={48} height={48} className="object-contain" priority />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, #5955d1, #7b78ed, #9895ff, #7b78ed, #5955d1)", backgroundSize: "200% 100%" }}>
                        Welcome to BlogCafeAI
                    </span>
                </h1>
                <div className="mx-auto mt-3 h-[2px] w-28 rounded-full" style={{ background: "linear-gradient(90deg, #9895ff 0%, #514dcc 100%)", boxShadow: "0 6px 18px -10px rgba(114,114,255,.75)" }} />
                <p className="mt-4 text-gray-600 leading-relaxed text-base sm:text-lg">
                    A creative space where ideas percolate, stories flow, and inspiration is always served fresh
                </p>

                {/* Animated progress indicator (no buttons) */}
                <div className="mt-9 inline-flex items-center gap-3 px-5 py-2 rounded-full" style={{ background: "#eef2ff", color: "#5559d1", boxShadow: "0 12px 26px -16px rgba(114,114,255,.55)" }}>
                    <span className="relative inline-flex w-2.5 h-2.5">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: "#7b78ed" }} />
                        <span className="relative inline-flex rounded-full w-2.5 h-2.5" style={{ backgroundColor: "#5559d1" }} />
                    </span>
                    Redirecting in {secondsLeft}s
                </div>
            </div>

            {/* Floating orbs */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <span className="absolute left-10 top-20 w-24 h-24 rounded-full blur-xl opacity-40 animate-float" style={{ background: "linear-gradient(180deg, #c7c6ff, #7b78ed)" }} />
                <span className="absolute right-16 top-32 w-16 h-16 rounded-full blur-xl opacity-40 animate-float-delayed" style={{ background: "linear-gradient(180deg, #9895ff, #5955d1)" }} />
                <span className="absolute left-1/2 bottom-16 -translate-x-1/2 w-20 h-20 rounded-full blur-xl opacity-40 animate-float-slow" style={{ background: "linear-gradient(180deg, #d6d5ff, #7b78ed)" }} />
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes rotateSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: 0 0; } }
                .animate-float { animation: float 4.5s ease-in-out infinite; }
                .animate-float-delayed { animation: float 5.2s ease-in-out infinite; animation-delay: .6s; }
                .animate-float-slow { animation: float 6.5s ease-in-out infinite; }
                .animate-rotateSlow { animation: rotateSlow 10s linear infinite; border-radius: 24px; }
                .animate-fadeUp { animation: fadeUp .6s ease-out both; }
                .animate-shimmer { animation: shimmer 2.2s ease-in-out infinite; }
            `}</style>
        </div>
    );
}


