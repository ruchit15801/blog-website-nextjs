import { NextResponse } from "next/server";
import { listAllHomePosts } from "@/lib/api";

function xml(items: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
  const staticUrls = [`/`, `/about`, `/contact`, `/blog`, `/all-posts`, `/privacy-policy`, `/cookie-policy`, `/disclaimer`];
  let postUrls: string[] = [];
  try {
    const res = await listAllHomePosts({ page: 1, limit: 200, sort: "latest" });
    const items = res.posts as Array<{ _id: string }>;
    postUrls = items.map(p => `/articles/${p._id}`).filter(Boolean);
  } catch {
    postUrls = [];
  }
  const urls = [...staticUrls, ...postUrls];
  const body = xml(urls.map(u => `  <url><loc>${site}${u}</loc></url>`).join("\n"));
  return new NextResponse(body, { headers: { "Content-Type": "application/xml" } });
}


