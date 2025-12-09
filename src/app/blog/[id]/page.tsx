"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageWithCredit from "@/components/ImageWithCredit";

type Comment = { id: string; author: string; message: string; date: string };
type PostDetail = {
    id: string;
    title: string;
    excerpt: string;
    cover: string;
    tags: string[];
    date: string;
    readMinutes: number;
    content: string;
    comments: Comment[];
};

export default function BlogDetailPage() {
    const params = useParams<{ id: string }>();
    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/posts/${params.id}`);
                if (!res.ok) {
                    setPost(null);
                } else {
                    const data = await res.json();
                    setPost(data);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.id]);

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12">
                <div className="h-8 w-2/3 bg-white/5 animate-pulse rounded mb-6" />
                <div className="aspect-[16/9] bg-white/5 animate-pulse rounded-2xl" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <p className="opacity-80">Please go back to the blog.</p>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-3xl px-4 py-12">
            <header className="space-y-3 mb-6">
                <div className="text-xs flex items-center gap-2 text-muted">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readMinutes} min read</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{post.title}</h1>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                        <span key={t} className="badge">{t}</span>
                    ))}
                </div>
            </header>

            <div className="rounded-2xl overflow-hidden border border-white/10 mb-8" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
                <ImageWithCredit src={post.cover} alt="cover" width={1280} height={720} className="w-full aspect-[16/9]" corner="br" />
            </div>

            <section className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>

            <section className="mt-12" id="comments">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <div className="space-y-4">
                    {post.comments.length === 0 ? (
                        <p className="opacity-80">Be the first to comment.</p>
                    ) : (
                        post.comments.map((c) => (
                            <div key={c.id} className="rounded-xl border border-white/10 p-4" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
                                <div className="text-xs opacity-75 mb-1">
                                    <span className="font-semibold" style={{ color: "var(--brand-teal)" }}>{c.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(c.date).toLocaleString()}</span>
                                </div>
                                <p className="text-sm">{c.message}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        Comments functionality will be available soon. For now, you can contact us through our contact page.
                    </p>
                </div>
            </section>
        </article>
    );
}
