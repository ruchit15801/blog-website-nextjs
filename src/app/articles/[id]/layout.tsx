import type { Metadata } from "next";
import { fetchSinglePostById } from "@/lib/adminClient";
import { extractIdFromSlug } from "@/lib/slug";

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    try {
        const { id } = await params;
        const realId = extractIdFromSlug(id) || id;
        if (!realId) return {};
        const res = await fetchSinglePostById(realId);
        type PostShape = { title?: string; subtitle?: string; contentHtml?: string; bannerImageUrl?: string; imageUrls?: string[] } | null | undefined;
        const postCandidate = (res as Record<string, unknown>)?.post ?? (res as Record<string, unknown>)?.data ?? res;
        const post = postCandidate as PostShape;
        if (!post || typeof post !== "object") return {};

        const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
        const url = `${site}/articles/${id}`;
        const plain = (html?: string) => (html ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "");
        const description = (post.subtitle?.trim?.() as string | undefined) || plain(post.contentHtml).slice(0, 180);
        const images: string[] = [];
        if (post.bannerImageUrl) images.push(post.bannerImageUrl);
        if (Array.isArray(post.imageUrls)) images.push(...post.imageUrls);

        return {
            title: post.title ? `${post.title} | BlogCafeAI` : "Article | BlogCafeAI",
            description: description || "Read this article on BlogCafeAI.",
            alternates: { canonical: url },
            openGraph: {
                type: "article",
                url,
                title: (post.title as string) || "Article",
                description: description || undefined,
                images: images.length ? images : undefined,
                siteName: "BlogCafeAI",
            },
            twitter: {
                card: "summary_large_image",
                title: (post.title as string) || "Article",
                description: description || undefined,
                images: images.length ? [images[0]] : undefined,
            },
        };
    } catch {
        return {};
    }
}

export default async function ArticleIdLayout(
    {
        children,
        params,
    }: {
        children: React.ReactNode;
        params: Promise<{ id: string }>;
    }
) {
    // Embed JSON-LD for better SEO
    try {
        const { id } = await params;
        const realId = extractIdFromSlug(id) || id;
        if (realId) {
            const res = await fetchSinglePostById(realId);
            type PostShape = { title?: string; subtitle?: string; contentHtml?: string; bannerImageUrl?: string; imageUrls?: string[]; author?: { fullName?: string } | string; publishedAt?: string | null; createdAt?: string } | null | undefined;
            const postCandidate = (res as Record<string, unknown>)?.post ?? (res as Record<string, unknown>)?.data;
            const post = postCandidate as PostShape;
            if (post && typeof post === "object") {
                const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
                const url = `${site}/articles/${id}`;
                const plain = (html?: string) => (html ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "");
                const description = (post.subtitle?.trim?.() as string | undefined) || plain(post.contentHtml).slice(0, 180);
                const images: string[] = [];
                if (post.bannerImageUrl) images.push(post.bannerImageUrl);
                if (Array.isArray(post.imageUrls)) images.push(...post.imageUrls);
                const authorName = typeof post.author === "string" ? post.author : post.author?.fullName;
                const jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": url,
                    },
                    headline: post.title || "Article",
                    description: description || undefined,
                    image: images.length ? images : undefined,
                    author: authorName ? { "@type": "Person", name: authorName } : undefined,
                    publisher: {
                        "@type": "Organization",
                        name: "BlogCafeAI",
                        logo: {
                            "@type": "ImageObject",
                            url: `${site}/logo.png`,
                        },
                    },
                    datePublished: post.publishedAt || post.createdAt,
                    dateModified: post.publishedAt || post.createdAt,
                    url,
                } as Record<string, unknown>;

                // BreadcrumbList for richer snippets
                const breadcrumbLd = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: site + "/" },
                        { "@type": "ListItem", position: 2, name: "Blog", item: site + "/blog" },
                        { "@type": "ListItem", position: 3, name: post.title || "Article", item: url }
                    ]
                } as Record<string, unknown>;

                return (
                    <>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                        />
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
                        />
                        {children}
                    </>
                );
            }
        }
    } catch { }
    return children;
}



