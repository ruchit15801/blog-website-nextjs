"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }): JSX.Element {
    const starfieldRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = starfieldRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId = 0;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const onResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        const numStars = Math.min(600, Math.floor((width * height) / 3600));
        const stars = Array.from({ length: numStars }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.1 + 0.2,
            speed: Math.random() * 0.35 + 0.08,
            alpha: Math.random() * 0.7 + 0.25,
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);
            const grd = ctx.createLinearGradient(0, 0, 0, height);
            grd.addColorStop(0, "#140f1f");
            grd.addColorStop(1, "#0b1020");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x += s.speed;
                if (s.x > width + 2) s.x = -2;
                ctx.globalAlpha = s.alpha;
                ctx.fillStyle = "#cbd5e1";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            animationId = requestAnimationFrame(draw);
        }

        animationId = requestAnimationFrame(draw);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <html>
            <body>
                <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
                    <canvas ref={starfieldRef} style={{ position: "absolute", inset: 0 }} />
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            color: "#e2e8f0",
                            textAlign: "center",
                            padding: 24,
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "clamp(40px, 6vw, 72px)",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                margin: 0,
                                backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            Something went wrong
                            {error?.digest ? ` (${error.digest})` : ""}
                        </h1>
                        <p style={{ marginTop: 10, color: "#cbd5e1" }}>
                            An unexpected error occurred. You can try again or head home.
                        </p>
                        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
                            <button
                                onClick={() => reset()}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    background: "linear-gradient(90deg, #22d3ee, #a78bfa)",
                                    color: "#0b1020",
                                    fontWeight: 700,
                                    border: 0,
                                    cursor: "pointer",
                                }}
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    background: "#0f172a",
                                    border: "1px solid rgba(148,163,184,0.35)",
                                    color: "#e2e8f0",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}


