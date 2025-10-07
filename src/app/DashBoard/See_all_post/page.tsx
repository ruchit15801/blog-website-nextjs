"use client";
import DashboardLayout from "../DashBoardLayout";
import { Check, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { fetchAdminPosts, type RemotePost, adminDeletePostById } from "@/lib/adminClient";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";
import { fetchUserPosts } from "@/lib/api";

export default function AllPosts() {
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;
    const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const isSearchActive = searchQuery.trim() !== "";
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        fetchAdminPosts({ page: 1, limit: 24 })
            .then((res) => {
                if (!active) return;
                setLivePosts(res.posts || []);
            })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, []);

    const baseList = useMemo(() => {
        return livePosts.map((p: RemotePost) => ({
            id: p._id,
            title: p.title,
            date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
            author: typeof p.author === "string" ? p.author : (p.author?.fullName || ""),
            excerpt: "",
            image: p.bannerImageUrl || "/images/a1.webp",
            tag: p.tags || [],
            readTime: p.readingTimeMinutes || 0,
            full: p,
        }));
    }, [livePosts]);

    const filteredArticles = useMemo(() => {
        const filtered = baseList.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filtered.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return filtered;
    }, [searchQuery, sortOrder, baseList]);

    const totalPages = Math.ceil(filteredArticles.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedArticles = filteredArticles.slice(start, start + perPage);



    // --- Handlers ---
    const handleEdit = (post: RemotePost) => {
        router.push(`/DashBoard/Create_post?id=${post._id}`);
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

    return (
        <DashboardLayout>
            {/* Header with Search + Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="custom-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="custom-dropdown">
                        <button onClick={() => setOpen(!open)}>
                            {sortOrder === "latest" ? "Latest Posts" : "Oldest Posts"}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {open && (
                            <div className="options">
                                <div
                                    className={`option ${sortOrder === "latest" ? "selected" : ""}`}
                                    onClick={() => { setSortOrder("latest"); setOpen(false); }}
                                >
                                    Latest Posts
                                    {sortOrder === "latest" && <Check />}
                                </div>
                                <div
                                    className={`option ${sortOrder === "oldest" ? "selected" : ""}`}
                                    onClick={() => { setSortOrder("oldest"); setOpen(false); }}
                                >
                                    Oldest Posts
                                    {sortOrder === "oldest" && <Check />}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-3 flex flex-col">
                    <div className={isSearchActive ? "flex flex-col gap-10" : "grid grid-cols-1 md:grid-cols-3 gap-8"}>
                        {loading && (
                            <div className="col-span-full text-center py-20"><Loader inline label="Loading latest posts" /></div>
                        )}
                        {error && !loading && (
                            <div className="col-span-full text-center py-20 text-red-500 text-lg font-semibold">{error}</div>
                        )}
                        {!loading && !error && paginatedArticles.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500 text-lg font-semibold">
                                {isSearchActive ? "No posts found for your search." : "No posts available."}
                            </div>
                        ) : (
                            paginatedArticles.map((a) => (
                                <article key={a.id} onClick={() => router.push(`/DashBoard/Post/${a.id}/`)} className="flex flex-col overflow-hidden group cursor-pointer relative bg-white pt-4 px-4 rounded-2xl">
                                    {/* --- Post Image + Menu --- */}
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

                                        {/* Hover Menu */}
                                        <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()} >
                                            <summary className="list-none cursor-pointer p-2 bg-black/30 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </summary>
                                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                                <button
                                                    onClick={() => handleEdit(a.full)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(a.id)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </details>
                                    </div>

                                    {/* --- Content --- */}
                                    <div className="py-4 px-1 flex flex-col gap-2">
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{a.author}</span>
                                            <span className="text-gray-500"> on {a.date}</span>
                                        </div>
                                        <h2 className="text-lg font-bold">{a.title}</h2>
                                        <p className="text-gray-600 text-sm">{a.excerpt}</p>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="lg:col-span-3 mt-10">
                        <Pagination
                            page={currentPage}
                            totalPages={totalPages}
                            onChange={(p) => setCurrentPage(p)}
                        />
                    </div>

                </div>
            </main>
        </DashboardLayout>
    );
}
