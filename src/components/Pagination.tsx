"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
    const smoothJumpTop = () => {
        try { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
    };
    const changePage = (p: number) => {
        if (p === page) return;
        smoothJumpTop();
        onChange(p);
    };
    const visiblePages = (() => {
        const pages: number[] = [];
        const maxShown = 7;
        if (totalPages <= maxShown) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        pages.push(1);
        if (start > 2) pages.push(-1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push(-2);
        pages.push(totalPages);
        return pages;
    })();

    return (
        <div className="flex flex-col items-center mt-10 gap-2">
            <div className="text-xs font-semibold tracking-wide" style={{ color: '#696981' }}>Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => changePage(1)}
                    disabled={page === 1}
                    className={`rounded-full p-2 transition hover-float ${page === 1 ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                    aria-label="First page"
                    title="First"
                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>
                    <ChevronsLeft className="w-4 h-4" style={{ color: '#5559d1' }} />
                </button>
                <button
                    onClick={() => changePage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`rounded-full p-2 transition hover-float ${page === 1 ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                    aria-label="Previous page"
                    title="Prev"
                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>
                    <ChevronLeft className="w-4 h-4" style={{ color: '#5559d1' }} />
                </button>
                {visiblePages.map((pnum, idx) => (
                    pnum < 0 ? (
                        <span key={`gap-${idx}`} className="px-2 text-gray-400">…</span>
                    ) : (
                        <button
                            key={pnum}
                            onClick={() => changePage(pnum)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${page === pnum ? "text-white" : ""}`}
                            style={page === pnum ? {
                                background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)',
                                boxShadow: '0 10px 24px -12px rgba(114,114,255,.45)'
                            } : {
                                background: '#fff',
                                color: '#5559d1',
                                boxShadow: '0 5px 20px rgba(114,114,255,.12)'
                            }}>
                            {pnum}
                        </button>
                    )
                ))}
                <button
                    onClick={() => changePage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`rounded-full p-2 transition hover-float ${page === totalPages ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                    aria-label="Next page"
                    title="Next"
                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>
                    <ChevronRight className="w-4 h-4" style={{ color: '#5559d1' }} />
                </button>
                <button
                    onClick={() => changePage(totalPages)}
                    disabled={page === totalPages}
                    className={`rounded-full p-2 transition hover-float ${page === totalPages ? "opacity-40 cursor-not-allowed bg-gray-100" : "bg-white"}`}
                    aria-label="Last page"
                    title="Last"
                    style={{ boxShadow: '0 5px 20px rgba(114,114,255,.12)' }}>
                    <ChevronsRight className="w-4 h-4" style={{ color: '#5559d1' }} />
                </button>
            </div>
        </div>
    );
}
