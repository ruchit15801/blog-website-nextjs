"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, } from "next/navigation";
import { Clock } from "lucide-react";
import Pagination from "@/components/Pagination";
import { fetchAdminPosts, type RemotePost } from "@/lib/adminClient";
import { buildSlugPath } from "@/lib/slug";

export default function BlogIndex() {
    const { authorId } = useParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<RemotePost[]>([]);
    // kept for possible future use/display, but not required for pagination UI
    // const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [authorName, setAuthorName] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        fetchAdminPosts({ page, limit, userid: Array.isArray(authorId) ? authorId[0] : authorId || undefined })
            .then((res) => {
                if (!active) return;
                setPosts(res.posts || []);
                // setTotal(res.total || 0);
                setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total || 0) / (res.limit || limit))));
                if (authorId) {
                    const first = (res.posts || [])[0];
                    const name = first ? (typeof first.author === "string" ? first.author : (first.author?.fullName || "")) : "";
                    setAuthorName(name);
                } else {
                    setAuthorName("");
                }
            })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [page, limit, authorId]);

    useEffect(() => {
        // Reset to first page when author filter changes
        setPage(1);
    }, [authorId]);

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
                    <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]">
                        <option value={6}>6 / page</option>
                        <option value={12}>12 / page</option>
                        <option value={24}>24 / page</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="text-center text-red-500 py-12">{error}</div>
            )}

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
                        const authorName = typeof p.author === "string" ? p.author : (p.author?.fullName || "");
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
                                            <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{authorName}</span>
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
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
            )}
        </div>
    );
}



