"use client";
import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import ArticlesSection from "@/components/ArticlesSection";
import { getHomeOverview, listAllHomePosts, listTrendingByCategory, type HomePost, type TrendingCategory } from "@/lib/api";

export default function Home() {

  const [featured, setFeatured] = useState<HomePost[]>([]);
  const [trending, setTrending] = useState<HomePost[]>([]);
  const [recent, setRecent] = useState<HomePost[]>([]);
  const [recentMeta, setRecentMeta] = useState<{ total: number; page: number; limit: number; totalPages: number } | undefined>(undefined);
  const [authors, setAuthors] = useState<{ _id: string; fullName?: string; avatarUrl?: string }[]>([]);
  const [catOptions, setCatOptions] = useState<TrendingCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [grid, setGrid] = useState<HomePost[]>([]);
  const [total, setTotal] = useState(0);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getHomeOverview(page, limit).then((d) => {
      if (!active) return;
      setFeatured(d.featuredPosts);
      setTrending(d.trendingPosts);
      setRecent(d.recentPosts);
      setAuthors(d.topAuthors);
      setRecentMeta(d.recentPagination);
    }).catch(() => { });
    listTrendingByCategory().then((d) => {
      if (!active) return;
      setCatOptions(d.categories);
    }).catch(() => { });
    return () => { active = false; };
  }, [page, limit]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    listAllHomePosts({ page, limit, sort: "random", category: selectedCat }).then((res) => {
      if (!active) return;
      setGrid(res.posts);
      setTotal(res.total);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoading(false));
    return () => { active = false; };
  }, [page, limit, selectedCat]);

  const filteredGrid = useMemo(() => {
    if (!search.trim()) return grid;
    const q = search.toLowerCase();
    return grid.filter(p => (p.title || "").toLowerCase().includes(q));
  }, [grid, search]);

  // pagination meta computed but unused (kept for extensibility)
  void Math.max(1, Math.ceil((filteredGrid.length || total) / limit));

  return (
    <div className="min-h-screen">
      <main>
        <Hero />

        {/* Featured/Trending/Recent from API */}
        <ArticlesSection
          featuredPosts={featured}
          trendingPosts={trending}
          recentPosts={recent}
          topAuthors={authors}
          // Pass recent pagination and a page setter to drive server pagination
          pagination={recentMeta}
          onPageChange={(p: number) => setPage(p)}
        />

        {/* All Posts section removed per request */}
      </main>
    </div>
  );
}
