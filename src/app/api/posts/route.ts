import { NextResponse } from "next/server";
import { mockPosts } from "@/lib/mockData";

export async function GET() {
    return NextResponse.json({ posts: mockPosts });
}


