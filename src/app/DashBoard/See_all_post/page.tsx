"use client";

import DashboardLayout from "../DashBoardLayout";
import { Check, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";
import { fetchAdminPosts, adminDeletePostById, type RemotePost } from "@/lib/adminClient";
import { fetchAllUserPosts, deleteUserPost, UserPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AllPosts() {
    const router = useRouter();
    const perPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const [open, setOpen] = useState(false);
    const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const isSearchActive = searchQuery.trim() !== "";
    const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);
    const role = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("role") || "user" : "user"), []);
    const userId = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("userId") : null), []);

    const safeDate = (value?: string) => (value ? new Date(value) : new Date());

    useEffect(() => {
        if (!token) return;
        let active = true;
        setLoading(true);
        setError(null);
        const fetchPosts = async () => {
            try {
                let posts: RemotePost[] = [];
                let total = 0;
                if (role === "admin") {
                    const res = await fetchAdminPosts({ page: currentPage, limit: perPage }, token);
                    posts = res.posts;
                    total = res.total;
                } else if (userId) {
                    const res = await fetchAllUserPosts({ page: currentPage, limit: perPage, token, authorId: userId });
                    posts = res.data.map((p: UserPost) => ({
                        _id: p._id,
                        title: p.title,
                        bannerImageUrl: p.bannerImageUrl || "",
                        createdAt: p.createdAt || "",
                        publishedAt: p.publishedAt || "",
                        author:typeof p.author === "string" ? { _id: "", fullName: p.author } : p.author,
                        contentHtml: p.contentHtml ?? "",
                        tags: p.tags ?? [],
                        readingTimeMinutes: p.readingTimeMinutes ?? 0,
                        slug: p.slug ?? "",         
                    }));
                    total = res.meta.total;
                } else {
                    setError("User ID not found");
                    return;
                }
                if (!active) return;
                setLivePosts(posts);
                setTotalPosts(total);
            } catch {
                toast.error("Failed to load posts");
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchPosts();
        return () => {
            active = false;
        };
    }, [token, role, currentPage, userId]);

    // --- Base List & Filter/Sort ---
    const filteredArticles = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return livePosts
            .map((p) => {
                const dateObj = safeDate(p.createdAt);
                return {
                    id: p._id,
                    title: p.title,
                    date: dateObj.toDateString(),
                    author: typeof p.author === "string" ? p.author : p.author?.fullName || "",
                    excerpt: "",
                    image: p.bannerImageUrl || "",
                    tag: p.tags || [],
                    readTime: p.readingTimeMinutes || 0,
                    full: p,
                    timestamp: dateObj.getTime(), 
                };
            })
            .filter((a) => a.title.toLowerCase().includes(query))
            .sort((a, b) => sortOrder === "latest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    }, [livePosts, searchQuery, sortOrder]);

    const handleEdit = (post: RemotePost) => router.push(`/DashBoard/Create_post?id=${post._id}`);
    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        if (!token) return toast.error("You must be logged in to delete a post");
        try {
            if (role === "admin") await adminDeletePostById(postId);
            else await deleteUserPost(postId, token);
            setLivePosts((prev) => prev.filter((p) => p._id !== postId));
            toast.success("Post deleted successfully!");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    // --- PostCard Component ---
    const PostCard = ({ a }: { a: (typeof filteredArticles)[0] }) => (
        <article
            key={a.id}
            onClick={() => router.push(`/DashBoard/Post/${a.id}/`)}
            className="flex flex-col overflow-hidden group cursor-pointer relative bg-white pt-4 px-4 rounded-2xl shadow hover:shadow-lg transition">
            <div className="relative w-full h-48 sm:h-56 md:h-48 lg:h-56">
                <Image
                    src={a.image || "/placeholder.png"}
                    alt={a.title}
                    fill
                    className="object-cover rounded-2xl"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {(Array.isArray(a.tag) ? a.tag.slice(0, 2) : [a.tag]).map((t, i) => (
                        <span
                            key={i}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                            style={{
                                background: "#eef2ff",
                                color: "#5559d1",
                                letterSpacing: ".05em",
                            }}>
                            {t}
                        </span>
                    ))}
                </div>

                <details
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition"
                    onClick={(e) => e.stopPropagation()}>
                    <summary className="list-none cursor-pointer p-2 bg-black/30 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                        <MoreHorizontal className="w-4 h-4" />
                    </summary>
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                        <button
                            onClick={() => handleEdit(a.full)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(a.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                            Delete
                        </button>
                    </div>
                </details>
            </div>

            <div className="py-4 px-1 flex flex-col gap-2">
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
                    <span className="font-medium text-gray-700" style={{ color: "#5559d1" }}>
                        {a.author}
                    </span>
                    <span className="text-gray-500"> on {a.date}</span>
                </div>
                <h2 className="text-lg font-bold">{a.title}</h2>
                <p className="text-gray-600 text-sm">{a.excerpt}</p>
            </div>
        </article>
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col shadow-xl pb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-10 rounded-xl" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center md:text-left w-full md:w-auto">All Posts</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-center">
                        <div className="custom-search w-full sm:w-auto relative">
                            <Search className="absolute top-3 left-3 text-gray-400" />
                            <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 pl-10 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div className="custom-dropdown relative w-full sm:w-auto">
                            <button className="flex items-center justify-between w-full sm:w-auto px-3 h-10 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setOpen(!open)}>
                                {sortOrder === "latest" ? "Latest Posts" : "Oldest Posts"}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>
                            {open && (
                                <div className="absolute mt-1 w-full sm:w-48 bg-white rounded-md shadow-lg z-20">
                                    {(["latest", "oldest"] as const).map((s) => (
                                        <div key={s} className={`option px-4 py-2 text-sm cursor-pointer ${sortOrder === s ? "bg-gray-100 font-semibold" : ""}`} onClick={() => { setSortOrder(s); setOpen(false); }}>
                                            {s === "latest" ? "Latest Posts" : "Oldest Posts"} {sortOrder === s && <Check className="inline ml-1 w-4 h-4 text-blue-600" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {loading && <div className="col-span-full text-center py-20"><Loader inline label="Loading latest posts" /></div>}
                    {error && !loading && <div className="col-span-full text-center py-20 text-red-500 text-lg font-semibold">{error}</div>}
                    {!loading && !error && filteredArticles.length === 0 && <div className="col-span-full text-center py-20 text-gray-500 text-lg font-semibold">{isSearchActive ? "No posts found for your search." : "No posts available."}</div>}
                    {!loading && !error && filteredArticles.map((a) => <PostCard key={a.id} a={a} />)}
                </main>

                {/* Pagination */}
                {!loading && !error && filteredArticles.length > 0 && totalPosts > perPage && (
                    <div className="lg:col-span-3 mt-10 flex justify-center">
                        <Pagination page={currentPage} totalPages={Math.ceil(totalPosts / perPage)} onChange={setCurrentPage} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
