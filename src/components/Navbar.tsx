"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* === LEFT : Logo === */}
                <Link href="/" className="navbar-logo">
                    <Image src="/images/BlogCafe_Logo.svg" alt="BlogCafeAI" width={130} height={130} priority />
                </Link>

                {/* Mobile toggle */}
                <button
                    className="icon-btn md:hidden rounded-lg p-2 border border-gray-200"
                    aria-label="Toggle menu"
                    onClick={() => setOpen(v => !v)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M4 7h16M4 12h16M4 17h16" stroke="#29294b" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <ul className={`navbar-menu ${open ? "block" : "hidden"} md:flex`}
                    style={{ position: undefined }}>
                    <li className="pt-2">
                        <Link
                            href="/"
                            className={`nav-link ${pathname === "/" ? "active" : ""} hover:bg-gray-100 rounded-lg px-2 py-2`}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="pt-2">
                        <Link
                            href="/all-posts"
                            className={`nav-link ${pathname === "/all-posts" ? "active" : ""} hover:bg-gray-100 rounded-l px-2 py-2`}
                        >
                            All Posts
                        </Link>
                    </li>
                    <li className="pt-2">
                        <Link
                            href="/about"
                            className={`nav-link ${pathname === "/about" ? "active" : ""} hover:bg-gray-100 rounded-l px-2 py-2`}
                        >
                            About
                        </Link>
                    </li>

                    <li className="pt-2">
                        <Link
                            href="/contact"
                            className={`nav-link ${pathname === "/contact" ? "active" : ""} hover:bg-gray-100 rounded-l px-2 py-2`}
                        >
                            Contact Us
                        </Link>
                    </li>
                    {/* <li className="pt-2">
                        <Link
                            href="/admin/new-post"
                            className={`nav-link ${pathname === "/admin/new-post" ? "active" : ""} hover:bg-gray-100 rounded-l px-2 py-2`}
                        >
                            New Post
                        </Link>
                    </li> */}
                </ul>

                {/* === RIGHT : Actions === */}
                <div className="navbar-actions flex items-center gap-2">
                    {/* Sign Up */}
                    <Link
                        href="/auth"
                        className="buy-btn px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>
            {/* Mobile dropdown panel */}
            {open && (
                <div className="md:hidden px-4 pb-3">
                    <div className="flex flex-col gap-1">
                        <Link href="/" className={`px-3 py-2 rounded-lg ${pathname === "/" ? "bg-gray-100" : ""}`} onClick={() => setOpen(false)}>Home</Link>
                        <Link href="/all-posts" className={`px-3 py-2 rounded-lg ${pathname === "/all-posts" ? "bg-gray-100" : ""}`} onClick={() => setOpen(false)}>All Posts</Link>
                        <Link href="/about" className={`px-3 py-2 rounded-lg ${pathname === "/about" ? "bg-gray-100" : ""}`} onClick={() => setOpen(false)}>About</Link>
                        <Link href="/contact" className={`px-3 py-2 rounded-lg ${pathname === "/contact" ? "bg-gray-100" : ""}`} onClick={() => setOpen(false)}>Contact Us</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
