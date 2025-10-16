"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchAdminMeProfile } from "@/lib/adminClient";
import { fetchMyProfile as fetchUserProfile } from "@/lib/api";
import { logoutAndRedirect } from "@/lib/auth";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [user, setUser] = useState<{ name: string; avatar: string; role: string } | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null; // user or admin

    useEffect(() => {
        if (!token || !role) return;

        let active = true;

        (async () => {
            try {
                let response;
                if (role === "admin") {
                    response = await fetchAdminMeProfile(token);
                } else {
                    response = await fetchUserProfile(token);
                }

                if (!active) return;

                setUser({
                    name: response.fullName || "User",
                    avatar: ("avatarUrl" in response ? response.avatarUrl : "avatar" in response ? response.avatar : "/images/default-avatar.png") || "/images/default-avatar.png",
                    role: (response.role?.toLowerCase() || role || "user") as string,
                });

            } catch (err) {
                console.error("Failed to fetch profile for Navbar:", err);
            }
        })();

        return () => {
            active = false;
        };
    }, [token, role]);

    const handleLogout = () => logoutAndRedirect();

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* Logo */}
                <Link href="/" className="navbar-logo" title="BlogCafeAI – Official Site">
                    <Image src="/images/BlogCafe_Logo.svg" alt="BlogCafeAI" width={130} height={130} priority />
                    <span style={{ position: "absolute", left: -9999 }} aria-hidden={false}>BlogCafeAI</span>
                </Link>

                {/* Mobile toggle */}
                <button
                    className="icon-btn md:hidden rounded-lg p-2 border border-gray-200"
                    aria-label="Toggle menu"
                    onClick={() => setOpen((v) => !v)}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M4 7h16M4 12h16M4 17h16" stroke="#29294b" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Menu Links */}
                <ul className={`navbar-menu ${open ? "block" : "hidden"} md:flex`} style={{ position: undefined }}>
                    {["/", "/all-posts", "/about", "/contact"].map((link, idx) => {
                        const names = ["Home", "All Posts", "About", "Contact Us"];
                        return (
                            <li key={idx} className="pt-2">
                                <Link
                                    href={link}
                                    className={`nav-link ${pathname === link ? "active" : ""} hover:bg-gray-100 rounded-lg px-2 py-2`}
                                    onClick={() => setOpen(false)}>
                                    {names[idx]}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right actions */}
                <div className="navbar-actions flex items-center gap-2 hidden md:flex">
                    {!user && (
                        <Link
                            href="/auth"
                            className="buy-btn px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">
                            Sign Up
                        </Link>
                    )}

                    {user && (
                        <div className="relative">
                            {/* Avatar + Name Button */}
                            <button
                                className="flex items-center gap-2  px-3 py-1.5 hover:bg-gray-100 hover:shadow transition-all duration-200 rounded-md"
                                onClick={() => setUserMenuOpen((v) => !v)}>
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="about_author_img object-cover"
                                />
                                <span className="font-medium text-black hover:text-indigo-600">{user.name}</span>
                                <svg
                                    className={`w-4 h-4 text-black hover:text-indigo-600 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-35 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                                    <Link
                                        href="/DashBoard"
                                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        onClick={() => setUserMenuOpen(false)}>
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-3 text-sm bg-red-500 hover:bg-red-700 text-white transition">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden px-4 pb-3">
                    <div className="flex flex-col gap-1">
                        {["/", "/all-posts", "/about", "/contact"].map((link, idx) => {
                            const names = ["Home", "All Posts", "About", "Contact Us"];
                            return (
                                <Link
                                    key={idx}
                                    href={link}
                                    className={`px-3 py-2 rounded-lg ${pathname === link ? "bg-gray-100" : ""}`}
                                    onClick={() => setOpen(false)}
                                >
                                    {names[idx]}
                                </Link>
                            );
                        })}
                        {!user && (
                            <Link href="/auth" className="mt-2 buy-btn px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>
                                Sign Up
                            </Link>
                        )}
                        {user && user.role === "admin" && (
                            <>
                                <Link href="/DashBoard" className="mt-2 px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="mt-1 px-4 py-2 rounded-lg text-center bg-red-500 text-white hover:bg-red-600">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

