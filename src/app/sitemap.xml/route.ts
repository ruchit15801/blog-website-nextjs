import { NextResponse } from "next/server";

function xml(items: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export async function GET() {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
    // Minimal set; dynamic posts can be appended here if you have an endpoint
    const urls = [
        `/`, `/about`, `/contact`, `/blog`, `/all-posts`, `/privacy-policy`, `/cookie-policy`, `/disclaimer`
    ];
    const body = xml(urls.map(u => `  <url><loc>${site}${u}</loc></url>`).join("\n"));
    return new NextResponse(body, { headers: { "Content-Type": "application/xml" } });
}


