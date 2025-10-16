import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "BlogCafeAI Dashboard",
    description: "Manage posts, authors, categories, and analytics in the BlogCafeAI Dashboard.",
    robots: {
        index: false, 
        follow: false,
    },
    viewport: "width=device-width, initial-scale=1",
    keywords: "Dashboard, BlogCafeAI, admin panel, posts management, categories, authors",
    authors: [{ name: "BlogCafeAI", url: "https://www.blogcafeai.com" }],
    openGraph: {
        title: "BlogCafeAI Dashboard",
        description: "Admin panel for managing posts, authors, and categories on BlogCafeAI.",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com",
        siteName: "BlogCafeAI",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com"}/og-image-dashboard.jpg`,
                width: 1200,
                height: 630,
                alt: "BlogCafeAI Dashboard",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "BlogCafeAI Dashboard",
        description: "Admin panel for managing BlogCafeAI content.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com"}/og-image-dashboard.jpg`],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
