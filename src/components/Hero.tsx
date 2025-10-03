// import { Airplay, BarChart2, BookOpen, Briefcase, Globe, Heart, Rocket, TrendingUp } from "lucide-react";

// export default function Hero() {

//     const topics = [
//         { name: "Technology", icon: <Globe size={16} color="#4F46E5" /> },
//         { name: "Travel", icon: <Airplay size={16} color="#F59E0B" /> },
//         { name: "Sport", icon: <Heart size={16} color="#EF4444" /> },
//         { name: "Business", icon: <Briefcase size={16} color="#10B981" /> },
//         { name: "Management", icon: <BarChart2 size={16} color="#8B5CF6" /> },
//         { name: "Trends", icon: <TrendingUp size={16} color="#F43F5E" /> },
//         { name: "Startups", icon: <Rocket size={16} color="#22D3EE" /> },
//         { name: "News", icon: <BookOpen size={16} color="#FACC15" /> },
//     ];
//     return (
//         <main>
//             <section className="hero-section py-20 px-4 text-center">
//                 {/* Headline */}
//                 <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6" style={{fontSize : '3.25rem' ,fontWeight : 700 , letterSpacing : '-.05em', margin : '6px 15%' , color : '#29294b'}}>
//                     Heartfelt{" "}
//                     <span
//                         className="text-gradient"
//                         style={{
//                             background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)",
//                             WebkitBackgroundClip: "text",
//                             WebkitTextFillColor: "transparent",
//                             display: "inline-block",
//                         }}
//                     >
//                         Reflections
//                     </span>
//                     : Stories of Love, Loss, and Growth
//                 </h1>

//                 {/* Description */}
//                 <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: "#696981)"}}>
//                     Revision Welcomes to ultimate source for fresh perspectives! Explore curated content to
//                     enlighten, entertain and engage global readers.
//                 </p>
//             </section>

//             <section className="trending-section py-12 px-4 text-center">
//                 {/* Section Title */}
//                 <h5 className="uppercase text-xl font-semibold mb-6" style={{color : '#696981' , fontSize : '12px' , lineHeight : '1.2' , fontWeight : 800 , }}>Explore Trending Topics</h5>

//                 {/* Buttons Grid */}
//                 <div className="trending-buttons-container mx-auto">
//                     {/* First 6 buttons */}
//                     {topics.slice(0, 6).map((topic, idx) => (
//                         <button key={idx} className="trending-btn shadow">
//                             {topic.icon}
//                             <span>{topic.name}</span>
//                         </button>
//                     ))}

//                     {/* Last 2 buttons in second row, centered */}
//                     <div className="second-row flex justify-center gap-4 w-full mt-4">
//                         {topics.slice(6).map((topic, idx) => (
//                             <button key={idx} className="trending-btn shadow">
//                                 {topic.icon}
//                                 <span>{topic.name}</span>
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//         </main>
//     );
// }


"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCategories } from "@/lib/adminClient";

type RemoteCategory = {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
};

export default function Hero() {
    const [categories, setCategories] = useState<RemoteCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <main>
            <section className="hero-section py-20 px-4 text-center relative overflow-hidden">
                {/* Decorative background */}
                <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(1000px 400px at 50% -10%, rgba(153,149,255,.15), transparent 60%)"
                }} />

                <div className="relative max-w-5xl mx-auto">
                    <h1
                        className="text-5xl sm:text-6xl font-bold leading-tight mb-5"
                        style={{
                            fontSize: "3.25rem",
                            fontWeight: 700,
                            letterSpacing: "-.05em",
                            color: "#29294b",
                        }}
                    >
                        Whispers of{" "}
                        <span
                            className="text-gradient"
                            style={{
                                background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "inline-block",
                            }}
                        >
                            Life
                        </span>
                        : Tales that Touch the Soul
                    </h1>

                    <p
                        className="text-lg sm:text-xl mx-auto"
                        style={{ color: "#696981", maxWidth: 720 }}
                    >
                        Discover stories woven with emotion, wisdom, and wonder crafted to inspire, heal, and connect hearts across the world.
                    </p>
                </div>
            </section>

            <section className="trending-section py-12 px-4 text-center">
                <h5
                    className="uppercase text-xl font-semibold mb-6"
                    style={{
                        color: "#696981",
                        fontSize: "12px",
                        lineHeight: "1.2",
                        fontWeight: 800,
                    }}
                >
                    Explore Trending Topics
                </h5>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="trending-buttons-container mx-auto">
                        {/* First 6 categories */}
                        {categories.slice(0, 6).map((cat) => (
                            <button
                                key={cat._id}
                                className="trending-btn shadow flex items-center gap-2 px-4 py-2 rounded-full"
                            >
                                <span
                                    className="inline-flex items-center justify-center rounded-full"
                                    style={{ width: 28, height: 28, background: '#eef2ff' }}
                                >
                                    <Image
                                        src={cat.imageUrl || "/images/about.webp"}
                                        alt={cat.name}
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover"
                                    />
                                </span>
                                <span>{cat.name}</span>
                            </button>
                        ))}

                        {/* Next 2 categories only */}
                        <div className="second-row flex justify-center gap-4 w-full mt-4">
                            {categories.slice(6, 8).map((cat) => (
                                <button
                                    key={cat._id}
                                    className="trending-btn shadow flex items-center gap-2 px-4 py-2 rounded-full"
                                >
                                    <span
                                        className="inline-flex items-center justify-center rounded-full"
                                        style={{ width: 28, height: 28, background: '#eef2ff' }}
                                    >
                                        <Image
                                            src={cat.imageUrl || "/images/aside.webp"}
                                            alt={cat.name}
                                            width={20}
                                            height={20}
                                            className="rounded-full object-cover"
                                        />
                                    </span>
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                )}
            </section>
        </main>
    );
}
