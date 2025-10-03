"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { fetchPostById, getAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../../DashBoardLayout";
import { Heart, Share2, MessageCircle } from "lucide-react";
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
}: {
    topAuthors?: HomeAuthor[];
    featuredPosts?: PostSummary[];
    trendingPosts?: PostSummary[];
}) {
    const [post, setPost] = useState<RemotePost | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = getAdminToken();

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
                <div className="flex justify-center">
                    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-2xl mx-auto">
                        {/* Sidebar (10%) */}
                        <div className="w-1/12 flex flex-col items-center gap-4 text-gray-500">
                            <span className="text-xs font-bold">{post.readingTimeMinutes} min read</span>
                            <div className="flex flex-col gap-2 mt-4">
                                <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
                                <Share2 className="w-5 h-5 cursor-pointer hover:text-blue-500" />
                                <MessageCircle className="w-5 h-5 cursor-pointer hover:text-green-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-6">
                            {post.subtitle && (
                                <h2 className="text-2xl font-semibold text-gray-700">{post.subtitle}</h2>
                            )}
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
