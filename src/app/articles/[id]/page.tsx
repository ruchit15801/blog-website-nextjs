"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { fetchSinglePostById } from "@/lib/adminClient";
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import toast from "react-hot-toast";
import Script from "next/script";

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
    createdAt?: string;
    readingTimeMinutes?: string;
};

export default function ArticlePage() {
    const [post, setPost] = useState<RemotePost | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Public article page: no admin token required
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0); // reading progress percent

    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        if (!postId) return;

        const loadPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchSinglePostById(postId);
                // Accept flexible API shapes
                const maybePost = (response?.post
                    ?? response?.data
                    ?? response) as unknown;
                if (!maybePost || typeof maybePost !== "object") {
                    throw new Error("Post not found");
                }
                setPost(maybePost as RemotePost);
                toast.success("Post loaded successfully!");
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId]);

    // Reading progress based on content scroll
    useEffect(() => {
        function handleScroll() {
            const el = contentRef.current;
            if (!el) { setProgress(0); return; }
            const rect = el.getBoundingClientRect();
            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            const total = rect.height - viewportH * 0.6; // start progress after header area
            const scrolled = Math.min(Math.max(0, 0 - rect.top + viewportH * 0.2), Math.max(1, total));
            const pct = Math.round((scrolled / Math.max(1, total)) * 100);
            setProgress(Math.max(0, Math.min(100, pct)));
        }
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    if (loading) return <Loader inline label="Loading post..." />;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
    if (!post) {
        return <div className="text-gray-500 text-center py-10">Post not found</div>;
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Unknown Date";
        const parts = dateStr.split("T")[0].split("-");
        if (parts.length !== 3) return dateStr;
        const [year, month, day] = parts.map(Number);
        if (!year || !month || !day) return dateStr;
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const formattedDate = formatDate(post.publishedAt || post.createdAt);

    const getContentWithImages = () => {
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

        // remaining images last me add
        if (post.imageUrls && usedImages < post.imageUrls.length) {
            for (let i = usedImages; i < post.imageUrls.length; i++) {
                blocks.push({ type: "image", url: post.imageUrls[i], size: "large" });
            }
        }

        return blocks;
    };

    const contentBlocks = getContentWithImages();

    const skipIndexes = new Set<number>();

    return (
        <div className="mx-auto max-w-7xl space-y-8 px-8">
            {/* JSON-LD Article schema */}
            <Script id="ld-article" type="application/ld+json" strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: post.title,
                        description: (post.subtitle || '').trim() || undefined,
                        image: [post.bannerImageUrl, ...(Array.isArray(post.imageUrls) ? post.imageUrls : [])].filter(Boolean),
                        datePublished: post.publishedAt || post.createdAt,
                        author: post.author?.fullName ? { '@type': 'Person', name: post.author.fullName } : undefined,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/articles/${postId}`,
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'BlogCafeAI',
                            logo: {
                                '@type': 'ImageObject',
                                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/images/BlogCafe_Logo.svg`,
                            },
                        },
                    })
                }}
            />
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="text-sm text-gray-500 py-6" style={{ color: '#696981', fontWeight: 400 }}>
                    <span className="cursor-pointer hover:underline">All Posts</span> &gt;{" "}
                    <span className="cursor-pointer hover:underline">{post.category || "Uncategorized"}</span> &gt;{" "}
                    <span className="text-gray-700">{post.title}</span>
                </div>
                <div className="text-gray-500 text-sm">
                    <span className="Breadcrumb text-md">{post.author?.fullName || "Unknown Author"}</span> on {formattedDate}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 py-2 tracking-tight" style={{ color: '#29294b' }}>{post.title}</h1>
                {post.subtitle && (
                    <p className="text-gray-600 mx-auto" style={{ fontSize: '18px', maxWidth: '720px', fontWeight: 400, color: '#696981', lineHeight: 1.65 }}>
                        {post.subtitle}
                    </p>
                )}
            </div>

            {/* Banner */}
            {post.bannerImageUrl && (
                <div className="relative w-full h-150 rounded-2xl overflow-hidden">
                    <Image src={post.bannerImageUrl} alt={post.title} fill className="object-cover" />
                </div>
            )}

            {/* Main Layout */}
            <div className="flex justify-center">
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">
                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '60px', alignSelf: 'start' }}>
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative flex items-center justify-center text-center font-bold" style={{ width: 96, height: 96 }} aria-label="Reading progress">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(#5955d1 ${progress}%, #e5e7eb ${progress}% 100%)`,
                                        filter: 'drop-shadow(0 4px 12px rgba(114,114,255,.25))'
                                    }}
                                />
                                <div className="relative flex items-center justify-center rounded-full bg-white" style={{ width: 70, height: 70, color: '#29294b' }}>
                                    <span className='px-1' style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        {post.readingTimeMinutes || 0} min
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 text-gray-800">
                                <a href="#" aria-label="Twitter" className="hover:text-blue-600 transition-colors">
                                    <TwitterIcon />
                                </a>
                                <a href="#" aria-label="Facebook" className="hover:text-sky-500 transition-colors">
                                    <FacebookIcon />
                                </a>
                                <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
                                    <InstagramIcon />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors">
                                    <LinkedinIcon />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div ref={contentRef} className="flex-1 flex flex-col">

                        {(() => {
                            let firstTextRendered = false; return contentBlocks.map((block, index) => {
                                if (skipIndexes.has(index)) return null;

                                if (typeof block === "string") {
                                    const className = `prose_content prose max-w-none mb-4 leading-relaxed tracking-[.005em]${firstTextRendered ? '' : ' lead'}`;
                                    if (!firstTextRendered) firstTextRendered = true;
                                    return (
                                        <div key={index} className={className}
                                            dangerouslySetInnerHTML={{ __html: block }} />
                                    );
                                }

                                if (block.type === "image") {
                                    const nextBlock = contentBlocks[index + 1];
                                    if (
                                        nextBlock &&
                                        typeof nextBlock !== "string" &&
                                        nextBlock.type === "image" &&
                                        block.size === "small" &&
                                        nextBlock.size === "small"
                                    ) {
                                        skipIndexes.add(index + 1);
                                        return (
                                            <div key={index} className="flex gap-4 my-6">
                                                <div className="relative w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover-zoom">
                                                    <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                                </div>
                                                <div className="relative w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover-zoom">
                                                    <Image src={nextBlock.url} alt={`Post image ${index + 1}`} fill className="object-cover rounded-2xl" />
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                                </div>
                                            </div>
                                        );
                                    }

                                    const height = block.size === "small" ? "h-72 md:h-80" : "h-80 md:h-[28rem]";
                                    const width = block.size === "small" ? "md:w-4/5 lg:w-2/3" : "md:w-4/5";
                                    return (
                                        <figure key={index} className={`relative w-full ${width} mx-auto ${height} rounded-2xl overflow-hidden my-6 shadow-xl ring-1 ring-black/5 hover-zoom`}>
                                            <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                        </figure>
                                    );
                                }

                                return null;
                            });
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
