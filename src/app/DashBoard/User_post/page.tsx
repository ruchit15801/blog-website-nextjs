"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";

// Mock users
const users = [
    { id: 1, name: "Ethan Caldwell" },
    { id: 2, name: "Jane Doe" },
    { id: 3, name: "John Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 3, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
];

const posts = [
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
        author: "Jane Doe",
        excerpt: "Learn how automation is boosting business management efficiency and driving growth in various sectors.",
        image: "/images/a6.webp",
        tag: "Technology",
        readTime: 6,
    },
    {
        id: 7,
        title: "Startups Disrupting the Sports Industry with Innovative Tech",
        date: "October 20, 2024",
        author: "Jane Doe",
        excerpt: " Discover how startups are leveraging technology to disrupt and innovate within the sports industry.",
        image: "/images/a7.webp",
        tag: "Sport",
        readTime: 3,
    },
    {
        id: 8,
        title: "Travel Trends in 2024: Virtual Tours and Immersive Experiences",
        date: "October 20, 2024",
        author: "Alice Johnson",
        excerpt: "Explore the rise of virtual tours and immersive experiences shaping the future of travel in 2024.",
        image: "/images/a8.webp",
        tag: "News",
        readTime: 5,
    },
    {
        id: 9,
        title: "Why Data Security is a Priority for Business Management in 2024",
        date: "October 20, 2024",
        author: "Bob Smith",
        excerpt: "Understand why data security is a growing concern for business management in today's digital world.",
        image: "/images/a9.webp",
        tag: "Trends",
        readTime: 7,
    },
    {
        id: 10,
        title: "Startups and AI: How Artificial Intelligence Drives Innovation",
        date: "October 20, 2024",
        author: "Bob Smith",
        excerpt: "See how startups are harnessing the power of AI to foster innovation and reshape industries.",
        image: "/images/a10.webp",
        tag: "Startups",
        readTime: 4,
    },
    {
        id: 11,
        title: "Top Business Management Software Solutions for 2024",
        date: "October 20, 2024",
        author: "Charlie Brown",
        excerpt: "Learn about the top management software solutions driving efficiency and growth in businesses.",
        image: "/images/a11.webp",
        tag: "Management",
        readTime: 6,
    },
    {
        id: 12,
        title: "How 5G Technology Will Impact the Travel Industry in 2024",
        date: "October 20, 2024",
        author: "Charlie Brown",
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
        author: "Charlie Brown",
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
        author: "Alice Johnson",
        excerpt:
            "Yet another interesting article summary goes here.",
        image: "/images/a5.webp",
        tag: ['News', 'Sport'],
        readTime: 4,
    },
];

export default function UserPosts() {
    const PER_PAGE = 6;
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [page, setPage] = useState(1);

    // --- Filtered posts ---
    const filteredPosts = useMemo(() => {
        let f = posts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
        if (selectedUser !== "all") {
            f = f.filter((p) => p.author === selectedUser);
        }
        // Sort by latest date
        f.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return f;
    }, [search, selectedUser]);

    // --- Pagination ---
    const totalPages = Math.ceil(filteredPosts.length / PER_PAGE);
    const start = (page - 1) * PER_PAGE;
    const paginatedPosts = filteredPosts.slice(start, start + PER_PAGE);

    const goTo = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">User Posts</h1>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    {/* User Filter */}
                    <select
                        value={selectedUser}
                        onChange={(e) => { setSelectedUser(e.target.value); setPage(1); }}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                    >
                        <option value="all">All Users</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts Grid */}
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paginatedPosts.map((p) => (
                    <article key={p.id} className="relative group flex flex-col overflow-hidden rounded-2xl transition">
                        <div className="relative w-full h-56">
                            <Image src={p.image} alt={p.title} fill className="object-cover rounded-2xl" />
                            {/* Tags */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                {Array.isArray(p.tag) ? p.tag.map((t, i) => (
                                    <span key={i} className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{t}</span>
                                )) : (
                                    <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase">{p.tag}</span>
                                )}
                            </div>
                            {/* 3-dot menu */}
                            <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                                <summary className="list-none cursor-pointer p-2 bg-black/20 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                                    <MoreHorizontal className="w-3 h-3"/>
                                </summary>
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                    <button onClick={() => alert(`Edit ${p.title}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Edit</button>
                                    <button onClick={() => alert(`Publish ${p.title}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Publish</button>
                                    <button onClick={() => alert(`Delete ${p.title}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Delete</button>
                                </div>
                            </details>
                        </div>

                        <div className="py-4 flex flex-col gap-2">
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                                <span className="font-medium text-gray-700" style={{ color: '#5559d1' }}>{p.author}</span>
                                <span>on {p.date}</span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                            <p className="text-gray-600 text-sm">{p.excerpt}</p>
                        </div>
                    </article>
                ))}

                {paginatedPosts.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No posts found.
                    </div>
                )}
            </main>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                    <button
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded-md ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pnum) => (
                        <button
                            key={pnum}
                            onClick={() => goTo(pnum)}
                            className={`px-3 py-1 rounded-md font-medium transition-colors ${page === pnum ? "bg-[#5559d1] text-white shadow-md" : "bg-white text-[#5559d1] hover:bg-[#5559d1] hover:text-white shadow-sm"}`}
                        >
                            {pnum}
                        </button>
                    ))}
                    <button
                        onClick={() => goTo(page + 1)}
                        disabled={page === totalPages}
                        className={`px-3 py-1 rounded-md ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
}
