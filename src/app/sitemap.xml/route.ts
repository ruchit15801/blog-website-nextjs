import { NextResponse } from "next/server";
import { listAllHomePosts } from "@/lib/api";
import { buildSlugPath } from "@/lib/slug";
import fs from "fs";
import path from "path";

function xml(items: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";

  // Auto-discover static routes (exclude admin/api/dynamic)
  const collectStaticRoutes = (): string[] => {
    const appDir = path.join(process.cwd(), "src", "app");
    const results = new Set<string>(["/"]);
    const skip = new Set(["api", "DashBoard", "rss.xml", "sitemap.xml", "robots.txt"]);
    const walk = (abs: string, rel: string) => {
      const entries = fs.readdirSync(abs, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        if (skip.has(e.name)) continue;
        if (e.name.startsWith("_")) continue;
        if (e.name.includes("[")) continue;
        const nextRel = path.posix.join(rel, e.name);
        const nextAbs = path.join(abs, e.name);
        const hasPage = ["page.tsx", "page.jsx", "page.ts", "page.js"].some(f => fs.existsSync(path.join(nextAbs, f)));
        if (hasPage) results.add("/" + nextRel.replace(/\\/g, "/"));
        walk(nextAbs, nextRel);
      }
    };
    if (fs.existsSync(appDir)) walk(appDir, "");
    return Array.from(results);
  };
  const staticPaths = collectStaticRoutes();

  // Dynamic article routes (paginate for full coverage)
  type PostLite = { _id: string; title?: string; publishedAt?: string | null; createdAt?: string };
  const dynamicEntries: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>
    = [];
  try {
    let page = 1;
    const limit = 100;
    // listAllHomePosts returns hasNextPage in our wrapper
    // Fetch up to 20 pages defensively to avoid infinite loops
    // and stop when hasNextPage is false
    for (let i = 0; i < 20; i++) {
      const res = await listAllHomePosts({ page, limit, sort: "latest" });
      const posts = (res.posts as PostLite[]) || [];
      for (const p of posts) {
        const slug = buildSlugPath(p._id, p.title);
        const last = p.publishedAt || p.createdAt;
        dynamicEntries.push({
          loc: `${site}/articles/${slug}`,
          lastmod: last ? new Date(last).toISOString() : undefined,
          changefreq: "weekly",
          priority: 0.7,
        });
      }
      if (!(res as unknown as { hasNextPage?: boolean }).hasNextPage) break;
      page += 1;
    }
  } catch {
    // ignore, keep dynamicEntries empty
  }

  const staticItems = staticPaths.map(p => {
    const changefreq = p === "/" ? "daily" : undefined;
    const priority = p === "/" ? 1.0 : undefined;
    const parts = [
      `  <loc>${site}${p}</loc>`,
      changefreq ? `  <changefreq>${changefreq}</changefreq>` : "",
      priority != null ? `  <priority>${priority.toFixed(1)}</priority>` : "",
    ].filter(Boolean).join("\n");
    return `<url>\n${parts}\n</url>`;
  });

  const dynamicItems = dynamicEntries.map(d => {
    const parts = [
      `  <loc>${d.loc}</loc>`,
      d.lastmod ? `  <lastmod>${d.lastmod}</lastmod>` : "",
      d.changefreq ? `  <changefreq>${d.changefreq}</changefreq>` : "",
      d.priority != null ? `  <priority>${d.priority.toFixed(1)}</priority>` : "",
    ].filter(Boolean).join("\n");
    return `<url>\n${parts}\n</url>`;
  });

  // Also include /blog/<id> endpoints if posts exist
  const blogItems = dynamicEntries.map(d => {
    const blogLoc = d.loc.replace("/articles/", "/blog/").replace(/-.+$/, (m) => {
      // keep id-only variant if present at end
      const lastDash = m.lastIndexOf("-");
      return m.slice(lastDash);
    });
    const parts = [
      `  <loc>${blogLoc}</loc>`,
      d.lastmod ? `  <lastmod>${d.lastmod}</lastmod>` : "",
      `  <changefreq>weekly</changefreq>`,
      `  <priority>0.5</priority>`,
    ].filter(Boolean).join("\n");
    return `<url>\n${parts}\n</url>`;
  });

  const body = xml([...staticItems, ...dynamicItems, ...blogItems].join("\n"));
  return new NextResponse(body, { headers: { "Content-Type": "application/xml" } });
}


