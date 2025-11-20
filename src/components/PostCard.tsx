import Link from "next/link";

export type Post = {
    id: string;
    title: string;
    excerpt: string;
    cover: string;
    tags: string[];
    date: string;
    readMinutes: number;
};

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className="rounded-2xl border border-white/10 overflow-hidden card-hover shine" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
            <Link href={`/blog/${post.id}`} className="block">
                <div className="aspect-[16/9] relative" style={{ background: `linear-gradient(180deg, color-mix(in oklab, var(--brand-muted-blue), transparent 70%), transparent)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover} alt="cover" className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-80" />
                </div>
                <div className="p-5 space-y-3">
                    <div className="text-xs flex items-center gap-2 text-muted">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.readMinutes} min read</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {post.tags.map((tag) => (
                            <span key={tag} className="badge">{tag}</span>
                        ))}
                    </div>
                </div>
            </Link>
        </article>
    );
}
