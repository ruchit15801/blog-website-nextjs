"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import PostCard, { type Post } from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data.posts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="font-sans">
      <Hero />
      <section id="latest" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Latest posts</h2>
          <a href="#" className="text-sm hover:underline" style={{ color: "var(--brand-muted-blue)" }}>View all</a>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-[260px] animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
