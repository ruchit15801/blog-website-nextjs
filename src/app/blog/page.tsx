"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import Pagination from "@/components/Pagination";
import { buildSlugPath } from "@/lib/slug";
import { HomePost, listPostsByAuthor } from "@/lib/api";

export default function BlogIndex() {
    const router = useRouter();
    const pathname = usePathname();

    // State
    const [posts, setPosts] = useState<HomePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [authorName, setAuthorName] = useState("");

    // URL Query Helper
    const getQueryParams = () => {
        const search = typeof window !== "undefined" ? window.location.search : "";
        const sp = new URLSearchParams(search);
        const authorId = sp.get("author") || "";
        const page = Number(sp.get("page") || "1");
        const limit = Number(sp.get("limit") || "12");
        return { authorId, page, limit };
    };

    // Fetch Posts
    const fetchPosts = ({ authorId, page, limit }: { authorId: string; page: number; limit: number }) => {
        if (!authorId) return;
        let active = true;
        setLoading(true);
        setError(null);

        listPostsByAuthor({ authorId, page, limit })
            .then((res) => {
                if (!active) return;
                setPosts(res.posts || []);
                setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total || 0) / limit)));
                const first = res.posts?.[0];
                setAuthorName(first ? (typeof first.author === "string" ? first.author : first.author?.fullName || "") : "");
            })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));

        return () => { active = false; };
    };

    // React to URL changes
    useEffect(() => {
        const { authorId, page, limit } = getQueryParams();
        fetchPosts({ authorId, page, limit });
    }, [pathname]);

    // Change page
    const handlePageChange = (newPage: number) => {
        const { authorId, limit } = getQueryParams();
        const sp = new URLSearchParams();
        if (authorId) sp.set("author", authorId);
        sp.set("page", String(newPage));
        sp.set("limit", String(limit));
        router.push(`/blog?${sp.toString()}`);
    };

    // Change limit
    const handleLimitChange = (newLimit: number) => {
        const { authorId } = getQueryParams();
        const sp = new URLSearchParams();
        if (authorId) sp.set("author", authorId);
        sp.set("page", "1");
        sp.set("limit", String(newLimit));
        router.push(`/blog?${sp.toString()}`);
    };

    const { page, limit, authorId } = getQueryParams();

    return (
        <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">All posts</h1>
                    {authorId ? (
                        <p className="opacity-80">Latest posts by {authorName || "this author"} on BlogCafeAI.</p>
                    ) : (
                        <p className="opacity-80">Read the latest from BlogCafeAI.</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                    >
                        <option value={6}>6 / page</option>
                        <option value={12}>12 / page</option>
                        <option value={24}>24 / page</option>
                    </select>
                </div>
            </div>

            {error && <div className="text-center text-red-500 py-12">{error}</div>}

            {loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="rounded-2xl h-56 bg-white/5 animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((p) => {
                        const name = typeof p.author === "string" ? p.author : (p.author?.fullName || "");
                        const date = new Date(p.publishedAt || p.createdAt || Date.now()).toDateString();
                        return (
                            <Link key={p._id} href={`/articles/${buildSlugPath(p._id, p.title)}`}>
                                <article className="flex flex-col overflow-hidden group">
                                    <div className="relative w-full h-56">
                                        <Image src={p.bannerImageUrl || "/images/a1.webp"} alt={p.title} fill className="object-cover rounded-2xl" />
                                        <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Clock className="w-5 h-5" />
                                            <span>{p.readingTimeMinutes ?? 0} min read</span>
                                        </div>
                                    </div>
                                    <div className="py-4 px-1 flex flex-col gap-2">
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{name}</span>
                                            <span>on {date}</span>
                                        </div>
                                        <h2 className="text-lg font-bold" style={{ color: '#29294b' }}>{p.title}</h2>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {Array.isArray(p.tags) && p.tags.slice(0, 3).map((t) => (
                                                <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fff', color: '#29294b', boxShadow: '0px 5px 20px 0px rgba(114,114,255,.12)', letterSpacing: '.05em' }}>
                                                    # {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                    {posts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-20">No posts found.</div>
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-10">
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                </div>
            )}
        </div>
    );
}
