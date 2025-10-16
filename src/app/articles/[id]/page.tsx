"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";
import { fetchSinglePostById } from "@/lib/adminClient";
import { listAllHomePosts, type HomePost } from "@/lib/api";
import { buildSlugPath, extractIdFromSlug } from "@/lib/slug";
import { FacebookIcon, InstagramIcon, LinkedinIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
    author?: { fullName: string, avatarUrl: string, twitterUrl: string, facebookUrl: string, instagramUrl: string, linkedinUrl: string };
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
    const [progress, setProgress] = useState(0);
    const [prevPost, setPrevPost] = useState<HomePost | null>(null);
    const [nextPost, setNextPost] = useState<HomePost | null>(null);

    const params = useParams();
    const router = useRouter();
    // Support both legacy id route and SEO slug route "title-slug-<id>"
    const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const postId = extractIdFromSlug(raw) || undefined;

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
                const normalized = maybePost as RemotePost;
                setPost(normalized);
                // If route is legacy (no slug), push pretty slug for SEO
                const current = raw || "";
                if (normalized?._id && normalized?.title) {
                    const desired = buildSlugPath(normalized._id, normalized.title);
                    if (current !== desired) {
                        router.replace(`/articles/${desired}`);
                    }
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId, raw, router]);

    // Fetch neighbors (best-effort) once post is loaded
    useEffect(() => {
        let active = true;
        if (!post?._id) return;
        (async () => {
            try {
                const res = await listAllHomePosts({ page: 1, limit: 12, sort: "latest", category: undefined });
                const arr = res.posts || [];
                const idx = arr.findIndex(p => p._id === post._id);
                if (!active) return;
                if (idx >= 0) {
                    setPrevPost(arr[idx + 1] || null);
                    setNextPost(arr[idx - 1] || null);
                } else {
                    setPrevPost(arr[1] || null);
                    setNextPost(arr[0] || null);
                }
            } catch {
                // best-effort; ignore
            }
        })();
        return () => { active = false; };
    }, [post?._id]);

    // Scroll reveal animation for blocks
    useEffect(() => {
        const nodes = document.querySelectorAll('.reveal-on-scroll');
        if (!nodes.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                }
            });
        }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, [postId, post?.contentHtml]);

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
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:px-8">
            {/* Ultra-thin top progress bar for mobile */}
            <div
                className="fixed top-0 left-0 right-0 z-40 h-[2px] md:h-[2px]"
                style={{
                    background: `linear-gradient(90deg, #9895ff 0%, #514dcc 100%)`,
                    transform: `scaleX(${Math.max(0, Math.min(100, progress)) / 100})`,
                    transformOrigin: '0 0',
                    opacity: 0.9,
                }}
            />
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
                        dateModified: post.createdAt,
                        author: post.author?.fullName ? { '@type': 'Person', name: post.author.fullName } : undefined,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/articles/${buildSlugPath(post._id, post.title)}`,
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'BlogCafeAI',
                            logo: {
                                '@type': 'ImageObject',
                                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/images/BlogCafe_Logo.svg`,
                                width: 512,
                                height: 512,
                            },
                        },
                    })
                }}
            />
            {/* BreadcrumbList JSON-LD */}
            <Script id="ld-breadcrumb" type="application/ld+json" strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/` },
                            { '@type': 'ListItem', position: 2, name: 'All Posts', item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/all-posts` },
                            { '@type': 'ListItem', position: 3, name: post.category || 'Uncategorized', item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/all-posts` },
                            { '@type': 'ListItem', position: 4, name: post.title, item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/articles/${buildSlugPath(post._id, post.title)}` }
                        ]
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
                <div className="mx-auto" style={{ maxWidth: '880px' }}>
                    <div className="h-1 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #9895ff 0%, #514dcc 100%)', opacity: .85 }} />
                </div>
                <div className="mx-auto flex flex-wrap items-center justify-center gap-2 pt-3" style={{ maxWidth: '880px' }}>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#eef2ff', color: '#5559d1' }}>{(post.readingTimeMinutes || 0)} min read</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-100">{post.category || 'Uncategorized'}</span>
                    <span className="ml-2 text-xs text-gray-500">Share:</span>
                    {(() => {
                        const slugUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/articles/${buildSlugPath(post._id, post.title)}`; return (
                            <>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(slugUrl)}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full text-xs font-semibold hover-float" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#5559d1', boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>X</a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(slugUrl)}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full text-xs font-semibold hover-float" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#5559d1', boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>Facebook</a>
                                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(slugUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full text-xs font-semibold hover-float" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#5559d1', boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>LinkedIn</a>
                                <button onClick={() => { try { navigator.clipboard.writeText(slugUrl); } catch { } }} className="px-3 py-1.5 rounded-full text-xs font-semibold hover-float" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)', color: '#fff', boxShadow: '0 10px 24px -12px rgba(114,114,255,.45)' }}>Copy link</button>
                            </>
                        );
                    })()}
                </div>
                {post.subtitle && (
                    <div className="mx-auto" style={{ maxWidth: '740px' }}>
                        <div className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full mb-2" style={{ background: '#eef2ff', color: '#5559d1' }}>Description</div>
                        <p className="text-gray-600" style={{ fontSize: '18px', fontWeight: 400, color: '#696981', lineHeight: 1.65 }}>
                            {post.subtitle}
                        </p>
                    </div>
                )}
            </div>

            {/* Banner */}
            {post.bannerImageUrl && (
                <div className="relative w-full h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden">
                    <Image src={post.bannerImageUrl} alt={post.title} fill priority sizes="100vw" className="object-cover" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: 'rgba(255,255,255,.85)', color: '#29294b', backdropFilter: 'blur(4px)' }}>
                        Main Image
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />
                </div>
            )}

            {/* Main Layout */}
            <div className="flex justify-center">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-5xl mx-auto px-0 sm:px-2 pt-2 sm:pt-4">
                    {/* Sidebar */}
                    <div className="article-aside hidden lg:block" style={{ position: 'sticky', top: '78px', alignSelf: 'start' }}>
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative flex items-center justify-center text-center font-bold" style={{ width: 100, height: 100 }} aria-label="Reading progress">
                                {/* Soft glow backdrop */}
                                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 18px 42px -18px rgba(114,114,255,.45)', background: 'radial-gradient(closest-side, #ffffff 60%, transparent 61%), conic-gradient(#5955d1 0%, #7b78ed 35%, #9895ff 65%, #c7c6ff 100%)', opacity: .07 }} />
                                {/* Progress arc */}
                                <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#5955d1 ${progress}%, #e5e7eb ${progress}% 100%)` }} />
                                {/* Inner cutout to form the ring */}
                                <div className="absolute inset-2 rounded-full" style={{ background: '#ffffff' }} />
                                {/* Inner disc with subtle inner shadow */}
                                <div className="relative flex items-center justify-center rounded-full" style={{ width: 68, height: 68, background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(0,0,0,.04), 0 6px 14px -10px rgba(114,114,255,.45)' }}>
                                    <div className="leading-tight" style={{ color: '#29294b' }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-.02em' }}>{post.readingTimeMinutes || 0} min</div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#696981' }}>read</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6 text-gray-800">
                                {post.author?.twitterUrl && (
                                    <a href={post.author.twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-blue-600 transition-colors">
                                        <svg width="24" height="24" viewBox="0 0 24 24" ><path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" /></svg>
                                    </a>
                                )}
                                {post.author?.facebookUrl && (
                                    <a href={post.author.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-sky-500 transition-colors">
                                        <FacebookIcon />
                                    </a>
                                )}
                                {post.author?.instagramUrl && (
                                    <a href={post.author.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
                                        <InstagramIcon />
                                    </a>
                                )}
                                {post.author?.linkedinUrl && (
                                    <a href={post.author.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors">
                                        <LinkedinIcon />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content wrapped in light card */}
                    <div className="flex-1 px-0 sm:px-2">
                        <div className="relative">
                            <div className="pointer-events-none absolute -inset-2 bg-gradient-to-b from-[#f5f7ff] to-transparent rounded-[22px] blur-sm" />
                        </div>
                        <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/5 p-5 sm:p-6 md:p-8">
                            <div ref={contentRef} className="flex flex-col">

                                {(() => {
                                    let firstTextRendered = false; return contentBlocks.map((block, index) => {
                                        if (skipIndexes.has(index)) return null;

                                        if (typeof block === "string") {
                                            const className = `prose_content prose max-w-none mb-4 leading-relaxed tracking-[.005em]${firstTextRendered ? '' : ' lead'}`;
                                            if (!firstTextRendered) firstTextRendered = true;
                                            return (
                                                <div key={index} className={`${className} reveal-on-scroll reveal`}
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
                                                    <div key={index} className="flex flex-col md:flex-row gap-4 my-6 reveal-on-scroll reveal">
                                                        <div className="relative w-full md:w-1/2 h-56 sm:h-64 md:h-64 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover-zoom">
                                                            <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                                                            <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ background: 'rgba(255,255,255,.9)', color: '#29294b' }}>Image</span>
                                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                                        </div>
                                                        <div className="relative w-full md:w-1/2 h-56 sm:h-64 md:h-64 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover-zoom">
                                                            <Image src={nextBlock.url} alt={`Post image ${index + 1}`} fill className="object-cover rounded-2xl" />
                                                            <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ background: 'rgba(255,255,255,.9)', color: '#29294b' }}>Image</span>
                                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const height = block.size === "small" ? "h-72 md:h-80" : "h-80 md:h-[28rem]";
                                            const width = block.size === "small" ? "md:w-4/5 lg:w-2/3" : "md:w-4/5";
                                            return (
                                                <figure key={index} className={`relative w-full ${width} mx-auto ${height} rounded-2xl overflow-hidden my-6 shadow-xl ring-1 ring-black/5 hover-zoom reveal-on-scroll reveal`}>
                                                    <Image src={block.url} alt={`Post image ${index}`} fill className="object-cover rounded-2xl" />
                                                    <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ background: 'rgba(255,255,255,.9)', color: '#29294b' }}>Image</span>
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                                    <figcaption className="absolute bottom-3 right-3 text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,.9)', color: '#696981' }}>
                                                        Inline image
                                                    </figcaption>
                                                </figure>
                                            );
                                        }

                                        return null;
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Author section */}
                        <div className="mt-8 rounded-2xl bg-white shadow ring-1 ring-black/5 p-5 sm:p-6 md:p-8 flex items-center gap-4 reveal-on-scroll reveal">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#eef2ff] flex items-center justify-center text-[#5559d1] font-bold">
                                {post.author?.avatarUrl ? (
                                    <Image
                                        src={post.author.avatarUrl}
                                        alt={post.author.fullName || "Author"}
                                        width={40}
                                        height={40}
                                        className="about_author_img object-cover"
                                    />
                                ) : (
                                    <span>
                                        {post.author?.fullName
                                            ? post.author.fullName
                                                .split(' ')
                                                .map(s => s[0])
                                                .join('')
                                                .slice(0, 2)
                                            : 'AU'}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="text-sm text-gray-500">Written by</div>
                                <div className="text-base font-semibold" style={{ color: '#29294b' }}>{post.author?.fullName || "Unknown Author"}</div>
                                <div className="text-sm text-gray-500">Published on {formattedDate}</div>
                            </div>
                            <div className="hidden sm:inline-flex flex-wrap  text-sm text-gray-500">
                                {Array.isArray(post.tags)
                                    ? post.tags.slice(0, 2).map((t, i) => (
                                        <span
                                            key={i}
                                            className="inline-block bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-md uppercase me-2"
                                            style={{
                                                boxShadow: '0px 3px 13px rgba(114, 114, 255, 0.25)'
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))
                                    : (
                                        <span
                                            className="inline-block bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                            style={{
                                                boxShadow: '0 3px 13px rgba(114, 114, 255, 0.25)'
                                            }}
                                        >
                                            {post.tags}
                                        </span>
                                    )
                                }
                            </div>

                        </div>

                        {/* Prev/Next cards */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Prev */}
                            <div className="group rounded-2xl bg-white shadow ring-1 ring-black/5 p-5 sm:p-6 md:p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg reveal-on-scroll reveal">
                                <div className="text-xs tracking-widest font-semibold uppercase mb-2" style={{ color: '#696981' }}>Previous Article</div>
                                {(prevPost ? (
                                    <Link href={`/articles/${buildSlugPath(prevPost._id, prevPost.title)}`} className="flex items-center gap-4">
                                        <ChevronLeft className="w-4 h-4 text-[#5559d1]" />
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={prevPost.bannerImageUrl || "/images/a1.webp"} alt={prevPost.title} fill className="object-cover" />
                                        </div>
                                        <div className="text-[#29294b] font-semibold leading-snug group-hover:underline">
                                            {prevPost.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <Link href={`/all-posts`} className="flex items-center gap-4 group">
                                        <ChevronLeft className="w-4 h-4 text-[#5559d1]" />
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" />
                                        <div className="text-[#29294b] font-semibold leading-snug group-hover:underline">Browse more articles</div>
                                    </Link>
                                ))}
                            </div>
                            {/* Next */}
                            <div className="group rounded-2xl bg-white shadow ring-1 ring-black/5 p-5 sm:p-6 md:p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg reveal-on-scroll reveal">
                                <div className="text-xs tracking-widest font-semibold uppercase mb-2" style={{ color: '#696981' }}>Next Article</div>
                                {(nextPost ? (
                                    <Link href={`/articles/${buildSlugPath(nextPost._id, nextPost.title)}`} className="flex items-center gap-4 justify-end">
                                        <div className="text-right text-[#29294b] font-semibold leading-snug group-hover:underline">
                                            {nextPost.title}
                                        </div>
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={nextPost.bannerImageUrl || "/images/a1.webp"} alt={nextPost.title} fill className="object-cover" />
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#5559d1]" />
                                    </Link>
                                ) : (
                                    <Link href={`/all-posts`} className="flex items-center gap-4 justify-end">
                                        <div className="text-right text-[#29294b] font-semibold leading-snug group-hover:underline">See latest articles</div>
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" />
                                        <ChevronRight className="w-4 h-4 text-[#5559d1]" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
