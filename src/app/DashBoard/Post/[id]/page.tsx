"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { fetchPostById, getAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../../DashBoardLayout";
import { LinkedinIcon, InstagramIcon, FacebookIcon } from "lucide-react";
import type { HomeAuthor } from "@/lib/api";
import toast from "react-hot-toast";

type RemotePost = {
    _id: string;
    title: string;
    subtitle?: string;
    contentHtml: string;
    bannerImageUrl?: string;
    imageUrls?: string[];
    category?: string;
    tags?: string[];
    author?: { fullName: string, twitterUrl: string, facebookUrl: string, instagramUrl: string, linkedinUrl: string };
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
    const token = (typeof window !== "undefined" ? (getAdminToken() || localStorage.getItem("token")) : null);

    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        if (!postId) return;

        const loadPost = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!token) throw new Error("Missing auth token. Please login.");
                const response = await fetchPostById(postId, token);

                const maybePost = (response?.post ?? response?.data ?? response) as RemotePost | undefined;
                if (!maybePost) throw new Error("Post not found");
                setPost(maybePost);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
                toast.error(msg || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId, token]);

    if (loading) return <Loader inline label="Loading post..." />;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
    if (!post) return <div className="text-gray-500 text-center py-10">Post not found</div>;

    function getContentBlocks(post: RemotePost) {
        const blocks: Array<string | { type: "image"; url: string; size?: "small" | "large" }> = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.contentHtml, "text/html");
        const children = Array.from(doc.body.children);

        let usedImages = 0;
        let wordCount = 0;

        if (children.length === 0) {
            const textContent = post.contentHtml.trim();
            if (textContent) blocks.push(`<p>${textContent}</p>`);
        } else {
            children.forEach((child) => {
                const text = child.textContent?.trim() || "";
                const words = text.split(/\s+/).filter(Boolean);

                if (words.length > 0) {
                    let start = 0;
                    while (start < words.length) {
                        const chunk = words.slice(start, start + 15).join(" ");
                        blocks.push(`<p>${chunk}</p>`);
                        start += 15;
                        wordCount += 15;

                        if (post.imageUrls && usedImages < post.imageUrls.length && wordCount >= 100) {
                            const remainingWords = words.length - start;
                            const numImages = remainingWords > 30 ? 2 : 1;
                            for (let i = 0; i < numImages; i++) {
                                if (usedImages >= post.imageUrls.length) break;
                                blocks.push({
                                    type: "image",
                                    url: post.imageUrls[usedImages],
                                    size: numImages > 1 ? "small" : "large",
                                });
                                usedImages++;
                            }
                            wordCount = 0;
                        }
                    }
                }
            });
        }

        // Remaining images at the end
        if (post.imageUrls && usedImages < post.imageUrls.length) {
            for (let i = usedImages; i < post.imageUrls.length; i++) {
                blocks.push({ type: "image", url: post.imageUrls[i], size: "large" });
            }
        }

        return blocks;
    }

    function renderContentBlocks(blocks: Array<string | { type: "image"; url: string; size?: "small" | "large" }>) {
        const skipIndexes = new Set<number>();

        return blocks.map((block, index) => {
            if (skipIndexes.has(index)) return null;

            if (typeof block === "string") {
                return (
                    <div key={index} className="prose_content prose max-w-none mb-2"
                        dangerouslySetInnerHTML={{ __html: block }} />
                );
            }

            if (block.type === "image") {
                const nextBlock = blocks[index + 1];

                if (
                    nextBlock &&
                    typeof nextBlock !== "string" &&
                    nextBlock.type === "image" &&
                    block.size === "small" &&
                    nextBlock.size === "small"
                ) {
                    skipIndexes.add(index + 1);
                    return (
                        <div key={index} className="flex gap-2 my-4">
                            <div className="relative w-1/2 h-36 sm:h-44 md:h-48 rounded-2xl overflow-hidden shadow-lg">
                                <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                            </div>
                            <div className="relative w-1/2 h-36 sm:h-44 md:h-48 rounded-2xl overflow-hidden shadow-lg">
                                <Image src={nextBlock.url} alt={`Post image ${index + 1}`} fill className="object-cover rounded-2xl" />
                            </div>
                        </div>
                    );
                }

                const height = block.size === "small" ? "h-44 sm:h-48 md:h-52" : "h-60 sm:h-64 md:h-72";
                const width = block.size === "small" ? "w-full sm:w-4/5" : "w-full sm:w-3/4";

                return (
                    <div key={index} className={`relative ${width} mx-auto ${height} rounded-2xl overflow-hidden my-4 shadow-lg`}>
                        <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                    </div>
                );
            }

            return null;
        });
    }
    const contentBlocks = getContentBlocks(post);

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Banner */}
                {post.bannerImageUrl && (
                    <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden">
                        <Image
                            src={post.bannerImageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Main Layout */}
                <div className="flex justify-center">
                    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto">
                        {/* Sidebar */}
                        <div
                            className="w-full sm:w-auto lg:w-1/5 flex-shrink-0 flex justify-center lg:block mb-4 lg:mb-0"
                            style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
                            <div className="flex gap-6 sm:flex-row lg:flex-col sm:items-center justify-center lg:justify-start">
                                {/* Reading Time Circle */}
                                <div
                                    className="relative flex items-center justify-center text-center font-bold rounded-full"
                                    style={{ width: "90px", height: "90px" }}>
                                    <div
                                        className="flex items-center justify-center text-gray-800"
                                        style={{
                                            position: 'sticky',
                                            top: "100px",
                                            width: "70px",
                                            height: "70px",
                                            boxShadow: "0px 5px 20px rgba(114, 114, 255, 0.15)",
                                            background: "#fff",
                                            borderRadius: "9999px",
                                            transition: ".25s",
                                        }}>
                                        <span
                                            className="text-sm font-bold px-2"
                                            style={{ fontSize: "0.85rem" }}>
                                            {post.readingTimeMinutes || 0} min read
                                        </span>
                                    </div>
                                </div>

                                {/* Social Icons */}
                                <div className="flex flex-row sm:flex-row lg:flex-col items-center gap-4 text-gray-800">
                                    {post.author?.twitterUrl && (
                                        <a
                                            href={post.author.twitterUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Twitter"
                                            className="hover:text-blue-600 transition-colors">
                                           <svg width="24" height="24" viewBox="0 0 24 24" ><path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" /></svg></a>
                                    )}
                                    {post.author?.facebookUrl && (
                                        <a
                                            href={post.author.facebookUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Facebook"
                                            className="hover:text-sky-500 transition-colors">
                                            <FacebookIcon />
                                        </a>
                                    )}
                                    {post.author?.instagramUrl && (
                                        <a
                                            href={post.author.instagramUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Instagram"
                                            className="hover:text-pink-500 transition-colors">
                                            <InstagramIcon />
                                        </a>
                                    )}
                                    {post.author?.linkedinUrl && (
                                        <a
                                            href={post.author.linkedinUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="LinkedIn"
                                            className="hover:text-blue-700 transition-colors">
                                            <LinkedinIcon />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:w-4/5 flex flex-col space-y-4">
                            {post.publishedAt && (
                                <div className="text-sm text-indigo-600 font-medium">
                                    Published At : {new Date(post.publishedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                            )}
                            {post.subtitle && (
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 text-center lg:text-left">
                                    {post.subtitle}
                                </h2>
                            )}

                            <div className="text-base sm:text-lg leading-relaxed text-gray-800">
                                {renderContentBlocks(contentBlocks)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
