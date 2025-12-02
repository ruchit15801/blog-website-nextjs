"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import {
    adminDeletePostById,
    fetchAdminUsers,
    fetchUserAllPosts,
    UserPost,
    type RemoteUser
} from "@/lib/adminClient";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";

type UiPost = {
    id: string;
    title: string;
    authorName: string;
    date: string;
    excerpt?: string;
    publishedAt?: string;
    image?: string;
    tag: string[] | string;
    readTime: number;
};

export default function UserPosts() {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(6);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<UiPost[]>([]);
    const [, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [userOptions, setUserOptions] = useState<RemoteUser[]>([]);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
    const [isLimitDropdownOpen, setLimitDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!loading && error) {
            router.replace("/error");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error]);

    useEffect(() => {
        let active = true;
        const token = localStorage.getItem("token");
        if (!token) return;
        (async () => {
            try {
                const res = await fetchAdminUsers({ page: 1, limit: 100 }, token);
                if (active) setUserOptions(res.users ?? []);
            } catch (err) {
                console.error(err);
            }
        })();
        return () => { active = false };
    }, []);

    useEffect(() => {
        let active = true;
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token not found");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const authorId = selectedUser !== "all" ? selectedUser : undefined;
        (async () => {
            try {
                const res = await fetchUserAllPosts({
                    page,
                    limit,
                    token,
                    search: search || undefined,
                    authorId
                });
                if (!active) return;
                const mapped: UiPost[] = res.data.map((p: UserPost) => ({
                    id: p._id,
                    title: p.title,
                    authorName: typeof p.author === "string" ? p.author : p.author?.fullName ?? "Unknown",
                    date: p.createdAt ?? new Date().toISOString(),
                    image: p.bannerImageUrl || "",
                    tag: p.tags ?? [],
                    publishedAt: p.publishedAt,
                    readTime: p.readingTimeMinutes ?? 0
                }));
                const total = res.meta?.total ?? mapped.length;
                setItems(mapped);
                setTotal(total);
                setTotalPages(Math.ceil(total / limit));
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false };
    }, [page, limit, search, selectedUser]);

    useEffect(() => {
        const timer = setTimeout(() => setPage(1), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = useCallback(async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await adminDeletePostById(postId);
            setItems(prev => prev.filter(p => p.id !== postId));
            toast.success("Post deleted successfully!");
        } catch {
            toast.error("Failed to delete post");
        }
    }, []);

    const getUserDisplay = useCallback(
        (id: string) => {
            if (id === "all") return "All Users";
            const user = userOptions.find(u => u._id === id);
            return user?.fullName ?? "Unknown User";
        },
        [userOptions]
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col shadow-xl pb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-12 rounded-xl" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                    <div className="w-full lg:w-auto text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-white">User Posts</h1>
                        <p className="text-gray-100 mt-1">Manage user posts</p>
                    </div>

                    {/* Search + Filter + Limit */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center w-full lg:w-auto mt-4 lg:mt-0">
                        {/* Search */}
                        <div className="custom-search flex-1 min-w-[12rem] md:w-64 flex items-center gap-2">
                            <Search />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* User Filter */}
                        <div className="custom-dropdown w-full sm:w-48 relative">
                            <button
                                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center justify-between w-full px-3 h-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {getUserDisplay(selectedUser)}
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isUserDropdownOpen && (
                                <div className="absolute mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-auto">
                                    <div className={`option ${selectedUser === "all" ? "selected" : ""}`}
                                        onClick={() => { setSelectedUser("all"); setUserDropdownOpen(false); }}>
                                        All Users
                                    </div>
                                    {userOptions.map(u => (
                                        <div key={u._id}
                                            className={`option ${selectedUser === u._id ? "selected" : ""}`}
                                            onClick={() => { setSelectedUser(u._id); setUserDropdownOpen(false); }}>
                                            {u.fullName || u.name || u.email}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Page Size */}
                        <div className="custom-dropdown w-full sm:w-32 relative">
                            <button
                                onClick={() => setLimitDropdownOpen(!isLimitDropdownOpen)}
                                className="flex items-center justify-between w-full px-3 h-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {limit} / page
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isLimitDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isLimitDropdownOpen && (
                                <div className="absolute mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                    {[6, 12, 24].map(l => (
                                        <div key={l}
                                            className={`option rounded-md ${limit === l ? "selected" : ""}`}
                                            onClick={() => { setLimit(l); setLimitDropdownOpen(false); }}>
                                            {l} / page
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {loading && <div className="col-span-full text-center py-10"><Loader inline label="Loading posts" /></div>}
                    {error && !loading && <div className="col-span-full text-center text-red-500 py-10">{error}</div>}
                    {!loading && !error && items.map(p => (
                        <article key={p.id}
                            onClick={() => router.push(`/DashBoard/Post/${p.id}/`)}
                            className="relative group flex flex-col overflow-hidden rounded-2xl transition bg-white px-4 pt-4 cursor-pointer shadow hover:shadow-xl">
                            <div className="relative w-full h-56">
                                <Image src={p.image ?? ''} alt={p.title} fill className="object-cover rounded-2xl" />
                                {/* Tags */}
                                {p.tag && (
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {Array.isArray(p.tag)
                                            ? p.tag.slice(0, 2).map((t, i) => (
                                                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#5559d1', letterSpacing: '.05em' }}>{t}</span>
                                            )) : <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#5559d1', letterSpacing: '.05em' }}>{p.tag}</span>
                                        }
                                    </div>
                                )}
                                {/* 3-dot menu */}
                                <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                                    <summary className="list-none cursor-pointer p-2 bg-black/20 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                                        <MoreHorizontal className="w-3 h-3" />
                                    </summary>
                                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                        <button onClick={() => router.push(`/DashBoard/Post/${p.id}/`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">View Post</button>
                                        <button onClick={() => handleDelete(p.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Delete</button>
                                    </div>
                                </details>
                            </div>

                            <div className="py-4 flex flex-col gap-2">
                                <div className="flex items-center text-sm text-gray-500 gap-1">
                                    <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{p.authorName}</span>
                                    <span>on {new Date(p.date).toLocaleDateString()}</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                                {p.publishedAt && (
                                    <div className="text-sm text-indigo-600 font-medium">
                                        Published At : {new Date(p.publishedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                )}
                                {p.excerpt && <p className="text-gray-600 text-sm">{p.excerpt}</p>}
                            </div>
                        </article>
                    ))}

                    {!loading && !error && items.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No posts found.</div>}
                </main>

                {/* Pagination */}
                {!loading && !error && items.length > 0 && totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
