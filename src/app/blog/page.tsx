"use client";
import { useEffect, useState } from "react";
import PostCard, { type Post } from "@/components/PostCard";

export default function BlogIndex() {
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
        <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">All posts</h1>
                <p className="opacity-80">Read the latest from MustBlog.</p>
            </div>
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                    {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
    );
}


