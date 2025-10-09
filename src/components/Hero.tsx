"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Image from "next/image";
import { listTrendingByCategory, type TrendingCategory } from "@/lib/api";
import toast from "react-hot-toast";

type RemoteCategory = TrendingCategory;

type HeroProps = {
    selectedCat?: string | null;
    onCategorySelect?: (catId: string | null) => void;
};

export default function Hero({ selectedCat, onCategorySelect }: HeroProps) {
    const [categories, setCategories] = useState<RemoteCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const { categories } = await listTrendingByCategory();
                setCategories(categories);
            } catch (err) {
                console.log("Failed to fetch trending categories", err);
                toast.error("Failed to fetch trending categories");
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
                    <div className="py-8 flex justify-center"><Loader inline label="Loading topics..." /></div>
                ) : (
                    <div className="trending-buttons-container mx-auto flex flex-wrap justify-center gap-4">

                        {/* ===== All Button ===== */}
                        <button
                            key="all"
                            className={`trending-btn shadow flex items-center gap-2 px-4 py-2 rounded-full ${!selectedCat ? "bg-indigo-100" : ""}`}
                            onClick={() => onCategorySelect?.(null)}
                        >
                            <span
                                className="inline-flex items-center justify-center rounded-full"
                                style={{ width: 28, height: 28, background: '#eef2ff' }}
                            >
                                🌐
                            </span>
                            <span>All</span>
                        </button>

                        {/* First 6 categories */}
                        {categories.slice(0, 6).map((cat) => (
                            <button
                                key={cat._id}
                                className={`trending-btn shadow flex items-center gap-2 px-4 py-2 rounded-full ${selectedCat === cat._id ? "bg-indigo-100" : ""}`}
                                onClick={() => onCategorySelect?.(cat._id)}
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

                        {/* Next 2 categories */}
                        <div className="second-row flex justify-center gap-4 w-full mt-4">
                            {categories.slice(6, 8).map((cat) => (
                                <button
                                    key={cat._id}
                                    className={`trending-btn shadow flex items-center gap-2 px-4 py-2 rounded-full ${selectedCat === cat._id ? "bg-indigo-100" : ""}`}
                                    onClick={() => onCategorySelect?.(cat._id)}
                                >
                                    <span className="inline-flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: '#eef2ff' }}>
                                        <Image src={cat.imageUrl || "/images/aside.webp"} alt={cat.name} width={20} height={20} className="rounded-full object-cover" />
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
