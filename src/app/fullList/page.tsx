"use client"
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FullList() {
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
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;
    const totalPages = Math.ceil(articles.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedArticles = articles.slice(start, start + perPage);
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            <Navbar/>
            <Hero />
            <main className="flex justify-center px-4 py-10">
                {/* ===== Main Content ===== */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* Outer wrapper for articles */}
                    <div className="w-full max-w-6xl flex flex-col gap-8">
                        {paginatedArticles.map((a) => (
                            <Link key={a.id} href={`/articles/${a.id}`}>
                                <article className="full-list pb-8 flex flex-row overflow-hidden group justify-center items-center">
                                    {/* Image */}
                                    <div className="relative w-100 h-56">
                                        <Image
                                            src={a.image}
                                            alt={a.title}
                                            fill
                                            className="object-cover rounded-2xl"
                                        />

                                        {/* Top-Left Tag */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {Array.isArray(a.tag) ? (
                                                a.tag.map((t: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                        style={{
                                                            lineHeight: 1.2,
                                                            color: "#222",
                                                            letterSpacing: ".1em",
                                                            transition: ".25s",
                                                        }}
                                                    >
                                                        {t}
                                                    </span>
                                                ))
                                            ) : (
                                                <span
                                                    className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                    style={{
                                                        lineHeight: 1.2,
                                                        color: "#222",
                                                        letterSpacing: ".1em",
                                                        transition: ".25s",
                                                    }}
                                                >
                                                    {a.tag}
                                                </span>
                                            )}
                                        </div>

                                        {/* Right-Top “min read” – visible on hover */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/10 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 700 }}>
                                            <Clock className="w-5 h-5" />
                                            <span style={{ fontSize: '16px' }}>{a.readTime} min read</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="py-4 px-4 flex flex-col gap-4 me-40">
                                        {/* Author & Date */}
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <span className="font-medium text-gray-700">
                                                <span style={{ color: '#5955d1', fontWeight: 600, fontSize: '.925rem', lineHeight: 1.2 }}>{a.author}</span>
                                            </span>
                                            <span style={{ color: '#696981', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.02em' }}> on {a.date}</span>
                                        </div>

                                        {/* Title */}
                                        <h2 style={{ fontSize: '1.3125rem', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1.2 }}>
                                            {a.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 text-sm" style={{ fontWeight: 400, fontSize: '1rem', lineHeight: 1.55, color: '#696981', maxWidth: '640px' }}>{a.excerpt}</p>

                                        <button className="discover mx-auto ms-0 mt-10" style={{cursor : 'pointer'}}>Discover More</button>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-10">
                        <nav
                            className="flex items-center text-sm"
                            aria-label="Pagination"
                            style={{
                                color: "var(--cs-color-primary)",
                                backgroundColor: "var(--cs-layout-background)",
                                boxShadow: "0px 5px 20px 0px rgba(var(--cs-color-box-shadow-rgb), .15)",
                                borderRadius: "var(--cs-layout-elements-border-radius)",
                                padding: ".5rem .75rem",
                                margin: "0 .75rem",
                            }}
                        >
                            {/* Prev button only when currentPage > 1 */}
                            {currentPage > 1 && (
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    className="flex items-center justify-center px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                    style={{ color: "#29294b" }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`mx-1 px-3 py-1 rounded-md transition-colors ${currentPage === page
                                        ? "bg-[#29294b] text-white"
                                        : "hover:bg-gray-100 text-[#29294b]"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next button only when currentPage < totalPages */}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    className="flex items-center justify-center px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                    style={{ color: "#29294b" }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </nav>
                    </div>
                </div>
            </main>
            <Footer/>

        </>
    );
}
