import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import Pagination from "./Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HomeAuthor, HomePost } from "@/lib/api";
import { buildSlugPath } from "@/lib/slug";
import Script from "next/script";
import AdSense from "./AdSense";

export default function ArticlesSection({
    featuredPosts,
    recentPosts,
    trendingPosts,
    topAuthors,
    pagination,
    onPageChange,
}: {
    featuredPosts: HomePost[];
    recentPosts: HomePost[];
    trendingPosts: HomePost[];
    topAuthors: HomeAuthor[];
    pagination?: { total: number; page: number; limit: number; totalPages: number };
    onPageChange?: (page: number) => void;
}) {
    // Helper to get author name
    const getPostAuthorName = (post: HomePost) => {
        if (typeof post.author === "string") return post.author;
        if (post.author?.fullName) return post.author.fullName;
        const email = post.author?.email;
        if (typeof email === "string") return email.split("@")[0];
        return "Unknown Author";
    };

    // Robust date formatter: supports ISO and YYYY-MM-DD strings
    const formatDate = (dateStr?: string) => {
        if (!dateStr || typeof dateStr !== "string") return "Unknown Date";
        const parts = dateStr.split("T")[0]?.split("-") || [];
        if (parts.length === 3) {
            const [year, month, day] = parts.map(Number);
            if (year && month && day) {
                try {
                    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                } catch { /* noop */ }
            }
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Unknown Date";
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const DEFAULT_BANNERS = [
        "/images/b1.png",
        "/images/b2.png",
        "/images/b3.png",
        "/images/b4.png",
        "/images/b5.png",
        "/images/b6.png",
        "/images/b7.png",
        "/images/b8.png",
        "/images/b9.png",
        "/images/b10.png",
        "/images/b11.png",
        "/images/b12.png",
    ];

    function getStableImage(postId: string) {
        const hash = postId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return DEFAULT_BANNERS[hash % DEFAULT_BANNERS.length];
    }

    // Process recent posts for main articles
    const articles = useMemo(() => {
        return (recentPosts || []).map((p) => ({
            id: p._id,
            title: p.title,
            date: formatDate(p.publishedAt || p.createdAt),
            author: getPostAuthorName(p),
            excerpt: "",
            image: p.bannerImageUrl || getStableImage(p._id),
            tag: Array.isArray(p.tags) ? p.tags : [],
            readTime: p.readingTimeMinutes ?? 0,
        }));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recentPosts]);

    // Process featured posts for slider
    const slider = useMemo(() => {
        return (featuredPosts || []).map((p) => ({
            img: p.bannerImageUrl || getStableImage(p._id),
            title: p.title,
            author: getPostAuthorName(p),
            date: formatDate(p.publishedAt || p.createdAt),
            tag: Array.isArray(p.tags) && p.tags.length ? p.tags[0] : "",
        }));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [featuredPosts]);

    // Slider state
    const [index, setIndex] = useState(0);
    const prev = () => slider.length && setIndex((i) => (i - 1 + slider.length) % slider.length);
    const next = () => slider.length && setIndex((i) => (i + 1) % slider.length);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
    const perPage = pagination?.limit ?? 12;
    const totalPages = pagination?.totalPages ?? Math.ceil(articles.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedArticles = pagination ? articles : articles.slice(start, start + perPage);

    // Keep local page in sync with parent-provided pagination
    useEffect(() => {
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination?.page]);
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        if (onPageChange) onPageChange(page);
        else setCurrentPage(page);
    };

    useEffect(() => {
        const nodes = document.querySelectorAll('.reveal-on-scroll');
        if (!nodes.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                }
            });
        }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, [paginatedArticles, currentPage]);

    useEffect(() => {
        setIndex(0);
    }, [recentPosts]);

    return (
        <main className="mx-auto max-w-7xl px-4 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ===== Main Content ===== */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedArticles.map((a, i) => (
                        <Link key={a.id} href={`/articles/${buildSlugPath(a.id, a.title)}`}>
                            <article className="flex flex-col overflow-hidden group cursor-pointer rounded-2xl bg-white shadow ring-1 ring-black/5 hover:-translate-y-0.5 transition-all hover:shadow-lg hover-glow reveal-on-scroll reveal" style={{ transitionDelay: `${i * 40}ms` }}>
                                {/* Image or Ad */}
                                <div className="relative w-full h-56">
                                    {a.image ? (
                                        <>
                                            <Image
                                                src={a.image}
                                                alt={a.title}
                                                fill
                                                className="object-cover rounded-2xl hover-zoom"
                                                loading={i < 2 ? "eager" : "lazy"}
                                                priority={i < 2}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <AdSense type="list" className="w-full h-full" />
                                        </div>
                                    )}
                                    {/* Tags */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {Array.isArray(a.tag)
                                            ? a.tag.slice(0, 2).map((t, i) => (
                                                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#5559d1', letterSpacing: '.05em' }}>
                                                    {t}
                                                </span>
                                            ))
                                            : <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#5559d1', letterSpacing: '.05em' }}>{a.tag}</span>
                                        }
                                    </div>
                                    {/* Read Time */}
                                    <div
                                        className={`absolute top-3 right-3 flex items-center gap-1 text-white text-xs px-3 py-1 rounded-xl
                                                transition-all duration-300 ease-in-out font-bold
                                                ${(Array.isArray(a.tag) ? a.tag.length > 0 : Boolean(a.tag)) ? 'bg-black/70' : 'bg-black/20'} opacity-0 group-hover:opacity-100 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap`}>
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{a.readTime} min read</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="py-4 px-4 flex flex-col gap-2">
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <span className="font-semibold" style={{ color: '#5559d1' }}>{a.author}</span>
                                        <span className="text-gray-500">on {a.date}</span>
                                    </div>
                                    <h2 className="text-lg font-bold" style={{ color: '#29294b' }}>{a.title}</h2>
                                    <p className="text-gray-600 text-sm">{a.excerpt}</p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                )}
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
                    data-ad-slot="4443874551"
                />
                <Script id="ads-init-four" strategy="afterInteractive">
                    {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </Script>
            </div>

            {/* ===== Sidebar ===== */}
            <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-10">
                    {/* About */}
                    <div className="aside-shadow rounded-xl shadow py-6 px-6 flex flex-col">
                        <h2 className="uppercase text-sm font-bold text-gray-500 mb-4">About</h2>
                        <div className="flex gap-3 items-center">
                            <Image
                                src={topAuthors?.[0]?.avatarUrl || "/images/p1.jpg"}
                                alt={topAuthors?.[0]?.fullName || "Author"}
                                width={50}
                                height={50}
                                className="about_author_img object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800">{topAuthors?.[0]?.fullName || "Top Author"}</h3>
                                <p className="text-xs uppercase text-gray-500">Top Author</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                            Meet the brilliant minds shaping our blog. These top authors share stories that cross borders, touch emotions, and challenge the ordinary.
                        </p>
                    </div>
                    {/* Google ads  */}
                    <Script
                        strategy="afterInteractive"
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
                        crossOrigin="anonymous"
                    />
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-8481647724806223"
                        data-ad-slot="6065730372"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                    <Script id="ads-init" strategy="afterInteractive">
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>
                    {/* Featured Slider */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Featured Posts</h3>
                        <div className="relative w-full h-80 overflow-hidden group">
                            {slider.length > 0 && (
                                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 z-10">
                                    <Image src={slider[index].img} alt={slider[index].title} fill className="object-cover rounded-2xl" loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" />
                                    <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                                        <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded self-start">{slider[index].tag}</span>
                                        <div>
                                            <span className="block text-sm">{slider[index].author} • {slider[index].date}</span>
                                            <h4 className="text-lg font-semibold">{slider[index].title}</h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={prev} className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:translate-x-5 transition-all" aria-label="Previous slide">
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button onClick={next} className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:-translate-x-5 transition-all" aria-label="Next slide">
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Google ads  */}
                    <Script
                        strategy="afterInteractive"
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
                        crossOrigin="anonymous"
                    />
                    {/* The ad placeholder for Home page Display Two */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-8481647724806223"
                        data-ad-slot="4830887360"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                    {/* Initialize the ad */}
                    <Script id="ads-init-two" strategy="afterInteractive">
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>

                    {/* Top Authors */}
                    <div className="aside-shadow rounded-xl shadow p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Top Authors</h3>
                        <div className="space-y-4">
                            {(topAuthors || []).slice(0, 3).map((a) => (
                                <div key={a._id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Image src={a.avatarUrl || "/images/p1.jpg"} alt={a.fullName || "Author"} width={40} height={40} className="about_author_img object-cover" />
                                        <div>
                                            <h4 className="font-medium">{a.fullName || "Author"}</h4>
                                            <p className="text-sm text-gray-500">Featured contributor</p>
                                        </div>
                                    </div>
                                    <Link href={`/blog/list?author=${encodeURIComponent(a._id)}`} className="text-sm text-blue-600 hover:underline">View</Link>
                                </div>
                            ))}
                            {(!topAuthors || topAuthors.length === 0) && <p className="text-sm text-gray-500">No authors to display.</p>}
                        </div>
                    </div>

                    {/* Google ads  */}
                    <Script
                        strategy="afterInteractive"
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
                        crossOrigin="anonymous"
                    />
                    {/* The ad placeholder for Home Page Display Three */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-8481647724806223"
                        data-ad-slot="1135184932"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                    {/* Initialize the ad */}
                    <Script id="ads-init-three" strategy="afterInteractive">
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>

                    {/* Trending Tags */}
                    <div className="aside-shadow rounded-xl shadow py-6 px-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Trending Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(new Set((trendingPosts || []).flatMap(p => (Array.isArray(p.tags) ? p.tags : []))))
                                .slice(0, 5)
                                .map((tag, idx) => (
                                    <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-300">#{tag}</span>
                                ))}
                        </div>
                    </div>

                    {/* Trending Blogs */}
                    <div className="aside-shadow rounded-xl shadow p-6 space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Trending Blogs</h3>
                        {(recentPosts || []).slice(0, 3).map((p) => (
                            <div key={p._id}>
                                <Link href={`/articles/${buildSlugPath(p._id, p.title)}`} className="flex items-center gap-2 font-medium text-blue-600 hover:underline">
                                    {p.title}
                                    <ExternalLink className="w-4 h-4" strokeWidth={3} />
                                </Link>
                                <p className="text-sm text-gray-500">{formatDate(p.publishedAt || p.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </main>
    );
}
