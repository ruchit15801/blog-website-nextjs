import { NextResponse, NextRequest } from "next/server";
import { getPostById } from "@/lib/mockData";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const post = getPostById(id);
    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
}



