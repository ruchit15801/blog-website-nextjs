import { Airplay, BarChart2, BookOpen, Briefcase, Globe, Heart, Rocket, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Hero() {

    const topics = [
        { name: "Technology", icon: <Globe size={16} color="#4F46E5" /> },
        { name: "Travel", icon: <Airplay size={16} color="#F59E0B" /> },
        { name: "Sport", icon: <Heart size={16} color="#EF4444" /> },
        { name: "Business", icon: <Briefcase size={16} color="#10B981" /> },
        { name: "Management", icon: <BarChart2 size={16} color="#8B5CF6" /> },
        { name: "Trends", icon: <TrendingUp size={16} color="#F43F5E" /> },
        { name: "Startups", icon: <Rocket size={16} color="#22D3EE" /> },
        { name: "News", icon: <BookOpen size={16} color="#FACC15" /> },
    ];
    return (
        <main>
            <section className="hero-section py-20 px-4 text-center">
                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
                    Heartfelt{" "}
                    <span
                        className="text-gradient"
                        style={{
                            background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block",
                        }}
                    >
                        Reflections
                    </span>
                    : Stories of Love, Loss, and Growth
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto" style={{ color: "#696981)" }}>
                    Revision Welcomes to ultimate source for fresh perspectives! Explore curated content to
                    enlighten, entertain and engage global readers.
                </p>
            </section>

            <section className="trending-section py-12 px-4 text-center">
                {/* Section Title */}
                <h5 className="uppercase text-xl font-semibold mb-6">Explore Trending Topics</h5>

                {/* Buttons Grid */}
                <div className="trending-buttons-container mx-auto">
                    {/* First 6 buttons */}
                    {topics.slice(0, 6).map((topic, idx) => (
                        <button key={idx} className="trending-btn shadow">
                            {topic.icon}
                            <span>{topic.name}</span>
                        </button>
                    ))}

                    {/* Last 2 buttons in second row, centered */}
                    <div className="second-row flex justify-center gap-4 w-full mt-4">
                        {topics.slice(6).map((topic, idx) => (
                            <button key={idx} className="trending-btn shadow">
                                {topic.icon}
                                <span>{topic.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

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
                            <Image src="/images/next.svg" alt="Next" width={160} height={40} className="absolute bottom-6 right-6 opacity-60" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


