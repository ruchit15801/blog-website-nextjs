export type MockPost = {
    id: string;
    title: string;
    excerpt: string;
    cover: string;
    tags: string[];
    date: string;
    readMinutes: number;
    content: string;
};

export type MockComment = {
    id: string;
    author: string;
    message: string;
    date: string;
};

export const mockPosts: MockPost[] = [
    {
        id: "introducing-nextjs-ui",
        title: "Introducing the Must UI for Next.js Blogs",
        excerpt:
            "A polished starter with subtle animations, premium palette, and delightful reading.",
        cover:
            "https://images.unsplash.com/photo-1527333656061-ca7c7b6a5f16?q=80&w=1600&auto=format&fit=crop",
        tags: ["Next.js", "Design", "Animation"],
        date: new Date().toISOString(),
        readMinutes: 6,
        content:
            "Must UI brings a refined visual language to your blog. From gentle float to shimmer, every detail is tuned for comfort. This is placeholder body content to demonstrate typography and rhythm across paragraphs...",
    },
    {
        id: "color-systems-that-feel-premium",
        title: "Color systems that feel premium (Muted Blue, Teal, Amber)",
        excerpt:
            "How to craft approachable yet vibrant palettes that guide focus and action.",
        cover:
            "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop",
        tags: ["Colors", "UI/UX"],
        date: new Date(Date.now() - 86400000).toISOString(),
        readMinutes: 5,
        content:
            "Muted Blue sets the tone, Teal freshens the interface, Amber drives action. Use contrast sparingly and rely on depth for hierarchy. This is placeholder text for demonstrating a longer article...",
    },
    {
        id: "micro-interactions-for-delight",
        title: "Micro-interactions for delight without distraction",
        excerpt:
            "Float, shimmer and depth that enhance scanning and comprehension.",
        cover:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
        tags: ["Animation", "UX"],
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        readMinutes: 4,
        content:
            "Micro-interactions should be purposeful. Favor low-amplitude motion with clear affordances. This placeholder content shows how the reading section will appear...",
    },
];

export const mockComments: Record<string, MockComment[]> = {
    "introducing-nextjs-ui": [
        {
            id: "c1",
            author: "Aarav",
            message: "Kharekhara premium feel! Animations bilkul sarkhi che.",
            date: new Date().toISOString(),
        },
        {
            id: "c2",
            author: "Mira",
            message: "Palette bahu gamyu. Amber CTA standout thay che!",
            date: new Date().toISOString(),
        },
    ],
    "color-systems-that-feel-premium": [
        {
            id: "c3",
            author: "Krish",
            message: "Muted blue + teal nu combo classy lage che.",
            date: new Date().toISOString(),
        },
    ],
    "micro-interactions-for-delight": [
        {
            id: "c4",
            author: "Isha",
            message: "Float effect very subtle ane mast che.",
            date: new Date().toISOString(),
        },
    ],
};

export function getPostById(id: string) {
    const post = mockPosts.find((p) => p.id === id);
    if (!post) return null;
    return { ...post, comments: mockComments[id] ?? [] };
}


