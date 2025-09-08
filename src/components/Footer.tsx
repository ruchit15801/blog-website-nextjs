export default function Footer() {
    return (
        <footer className="mt-20 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm opacity-80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>
                    © {new Date().getFullYear()} MustBlog. Built with Next.js.
                </p>
                <p>
                    <a href="#" className="hover:underline" style={{ color: "var(--brand-muted-blue)" }}>Privacy</a>
                    <span className="mx-2">•</span>
                    <a href="#" className="hover:underline" style={{ color: "var(--brand-teal)" }}>Terms</a>
                </p>
            </div>
        </footer>
    );
}


