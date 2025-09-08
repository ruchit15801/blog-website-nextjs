import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative py-16 sm:py-20 overflow-hidden bg-radial-accent">
            <div className="absolute inset-0 bg-grid opacity-[0.08] pointer-events-none"></div>
            <div className="mx-auto max-w-6xl px-4 grid gap-8 sm:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="space-y-6">
                    <span className="badge">World-class Next.js Blog</span>
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                        Elevate your stories with a modern, animated, must UI
                    </h1>
                    <p className="text-base sm:text-lg opacity-80 max-w-[60ch]">
                        Subtle motion, premium colors, and a reading experience that feels effortless.
                    </p>
                    <div className="flex gap-3">
                        <a href="#latest" className="btn btn-primary shine">Read Latest</a>
                        <a href="#featured" className="btn btn-secondary">Featured</a>
                    </div>
                </div>
                <div className="relative h-[220px] sm:h-[300px] animate-float">
                    <div className="absolute -inset-6 rounded-3xl opacity-25" style={{ background: "radial-gradient(60% 60% at 50% 40%, var(--brand-teal), transparent)" }} />
                    <div className="relative rounded-3xl card-hover shine h-full w-full border border-white/10" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
                        <Image src="/next.svg" alt="Next" width={160} height={40} className="absolute bottom-6 right-6 opacity-60" />
                    </div>
                </div>
            </div>
        </section>
    );
}


