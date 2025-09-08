import { NextResponse } from "next/server";
import { getPostById } from "@/lib/mockData";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    const post = getPostById(params.id);
    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
}


