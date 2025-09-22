"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Moon, Search, Sun } from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* === LEFT : Logo === */}
                <Link href="/" className="navbar-logo">
                    <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
                </Link>


                <ul className="navbar-menu">
                    <li className="pt-2">
                        <Link
                            href="/"
                            className={`nav-link ${pathname === "/about" ? "active" : ""} hover:bg-gray-100 px-2 py-2`}
                        >
                            Home
                        </Link>
                    </li>

                    <li className="pt-2">
                        <Link
                            href="/about"
                            className={`nav-link ${pathname === "/about" ? "active" : ""} hover:bg-gray-100 px-2 py-2`}
                        >
                            About
                        </Link>
                    </li>
                    <li className="pt-2">
                        <Link
                            href="/contact"
                            className={`nav-link ${pathname === "/contact" ? "active" : ""} hover:bg-gray-100 px-2 py-2`}
                        >
                            Contact Us
                        </Link>
                    </li>
                    <li className="pt-2">
                        <Link
                            href="/admin/new-post"
                            className={`nav-link ${pathname === "/admin/new-post" ? "active" : ""} hover:bg-gray-100 px-2 py-2`}
                        >
                            New Post
                        </Link>
                    </li>
                </ul>


                {/* === RIGHT : Actions === */}
                <div className="navbar-actions flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-1.5 rounded-full border transition-colors duration-300 text-gray-800 dark:text-gray-100 bg-white-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                        />
                    </div>

                    {/* Theme toggle */}
                    <button
                        aria-label="Toggle theme"
                        className="icon-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onClick={toggleTheme}
                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Sign Up */}
                    <Link
                        href="/signUp"
                        className="buy-btn px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    );
}
