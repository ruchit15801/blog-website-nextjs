"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Moon, Search, Sun } from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* === LEFT : Logo === */}
                <Link href="/" className="navbar-logo">
                    <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
                </Link>

                {/* === CENTER : Menu === */}

                <ul className="navbar-menu">
                    {/* HomePages dropdown */}
                    <li
                        className={`nav-item relative ${openMenu === "home" ? "open" : ""}`}
                        onMouseEnter={() => setOpenMenu("home")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <button className="nav-link flex items-center gap-1 bg-gray-100 px-2 py-2 rounded-md">
                            HomePages
                            {openMenu === "home" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {openMenu === "home" && (
                            <ul className="dropdown absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded-md z-50">
                                <li><Link href="/classicList" className="block px-4 py-2 hover:bg-gray-100">Classic List</Link></li>
                                <li><Link href="/" className="block px-4 py-2 hover:bg-gray-100">Classic Grid</Link></li>
                                <li><Link href="/classicOverlay" className="block px-4 py-2 hover:bg-gray-100">Classic Overlay</Link></li>
                                <li><Link href="/classic-grid" className="block px-4 py-2 hover:bg-gray-100">Hero Slider</Link></li>
                                <li><Link href="/classic-grid" className="block px-4 py-2 hover:bg-gray-100">Classic Grid</Link></li>
                                <li><Link href="/classic-grid" className="block px-4 py-2 hover:bg-gray-100">Classic Grid</Link></li>
                                <li><Link href="/hero-slider" className="block px-4 py-2 hover:bg-gray-100">Hero Slider</Link></li>
                                <li><Link href="/featured-posts" className="block px-4 py-2 hover:bg-gray-100">Featured Posts</Link></li>
                            </ul>
                        )}
                    </li>

                    {/* Features multi-level dropdown */}
                    <li
                        className={`nav-item relative ${openMenu === "features" ? "open" : ""}`}
                        onMouseEnter={() => setOpenMenu("features")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <button className="nav-link flex items-center gap-1 hover:bg-gray-100 px-2 py-2">
                            Features
                            {openMenu === "features" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {openMenu === "features" && (
                            <ul className="dropdown absolute top-full left-0 mt-1 w-56 bg-white border shadow-lg rounded-md z-50">
                                <li className="has-sub relative group">
                                    <span className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Post Headers
                                        <ChevronRight size={14} className="ml-2 text-gray-500" />
                                    </span>
                                    <ul className="absolute top-0 left-full mt-0 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                                        <li><Link href="/widgets/basic" className="block px-4 py-2 hover:bg-gray-100">Standard</Link></li>
                                        <li><Link href="/widgets/advanced" className="block px-4 py-2 hover:bg-gray-100">Split</Link></li>
                                        <li><Link href="/widgets/pro" className="block px-4 py-2 hover:bg-gray-100">Overlay</Link></li>
                                    </ul>
                                </li>

                                {/* ---- Layouts ---- */}
                                <li className="has-sub relative group">
                                    <span className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Layouts
                                        <ChevronRight size={14} className="ml-2 text-gray-500" />
                                    </span>
                                    <ul className="absolute top-0 left-full mt-0 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                                        <li><Link href="/layouts/grid" className="block px-4 py-2 hover:bg-gray-100">Right Sidebar</Link></li>
                                        <li><Link href="/layouts/masonry" className="block px-4 py-2 hover:bg-gray-100">Left Sidebar</Link></li>
                                        <li><Link href="/layouts/masonry" className="block px-4 py-2 hover:bg-gray-100">Without Sidebar</Link></li>
                                    </ul>
                                </li>

                                <li><Link href="/features/auto-load" className="block px-4 py-2 hover:bg-gray-100">Auto Load Next Post</Link></li>
                                <li><Link href="/features/analytics" className="block px-4 py-2 hover:bg-gray-100">Analytics</Link></li>
                            </ul>
                        )}
                        
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
                            Contact
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
                <div className="navbar-actions">
                    <button aria-label="Search" className="icon-btn">
                        <Search size={20} />
                    </button>
                    <button
                        aria-label="Toggle theme"
                        className="icon-btn"
                        onClick={toggleTheme}
                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <Link href="/buy" className="buy-btn">
                        Buy Now
                    </Link>
                </div>
            </nav>
        </header>
    );
}
