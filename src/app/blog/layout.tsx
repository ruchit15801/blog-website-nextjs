import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Latest Articles on BlogCafeAI",
    description: "Explore the latest articles, tutorials, and insights from BlogCafeAI.",
    alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com") + "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}


