"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let timeout: number | undefined;
        const start = () => setLoading(true);
        const done = () => {
            timeout = window.setTimeout(() => setLoading(false), 250);
        };

        let last = pathname;
        const observer = new MutationObserver(() => {
            if (last !== pathname) {
                last = pathname;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        start();
        requestAnimationFrame(() => done());

        return () => {
            if (timeout) clearTimeout(timeout);
            observer.disconnect();
        };
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-ring">
                        <span className="loader-dot"></span>
                    </div>
                </div>
            )}

            {!pathname.startsWith("/DashBoard") && !pathname.startsWith("/splash") && !pathname.startsWith("/welcome") && <Navbar />}
            <main className="flex-1">{children}</main>
            {!pathname.startsWith("/DashBoard") && !pathname.startsWith("/splash") && !pathname.startsWith("/welcome") && <Footer />}

            <Toaster
                position="top-right"
                toastOptions={{ duration: 4000, style: { fontSize: "14px" } }}
            />
        </div>
    );
}



