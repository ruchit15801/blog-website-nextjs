import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import Pagination from "./Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HomeAuthor, HomePost } from "@/lib/api";
import { buildSlugPath } from "@/lib/slug";

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
    // Helper to get author name only for HomePost
    const getPostAuthorName = (post: HomePost) => {
        if (typeof post.author === "string") return post.author;
        if (post.author?.fullName) return post.author.fullName;
        const email = post.author?.email;
        if (typeof email === "string") return email.split("@")[0];
        return "Unknown Author";
    };


    // Helper to format dates
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Unknown Date";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Process recent posts for main articles
    const articles = useMemo(() => {
        return (recentPosts || []).map((p) => ({
            id: p._id,
            title: p.title,
            date: formatDate(p.publishedAt || p.createdAt),
            author: getPostAuthorName(p),
            excerpt: "",
            image: p.bannerImageUrl || "/images/a1.webp",
            tag: Array.isArray(p.tags) ? p.tags : [],
            readTime: p.readingTimeMinutes ?? 0,
        }));
    }, [recentPosts]);


    // Process featured posts for slider
    const slider = useMemo(() => {
        return (featuredPosts || []).map((p) => ({
            img: p.bannerImageUrl || "/images/a1.webp",
            title: p.title,
            author: getPostAuthorName(p),
            date: formatDate(p.publishedAt || p.createdAt),
            tag: Array.isArray(p.tags) && p.tags.length ? p.tags[0] : "",
        }));
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

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ===== Main Content ===== */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedArticles.map((a) => (
                        <Link key={a.id} href={`/articles/${buildSlugPath(a.id, a.title)}`}>
                            <article className="flex flex-col overflow-hidden group cursor-pointer">
                                {/* Image */}
                                <div className="relative w-full h-56">
                                    <Image
                                        src={a.image}
                                        alt={a.title}
                                        fill
                                        className="object-cover rounded-2xl"
                                    />
                                    {/* Tags */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {Array.isArray(a.tag)
                                            ? a.tag.slice(0, 2).map((t, i) => (
                                                <span key={i} className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                                    {t}
                                                </span>
                                            ))
                                            : <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{a.tag}</span>
                                        }
                                    </div>
                                    {/* Read Time */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                        <Clock className="w-5 h-5" />
                                        <span>{a.readTime} min read</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="py-4 px-1 flex flex-col gap-2">
                                    <div className="flex items-center text-sm text-gray-500 gap-1">
                                        <span className="font-medium text-gray-700">{a.author}</span>
                                        <span>on {a.date}</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">{a.title}</h2>
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
            </div>

            {/* ===== Sidebar ===== */}
            <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-10">
                    {/* About */}
                    <div className="aside-shadow rounded-xl shadow py-6 px-6 flex flex-col">
                        <h2 className="uppercase text-sm font-bold text-gray-500 mb-4">About</h2>
                        <div className="flex gap-3 items-center">
                            <Image
                                src={topAuthors?.[0]?.avatarUrl || "/images/aside_about.webp"}
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

                    {/* Featured Slider */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Featured Posts</h3>
                        <div className="relative w-full h-80 overflow-hidden group">
                            {slider.map((post, i) => (
                                <div key={post.title} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                                    <Image src={post.img} alt={post.title} fill className="object-cover rounded-2xl" />
                                    <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                                        <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded self-start">{post.tag}</span>
                                        <div>
                                            <span className="block text-sm">{post.author} • {post.date}</span>
                                            <h4 className="text-lg font-semibold">{post.title}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={prev} className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:translate-x-5 transition-all" aria-label="Previous slide">
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button onClick={next} className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:-translate-x-5 transition-all" aria-label="Next slide">
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Top Authors */}
                    <div className="aside-shadow rounded-xl shadow p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Top Authors</h3>
                        <div className="space-y-4">
                            {(topAuthors || []).slice(0, 3).map((a) => (
                                <div key={a._id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Image src={a.avatarUrl || "/images/aside_about.webp"} alt={a.fullName || "Author"} width={40} height={40} className="about_author_img object-cover" />
                                        <div>
                                            <h4 className="font-medium">{a.fullName || "Author"}</h4>
                                            <p className="text-sm text-gray-500">Featured contributor</p>
                                        </div>
                                    </div>
                                    <Link href={`/blog?author=${encodeURIComponent(a._id)}`} className="text-sm text-blue-600 hover:underline">View</Link>
                                </div>
                            ))}
                            {(!topAuthors || topAuthors.length === 0) && <p className="text-sm text-gray-500">No authors to display.</p>}
                        </div>
                    </div>

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
