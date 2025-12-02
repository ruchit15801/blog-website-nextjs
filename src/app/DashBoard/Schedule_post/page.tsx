"use client";

import DashboardLayout from "../DashBoardLayout";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";
import {
  adminDeletePostById,
  fetchAdminScheduledPosts,
  publishAdminPostNow,
  type RemotePost,
} from "@/lib/adminClient";
import { deleteUserPost, fetchScheduledPosts, publishUserPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SchedulePosts() {
  const perPage = 6;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);
  const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!loading && error) {
      router.replace("/error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error]);

  useEffect(() => {
    const r = (localStorage.getItem("role") || "").toLowerCase();
    setRole(r);

    const t = localStorage.getItem(r === "admin" ? "token" : "accessToken") || "";
    setToken(t);

    const u = localStorage.getItem("userId") || undefined;
    setUserId(u);
  }, []);

  // Fetch scheduled posts
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const fetchFn = role === "admin" ? fetchAdminScheduledPosts : fetchScheduledPosts;

    const load = async () => {
      try {
        const res = await fetchFn({
          page,
          limit: perPage,
          token,
          q: search || undefined,
          userId: role === "admin" ? undefined : userId,
        });
        if (!active) return;
        const posts = role === "admin" ? res.posts : res.data ?? [];
        const total = role === "admin" ? res.total : res.total ?? res.meta?.total ?? posts.length;
        setLivePosts(posts);
        setTotalPosts(total);
      } catch {
        if (active) setError("Something went wrong");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page, perPage, search, role, token, userId]);

  const baseList = useMemo(() => {
    return livePosts.map((p) => {
      const dateString = p.createdAt ? new Date(p.createdAt).toDateString() : new Date().toDateString();
      return {
        id: p._id,
        title: p.title,
        date: dateString,
        excerpt: "",
        image: p.bannerImageUrl || p.imageUrls?.[0] || "",
        author: typeof p.author === "string" ? p.author : p.author?.fullName || "Admin",
        tag: p.tags || [],
        publishedAt: p.publishedAt,
        readTime: p.readingTimeMinutes || 0,
      };
    });
  }, [livePosts]);

  const filtered = useMemo(() => {
    const toTime = (val: string) => new Date(val).getTime();
    return [...baseList].sort((a, b) =>
      sortOrder === "latest" ? toTime(b.date) - toTime(a.date) : toTime(a.date) - toTime(b.date)
    );
  }, [sortOrder, baseList]);

  const handleEdit = (post: RemotePost) => {
    router.push(`/DashBoard/Create_schedule_post?id=${post._id}`);
  };

  const handlePublishNow = async (postId: string, postTitle: string) => {
    if (!confirm(`Publish "${postTitle}" now?`)) return;
    try {
      if (!token) throw new Error("Token not found");
      setLoading(true);
      const action = role === "admin" ? publishAdminPostNow : publishUserPost;
      await action(postId, token);
      setLivePosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success(`"${postTitle}" published successfully!`);
    } catch {
      toast.error("Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      if (!token) throw new Error("Token not found");
      const action = role === "admin" ? adminDeletePostById : deleteUserPost;
      await action(postId, token);
      setLivePosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully!");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const totalPages = Math.ceil(totalPosts / perPage);

  return (
    <DashboardLayout>
      <div className="flex flex-col shadow-xl pb-8">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-10 rounded-xl"
          style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
          <div className="w-full lg:w-auto text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white">Scheduled Posts</h1>
            <p className="text-gray-200 mt-1">Manage scheduled posts</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 flex-wrap sm:flex-nowrap">
            {/* Search */}
            <div className="custom-search w-full sm:w-64 relative">
              <Search className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Sort */}
            <div className="custom-dropdown w-full sm:w-auto relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center justify-between w-full sm:w-auto px-3 h-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 gap-2">
                {sortOrder === "latest" ? "Latest" : "Oldest"}
                <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {sortDropdownOpen && (
                <div className="absolute mt-1 w-full sm:w-48 bg-white rounded-md shadow-lg z-20">
                  {(["latest", "oldest"] as const).map((s) => (
                    <div
                      key={s}
                      className={`option rounded-md ${sortOrder === s ? "selected" : ""}`}
                      onClick={() => {
                        setSortOrder(s);
                        setSortDropdownOpen(false);
                      }}>
                      {s === "latest" ? "Latest" : "Oldest"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Schedule Button */}
            <Link
              href="/DashBoard/Create_schedule_post"
              className="create_schedule px-4 py-2 rounded-lg text-center transition shine hover:scale-102 sm:w-auto">Create Schedule Post
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {loading && (
            <div className="col-span-full text-center py-16">
              <Loader inline label="Loading scheduled posts" />
            </div>
          )}
          {error && !loading && (
            <div className="col-span-full text-center py-16 text-red-500">{error}</div>
          )}
          {!loading && !error &&
            filtered.map((p) => (
              <article
                key={p.id}
                onClick={() => router.push(`/DashBoard/Post/${p.id}/`)}
                className="relative group flex flex-col overflow-hidden transition bg-white px-4 pt-4 rounded-2xl shadow hover:shadow-xl cursor-pointer">
                <div className="relative w-full h-56">
                  <Image src={p.image} alt={p.title} fill className="object-cover rounded-2xl" />
                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {(Array.isArray(p.tag) ? p.tag.slice(0, 2) : [p.tag]).map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "#eef2ff", color: "#5559d1", letterSpacing: ".05em" }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* 3-dot menu */}
                  <details
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition"
                    onClick={(e) => e.stopPropagation()}>
                    <summary className="list-none cursor-pointer p-2 bg-black/20 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                      <MoreHorizontal className="w-3 h-3" />
                    </summary>
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                      <button
                        onClick={() => {
                          const originalPost = livePosts.find((lp) => lp._id === p.id);
                          if (!originalPost) return alert("Post not found!");
                          handleEdit(originalPost);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublishNow(p.id, p.title)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-green-600">
                        Publish Now
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                        Delete
                      </button>
                    </div>
                  </details>
                </div>

                <div className="py-4 flex flex-col gap-2">
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <span className="font-medium text-gray-700" style={{ color: "#5559d1" }}>
                      {p.author}
                    </span>
                    <span>on {p.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                  {p.publishedAt && (
                    <div className="text-sm text-indigo-600 font-medium">
                      Published At :{" "}
                      {new Date(p.publishedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}
                  <p className="text-gray-600 text-sm">{p.excerpt}</p>
                </div>
              </article>
            ))}

          {!loading && !error && filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">No posts found.</div>
          )}
        </main>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
