import { NextResponse } from "next/server";

export async function GET() {
    // This endpoint should connect to your real database
    // For now, return empty array until real content is available
    return NextResponse.json({
        posts: [],
        message: "No posts available yet. Content will be loaded from the database."
    });
}


