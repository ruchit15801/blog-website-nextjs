"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b border-white/10">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg" style={{ color: "var(--brand-muted-blue)" }}>
                    Blogcafeai
                </Link>
                <ul className="hidden sm:flex items-center gap-6">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`transition-colors ${active ? "font-semibold" : ""}`}
                                    style={{ color: active ? "var(--brand-teal)" : "var(--foreground)" }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="flex items-center gap-2">
                    <Link href="#subscribe" className="btn btn-primary shine">Subscribe</Link>
                </div>
            </nav>
        </header>
    );
}


