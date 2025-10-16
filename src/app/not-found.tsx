"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

export default function NotFound(): React.ReactElement {
    const groupRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483647,
                background: "radial-gradient(1200px 800px at 20% -10%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(1000px 700px at 110% 10%, rgba(168,85,247,0.08), transparent 60%), #ffffff",
                backgroundSize: "160% 160%, 180% 180%, auto",
                animation: "bgpan 60s linear infinite alternate",
                overflow: "hidden",
            }}
        >
            {/* Decorative blobs */}
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    top: "-120px",
                    left: "-120px",
                    width: 380,
                    height: 380,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #93c5fd, #e9d5ff)",
                    filter: "blur(40px)",
                    opacity: 0.6,
                    animation: "float1 14s ease-in-out infinite alternate",
                }}
            />
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    bottom: "-140px",
                    right: "-140px",
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fde68a, #fbcfe8)",
                    filter: "blur(44px)",
                    opacity: 0.6,
                    animation: "float2 16s ease-in-out infinite alternate",
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: 24,
                    textAlign: "center",
                }}
                onMouseMove={(e) => {
                    const el = groupRef.current;
                    if (!el) return;
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = requestAnimationFrame(() => {
                        el.style.transform = `perspective(1200px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
                    });
                }}
                onMouseLeave={() => {
                    const el = groupRef.current;
                    if (!el) return;
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = requestAnimationFrame(() => {
                        el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
                    });
                }}
            >
                <div ref={groupRef} style={{ transition: "transform 300ms ease" }}>
                    <div style={{ animation: "fadeup 700ms ease both" }}>
                        {/* Logo */}
                        <div style={{ marginBottom: 18, display: "flex", justifyContent: "center", width: "100%" }}>
                            <Image src="/images/BlogCafe_Logo.svg" alt="BlogCafeAI" width={200} height={48} priority />
                        </div>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                borderRadius: 999,
                                background: "rgba(2,132,199,0.08)",
                                border: "1px solid rgba(2,132,199,0.15)",
                                color: "#0369a1",
                                fontWeight: 600,
                                marginBottom: 18,
                            }}
                        >
                            Page not found
                        </span>

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "clamp(56px, 10vw, 140px)",
                                fontWeight: 900,
                                letterSpacing: "-0.04em",
                                backgroundImage: "linear-gradient(180deg, #111827, #4b5563 60%, #9ca3af)",
                                backgroundSize: "200% 100%",
                                animation: "shine 3.2s ease-in-out infinite",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            404
                        </h1>

                        <p
                            style={{
                                marginTop: 12,
                                maxWidth: 680,
                                fontSize: "clamp(16px, 2vw, 20px)",
                                lineHeight: 1.6,
                                color: "#4b5563",
                            }}
                        >
                            The page you’re looking for doesn’t exist or was moved. Try searching or go back home.
                        </p>

                        <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap", justifyContent: "center" }}>
                            <Link
                                href="/"
                                style={{
                                    padding: "12px 18px",
                                    borderRadius: 999,
                                    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                                    backgroundSize: "200% 100%",
                                    animation: "btnsheen 5s ease-in-out infinite",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    boxShadow: "0 8px 24px rgba(99,102,241,0.28)",
                                    transition: "transform 150ms ease, box-shadow 150ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 30px rgba(99,102,241,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(99,102,241,0.28)";
                                }}
                            >
                                Back to Home
                            </Link>

                            <Link
                                href="/all-posts"
                                style={{
                                    padding: "12px 18px",
                                    borderRadius: 999,
                                    background: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    color: "#111827",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    transition: "background 200ms ease, border-color 200ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "#f9fafb";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,0,0,0.14)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "#ffffff";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,0,0,0.08)";
                                }}
                            >
                                Explore Posts
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Subtle noise overlay */}
                <div
                    aria-hidden
                    style={{
                        pointerEvents: "none",
                        position: "fixed",
                        inset: 0,
                        opacity: 0.04,
                        mixBlendMode: "multiply",
                        backgroundImage:
                            "radial-gradient(1px 1px at 10% 20%, #000 25%, transparent 26%), radial-gradient(1px 1px at 30% 80%, #000 25%, transparent 26%), radial-gradient(1px 1px at 70% 40%, #000 25%, transparent 26%), radial-gradient(1px 1px at 90% 60%, #000 25%, transparent 26%)",
                        backgroundSize: "140px 140px, 160px 160px, 180px 180px, 200px 200px",
                    }}
                />

                <style>{`
					@keyframes float1 { from { transform: translateY(0) translateX(0); } to { transform: translateY(20px) translateX(10px); } }
					@keyframes float2 { from { transform: translateY(0) translateX(0); } to { transform: translateY(-16px) translateX(-12px); } }
					@keyframes shine { 0% { background-position: 200% 0; } 50% { background-position: 0% 0; } 100% { background-position: -200% 0; } }
					@keyframes btnsheen { 0% { background-position: 200% 0; } 50% { background-position: 0% 0; } 100% { background-position: -200% 0; } }
					@keyframes bgpan { 0% { background-position: 0 0, 0 0, 0 0; } 100% { background-position: 400px 120px, -400px -120px, 0 0; } }
					@keyframes fadeup { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
				`}</style>
            </div>
        </div>
    );
}


