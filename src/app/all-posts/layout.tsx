import React, { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Posts — Browse Everything on BlogCafeAI",
    description: "Browse all posts on BlogCafeAI by date, category, and author.",
    alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com") + "/all-posts" },
};

export default function AllPostsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="py-16 text-center">Loading posts…</div>}>
            {children}
        </Suspense>
    );
}


