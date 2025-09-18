export function saveAdminToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin_token", token);
}

export function getAdminToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
}

export async function createRemotePost(payload: {
    title: string;
    subtitle?: string;
    contentHtml: string;
    bannerFile?: File | null;
    images?: string;
    imageFiles?: File[];
    categoryId?: string;
    tags?: string;
    status?: "draft" | "published";
}) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin token missing. Please set it first.");

    const form = new FormData();
    form.append("title", payload.title);
    form.append("subtitle", payload.subtitle ?? "");
    form.append("contentHtml", payload.contentHtml);
    if (payload.imageFiles && payload.imageFiles.length > 0) {
        for (const f of payload.imageFiles) {
            form.append("images", f);
        }
    } else {
        form.append("images", payload.images ?? "");
    }
    form.append("categoryId", payload.categoryId ?? "");
    form.append("tags", payload.tags ?? "");
    form.append("status", payload.status ?? "published");
    if (payload.bannerFile) {
        form.append("bannerImage", payload.bannerFile);
    }

    const res = await fetch("https://api.blogcafeai.com/api/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create post: ${res.status} ${text}`);
    }
    return res.json();
}

export type RemoteCategory = {
    _id: string;
    name: string;
    logo?: string;
};

export async function fetchCategories(tokenOverride?: string): Promise<RemoteCategory[]> {
    const token = tokenOverride ?? getAdminToken();
    if (!token) throw new Error("Admin token missing. Please set it first.");
    const res = await fetch("https://api.blogcafeai.com/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load categories: ${res.status} ${text}`);
    }
    const data: unknown = await res.json();
    // Flexible shapes: array | {data: array} | {categories: array} | {result: array}
    if (Array.isArray(data)) return data as RemoteCategory[];
    if (typeof data === "object" && data !== null) {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as RemoteCategory[];
        if (Array.isArray(obj.categories)) return obj.categories as RemoteCategory[];
        if (Array.isArray(obj.result)) return obj.result as RemoteCategory[];
    }
    return [];
}


