"use client"
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ClassicOverlay() {
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

    const posts = [
        {
            img: "/images/aside1.webp",
            title: "AI in Business Management: Improving Efficiency and Decision Making",
            author: "Ethan Caldwell",
            date: "on July 7, 2024",
            tag: "Management",
        },
        {
            img: "/images/a4.webp",
            title: "Business Travel Tools for the Digital Age",
            author: "Ethan Caldwell",
            date: "on September 25,2024",
            tag: "Business",
        },
        {
            img: "/images/aside.webp",
            title: "Business Travel Trends to Expect in 2024: Tech and Efficiency",
            author: "Ethan Caldwell",
            date: "on August 5,2024",
            tag: "Business",
        },
    ];

    const technologies = [
        {
            img: "/images/aside_tech.webp",
            name: "Figma",
            desc: "Collaborate and design interfaces in real-time.",
        },
        {
            img: "/images/aside_tech1.webp",
            name: "Notion",
            desc: "Organize, track, and collaborate on projects easily.",
        },
        {
            img: "/images/aside_tech2.webp",
            name: "Photoshop",
            desc: "Professional image and graphic editing tool.",
        },
        {
            img: "/images/aside_tech3.webp",
            name: "Illustrator",
            desc: "Create precise vector graphics and illustrations.",
        },
    ];

    const [index, setIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;
    const prev = () => setIndex((i) => (i - 1 + posts.length) % posts.length);
    const next = () => setIndex((i) => (i + 1) % posts.length);
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
            <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ===== Main Content ===== */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* Outer wrapper for articles */}
                    <div className="grid grid-cols-1 gap-8">
                        {paginatedArticles.map((a) => (
                            <Link key={a.id} href={`/articles/${a.id}`}>
                                <article className="relative w-full h-96 rounded-2xl overflow-hidden group flex flex-col justify-end">
                                    <Image
                                        src={a.image}
                                        alt={a.title}
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    {/* Top-left tags */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 px-4 py-4">
                                        {Array.isArray(a.tag) ? (
                                            a.tag.map((t: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                    style={{ lineHeight: 1.2, letterSpacing: ".1em" }}
                                                >
                                                    {t}
                                                </span>
                                            ))
                                        ) : (
                                            <span
                                                className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                style={{ lineHeight: 1.2, letterSpacing: ".1em" }}
                                            >
                                                {a.tag}
                                            </span>
                                        )}
                                    </div>
                                    {/* Top-right “min read” – visible on hover */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-white/50 px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 font-semibold">
                                        <Clock className="w-5 h-5" />
                                        <span style={{ fontSize: "14px" }}>{a.readTime} min read</span>
                                    </div>
                                    {/* Content at bottom */}
                                    <div className="relative z-10 text-left text-gray-900 py-10 md:px-6 pb-6 flex flex-col gap-2">
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <span className="font-medium text-gray-700">
                                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '.925rem', lineHeight: 1.2 }}>{a.author}</span>
                                            </span>
                                            <span style={{ color: '#fff', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.02em' }}> on {a.date}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">{a.title}</h2>
                                        <p className="text-white text-base">{a.excerpt}</p>
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
                {/* ===== Sidebar / Aside ===== */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-8 space-y-10">
                        {/* 1️⃣ About Section */}
                        <div className="aside-shadow rounded-xl shadow py-6 ps-6 pe-10 flex flex-col">
                            <h2 style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem' }} className="uppercase">About</h2>
                            {/* Profile Photo */}
                            <div className="flex gap-3">
                                <div>
                                    <Image
                                        src="/images/aside_about.webp"
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="rounded-full mb-4 object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-900" style={{ color: '#29294b', fontWeight: 700, letterSpacing: '-0.04em' }}>Ethan Caldwell</h3>
                                    <p className="text-sm text-gray-500 mb-3 uppercase" style={{ fontSize: '12px', fontWeight: 800, color: '#696981', letterSpacing: '0.1em' }}>Reflective Blogger</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 mx-auto" style={{ marginTop: '12px', lineHeight: '1.55', color: '#696981', fontSize: '17px' }}>
                                Ethan Caldwell shares thoughtful insights and reflections on life, culture, and personal growth. His work explores the intersections of creativity and experience, offering readers unique perspectives.
                            </p>
                            {/* Location */}
                            <h4 className="flex items-center text-sm mb-4 gap-1">
                                <MapPin style={{ color: '#5955d1', fontSize: '1.5rem', width: '24px', height: '24px' }} />
                                <span style={{ color: '#29294b', fontSize: '16px', fontWeight: 400, marginTop: '8px', marginBottom: '0px', lineHeight: '1.55' }}>Paris, France</span>
                            </h4>
                            {/* Social Icons */}
                            <div className="flex gap-4" style={{ color: '#29294b' }}>
                                <a href="#" aria-label="Twitter" className="hover:text-blue-600">
                                    <svg width={24} height={24} viewBox="0 0 24 24">
                                        <path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="FaceBook" className="hover:text-sky-500">
                                    <svg width={24} height={24} viewBox="0 0 24 24">
                                        <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="InstaGram" className="hover:text-sky-500">
                                    <svg width={24} height={24} viewBox="0 0 24 24">
                                        <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Linkedin" className="hover:text-sky-500">
                                    <svg width={24} height={24} viewBox="0 0 24 24">
                                        <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* 2️⃣ Featured Posts (Slider) */}
                        <h3 className="text-lg font-semibold mb-4">Featured Posts</h3>
                        <div>
                            <div className="relative w-full h-80 overflow-hidden group">
                                {posts.map((post, i) => (
                                    <div
                                        key={post.title}
                                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                    >
                                        <Image src={post.img} alt={post.title} fill className="object-cover rounded-2xl" />

                                        {/* Overlay (optional) */}
                                        <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                                            <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded self-start">
                                                {post.tag}
                                            </span>
                                            <div>
                                                <span className="block text-sm">{post.author}{post.date}</span>
                                                <h4 className="text-lg font-semibold">{post.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Navigation Arrows */}
                                <button
                                    onClick={prev}
                                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:translate-x-5 transition-all"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 hover:-translate-x-5 transition-all"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* 3️⃣ Work Experience */}
                        <div className="aside-shadow rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 uppercase" style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem', lineHeight: '1.2' }}>Work Experience</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-medium" style={{ fontWeight: 600 }}>Product Designer</h4>
                                        <p className="text-sm text-gray-500" style={{ fontWeight: 400, fontSize: '16px', marginTop: '4px' }}>Pioneer</p>
                                    </div>
                                    <span className="text-sm text-gray-400" style={{ fontWeight: 500, fontSize: '15px', lineHeight: '1.2' }}>2022 – Now</span>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-medium" style={{ fontWeight: 600 }}>Product Designer</h4>
                                        <p className="text-sm text-gray-500" style={{ fontWeight: 400, fontSize: '16px', marginTop: '4px' }}>Digital</p>
                                    </div>
                                    <span className="text-sm text-gray-400" style={{ fontWeight: 500, fontSize: '15px', lineHeight: '1.2' }}>2020 – 2022</span>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-medium" style={{ fontWeight: 600 }}>UI/UX Designer</h4>
                                        <p className="text-sm text-gray-500" style={{ fontWeight: 400, fontSize: '16px', marginTop: '4px' }}>Digital</p>
                                    </div>
                                    <span className="text-sm text-gray-400" style={{ fontWeight: 500, fontSize: '15px', lineHeight: '1.2' }}>2017 – 2020</span>
                                </div>
                            </div>
                        </div>

                        {/* 4️⃣ Technologies */}
                        <div className="aside-shadow rounded-xl shadow py-6 ps-6 pe-10">
                            <h3
                                className="text-lg font-semibold mb-4 uppercase"
                                style={{ fontSize: ".75rem", fontWeight: 800, color: "#696981" }}
                            >
                                Technologies
                            </h3>

                            {/* Loop through technologies */}
                            {technologies.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="flex gap-4 items-center justify-center mb-4 last:mb-0"
                                >
                                    <Image
                                        src={tech.img}
                                        alt={tech.name}
                                        width={50}
                                        height={50}
                                        className="rounded-xl object-cover"
                                    />
                                    <div>
                                        <h3
                                            className="text-lg font-semibold"
                                            style={{
                                                color: "#29294b",
                                                fontWeight: 700,
                                                letterSpacing: "-0.04em",
                                            }}
                                        >
                                            {tech.name}
                                        </h3>
                                        <p
                                            className="text-sm text-gray-500"
                                            style={{ fontSize: "14px", color: "#696981", lineHeight: "1.55" }}
                                        >
                                            {tech.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 5️⃣ Creating */}
                        <div className="aside-shadow rounded-xl shadow p-6 space-y-4">
                            <h3 style={{ fontSize: '.75rem', fontWeight: 800, color: '#696981', marginBottom: '1.25rem' }} className="uppercase text-lg font-semibold mb-4" >Creating</h3>
                            {[
                                { title: "Heartfelt Reflections", desc: "A deep dive into emotional experiences and personal growth, sharing valuable insights on life's most meaningful moments." },
                                { title: "Latest Tech Gadgets", desc: "Explore the newest and most innovative technology products hitting the market, from smart devices to cutting-edge tools." },
                                { title: "Trends For 2024", desc: "A look ahead at the emerging trends that will shape the world in 2024, from lifestyle shifts to groundbreaking innovations." },
                            ].map((item) => (
                                <div key={item.title}>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 font-medium text-blue-600 hover:underline"
                                        style={{ color: '#5955d1', fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}
                                    >
                                        {item.title}
                                        <ExternalLink className="w-4 h-4" strokeWidth={3} />
                                    </a>
                                    <p className="text-sm text-gray-600" style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.55', color: '#696981' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
            <Footer/>
        </>
    );
}
