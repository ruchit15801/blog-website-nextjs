import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com";
    const body = `User-agent: *
Allow: /
Disallow: /DashBoard/
Disallow: /api/
Disallow: /admin/

Sitemap: ${site}/sitemap.xml
`;
    return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
}


