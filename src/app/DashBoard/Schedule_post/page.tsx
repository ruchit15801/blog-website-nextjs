"use client";
import DashboardLayout from "../DashBoardLayout";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { adminDeletePostById, fetchAdminScheduledPosts, publishAdminPostNow, type RemotePost } from "@/lib/adminClient";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";
import { fetchScheduledPosts } from "@/lib/api";

export default function SchedulePosts() {
    const perPage = 6;
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const [page, setPage] = useState(1);
    const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        const role = (localStorage.getItem("role") || "").toLowerCase();
        const token = localStorage.getItem("accessToken") || "";

        const fetchFn =
            role === "admin" ? fetchAdminScheduledPosts : fetchScheduledPosts;
        console.log("Fetching scheduled posts for:", role);

        fetchFn({
            page,
            limit: perPage,
            token,
            q: search || undefined,
            userId: role === "admin" ? undefined : localStorage.getItem("userId") || undefined,
        })
            .then((res) => {
                if (!active) return;
                setLivePosts(res.data || []);
            }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));

        return () => {
            active = false;
        };
    }, [page, perPage, search]);

    const baseList = useMemo(() => {
        return livePosts.map(p => ({
            id: p._id,
            title: p.title,
            date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
            excerpt: "",
            image: p.bannerImageUrl || p.imageUrls?.[0] || "/images/a1.webp",
            author: typeof p.author === "string" ? p.author : p.author?.fullName || "Admin",
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

            toast.success(`"${postTitle}" published successfully!`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to publish post");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await adminDeletePostById(postId);
            setLivePosts(prev => prev.filter(p => p._id !== postId));
            toast.success(`Post deleted successfully!`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete post");
        }
    };

    // --- Pagination ---
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Scheduled Posts</h1>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    {/* Search */}
                    <div className="custom-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <div className="custom-dropdown">
                        <button
                            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                            className="flex items-center gap-2">
                            {sortOrder === "latest" ? "Latest" : "Oldest"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {sortDropdownOpen && (
                            <div className="options">
                                <div
                                    className={`option ${sortOrder === "latest" ? "selected" : ""}`}
                                    onClick={() => {
                                        setSortOrder("latest");
                                        setSortDropdownOpen(false);
                                    }}> Latest </div>
                                <div
                                    className={`option ${sortOrder === "oldest" ? "selected" : ""}`}
                                    onClick={() => {
                                        setSortOrder("oldest");
                                        setSortDropdownOpen(false);
                                    }}> Oldest </div>
                            </div>
                        )}
                    </div>

                    {/* Create Schedule Button */}
                    <Link href="/DashBoard/Create_schedule_post" className="Create_Schedule px-4 rounded-lg transition" style={{ padding: '11px 10px' }}>Create Schedule Post</Link>
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
                    <article key={p.id} onClick={() => router.push(`/DashBoard/Post/${p.id}/`)} className="relative group flex flex-col overflow-hidden transition bg-white px-4 pt-4 rounded-2xl">
                        <div className="relative w-full h-56">
                            <Image src={p.image} alt={p.title} fill className="object-cover rounded-2xl" />

                            {/* Tags */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                {Array.isArray(p.tag)
                                    ? p.tag.slice(0, 2).map((t, i) => (
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
                            <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
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
                <div className="mt-10">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={(p) => setPage(p)}
                    />
                </div>
            )}

        </DashboardLayout>
    );
}
