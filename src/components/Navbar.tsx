"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* === LEFT : Logo === */}
                <Link href="/" className="navbar-logo">
                    {/* <Image src="/images/logo.png" alt="BlogCafeAI" width={130} height={130} priority /> */}
                    <span className="navbar-title" style={{ color: '#29294b', letterSpacing: '-.02em' }}>BlogCafeAI</span>
                </Link>


                <ul className="navbar-menu">
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
        </header>
    );
}
