import { NextResponse } from "next/server";
import { fetchAllUserPosts } from "@/lib/api";

function rss({ title, site, items }: { title: string; site: string; items: { title: string; link: string; description?: string }[] }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${site}</link>
    <description>${title}</description>
    ${items.map(i => `<item><title>${i.title}</title><link>${i.link}</link>${i.description ? `<description>${i.description}</description>` : ''}</item>`).join('')}
  </channel>
</rss>`;
}

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
  let items: { title: string; link: string; description?: string }[] = [];
  try {
    const res = await fetchAllUserPosts({ page: 1, limit: 50 });
    const posts = (res?.data || res?.posts || res?.result || []) as Array<{ _id?: string; id?: string; title?: string; contentHtml?: string; subtitle?: string } & Record<string, unknown>>;
    items = posts.map(p => ({
      title: p.title || "Post",
      link: `${site}/articles/${(p._id || (p as any).id)}`,
      description: (p.subtitle as string) || (p.contentHtml ? String(p.contentHtml).replace(/<[^>]*>/g, ' ').slice(0, 180) : undefined)
    }));
  } catch {
    items = [{ title: "Welcome to BlogCafeAI", link: `${site}/` }];
  }
  const body = rss({ title: "BlogCafeAI Feed", site, items });
  return new NextResponse(body, { headers: { "Content-Type": "application/rss+xml" } });
}


