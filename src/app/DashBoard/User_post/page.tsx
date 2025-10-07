"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { adminDeletePostById, fetchAdminPosts, fetchAdminUsers, type RemotePost, type RemoteUser } from "@/lib/adminClient";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";

type UiPost = {
    id: string;
    title: string;
    authorName: string;
    date: string;
    excerpt: string;
    image: string;
    tag: string[] | string;
    readTime: number;
};

export default function UserPosts() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<UiPost[]>([]);
    const [, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userOptions, setUserOptions] = useState<RemoteUser[]>([]);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isLimitDropdownOpen, setLimitDropdownOpen] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const usersRes = await fetchAdminUsers({ page: 1, limit: 100 });
                if (!active) return;
                setUserOptions(usersRes.users);
            } catch {
                // ignore users error on sidebar
            }
        })();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        const userid = selectedUser !== "all" ? selectedUser : undefined;
        fetchAdminPosts({ page, limit, q: search || undefined, userid })
            .then((res) => {
                if (!active) return;
                const mapped: UiPost[] = (res.posts || []).map((p: RemotePost) => ({
                    id: p._id,
                    title: p.title,
                    authorName: typeof p.author === "string" ? p.author : (p.author?.fullName || "Unknown"),
                    date: p.publishedAt || p.createdAt || new Date().toISOString(),
                    excerpt: "",
                    image: p.bannerImageUrl || "/images/a1.webp",
                    tag: p.tags || [],
                    readTime: p.readingTimeMinutes || 0,
                }));
                setItems(mapped);
                setTotal(res.total || mapped.length);
                setTotalPages(res.totalPages || 1);
            })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [page, limit, search, selectedUser]);

    const handleDelete = async (postId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await adminDeletePostById(postId);
            setItems(prev => prev.filter(p => p.id !== postId));
            toast.success(`Post deleted successfully!`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete post");
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">User Posts</h1>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="custom-search flex-1 min-w-[12rem] md:w-64">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    {/* User Filter */}
                    <div className="custom-dropdown w-48 relative">
                        <button
                            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center justify-between w-full"
                        >
                            {userOptions.find(u => u._id === selectedUser)?.fullName || "All Users"}
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {isUserDropdownOpen && (
                            <div className="options">
                                <div
                                    className={`option ${selectedUser === "all" ? "selected" : ""}`}
                                    onClick={() => { setSelectedUser("all"); setUserDropdownOpen(false); }}
                                >
                                    All Users
                                </div>
                                {userOptions.map((u: RemoteUser) => (
                                    <div
                                        key={u._id}
                                        className={`option ${selectedUser === u._id ? "selected" : ""}`}
                                        onClick={() => { setSelectedUser(u._id); setUserDropdownOpen(false); }}
                                    >
                                        {u.fullName || u.name || u.email}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Page Size */}
                    <div className="custom-dropdown w-32 relative">
                        <button
                            onClick={() => setLimitDropdownOpen(!isLimitDropdownOpen)}
                            className="flex items-center justify-between w-full"
                        >
                            {limit} / page
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${isLimitDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {isLimitDropdownOpen && (
                            <div className="options">
                                {[6, 12, 24].map((l) => (
                                    <div
                                        key={l}
                                        className={`option ${limit === l ? "selected" : ""}`}
                                        onClick={() => { setLimit(l); setLimitDropdownOpen(false); }}
                                    >
                                        {l} / page
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading && (
                    <div className="col-span-full text-center py-10"><Loader inline label="Loading posts" /></div>
                )}
                {error && !loading && (
                    <div className="col-span-full text-center text-red-500 py-10">{error}</div>
                )}
                {!loading && !error && items.map((p) => (
                    <article key={p.id} onClick={() => router.push(`/DashBoard/Post/${p.id}/`)} className="relative group flex flex-col overflow-hidden rounded-2xl transition bg-white px-4 pt-4 rounded-2xl">
                        <div className="relative w-full h-56">
                            <Image src={p.image} alt={p.title} fill className="object-cover rounded-2xl" />
                            {/* Tags */}
                            {p.tag && (
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                    {Array.isArray(p.tag) ? p.tag.slice(0, 2).map((t, i) => (
                                        <span key={i} className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{t}</span>
                                    )) : (
                                        <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{p.tag}</span>
                                    )}
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
                            {p.excerpt && <p className="text-gray-600 text-sm">{p.excerpt}</p>}
                        </div>
                    </article>
                ))}

                {!loading && !error && items.length === 0 && (
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
