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

export default function ArticleIdLayout({ children }: { children: React.ReactNode }) {
    return children;
}



