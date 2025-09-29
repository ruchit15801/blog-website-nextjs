"use client";
import DashboardLayout from "../DashBoardLayout";
import { Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminPosts, type RemotePost } from "@/lib/adminClient";

const articles = [
    {
        id: 1,
        title: "How Tech Shapes the Future of Work in 2024",
        date: "October 16, 2024",
        author: "Ethan Caldwell",
        excerpt: "In today’s ever-evolving world, storytelling has become a powerful tool for connection. Revision provides a unique platform for individuals to…",
        image: "/images/a1.webp",
        tag: ["Business", "News"],
        readTime: 6,
    },
    {
        id: 2,
        title: "The Future of Work: Tech and Remote Trends",
        date: "October 18, 2024",
        author: "Jane Doe",
        excerpt: "Find out why 2024 is predicted to be a pivotal year for sports technology and its impact on the industry.",
        image: "/images/a2.webp",
        tag: ["Sport", 'Travel'],
        readTime: 3,
    },
    {
        id: 3,
        title: "Remote Work Trends in the Digital Age",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Discover the cutting-edge tech gadgets making travel smarter and more convenient in 2024.",
        image: "/images/a3.webp",
        tag: ["News", 'Trends'],
        readTime: 5,
    },
    {
        id: 4,
        title: "Business Travel Tools for the Digital Age",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: " Learn how startups are leveraging data to fuel growth and scale in today’s competitive landscape.",
        image: "/images/a4.webp",
        tag: "Business",
        readTime: 7,
    },
    {
        id: 5,
        title: "Key Sports Trends for 2024: From AI to Virtual Reality",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Dive into the key sports trends like AI and virtual reality set to redefine the sports industry in 2024.",
        image: "/images/a5.webp",
        tag: "Sport",
        readTime: 4,
    },
    {
        id: 6,
        title: "The Impact of Automation on Business Management Efficiency",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Learn how automation is boosting business management efficiency and driving growth in various sectors.",
        image: "/images/a6.webp",
        tag: "Technology",
        readTime: 6,
    },
    {
        id: 7,
        title: "Startups Disrupting the Sports Industry with Innovative Tech",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: " Discover how startups are leveraging technology to disrupt and innovate within the sports industry.",
        image: "/images/a7.webp",
        tag: "Sport",
        readTime: 3,
    },
    {
        id: 8,
        title: "Travel Trends in 2024: Virtual Tours and Immersive Experiences",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Explore the rise of virtual tours and immersive experiences shaping the future of travel in 2024.",
        image: "/images/a8.webp",
        tag: "News",
        readTime: 5,
    },
    {
        id: 9,
        title: "Why Data Security is a Priority for Business Management in 2024",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Understand why data security is a growing concern for business management in today's digital world.",
        image: "/images/a9.webp",
        tag: "Trends",
        readTime: 7,
    },
    {
        id: 10,
        title: "Startups and AI: How Artificial Intelligence Drives Innovation",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "See how startups are harnessing the power of AI to foster innovation and reshape industries.",
        image: "/images/a10.webp",
        tag: "Startups",
        readTime: 4,
    },
    {
        id: 11,
        title: "Top Business Management Software Solutions for 2024",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Learn about the top management software solutions driving efficiency and growth in businesses.",
        image: "/images/a11.webp",
        tag: "Management",
        readTime: 6,
    },
    {
        id: 12,
        title: "How 5G Technology Will Impact the Travel Industry in 2024",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt: "Discover how 5G technology is set to revolutionize connectivity and enhance travel experiences.",
        image: "/images/a12.webp",
        tag: "Technology",
        readTime: 3,
    },
    {
        id: 13,
        title: "Sample Article Title 1",
        date: "October 16, 2024",
        author: "Ethan Caldwell",
        excerpt:
            "This is a short preview of the article content. Add a captivating summary here.",
        image: "/images/a1.webp",
        tag: "Management",
        readTime: 5,
    },
    {
        id: 14,
        title: "Second Article Title",
        date: "October 18, 2024",
        author: "Jane Doe",
        excerpt:
            "Another article with its own short preview. Keep it catchy.",
        image: "/images/a2.webp",
        tag: "Sport",
        readTime: 6,
    },
    {
        id: 15,
        title: "Third Amazing Article",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt:
            "Yet another interesting article summary goes here.",
        image: "/images/a3.webp",
        tag: ["Business", "News"],
        readTime: 3,
    },
    {
        id: 16,
        title: "Third Amazing Article",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt:
            "Yet another interesting article summary goes here.",
        image: "/images/a4.webp",
        tag: ["Startups", "Technology"],
        readTime: 5,
    },
    {
        id: 17,
        title: "Third Amazing Article",
        date: "October 20, 2024",
        author: "John Smith",
        excerpt:
            "Yet another interesting article summary goes here.",
        image: "/images/a5.webp",
        tag: ['News', 'Sport'],
        readTime: 4,
    },
];
export default function AllPosts() {

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;
    const [livePosts, setLivePosts] = useState<RemotePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const isSearchActive = searchQuery.trim() !== "";

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        fetchAdminPosts({ page: 1, limit: 24 })
            .then((res) => { if (!active) return; setLivePosts(res.posts || []); })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, []);

    const baseList = useMemo(() => {
        if (livePosts.length) {
            return livePosts.map((p: RemotePost) => ({
                id: p._id,
                title: p.title,
                date: new Date(p.publishedAt || p.createdAt || Date.now()).toDateString(),
                author: typeof p.author === "string" ? p.author : (p.author?.fullName || ""),
                excerpt: "",
                image: p.bannerImageUrl || "/images/a1.webp",
                tag: p.tags || [],
                readTime: p.readingTimeMinutes || 0,
            }));
        }
        return articles;
    }, [livePosts]);

    // Filtered + Sorted Articles
    const filteredArticles = useMemo(() => {
        const filtered = baseList.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (sortOrder === "latest") {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }
        });

        return filtered;
    }, [searchQuery, sortOrder, baseList]);

    const totalPages = Math.ceil(filteredArticles.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedArticles = filteredArticles.slice(start, start + perPage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <DashboardLayout>
            {/* Header with Search + Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Filter */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="latest">Latest Posts</option>
                        <option value="oldest">Oldest Posts</option>
                    </select>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-3 flex flex-col">
                    <div className={isSearchActive ? "flex flex-col gap-10" : "grid grid-cols-1 md:grid-cols-3 gap-8"}>
                        {loading && (
                            <div className="col-span-full text-center py-20 text-gray-500 text-lg font-semibold">Loading latest posts…</div>
                        )}
                        {error && !loading && (
                            <div className="col-span-full text-center py-20 text-red-500 text-lg font-semibold">{error}</div>
                        )}
                        {!loading && !error && paginatedArticles.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500 text-lg font-semibold">
                                {isSearchActive ? "No posts found for your search." : "No posts available."}
                            </div>
                        ) : (
                            paginatedArticles.map((a) => (
                                <Link key={a.id} href={`/articles/${a.id}`}>
                                    {isSearchActive ? (
                                        <article className="flex mx-20 flex-col md:flex-row justify-center items-stretch gap-4 group rounded-2xl overflow-hidden p-3 hover:shadow-lg transition-shadow">
                                            {/* Image */}
                                            <div className="relative w-full md:w-1/3 h-56 md:h-auto flex-shrink-0">
                                                <Image
                                                    src={a.image}
                                                    alt={a.title}
                                                    fill
                                                    className="object-cover rounded-2xl"
                                                />

                                                {/* Top-left Tags */}
                                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                                    {Array.isArray(a.tag) ? (
                                                        a.tag.map((t, i) => (
                                                            <span key={i} className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                                                {t}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{a.tag}</span>
                                                    )}
                                                </div>

                                                {/* Top-right min read (hover) */}
                                                <div className="absolute top-2 right-2 flex items-center gap-1 text-white text-xs bg-black/20 px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{a.readTime} min read</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-2 w-full md:w-2/3 p-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{a.author}</span>
                                                    <span>on {a.date}</span>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-800">{a.title}</h2>
                                                <p className="text-gray-600">{a.excerpt}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {Array.isArray(a.tag)
                                                        ? a.tag.map((t, i) => (
                                                            <span key={i} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                                                {t}
                                                            </span>
                                                        ))
                                                        : <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-md uppercase">{a.tag}</span>
                                                    }
                                                </div>
                                            </div>
                                        </article>
                                    ) : (
                                        <article className="flex flex-col overflow-hidden group cursor-pointer">
                                            <div className="relative w-full h-56">
                                                <Image
                                                    src={a.image}
                                                    alt={a.title}
                                                    fill
                                                    className="object-cover rounded-2xl"
                                                />
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                    {Array.isArray(a.tag) ? (
                                                        a.tag.map((t, i) => (
                                                            <span key={i} className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                                                {t}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">
                                                            {a.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Clock className="w-5 h-5" />
                                                    <span>{a.readTime} min read</span>
                                                </div>
                                            </div>
                                            <div className="py-4 px-1 flex flex-col gap-2">
                                                <div className="flex items-center text-sm text-gray-500 gap-1">
                                                    <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{a.author}</span>
                                                    <span className="text-gray-500"> on {a.date}</span>
                                                </div>
                                                <h2 className="text-lg font-bold">{a.title}</h2>
                                                <p className="text-gray-600 text-sm">{a.excerpt}</p>
                                            </div>
                                        </article>
                                    )}

                                </Link>
                            ))
                        )}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-10 gap-2">
                        {/* Prev Button */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md transition-colors ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white text-[#5559d1] shadow-sm"
                                }`}>
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded-md transition-colors font-medium ${currentPage === page
                                    ? "bg-[#5559d1] text-white shadow-md"
                                    : "bg-white text-[#5559d1] hover:bg-[#5559d1] hover:text-white shadow-sm"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md transition-colors ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white text-[#5559d1] shadow-sm"
                                }`} >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}
