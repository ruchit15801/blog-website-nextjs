import { NextResponse, NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;

    // This endpoint should connect to your real database
    // For now, return 404 since we removed mock data
    return NextResponse.json({
        error: "Post not found",
        message: "This endpoint will connect to the database when real content is available."
    }, { status: 404 });
}



