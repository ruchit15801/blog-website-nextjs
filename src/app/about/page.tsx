export default function AboutPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">About MustBlog</h1>
            <p className="opacity-80 mb-4">
                MustBlog is a modern blog UI built with Next.js. It blends a premium palette with subtle motion for a delightful reading experience.
            </p>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
                <h2 className="text-xl font-semibold mb-2">Design Principles</h2>
                <ul className="list-disc pl-5 space-y-1 opacity-90">
                    <li>Muted Blue for trust, Teal for freshness, Amber for action.</li>
                    <li>Subtle animations: float, shimmer, soft shadows.</li>
                    <li>Focus on readability and calm visual hierarchy.</li>
                </ul>
            </div>
        </div>
    );
}


