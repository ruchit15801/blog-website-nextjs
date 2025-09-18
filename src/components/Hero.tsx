import { Airplay, BarChart2, BookOpen, Briefcase, Globe, Heart, Rocket, TrendingUp } from "lucide-react";

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
        </main>
    );
}


