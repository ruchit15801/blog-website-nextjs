"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface CommentType {
    id: number;
    name: string;
    avatar?: string;
    date: string;
    comment: string;
    replies?: CommentType[];
}




export default function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);

    const articles = [
        {
            id: 1,
            title: "How Tech Shapes the Future of Work in 2024",
            date: "October 16, 2024",
            author: "Ethan Caldwell",
            excerpt: `
            In today’s ever-evolving world, storytelling has become a powerful tool for connection. Revision provides a unique platform for individuals to share their stories.

            Revision is more than a typical content hub. It’s a dynamic space for meaningful conversations and personal stories that resonate with people on an emotional level. Whether you are looking for inspiration, comfort, or just a different perspective on life, Revision offers a wide range of narratives to explore.

            So, what makes Revision stand out as the place for heartfelt reflections?

            Revision is more than a typical content hub. It’s a dynamic space for meaningful conversations and personal stories that resonate with people on an emotional level. Whether you are looking for inspiration, comfort, or just a different perspective on life, Revision offers a wide range of narratives to explore.

            With categories covering everything from love and relationships to personal development and lifestyle, it encourages readers to explore topics that touch on their emotions and experiences.

            **Stories that Matter**

            At the core of Revision is a commitment to delivering stories that matter. Unlike traditional media platforms or news, Revision invites readers into a world of deeply personal narratives. The website’s title, “Heartfelt Reflections: Stories of Love, Loss, and Growth,” signals this intent clearly, inviting you to journey through the most intimate aspects of human experience.

            But we’re not just talking about written content — there are many ways that Revision fosters connection and creativity. The different types of features include:
            - Author Profiles: Each contributor has a detailed profile, allowing readers to connect with their personal journey and social media presence.
            - Experience Widgets: Contributors showcase their professional growth and skills, giving readers insight into their expertise.
            - Technologies Section: Creators highlight the tools they use, such as Figma, Photoshop, and more, providing transparency in their creative processes.
            - Creating Widget: A space where contributors can link to external projects and portfolios, expanding their reach beyond the platform.

            *Image below with caption:*  
            **How to raise customer loyalty**

            **How do I create meaningful connections?**  
            When producing content for platforms like Revision, it’s essential to focus not only on the quality of the writing but also on how it fosters engagement.

            **How do I make authentic engagement?**  
            There are several ways to ensure your content builds these connections effectively. Here’s what they are:

            1. **Understand your audience**  
            The first step to creating meaningful connections is understanding who your audience is. This involves researching their demographics, interests, preferences, and needs. Are they young professionals looking for lifestyle tips? Or perhaps seasoned entrepreneurs seeking business insights? Once you have a clear picture of who your readers are, you can start shaping content that resonates with their unique preferences.  

            For instance, knowing that your audience values emotional, personal stories can guide your content to be more reflective and heartfelt, making it easier for them to relate to the subject matter. Furthermore, understanding your audience allows you to tailor your tone and style to better connect with them.
        `,
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
    const article = articles.find((a) => a.id === Number(resolvedParams.id));

    const [index, setIndex] = useState(0);
    const prev = () => setIndex((i) => (i - 1 + posts.length) % posts.length);
    const next = () => setIndex((i) => (i + 1) % posts.length);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", comment: "", remember: false, replyingTo: "" });
    const [comments, setComments] = useState<CommentType[]>([
        {
            id: 1,
            name: "Joanna Wellick",
            avatar: "/images/c1.jpeg",
            date: "October 9, 2024",
            comment: "This is a sample comment.",
            replies: [
                {
                    id: 11,
                    name: "Elliot Alderson",
                    avatar: "/images/c2.jpeg",
                    date: "October 10, 2024",
                    comment: "This is a reply to Joanna."
                }
            ]
        }
    ]);

    if (!article) return <p className="p-10 text-center">Article not found</p>;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        setShowForm(false);
    };

    return (
        <>
            <Navbar />
            <main className="mx-auto py-10" style={{ maxWidth: '73rem' }}>
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6 flex justify-center items-center gap-1">
                    <Link href="/" className="text-gray-700">
                        Home
                    </Link>
                    <span>›</span>
                    <Link
                        href={`/category/${Array.isArray(article.tag)
                            ? article.tag[0].toLowerCase()
                            : article.tag
                            }`}
                        className="hover:underline capitalize text-gray-700"
                    >
                        {Array.isArray(article.tag) ? article.tag[0] : article.tag}
                    </Link>
                    <span>›</span>
                    <span className="text-gray-900">{article.title}</span>
                </nav>

                <div className="flex items-center justify-center text-sm text-gray-500 gap-1 py-3">
                    <span className="font-medium text-gray-700">
                        <span style={{ color: '#5955d1', fontWeight: 600, fontSize: '.925rem', lineHeight: 1.2 }}>{article.author}</span>
                    </span>
                    <span style={{ color: '#696981', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.02em' }}> on {article.date}</span>
                </div>

                {/* Tags + Title */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl mb-4 mx-20" style={{ fontSize: '3.25rem', fontWeight: 700, color: '#29294b' }}>
                        {article.title}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto" style={{ maxWidth: '640px', textWrap: 'balance', fontWeight: 400, fontSize: '1.125rem', color: '#696981' }}>
                        Revision – Welcome to ultimate source for fresh perspectives!
                        Explore curated content to enlighten, entertain and engage
                        global readers.
                    </p>
                    <div className="flex justify-center items-center text-center gap-2" style={{ margin: '1.5rem 0px' }}>
                        {(Array.isArray(article.tag) ? article.tag : [article.tag]).map(
                            (t) => (
                                <span
                                    key={t}
                                    className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded uppercase"
                                    style={{
                                        boxShadow: '0px 5px 20px 0px rgba(114,114,255), .15)',
                                    }}
                                >{t}</span>
                            )
                        )}
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative w-full mb-8 overflow-hidden rounded-3xl">
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-xl object-cover"
                        priority
                    />
                </div>

                {/* Read-time & icons */}
                <section className="flex flex-row-reverse gap-8 mb-10">
                    <aside className="lg:col-span-1 w-[35%]">
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
                    <div className="w-[65%] grid grid-cols-[10%_auto] gap-6">
                        {/* 10% column */}
                        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center justify-center text-center font-bold rounded-full" style={{
                                    width: '80px',
                                    height: '80px',
                                    boxShadow: '0px 5px 20px 0px rgba(114, 114, 255, 0.15)',
                                    transition: '.25s',
                                    animation: 'fade .5s',
                                    color: '#29294b',
                                }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, transition: '.25s' }}>{article.readTime} min read</span>
                                </div>
                                <div className="flex items-center justify-start gap-4 text-gray-800" style={{ color: '#29294b', flexDirection: 'column' }}>
                                    <a href="#" aria-label="Twitter" className="hover:text-blue-600">
                                        <svg width={32} height={32} viewBox="0 0 24 24">
                                            <path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-label="FaceBook" className="hover:text-sky-500">
                                        <svg width={32} height={32} viewBox="0 0 24 24">
                                            <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-label="InstaGram" className="hover:text-sky-500">
                                        <svg width={32} height={32} viewBox="0 0 24 24">
                                            <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-label="Linkedin" className="hover:text-sky-500">
                                        <svg width={32} height={32} viewBox="0 0 24 24">
                                            <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 50% column – main content */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">{article.title}</h2>
                            <p className="text-gray-600">
                                {article.excerpt}
                            </p>
                            <Image
                                src={article.image}
                                alt={article.title}
                                width={600}
                                height={400}
                                className="rounded-lg object-cover"
                            />

                            <div>
                                {/* View Comment button */}
                                <button className="view_comment ms-0"
                                    onClick={() => setShowForm((prev) => !prev)}>
                                    {showForm ? "Hide Comment Form" : "View Comment"}
                                </button>

                                {/* Comments Section */}
                                {showForm && (
                                    <div className="comments-section mt-4 space-y-4">
                                        {comments.map((c, idx) => (
                                            <div key={idx} className="comment flex flex-col gap-2 bg-gray-50 p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={c.avatar || "/default-avatar.png"}
                                                        alt={c.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-800">{c.name}</span>
                                                        <span className="text-gray-500 text-sm">{c.date}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mt-2">{c.comment}</p>

                                                {/* Reply button */}
                                                <button
                                                    className="text-blue-600 text-sm mt-2 hover:underline"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, replyingTo: c.name }));
                                                        setShowForm(true);
                                                        document.getElementById("commentForm")?.scrollIntoView({ behavior: "smooth" });
                                                    }}>
                                                    Reply
                                                </button>

                                                {/* Nested replies */}
                                                {c.replies && c.replies.length > 0 && (
                                                    <div className="replies mt-4 space-y-4 pl-12 border-l border-gray-200">
                                                        {c.replies.map((r: CommentType, ridx: number) => (
                                                            <div key={ridx} className="reply flex flex-col gap-2">
                                                                <div className="flex items-center gap-3">
                                                                    <Image
                                                                        src={r.avatar || "/default-avatar.png"}
                                                                        alt={r.name}
                                                                        width={40}
                                                                        height={40}
                                                                        className="rounded-full object-cover"
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-gray-800">{r.name}</span>
                                                                        <span className="text-gray-500 text-sm">{r.date}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 mt-1">{r.comment}</p>
                                                                <button
                                                                    className="text-blue-600 text-sm mt-1 hover:underline"
                                                                    onClick={() => {
                                                                        setFormData((prev) => ({ ...prev, replyingTo: r.name }));
                                                                        setShowForm(true);
                                                                        document.getElementById("commentForm")?.scrollIntoView({ behavior: "smooth" });
                                                                    }}
                                                                >
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Comment Form */}
                                        <form
                                            id="commentForm"
                                            onSubmit={handleSubmit}
                                            className="comment_form mt-4 flex flex-col shadow gap-4 p-4 rounded-2xl bg-white"
                                        >
                                            {/* Replying To */}
                                            {formData.replyingTo && (
                                                <div className="text-sm font-medium text-gray-600 mb-2">
                                                    Replying to <span className="font-semibold">{formData.replyingTo}</span>
                                                </div>
                                            )}

                                            {/* Heading */}
                                            <h4 className="text-xl font-semibold" style={{ color: "#29294b", fontWeight: 700 }}>
                                                Leave a Comment
                                            </h4>
                                            <p className="text-sm text-gray-600" style={{ fontSize: ".875rem", color: "#696981" }}>
                                                Your email address will not be published. Required fields are marked{" "}
                                                <span className="text-gray-500">*</span>
                                            </p>

                                            {/* Name + Email */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <label className="flex flex-col gap-1 text-sm font-medium">
                                                    <span className="flex items-center gap-1">Name <span className="text-gray-500">*</span></span>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Name*"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="border border-gray-200 focus:border-gray-400 focus:ring-0 p-2 rounded w-full placeholder:text-gray-400"
                                                        required
                                                    />
                                                </label>

                                                <label className="flex flex-col gap-1 text-sm font-medium">
                                                    <span className="flex items-center gap-1">Email <span className="text-gray-500">*</span></span>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Email*"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="border border-gray-200 focus:border-gray-400 focus:ring-0 p-2 rounded w-full placeholder:text-gray-400"
                                                        required
                                                    />
                                                </label>
                                            </div>

                                            {/* Comment */}
                                            <label className="flex flex-col gap-1 text-sm font-medium">
                                                <span className="flex items-center gap-1">Your Comment <span className="text-gray-500">*</span></span>
                                                <textarea
                                                    name="comment"
                                                    placeholder="Your Comment*"
                                                    value={formData.comment}
                                                    onChange={handleChange}
                                                    className="border border-gray-200 focus:border-gray-400 focus:ring-0 p-2 rounded w-full placeholder:text-gray-400"
                                                    rows={4}
                                                    required
                                                />
                                            </label>

                                            {/* Remember Checkbox */}
                                            <label className="flex items-center justify-center gap-2 text-sm" style={{ maxWidth: "64%" }}>
                                                <input
                                                    type="checkbox"
                                                    name="remember"
                                                    checked={formData.remember}
                                                    onChange={handleChange}
                                                    className="w-4 h-4"
                                                />
                                                Save my name and email in this browser for the next time I comment.
                                            </label>

                                            {/* Buttons */}
                                            <div className="flex gap-4">
                                                <button
                                                    type="submit"
                                                    className="submit_comment px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    Submit Comment
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowForm(false);
                                                        setFormData((prev) => ({ ...prev, replyingTo: "" }));
                                                    }}
                                                    className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#29294b' }}>Read Next</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {articles
                            .filter((a) => a.id !== article.id)
                            .slice(0, 3)
                            .map((a) => (
                                <article
                                    key={a.id}
                                    className="flex flex-col overflow-hidden group"
                                >
                                    {/* Image */}
                                    <div className="relative w-full h-56">
                                        <Image
                                            src={a.image}
                                            alt={a.title}
                                            fill
                                            className="object-cover rounded-2xl"
                                        />

                                        {/* Top-Left Tag */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {Array.isArray(a.tag) ? (
                                                a.tag.map((t, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                        style={{ lineHeight: 1.2, letterSpacing: '.1em', transition: '.25s' }}
                                                    >
                                                        {t}
                                                    </span>
                                                ))
                                            ) : (
                                                <span
                                                    className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-md uppercase"
                                                    style={{ lineHeight: 1.2, letterSpacing: '.1em', transition: '.25s' }}
                                                >
                                                    {a.tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="py-4 px-1 flex flex-col gap-2">
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
                                        <p className="text-gray-600 text-sm" style={{ fontWeight: 400, fontSize: '1rem', lineHeight: 1.55, color: '#696981', maxWidth: '100%' }}>
                                            {a.excerpt.substring(0, 120)}...
                                        </p>
                                    </div>
                                </article>
                            ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
