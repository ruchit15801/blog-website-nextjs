"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";
import { listAllHomePosts, listTopTrendingCategories, listTopTrendingAuthors, type HomePost, type TrendingCategory, type HomeAuthor } from "@/lib/api";
import toast from "react-hot-toast";
import { buildSlugPath } from "@/lib/slug";
import Loader from "@/components/Loader";

type SidebarAuthor = { _id: string; fullName?: string; avatarUrl?: string };

export default function AllPostsPage() {
    const [posts, setPosts] = useState<HomePost[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<TrendingCategory[]>([]);
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"latest" | "oldest" | "random">("latest");
    const [authors, setAuthors] = useState<SidebarAuthor[]>([]);
    // Custom dropdown state
    const sortOptions: Array<{ value: "latest" | "oldest" | "random"; label: string }> = [
        { value: "latest", label: "Latest" },
        { value: "oldest", label: "Oldest" },
        { value: "random", label: "Random" },
    ];
    const perPageOptions = [6, 12, 24];
    const [sortOpen, setSortOpen] = useState(false);
    const [perOpen, setPerOpen] = useState(false);

    useEffect(() => {
        let active = true;
        listTopTrendingCategories(9).then((d) => { if (!active) return; setCategories(d.categories); }).catch(() => { });
        listTopTrendingAuthors(8).then((d) => { if (!active) return; setAuthors((d.authors || []).map((a: HomeAuthor & { avatarUrl?: string }) => ({ _id: a._id, fullName: a.fullName, avatarUrl: a.avatarUrl }))); }).catch(() => { });
        return () => { active = false; };
    }, []);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Sync state from URL on first load
    useEffect(() => {
        const p = Number(searchParams.get("page") || 1);
        const l = Number(searchParams.get("limit") || 12);
        const s = (searchParams.get("sort") as typeof sort) || "latest";
        const c = searchParams.get("category");
        if (p && p !== page) setPage(p);
        if (l && l !== limit) setLimit(l);
        if (s && s !== sort) setSort(s);
        if ((c || null) !== selectedCat) setSelectedCat(c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reflect state into URL when it changes
    useEffect(() => {
        const sp = new URLSearchParams();
        if (page) sp.set("page", String(page));
        if (limit) sp.set("limit", String(limit));
        if (sort) sp.set("sort", String(sort));
        if (selectedCat) sp.set("category", String(selectedCat));
        router.replace(`/all-posts?${sp.toString()}`);
        // Smooth scroll top on page change
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, limit, sort, selectedCat, router]);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        listAllHomePosts({ page, limit, sort, category: selectedCat })
            .then((res) => {
                if (!active) return;
                setPosts(res.posts);
                setTotal(res.total);

                if (!res.posts.length) {
                    toast("No posts found for the selected filters.", { icon: "⚠️" });
                }
            })
            .catch((e) => {
                const msg = e instanceof Error ? e.message : String(e);
                setError(msg);
                toast.error(msg);
            }).finally(() => setLoading(false));
        return () => { active = false; };
    }, [page, limit, sort, selectedCat]);

    // Smooth reveal for cards
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
    }, [posts.length, search]);

    // Debounce search typing for better UX
    useEffect(() => {
        const t = setTimeout(() => { /* trigger filter already updates state */ }, 200);
        return () => clearTimeout(t);
    }, [search]);

    // authors now loaded from API

    const filtered = useMemo(() => {
        if (!search.trim()) return posts;
        const q = search.toLowerCase();
        return posts.filter(p => (p.title || "").toLowerCase().includes(q));
    }, [posts, search]);

    const effectiveTotal = search.trim() ? filtered.length : total;
    const totalPages = Math.max(1, Math.ceil(effectiveTotal / limit));

    const visiblePages = useMemo(() => {
        const pages: number[] = [];
        const maxShown = 7; // including first/last and gaps
        if (totalPages <= maxShown) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        pages.push(1);
        if (start > 2) pages.push(-1); // gap
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push(-2); // gap
        pages.push(totalPages);
        return pages;
    }, [page, totalPages]);

    return (
        <Suspense fallback={<div className="py-16 flex justify-center"><Loader inline label="Loading posts..." /></div>}>
            <div className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    {/* Categories */}
                    <div className="aside-shadow rounded-2xl shadow p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-3 uppercase" style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981' }}>Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => { setSelectedCat(null); setPage(1); }} className={`btn btn-secondary ${selectedCat === null ? "ring-2" : ""}`}>All</button>
                            {categories.map(c => (
                                <button key={c._id} onClick={() => { setSelectedCat(c._id); setPage(1); }} className={`btn btn-secondary ${selectedCat === c._id ? "ring-2" : ""}`}>{c.name}</button>
                            ))}
                        </div>
                    </div>

                    {/* Top Authors */}
                    <div className="aside-shadow rounded-2xl shadow p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-3 uppercase" style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981' }}>Top Authors</h3>
                        <div className="space-y-3">
                            {authors.length === 0 && <p className="text-sm text-gray-500">No authors to display.</p>}
                            {authors.map(a => (
                                <div key={a._id} className="flex items-center gap-3">
                                    <Image src={a.avatarUrl || "/images/aside_about.webp"} alt={a.fullName || "Author"} width={40} height={40} className="about_author_img object-cover" />
                                    <div className="flex-1">
                                        <div className="font-medium" style={{ color: '#29294b' }}>{a.fullName}</div>
                                    </div>
                                    <Link href={`/blog?author=${encodeURIComponent(a._id)}`} className="text-sm link-underline">View</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main grid */}
                <section className="lg:col-span-2">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search posts..."
                                className="w-full rounded-xl pl-10 pr-3 py-2.5 border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5559d1] focus:border-transparent transition"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Sort dropdown */}
                            <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setSortOpen(false); }}>
                                <button
                                    type="button"
                                    className="rounded-xl px-3 py-2.5 border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5559d1] transition flex items-center gap-2"
                                    onClick={() => setSortOpen((v) => !v)}
                                >
                                    {sortOptions.find(o => o.value === sort)?.label || "Latest"}
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {sortOpen && (
                                    <div className="absolute z-20 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-1">
                                        {sortOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`w-full text-left px-3 py-2 rounded-lg transition ${sort === opt.value ? "bg-[#eef2ff] text-[#5559d1]" : "hover:bg-gray-50"}`}
                                                onClick={() => { setSort(opt.value); setPage(1); setSortOpen(false); }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Per-page dropdown */}
                            <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPerOpen(false); }}>
                                <button
                                    type="button"
                                    className="rounded-xl px-3 py-2.5 border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5559d1] transition flex items-center gap-2"
                                    onClick={() => setPerOpen((v) => !v)}
                                >
                                    {limit} / page
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {perOpen && (
                                    <div className="absolute z-20 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg p-1">
                                        {perPageOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                className={`w-full text-left px-3 py-2 rounded-lg transition ${limit === opt ? "bg-[#eef2ff] text-[#5559d1]" : "hover:bg-gray-50"}`}
                                                onClick={() => { setLimit(opt); setPage(1); setPerOpen(false); }}
                                            >
                                                {opt} / page
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {loading && (
                            <div className="col-span-full flex justify-center py-16">
                                <Loader inline label="Loading posts..." />
                            </div>
                        )}
                        {error && !loading && <div className="col-span-full text-center text-red-500 py-10">{error}</div>}
                        {!loading && !error && filtered.map((p, i) => {
                            const authorName = typeof p.author === "string" ? p.author : (p.author?.fullName || "");
                            const date = new Date(p.publishedAt || p.createdAt || Date.now()).toDateString();
                            return (
                                <Link key={p._id} href={`/articles/${buildSlugPath(p._id, p.title)}`}>
                                    <article className="flex flex-col overflow-hidden group rounded-2xl bg-white shadow ring-1 ring-black/5 hover:-translate-y-0.5 transition-all hover:shadow-lg hover-glow reveal-on-scroll reveal" style={{ transitionDelay: `${i * 40}ms` }}>
                                        <div className="relative w-full h-56">
                                            <Image src={p.bannerImageUrl || "/images/a1.webp"} alt={p.title} fill className="object-cover rounded-2xl hover-zoom" />
                                            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                            <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/30 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Clock className="w-5 h-5" />
                                                <span>{p.readingTimeMinutes ?? 0} min read</span>
                                            </div>
                                        </div>
                                        <div className="py-4 px-4 flex flex-col gap-2">
                                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                                <span className="font-semibold" style={{ color: '#5559d1' }}>{authorName}</span>
                                                <span className="text-gray-500">on {date}</span>
                                            </div>
                                            <h2 className="text-lg font-bold" style={{ color: '#29294b' }}>{p.title}</h2>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {Array.isArray(p.tags) && p.tags.slice(0, 3).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                                        style={{ background: '#eef2ff', color: '#5559d1', letterSpacing: '.05em' }}
                                                    >
                                                        #{" "}{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                        {!loading && !error && filtered.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-20">No posts found.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center mt-10 gap-2">
                            <div className="text-xs font-semibold tracking-wide" style={{ color: '#696981' }}>Page {page} of {totalPages}</div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className={`rounded-full p-2 transition hover-float ${page === 1 ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                                    aria-label="First page"
                                    title="First"
                                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}
                                >
                                    <ChevronsLeft className="w-4 h-4" style={{ color: '#5559d1' }} />
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`rounded-full p-2 transition hover-float ${page === 1 ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                                    aria-label="Previous page"
                                    title="Prev"
                                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}
                                >
                                    <ChevronLeft className="w-4 h-4" style={{ color: '#5559d1' }} />
                                </button>
                                {visiblePages.map((pnum, idx) => (
                                    pnum < 0 ? (
                                        <span key={`gap-${idx}`} className="px-2 text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={pnum}
                                            onClick={() => setPage(pnum)}
                                            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${page === pnum ? "text-white" : ""}`}
                                            style={page === pnum ? {
                                                background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)',
                                                boxShadow: '0 10px 24px -12px rgba(114,114,255,.45)'
                                            } : {
                                                background: '#fff',
                                                color: '#5559d1',
                                                boxShadow: '0 5px 20px rgba(114,114,255,.12)'
                                            }}
                                        >
                                            {pnum}
                                        </button>
                                    )
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`rounded-full p-2 transition hover-float ${page === totalPages ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                                    aria-label="Next page"
                                    title="Next"
                                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}
                                >
                                    <ChevronRight className="w-4 h-4" style={{ color: '#5559d1' }} />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className={`rounded-full p-2 transition hover-float ${page === totalPages ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                                    aria-label="Last page"
                                    title="Last"
                                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}
                                >
                                    <ChevronsRight className="w-4 h-4" style={{ color: '#5559d1' }} />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </Suspense>
    );
}


