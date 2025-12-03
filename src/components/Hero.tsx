"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Image from "next/image";
import { listTrendingByCategory, type TrendingCategory } from "@/lib/api";
import toast from "react-hot-toast";
import Script from "next/script";

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
            } catch {
                toast.error("Failed to fetch trending categories");
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="hero-section pt-16 pb-6 sm:pt-20 px-4 text-center relative overflow-hidden">

                {/* RESPONSIVE BACKGROUND FIX */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(300px 150px at 50% -10%, rgba(153,149,255,.15), transparent 60%)",
                    }}
                ></div>

                {/* Desktop / Tablet Background Override */}
                <style>
                    {`
                        @media (min-width: 640px) {
                            .hero-section > div[aria-hidden] {
                                background: radial-gradient(600px 300px at 50% -10%, rgba(153,149,255,.15), transparent 60%);
                            }
                        }
                        @media (min-width: 1024px) {
                            .hero-section > div[aria-hidden] {
                                background: radial-gradient(1000px 400px at 50% -10%, rgba(153,149,255,.15), transparent 60%);
                            }
                        }
                    `}
                </style>

                <div className="relative max-w-5xl mx-auto">
                    <div className="fx2-wrap mb-5 inline-block">
                        <span aria-hidden className="fx2-orb hidden sm:block" style={{ width: 90, height: 90, left: -60, top: -10 }} />
                        <span aria-hidden className="fx2-orb hidden sm:block" style={{ width: 70, height: 70, right: -40, top: -20, animationDelay: "1.2s" }} />
                        <span aria-hidden className="fx2-orb hidden sm:block" style={{ width: 56, height: 56, left: -24, bottom: -14, animationDelay: "2.1s" }} />

                        <h1 className="fx2-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight break-words">
                            Whispers of Life: Tales that Touch the Soul
                        </h1>

                        <span aria-hidden className="fx2-streak hidden sm:block"></span>
                    </div>

                    <p className="text-sm sm:text-lg md:text-xl mx-auto max-w-xs sm:max-w-md md:max-w-2xl text-gray-500 min-h-[48px]">
                        Discover stories woven with emotion, wisdom, and wonder crafted to inspire, heal, and connect hearts across the world.
                    </p>
                </div>
            </section>

            {/* Trending Section */}
            <section className="trending-section py-8 sm:py-8 px-4 sm:px-6 text-center">
                <h2 className="uppercase text-xs sm:text-sm font-semibold mb-6 text-gray-500 tracking-widest">
                    Explore Trending Topics
                </h2>

                {loading ? (
                    <div className="py-8 flex justify-center">
                        <Loader inline label="Loading topics..." />
                    </div>
                ) : (
                    <div className="trending-buttons-container mx-auto flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto px-2 sm:px-0">
                        {/* ===== All Button ===== */}
                        <button
                            key="all"
                            className={`trending-btn shadow flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full flex-shrink-0 ${!selectedCat ? "bg-indigo-100" : ""
                                }`}
                            onClick={() => onCategorySelect?.(null)}>
                            <span className="inline-flex items-center justify-center rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50 text-xs sm:text-base">
                                🌐
                            </span>
                            <span className="text-sm sm:text-base">All</span>
                        </button>

                        {/* First 6 categories */}
                        {categories.slice(0, 6).map((cat) => (
                            <button
                                key={cat._id}
                                className={`trending-btn shadow flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full flex-shrink-0 ${selectedCat === cat._id ? "bg-indigo-100" : ""
                                    }`}
                                onClick={() => onCategorySelect?.(cat._id)}>
                                <span className="inline-flex items-center justify-center rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50">
                                    <Image
                                        src={cat.imageUrl || "/images/about.webp"}
                                        alt={`Icon for ${cat.name} category`}
                                        width={32}
                                        height={32}
                                        className="trending_category_img rounded-full object-cover"
                                        loading="lazy"
                                    />
                                </span>
                                <span className="text-sm sm:text-base">{cat.name}</span>
                            </button>
                        ))}

                        {/* Next categories (7-8, if any) */}
                        {categories.slice(6, 8).map((cat) => (
                            <button
                                key={cat._id}
                                className={`trending-btn shadow flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full flex-shrink-0 ${selectedCat === cat._id ? "bg-indigo-100" : ""
                                    }`}
                                onClick={() => onCategorySelect?.(cat._id)}>
                                <span className="inline-flex items-center justify-center rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50">
                                    <Image
                                        src={cat.imageUrl || "/images/aside.webp"}
                                        alt={`Icon for ${cat.name} category`}
                                        width={32}
                                        height={32}
                                        className="trending_category_img rounded-full object-cover"
                                        loading="lazy"
                                    />
                                </span>
                                <span className="text-sm sm:text-base">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Google Ads */}
            <Script
                strategy="afterInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
                crossOrigin="anonymous"
            />
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="autorelaxed"
                data-ad-client="ca-pub-8481647724806223"
                data-ad-slot="1466357420"
            />
            <Script id="ads-init" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </main>
    );
}
