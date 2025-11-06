"use client";
import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import ArticlesSection from "@/components/ArticlesSection";
import { getHomeOverview, listAllHomePosts, listTrendingByCategory, type HomePost } from "@/lib/api";

export default function HomeClient() {
    const [featured, setFeatured] = useState<HomePost[]>([]);
    const [trending, setTrending] = useState<HomePost[]>([]);
    const [recentMeta, setRecentMeta] = useState<{ total: number; page: number; limit: number; totalPages: number; hasNextPage?: boolean; hasPrevPage?: boolean } | undefined>(undefined);
    const [authors, setAuthors] = useState<{ _id: string; fullName?: string; avatarUrl?: string }[]>([]);
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
        getHomeOverview(page, limit).then(({ featuredPosts, trendingPosts, topAuthors, recentPagination }) => {
            if (!active) return;
            setFeatured(featuredPosts);
            setTrending(trendingPosts);
            setAuthors(topAuthors);
            setRecentMeta(recentPagination);
        }).catch(() => { });
        listTrendingByCategory().then(() => {
            if (!active) return;
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
            setRecentMeta({ total: res.total, page: res.page, limit: res.limit, totalPages: res.totalPages, hasNextPage: (res as unknown as { hasNextPage?: boolean }).hasNextPage, hasPrevPage: (res as unknown as { hasPrevPage?: boolean }).hasPrevPage });
        }).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoading(false));
        return () => { active = false; };
    }, [page, limit, selectedCat]);

    const filteredGrid = useMemo(() => {
        if (!search.trim()) return grid;
        const q = search.toLowerCase();
        return grid.filter(p => (p.title || "").toLowerCase().includes(q));
    }, [grid, search]);

    void Math.max(1, Math.ceil((filteredGrid.length || total) / limit));

    return (
        <div className="min-h-screen px-4 sm:px-4 md:px-6">
            <main>
                <Hero selectedCat={selectedCat}
                    onCategorySelect={(catId) => {
                        setSelectedCat(catId);
                        setPage(1);
                    }} />

                <ArticlesSection
                    featuredPosts={featured}
                    trendingPosts={trending}
                    recentPosts={grid}
                    topAuthors={authors}
                    pagination={recentMeta}
                    onPageChange={(p: number) => setPage(p)}
                />
            </main>
        </div>
    );
}


