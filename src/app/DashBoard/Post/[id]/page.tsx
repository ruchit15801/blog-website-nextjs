"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { fetchPostById, getAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../../DashBoardLayout";
import { Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import type { HomeAuthor } from "@/lib/api";

type RemotePost = {
    _id: string;
    title: string;
    subtitle?: string;
    contentHtml: string;
    bannerImageUrl?: string;
    imageUrls?: string[];
    category?: string;
    tags?: string[];
    author?: { fullName: string };
    publishedAt?: string;
    readingTimeMinutes?: string;
};

type PostSummary = {
    _id: string;
    title: string;
    bannerImageUrl?: string;
    author?: { fullName: string } | string;
    publishedAt?: string;
    tags?: string[];
};

export default function PostPage({
    topAuthors = [],
    featuredPosts = [] as PostSummary[],
    trendingPosts = [] as PostSummary[],
}: {
    topAuthors?: HomeAuthor[];
    featuredPosts?: PostSummary[];
    trendingPosts?: PostSummary[];
}) {
    const [post, setPost] = useState<RemotePost | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = getAdminToken();
    const [index, setIndex] = useState(0);

    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        if (!postId || !token) return;

        const loadPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchPostById(postId, token);
                if (!response.success) throw new Error("Post not found");
                setPost(response.post);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId, token]);

    if (loading) return <Loader inline label="Loading post..." />;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
    if (!post) return <div className="text-gray-500 text-center py-10">Post not found</div>;

    // Featured Slider state
    const prev = () => setIndex((i) => (i - 1 + featuredPosts.length) % featuredPosts.length);
    const next = () => setIndex((i) => (i + 1) % featuredPosts.length);

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Banner */}
                {post.bannerImageUrl && (
                    <div className="relative w-full h-120 rounded-xl overflow-hidden mb-10">
                        <Image src={post.bannerImageUrl} alt={post.title} fill className="object-cover" />
                    </div>
                )}

                {/* Main Layout: Left 60% | Right 40% */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: 60% */}
                    <div className="w-full lg:w-3/5 flex gap-4">
                        {/* Sidebar 10% */}
                        <div className="w-1/12 flex flex-col items-center gap-4 text-gray-500">
                            <span className="text-xs font-bold">{post.readingTimeMinutes} min read</span>
                            <div className="flex flex-col gap-2 mt-4">
                                <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
                                <Share2 className="w-5 h-5 cursor-pointer hover:text-blue-500" />
                                <MessageCircle className="w-5 h-5 cursor-pointer hover:text-green-500" />
                            </div>
                        </div>

                        {/* Content 50% */}
                        <div className="w-11/12 flex flex-col gap-6">
                            {post.subtitle && <h2 className="text-2xl font-semibold text-gray-700">{post.subtitle}</h2>}
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                            />
                        </div>
                    </div>

                    {/* Right: 40% - Full Aside */}
                    <aside className="w-full lg:w-2/5">
                        <div className="sticky top-8 space-y-10">
                            {/* 1️⃣ About Section */}
                            <div className="aside-shadow rounded-xl shadow py-6 px-6 flex flex-col">
                                <h2 className="uppercase text-xs font-bold text-gray-500 mb-4">About</h2>
                                <div className="flex gap-3">
                                    <Image
                                        src={topAuthors?.[0]?.avatarUrl || "/images/aside_about.webp"}
                                        alt={topAuthors?.[0]?.fullName || "Profile"}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{topAuthors?.[0]?.fullName || "Top Author"}</h3>
                                        <p className="text-xs uppercase text-gray-500">Top Author</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Discover insights from our leading contributors and explore trending stories curated just for you.
                                </p>
                                <div className="flex items-center gap-1 mt-4 text-gray-500">
                                    <MapPin />
                                    <span>Paris, France</span>
                                </div>
                            </div>

                            {/* 2️⃣ Featured Posts Slider */}
                            <div className="relative w-full h-80 overflow-hidden group rounded-xl shadow">
                                {featuredPosts.map((f, i) => (
                                    <div
                                        key={f.title}
                                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                    >
                                        <Image src={f.bannerImageUrl || "/images/a1.webp"} alt={f.title} fill className="object-cover rounded-xl" />
                                        <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                                            <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded self-start">
                                                {Array.isArray(f.tags) && f.tags.length ? f.tags[0] : ""}
                                            </span>
                                            <div>
                                                <h4 className="text-lg font-semibold">{f.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={prev} className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-20">
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button onClick={next} className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-20">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* 3️⃣ Top Authors */}
                            <div className="aside-shadow rounded-xl shadow p-6 space-y-4">
                                <h3 className="uppercase text-xs font-bold text-gray-500 mb-4">Top Authors</h3>
                                {(topAuthors || []).slice(0, 3).map((a) => (
                                    <div key={a._id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Image src={a.avatarUrl || "/images/aside_about.webp"} alt='aside' width={40} height={40} className="rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-medium">{a.fullName}</h4>
                                                <p className="text-sm text-gray-500">Featured contributor</p>
                                            </div>
                                        </div>
                                        <a href="#" className="text-sm text-blue-600 hover:underline">View</a>
                                    </div>
                                ))}
                            </div>

                            {/* 4️⃣ Technologies */}
                            <div className="aside-shadow rounded-xl shadow py-6 px-6">
                                <h3 className="uppercase text-xs font-bold text-gray-500 mb-4">Technologies</h3>
                                {Array.from(new Set((trendingPosts || []).flatMap(p => p.tags || []))).slice(0, 6).map((tag) => (
                                    <div key={tag} className="flex gap-4 items-center mb-4">
                                        <Image src="/images/aside_tech.webp" alt={tag} width={50} height={50} className="rounded-xl object-cover" />
                                        <div>
                                            <h3 className="text-gray-800 font-semibold">{tag}</h3>
                                            <p className="text-sm text-gray-500">Popular topic from trending posts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 5️⃣ Creating */}
                            <div className="aside-shadow rounded-xl shadow p-6 space-y-4">
                                <h3 className="uppercase text-xs font-bold text-gray-500 mb-4">Creating</h3>
                                {/* Use last 3 posts */}
                                {(featuredPosts || []).slice(0, 3).map((p) => (
                                    <div key={p._id}>
                                        <a href={`/articles/${p._id}`} className="flex items-center gap-2 font-medium text-blue-600 hover:underline">
                                            {p.title}
                                            <ExternalLink className="w-4 h-4" strokeWidth={3} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}
