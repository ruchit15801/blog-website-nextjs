"use client";
import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import ArticlesSection from "@/components/ArticlesSection";
import { getHomeOverview, listAllHomePosts, listTrendingByCategory, type HomePost, type TrendingCategory } from "@/lib/api";

export default function Home() {

  const [featured, setFeatured] = useState<HomePost[]>([]);
  const [trending, setTrending] = useState<HomePost[]>([]);
  const [recent, setRecent] = useState<HomePost[]>([]);
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
    getHomeOverview().then((d) => {
      if (!active) return;
      setFeatured(d.featuredPosts);
      setTrending(d.trendingPosts);
      setRecent(d.recentPosts);
      setAuthors(d.topAuthors);
    }).catch(() => { });
    listTrendingByCategory().then((d) => {
      if (!active) return;
      setCatOptions(d.categories);
    }).catch(() => { });
    return () => { active = false; };
  }, []);

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

        {/* Explore Trending Topics (Category chips) */}
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <h2 className="text-xl font-bold mb-3">Explore Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setSelectedCat(null); setPage(1); }} className={`btn btn-secondary ${selectedCat === null ? "ring-2" : ""}`}>All</button>
            {catOptions.map(c => {
              const icon = c.icon || "";
              const isUrl = /^https?:\/\//i.test(icon) || icon.endsWith(".svg") || icon.endsWith(".png");
              return (
                <button key={c._id} onClick={() => { setSelectedCat(c._id); setPage(1); }} className={`btn btn-secondary ${selectedCat === c._id ? "ring-2" : ""}`}>
                  {icon ? (
                    isUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={icon} alt="" width={18} height={18} className="inline-block mr-1 align-[-2px]" />
                    ) : (
                      <span className="inline-block mr-1" style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                    )
                  ) : null}
                  {c.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured/Trending/Recent from API */}
        <ArticlesSection
          featuredPosts={featured}
          trendingPosts={trending}
          recentPosts={recent}
          topAuthors={authors}
        />

        {/* All Posts section removed per request */}
      </main>
    </div>
  );
}
