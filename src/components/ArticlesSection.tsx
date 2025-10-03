import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import Pagination from "./Pagination";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { HomeAuthor, HomePost } from "@/lib/api";

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
    // Main articles grid uses recent posts
    const articles = useMemo(() => {
        const list = Array.isArray(recentPosts) ? recentPosts : [];
        return list.map((p) => {
            const fallbackEmail = (typeof (p as unknown as { author?: { email?: string } }).author?.email === "string")
                ? (p as unknown as { author?: { email?: string } }).author!.email!.split("@")[0]
                : "";
            const fallbackName = (typeof (p as unknown as { author?: { name?: string } }).author?.name === "string")
                ? (p as unknown as { author?: { name?: string } }).author!.name!
                : fallbackEmail;
            const authorName = typeof p.author === "string"
                ? p.author
                : (p.author?.fullName || fallbackName || "");
            return {
                id: p._id,
                title: p.title,
                date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
                author: authorName,
                excerpt: "",
                image: p.bannerImageUrl || "/images/a1.webp",
                tag: Array.isArray(p.tags) ? p.tags : [],
                readTime: (p as unknown as { readingTimeMinutes?: number }).readingTimeMinutes ?? 0,
            };
        });
    }, [recentPosts]);

    // Sidebar featured slider uses featured posts
    const slider = useMemo(() => {
        return (featuredPosts || []).map((p) => {
            const fEmail = (typeof (p as unknown as { author?: { email?: string } }).author?.email === "string")
                ? (p as unknown as { author?: { email?: string } }).author!.email!.split("@")[0]
                : "";
            const fName = (typeof (p as unknown as { author?: { name?: string } }).author?.name === "string")
                ? (p as unknown as { author?: { name?: string } }).author!.name!
                : fEmail;
            const authorName = typeof p.author === "string"
                ? p.author
                : (p.author?.fullName || fName || "");
            return {
                img: p.bannerImageUrl || "/images/a1.webp",
                title: p.title,
                author: authorName,
                date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
                tag: Array.isArray(p.tags) && p.tags.length ? p.tags[0] : "",
            };
        });
    }, [featuredPosts]);

    const [index, setIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
    const perPage = 12;
    const prev = () => setIndex((i) => (i - 1 + slider.length) % slider.length);
    const next = () => setIndex((i) => (i + 1) % slider.length);
    const totalPages = pagination?.totalPages ?? Math.ceil(articles.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedArticles = pagination ? articles : articles.slice(start, start + perPage);
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        if (onPageChange) onPageChange(page);
        else setCurrentPage(page);
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ===== Main Content ===== */}
            <div className="lg:col-span-2 flex flex-col">
                {/* Outer wrapper for articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedArticles.map((a) => (
                        <Link key={a.id} href={`/articles/${a.id}`}>
                            <article
                                className="flex flex-col overflow-hidden group"
                            >
                                {/* Image */}
                                <div className="relative w-full h-56">
                                    <Image
                                        src={a.image}
                                        alt={a.title}
                                        fill
                                        className="object-cover rounded-2xl"
                                    />

                                    {/* Top-Left Tag */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {Array.isArray(a.tag) ? (
                                            a.tag.slice(0, 2).map((t: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                    style={{
                                                        lineHeight: 1.2,
                                                        color: "#222",
                                                        letterSpacing: ".1em",
                                                        transition: ".25s",
                                                    }}
                                                >
                                                    {t}
                                                </span>
                                            ))
                                        ) : (
                                            <span
                                                className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                style={{
                                                    lineHeight: 1.2,
                                                    color: "#222",
                                                    letterSpacing: ".1em",
                                                    transition: ".25s",
                                                }}
                                            >
                                                {a.tag}
                                            </span>
                                        )}
                                    </div>

                                    {/* Right-Top “min read” – visible on hover */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 700 }}>
                                        <Clock className="w-5 h-5" />
                                        <span style={{ fontSize: '16px' }}>{a.readTime} min read</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="py-4 px-1 flex flex-col gap-2">
                                    {/* Author & Date */}
                                    <div className="flex items-center text-sm text-gray-500 gap-1">
                                        <span className="font-medium text-gray-700">
                                            <span style={{ color: '#5955d1', fontWeight: 600, fontSize: '.925rem', lineHeight: 1.2 }}>{a.author}</span>
                                        </span>
                                        <span style={{ color: '#696981', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.02em' }}> on {a.date}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 style={{ fontSize: '1.3125rem', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1.2, color: '#29294b' }}>
                                        {a.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 text-sm" style={{ fontWeight: 400, fontSize: '1rem', lineHeight: 1.55, color: '#696981', maxWidth: '640px' }}>{a.excerpt}</p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
                {/* Pagination - unified UI */}
                {totalPages > 1 && (
                    <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                )}
            </div>
            {/* ===== Sidebar / Aside ===== */}
            <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-10">

                    {/* 1️⃣ About Section */}
                    <div className="aside-shadow rounded-xl shadow py-6 ps-6 pe-10 flex flex-col">
                        <h2 style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem' }} className="uppercase">About</h2>
                        {/* Profile Photo */}
                        <div className="flex gap-3">
                            <div>
                                <Image
                                    src={(topAuthors?.[0]?.avatarUrl) || "/images/aside_about.webp"}
                                    alt={topAuthors?.[0]?.fullName || "Profile"}
                                    width={50}
                                    height={50}
                                    className="rounded-full mb-4 object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-900" style={{ color: '#29294b', fontWeight: 700, letterSpacing: '-0.04em' }}>{topAuthors?.[0]?.fullName || "Top Author"}</h3>
                                <p className="text-sm text-gray-500 mb-3 uppercase" style={{ fontSize: '12px', fontWeight: 800, color: '#696981', letterSpacing: '0.1em' }}>{topAuthors?.[0]?.fullName ? "Top Author" : ""}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 mx-auto" style={{ marginTop: '12px', lineHeight: '1.55', color: '#696981', fontSize: '17px' }}>
                            Meet the brilliant minds shaping our blog. These top authors share stories that cross borders, touch emotions, and challenge the ordinary. Each article they create carries the power to entertain, enlighten, and engage—making their words a must-read for every curious soul.
                        </p>
                        {/* Location */}
                        {/* <h4 className="flex items-center text-sm mb-4 gap-1">
                            <MapPin style={{ color: '#5955d1', fontSize: '1.5rem', width: '24px', height: '24px' }} />
                            <span style={{ color: '#29294b', fontSize: '16px', fontWeight: 400, marginTop: '8px', marginBottom: '0px', lineHeight: '1.55' }}>Paris, France</span>
                        </h4> */}

                        {/* Social Icons */}
                        {/* <div className="flex gap-4" style={{ color: '#29294b' }}>
                            <a href="#" aria-label="Twitter" className="hover:text-blue-600">
                                <svg width={24} height={24} viewBox="0 0 24 24">
                                    <path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="FaceBook" className="hover:text-sky-500">
                                <svg width={24} height={24} viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="InstaGram" className="hover:text-sky-500">
                                <svg width={24} height={24} viewBox="0 0 24 24">
                                    <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Linkedin" className="hover:text-sky-500">
                                <svg width={24} height={24} viewBox="0 0 24 24">
                                    <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                                </svg>
                            </a>
                        </div> */}
                    </div>

                    {/* 2️⃣ Featured Posts (Slider) */}
                    <h3 className="text-lg font-semibold mb-4">Featured Posts</h3>
                    <div>
                        <div className="relative w-full h-80 overflow-hidden group">
                            {slider.map((post, i) => (
                                <div
                                    key={post.title}
                                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                >
                                    <Image src={post.img} alt={post.title} fill className="object-cover rounded-2xl" />

                                    {/* Overlay (optional) */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                                        <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded self-start">
                                            {post.tag}
                                        </span>
                                        <div>
                                            <span className="block text-sm">{post.author} • {post.date}</span>
                                            <h4 className="text-lg font-semibold">{post.title}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={prev}
                                className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:translate-x-5 transition-all"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:-translate-x-5 transition-all"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* 3️⃣ Top Authors (from API) */}
                    <div className="aside-shadow rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 uppercase" style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem', lineHeight: '1.2' }}>Top Authors</h3>
                        <div className="space-y-4">
                            {(topAuthors || []).slice(0, 3).map((a) => (
                                <div key={a._id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Image src={a.avatarUrl || "/images/aside_about.webp"} alt={a.fullName || "Author"} width={40} height={40} className="rounded-full object-cover" />
                                        <div>
                                            <h4 className="font-medium" style={{ fontWeight: 600 }}>{a.fullName || "Author"}</h4>
                                            <p className="text-sm text-gray-500" style={{ fontWeight: 400, fontSize: '14px', marginTop: '2px' }}>Featured contributor</p>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm link-underline">View</a>
                                </div>
                            ))}
                            {(!topAuthors || topAuthors.length === 0) && (
                                <p className="text-sm text-gray-500">No authors to display.</p>
                            )}
                        </div>
                    </div>

                    {/* 4️⃣ Trending Tags (chips only) */}
                    <div className="aside-shadow rounded-xl shadow py-6 ps-6 pe-10">
                        <h3
                            className="text-lg font-semibold mb-4 uppercase"
                            style={{ fontSize: ".75rem", fontWeight: 800, color: "#696981" }}
                        >
                            Trending Tags
                        </h3>
                        <div className="trending-buttons-container">
                            {Array.from(new Set((trendingPosts || []).flatMap(p => (Array.isArray(p.tags) ? p.tags : [] as string[]))))
                                .slice(0, 5)
                                .map((tag, idx) => (
                                    <button
                                        key={`${tag}-${idx}`}
                                        className="trending-btn hover-float"
                                        aria-label={`Tag ${tag}`}
                                    >
                                        <span># {tag}</span>
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* 5️⃣ Creating (from recent post titles) */}
                    <div className="aside-shadow rounded-xl shadow p-6 space-y-4">
                        <h3 style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem' }} className="uppercase text-lg font-semibold mb-4" >Trending Blogs</h3>
                        {(recentPosts || []).slice(0, 3).map((p) => (
                            <div key={p._id}>
                                <a href={`/articles/${p._id}`} className="flex items-center gap-2 font-medium text-blue-600 hover:underline" style={{ color: '#5955d1', fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>
                                    {p.title}
                                    <ExternalLink className="w-4 h-4" strokeWidth={3} />
                                </a>
                                <p className="text-sm text-gray-600" style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.55', color: '#696981' }}>{new Date(p.publishedAt || p.createdAt || Date.now()).toDateString()}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </aside>
        </main>
    );
}
