"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { adminDeletePostById, fetchAdminScheduledPosts, publishAdminPostNow, type RemotePost } from "@/lib/adminClient";
import { useRouter } from "next/navigation";

export default function SchedulePosts() {
    const perPage = 6;
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const [page, setPage] = useState(1);
    const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        fetchAdminScheduledPosts({ page, limit: perPage, q: search || undefined })
            .then((res) => { if (!active) return; setLivePosts(res.posts || []); })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [page, perPage, search]);

    const baseList = useMemo(() => {
        return livePosts.map(p => ({
            id: p._id,
            title: p.title,
            date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
            author: typeof p.author === "string" ? p.author : p.author?.fullName || "",
            excerpt: "",
            image: p.bannerImageUrl || "/images/a1.webp",
            tag: p.tags || [],
            readTime: p.readingTimeMinutes || 0,
        }));
    }, [livePosts]);

    const filtered = useMemo(() => {
        const f = baseList.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
        f.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return f;
    }, [search, sortOrder, baseList]);

    const handleEdit = (post: RemotePost) => {
        router.push(`/DashBoard/Create_schedule_post?id=${post._id}`);
    };

    const handlePublishNow = async (postId: string, postTitle: string) => {
        if (!confirm(`Publish "${postTitle}" now?`)) return;

        try {
            setLoading(true);
            const updatedPost = await publishAdminPostNow(postId);

            setLivePosts(prev =>
                prev.map(lp => (lp._id === postId ? updatedPost : lp))
            );

            alert(`Post "${postTitle}" published successfully!`);
        } catch (err) {
            alert(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await adminDeletePostById(postId);
            alert("Post deleted successfully!");
            setLivePosts(prev => prev.filter(p => p._id !== postId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete post");
        }
    };

    // --- Pagination ---
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    const goTo = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Scheduled Posts</h1>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]">
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <Link href="/DashBoard/Create_schedule_post" className="Create_Schedule px-4 py-2 rounded-lg transition">Create Schedule Post</Link>

                </div>
            </div>

            {/* Posts Grid */}
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading && (
                    <div className="col-span-full text-center py-16"><Loader inline label="Loading scheduled posts" /></div>
                )}
                {error && !loading && (
                    <div className="col-span-full text-center py-16 text-red-500">{error}</div>
                )}
                {!loading && !error && paginated.map((p) => (
                    <article key={p.id} className="relative group flex flex-col overflow-hidden transition">
                        <div className="relative w-full h-56">
                            <Image src={p.image} alt={p.title} fill className="object-cover rounded-2xl" />

                            {/* Tags */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                {Array.isArray(p.tag)
                                    ? p.tag.map((t, i) => (
                                        <span
                                            key={i}
                                            className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                        >
                                            {t}
                                        </span>
                                    ))
                                    : (
                                        <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                            {p.tag}
                                        </span>
                                    )}
                            </div>

                            {/* 3-dot menu (hover only) */}
                            <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                                <summary
                                    className="list-none cursor-pointer p-2 bg-black/20 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                                    <MoreHorizontal className="w-3 h-3" />
                                </summary>

                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                    {/* <button onClick={() => alert(`Edit ${p.title}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                        Edit
                                    </button> */}

                                    <button
                                        onClick={() => {
                                            const originalPost = livePosts.find(lp => lp._id === p.id);
                                            if (!originalPost) return alert("Post not found!");
                                            handleEdit(originalPost);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handlePublishNow(p.id, p.title)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-green-600"
                                    >
                                        Publish Now
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                                        Delete
                                    </button>
                                </div>
                            </details>
                        </div>

                        <div className="py-4 flex flex-col gap-2">
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                                <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{p.author}</span>
                                <span>on {p.date}</span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                            <p className="text-gray-600 text-sm">{p.excerpt}</p>
                        </div>
                    </article>
                ))}

                {!loading && !error && paginated.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No posts found.
                    </div>
                )}
            </main>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                    <button
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded-md ${page === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#5559d1] shadow-sm"
                            }`}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pnum) => (
                        <button
                            key={pnum}
                            onClick={() => goTo(pnum)}
                            className={`px-3 py-1 rounded-md font-medium transition-colors ${page === pnum
                                ? "bg-[#5559d1] text-white shadow-md"
                                : "bg-white text-[#5559d1] hover:bg-[#5559d1] hover:text-white shadow-sm"
                                }`}
                        >
                            {pnum}
                        </button>
                    ))}
                    <button
                        onClick={() => goTo(page + 1)}
                        disabled={page === totalPages}
                        className={`px-3 py-1 rounded-md ${page === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#5559d1] shadow-sm"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
}
