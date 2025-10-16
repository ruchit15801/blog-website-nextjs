/*
  Node sitemap generator: builds public/sitemap.xml for Search Console uploads.
  Uses NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_HOME_API_URL to fetch dynamic posts.
*/

const fs = require("fs");
const path = require("path");

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
const HOME_API_BASE_URL = process.env.NEXT_PUBLIC_HOME_API_URL || "http://localhost:4000/api";

function xml(items) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

function urlNode({ loc, lastmod, changefreq, priority }) {
    const lines = [
        `  <loc>${loc}</loc>`,
        lastmod ? `  <lastmod>${lastmod}</lastmod>` : "",
        changefreq ? `  <changefreq>${changefreq}</changefreq>` : "",
        typeof priority === "number" ? `  <priority>${priority.toFixed(1)}</priority>` : "",
    ].filter(Boolean).join("\n");
    return `<url>\n${lines}\n</url>`;
}

async function fetchAllPosts() {
    const acc = [];
    let page = 1;
    const limit = 100;
    for (let i = 0; i < 20; i++) {
        const u = new URL(`${HOME_API_BASE_URL}/home/all-posts`);
        u.searchParams.set("page", String(page));
        u.searchParams.set("limit", String(limit));
        const res = await fetch(u.toString()).catch(() => null);
        if (!res || !res.ok) break;
        const data = await res.json();
        const posts = (data?.data || data?.posts || data?.result || []);
        if (!Array.isArray(posts) || posts.length === 0) break;
        acc.push(...posts);
        const meta = data?.meta || data?.pagination || data;
        const totalPages = Number(meta?.totalPages || meta?.pages || 1);
        const hasNext = meta?.hasNextPage != null ? Boolean(meta.hasNextPage) : (page < totalPages);
        if (!hasNext) break;
        page += 1;
    }
    return acc;
}

function slugifyTitle(title) {
    const base = String(title || "").toLowerCase();
    return base
        .normalize("NFKD")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 90);
}

function buildSlugPath(id, title) {
    const safeId = String(id || "");
    const slug = slugifyTitle(title || "article");
    return `${slug}-${safeId}`;
}

function collectStaticRoutes() {
    const appDir = path.join(process.cwd(), "src", "app");
    const results = new Set(["/"]); // root
    const skipDirs = new Set(["api", "DashBoard", "rss.xml", "sitemap.xml", "robots.txt"]);

    function walk(dir, rel = "") {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
            if (e.isDirectory()) {
                if (skipDirs.has(e.name)) continue;
                if (e.name.startsWith("_")) continue; // private
                if (e.name.includes("[")) continue; // dynamic segments
                const nextRel = path.posix.join(rel, e.name);
                const nextAbs = path.join(dir, e.name);
                const pageTsx = path.join(nextAbs, "page.tsx");
                const pageJsx = path.join(nextAbs, "page.jsx");
                const pageTs = path.join(nextAbs, "page.ts");
                const pageJs = path.join(nextAbs, "page.js");
                if (fs.existsSync(pageTsx) || fs.existsSync(pageJsx) || fs.existsSync(pageTs) || fs.existsSync(pageJs)) {
                    results.add("/" + nextRel.replace(/\\/g, "/"));
                }
                walk(nextAbs, nextRel);
            }
        }
    }

    if (fs.existsSync(appDir)) walk(appDir, "");
    return Array.from(results);
}

async function main() {
    const nowIso = new Date().toISOString();
    const staticPaths = collectStaticRoutes();
    const staticItems = staticPaths.map(p => urlNode({ loc: `${SITE}${p}`, lastmod: nowIso, changefreq: p === "/" ? "daily" : undefined, priority: p === "/" ? 1.0 : undefined }));

    let dynamicItems = [];
    try {
        const posts = await fetchAllPosts();
        const articleItems = posts.map(p => {
            const slug = buildSlugPath(p._id || p.id, p.title);
            const last = p.publishedAt || p.createdAt;
            return urlNode({ loc: `${SITE}/articles/${slug}`, lastmod: last ? new Date(last).toISOString() : undefined, changefreq: "weekly", priority: 0.7 });
        });
        const blogItems = posts.map(p => urlNode({ loc: `${SITE}/blog/${p._id || p.id}`, changefreq: "weekly", priority: 0.5 }));
        dynamicItems = [...articleItems, ...blogItems];
    } catch (_) {
        // fallback: no dynamic URLs
    }

    const body = xml([...staticItems, ...dynamicItems].join("\n"));
    const outDir = path.join(process.cwd(), "public");
    const outFile = path.join(outDir, "sitemap.xml");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, body, "utf8");
    // eslint-disable-next-line no-console
    console.log(`Wrote sitemap: ${outFile}`);
}

// Node 18+ has global fetch
if (typeof fetch !== "function") {
    // eslint-disable-next-line global-require
    global.fetch = require("node-fetch");
}

main().catch(err => {
    // eslint-disable-next-line no-console
    console.error("Sitemap generation failed:", err);
    process.exit(1);
});


