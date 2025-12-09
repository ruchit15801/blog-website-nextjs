"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import Pagination from "@/components/Pagination";
import { buildSlugPath } from "@/lib/slug";
import { HomePost, listPostsByAuthor } from "@/lib/api";

type QueryState = {
  authorId: string;
  page: number;
  limit: number;
};

export default function BlogIndex() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [authorName, setAuthorName] = useState("");
  const [query, setQuery] = useState<QueryState>({ authorId: "", page: 1, limit: 12 });

  useEffect(() => {
    if (!loading && error) {
      router.replace("/error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error]);

  // read query params from URL
  const readQueryParams = useCallback((): QueryState => {
    if (typeof window === "undefined") return { authorId: "", page: 1, limit: 12 };
    const sp = new URLSearchParams(window.location.search);
    return {
      authorId: sp.get("author") || "",
      page: Number(sp.get("page") || "1"),
      limit: Number(sp.get("limit") || "12"),
    };
  }, []);

  // fetch posts
  const fetchPosts = useCallback(async ({ authorId, page, limit }: QueryState) => {
    if (!authorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listPostsByAuthor({ authorId, page, limit });
      const postsData = res.posts ?? [];
      const total = res.total ?? 0;
      const firstPost = postsData[0];
      setPosts(postsData);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil(total / limit)));
      setAuthorName(typeof firstPost?.author === "string" ? firstPost.author : firstPost?.author?.fullName ?? "");
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    const q = readQueryParams();
    setQuery(q);
    if (q.authorId) fetchPosts(q);
  }, [readQueryParams, fetchPosts]);

  // handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const q = readQueryParams();
      setQuery(q);
      if (q.authorId) fetchPosts(q);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [readQueryParams, fetchPosts]);

  // handle page or limit change
  const updateQueryAndFetch = (newQuery: Partial<QueryState>) => {
    const updated = { ...query, ...newQuery };
    setQuery(updated);
    const sp = new URLSearchParams();
    if (updated.authorId) sp.set("author", updated.authorId);
    sp.set("page", String(updated.page));
    sp.set("limit", String(updated.limit));
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    fetchPosts(updated);
  };

  const handlePageChange = (newPage: number) => updateQueryAndFetch({ page: newPage });
  const handleLimitChange = (newLimit: number) => updateQueryAndFetch({ limit: newLimit, page: 1 });

  const { page, limit, authorId } = query;

  // render single post card
  const PostCard = ({ post }: { post: HomePost }) => {
    const name = typeof post.author === "string" ? post.author : post.author?.fullName || "";
    const date = new Date(post.publishedAt || post.createdAt || Date.now()).toDateString();

    return (
      <Link href={`/articles/${buildSlugPath(post._id, post.title)}`}>
        <article className="flex flex-col overflow-hidden group">
          <div className="relative w-full h-56">
            <Image
              src={post.bannerImageUrl || "/images/a1.webp"}
              alt={post.title}
              fill
              className="object-cover rounded-2xl"
            />
            <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Clock className="w-5 h-5" />
              <span>{post.readingTimeMinutes ?? 0} min read</span>
            </div>
          </div>
          <div className="py-4 px-1 flex flex-col gap-2">
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <span className="font-medium text-gray-700" style={{ color: "#5559d1" }}>{name}</span>
              <span>on {date}</span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: "#29294b" }}>{post.title}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(post.tags) &&
                post.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "#fff",
                      color: "#29294b",
                      boxShadow: "0px 5px 20px 0px rgba(114,114,255,.12)",
                      letterSpacing: ".05em",
                    }}> # {t}
                  </span>
                ))}
            </div>
          </div>
        </article>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">All posts</h1>
          <p className="opacity-80">
            {authorId ? (
              <>
                Latest posts by <span className="font-bold">{authorName || "this author"}</span> on BlogCafeAI.
              </>
            ) : (
              "Read the latest from BlogCafeAI."
            )}
          </p>
        </div>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1] w-30 sm:w-auto"
        >
          <option value={6}>6 / page</option>
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
        </select>
      </div>

      {/* Loading */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="rounded-2xl h-56 bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Posts */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0
            ? posts.map((p) => <PostCard key={p._id} post={p} />)
            : <div className="col-span-full text-center text-gray-500 py-20">No posts found.</div>
          }
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>}
    </div>
  );
}