import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact BlogCafeAI — Get in Touch",
    description: "Questions, feedback, or collaboration ideas? Contact BlogCafeAI using the form.",
    alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com") + "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}


