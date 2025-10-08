import toast from "react-hot-toast";

export function saveAdminToken(token: string) {
    if (typeof window === "undefined") return;
    // keep admin token separate from user token to avoid cross-session leakage
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
    tags?: string | string[];
    status?: "published" | "scheduled";
}) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin token missing. Please set it first.");

    const form = new FormData();
    form.append("title", payload.title);
    form.append("subtitle", payload.subtitle ?? "");
    form.append("contentHtml", payload.contentHtml);
    // tags supports array per API
    if (Array.isArray(payload.tags)) {
        for (const t of payload.tags) form.append("tags", t);
    } else if (payload.tags) {
        // comma string -> split into items
        const parts = payload.tags.split(",").map(s => s.trim()).filter(Boolean);
        if (parts.length) {
            for (const t of parts) form.append("tags", t);
        } else {
            form.append("tags", payload.tags);
        }
    } else {
        form.append("tags", "");
    }
    if (payload.imageFiles && payload.imageFiles.length > 0) {
        for (const f of payload.imageFiles) {
            form.append("images", f);
        }
    } else {
        form.append("images", payload.images ?? "");
    }
    form.append("categoryId", payload.categoryId ?? "");
    form.append("status", payload.status ?? "published");
    if (payload.bannerFile) {
        form.append("bannerImage", payload.bannerFile);
    }

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create post: ${res.status} ${text}`);
    }
    return res.json();
}

export async function createScheduledPost(payload: {
    title: string;
    subtitle?: string;
    contentHtml: string;
    publishedAt: string; // ISO datetime
    bannerFile?: File | null;
    images?: string;
    imageFiles?: File[];
    categoryId?: string;
    tags?: string | string[];
    status?: "scheduled";
}) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin token missing. Please set it first.");

    const form = new FormData();
    form.append("title", payload.title);
    form.append("subtitle", payload.subtitle ?? "");
    form.append("contentHtml", payload.contentHtml);
    form.append("publishedAt", payload.publishedAt);
    // tags supports array per API
    if (Array.isArray(payload.tags)) {
        for (const t of payload.tags) form.append("tags", t);
    } else if (payload.tags) {
        const parts = payload.tags.split(",").map(s => s.trim()).filter(Boolean);
        if (parts.length) { for (const t of parts) form.append("tags", t); } else { form.append("tags", payload.tags); }
    } else {
        form.append("tags", "");
    }
    if (payload.imageFiles && payload.imageFiles.length > 0) {
        for (const f of payload.imageFiles) form.append("images", f);
    } else {
        form.append("images", payload.images ?? "");
    }
    form.append("categoryId", payload.categoryId ?? "");
    form.append("status", payload.status ?? "scheduled");
    if (payload.bannerFile) form.append("bannerImage", payload.bannerFile);

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/posts/scheduled`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create scheduled post: ${res.status} ${text}`);
    }
    return res.json();
}

export async function publishAdminPostNow(
    postId: string,
    tokenOverride?: string
): Promise<RemotePost> {
    // 🔑 Token fetch
    const token =
        tokenOverride ??
        getAdminToken() ??
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/posts/${postId}/publish`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to publish post: ${res.status} ${text}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(`Failed to publish post: ${JSON.stringify(data.error)}`);

    return data.post as RemotePost;
}

// CATEGORIES 
export type RemoteCategory = {
    _id: string;
    name: string;
    logo?: string;
};

export async function fetchCategories(tokenOverride?: string): Promise<RemoteCategory[]> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please set it first.");
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/categories`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load categories: ${res.status} ${text}`);
    }
    const data: unknown = await res.json();
    console.log('data', data)
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

export async function updateCategory(id: string, payload: { name?: string; description?: string; imageFile?: File }) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const form = new FormData();
    if (payload.name) form.append("name", payload.name);
    if (payload.description) form.append("description", payload.description);
    if (payload.imageFile) form.append("image", payload.imageFile);

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/categories/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update category: ${res.status} ${text}`);
    }

    return res.json();
}

export async function deleteCategory(id: string) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete category: ${res.status} ${text}`);
    }

    return res.json();
}

// USER
export type RemoteUser = {
    _id: string;
    fullName?: string;
    name?: string;
    email: string;
    avatarUrl?: string;
    avatar?: string;
    totalPosts?: number;
    scheduledPosts?: number;
    role?: string;
};

export type PaginatedUsers = {
    users: RemoteUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export async function fetchAdminUsers(
    params: { page?: number; limit?: number; q?: string },
    tokenOverride?: string
): Promise<PaginatedUsers> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = new URL(`${base}/admin/users`);
    if (params.page != null) url.searchParams.set("page", String(params.page));
    if (params.limit != null) url.searchParams.set("limit", String(params.limit));
    if (params.q != null && params.q !== "") url.searchParams.set("q", params.q);

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load users: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();
    // Accept flexible shapes
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const list = ((obj.data as unknown) ?? (obj.users as unknown)) ?? (obj.result as unknown);
        const meta = (obj.meta as Record<string, unknown>) || (obj as Record<string, unknown>);
        const users = Array.isArray(list) ? (list as RemoteUser[]) : [];
        const total = (meta.total as number) ?? (obj.total as number) ?? users.length;
        const page = (meta.page as number) ?? (obj.page as number) ?? (params.page ?? 1);
        const inferredLimit = params.limit ?? (users.length || 10);
        const limit = (meta.limit as number) ?? (obj.limit as number) ?? inferredLimit;
        const totalPages = (meta.totalPages as number) ?? (obj.totalPages as number) ?? Math.max(1, Math.ceil(total / (limit || 1)));
        return { users, total, page, limit, totalPages };
    }

    return { users: [], total: 0, page: params.page ?? 1, limit: params.limit ?? 10, totalPages: 1 };
}
export async function updateAdminUser(
    userId: string,
    input: Partial<RemoteUser>,
    tokenOverride?: string
): Promise<RemoteUser> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update user: ${res.status} ${text}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(`Failed to update user: ${JSON.stringify(data.error)}`);

    return data.user as RemoteUser;
}
export async function deleteAdminUser(
    userId: string,
    tokenOverride?: string
): Promise<void> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete user: ${res.status} ${text}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(`Failed to delete user: ${JSON.stringify(data.error)}`);
}

// SCHEDULE POST 

export type RemotePost = {
    _id: string;
    title: string;
    author?: { _id: string; fullName?: string; email?: string } | string;
    subtitle?: string;
    contentHtml: string;
    categoryId?: string;
    category?: { _id: string; name: string };
    userId?: string;
    status?: string;
    publishedAt?: string | null;
    createdAt?: string;
    imageUrls?: string;
    // Optional fields seen in UI usage
    bannerImageUrl?: string;
    tags?: string[];
    readingTimeMinutes?: number;
};

export type PaginatedPosts = {
    posts: RemotePost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export async function fetchAdminPosts(
    params: { page?: number; limit?: number; q?: string; userid?: string },
    tokenOverride?: string
): Promise<PaginatedPosts> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = new URL(`${base}/admin/posts`);
    if (params.page != null) url.searchParams.set("page", String(params.page));
    if (params.limit != null) url.searchParams.set("limit", String(params.limit));
    if (params.q) url.searchParams.set("q", params.q);
    if (params.userid) url.searchParams.set("userId", params.userid);

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load posts: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const list = ((obj.data as unknown) ?? (obj.posts as unknown)) ?? (obj.result as unknown);
        const meta = (obj.meta as Record<string, unknown>) || (obj as Record<string, unknown>);
        const posts = Array.isArray(list) ? (list as RemotePost[]) : [];
        const total = (meta.total as number) ?? (obj.total as number) ?? posts.length;
        const page = (meta.page as number) ?? (obj.page as number) ?? (params.page ?? 1);
        const inferredLimit = params.limit ?? (posts.length || 10);
        const limit = (meta.limit as number) ?? (obj.limit as number) ?? inferredLimit;
        const totalPages = (meta.totalPages as number) ?? (obj.totalPages as number) ?? Math.max(1, Math.ceil(total / (limit || 1)));
        return { posts, total, page, limit, totalPages };
    }

    return { posts: [], total: 0, page: params.page ?? 1, limit: params.limit ?? 10, totalPages: 1 };
}

// --- Admin: Update Post ---
interface AdminUpdateResponse {
    success: boolean;
    post: RemotePost;
}

export async function adminUpdatePostById(
    postId: string,
    body: Partial<Omit<RemotePost, "_id" | "createdAt" | "updatedAt">>,
    tokenOverride?: string
): Promise<RemotePost> {
    const token = tokenOverride ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update post: ${res.status} ${text}`);
    }

    const data: AdminUpdateResponse = await res.json();
    return data.post;
}

// --- Admin: Delete Post ---
interface AdminDeleteResponse {
    success: boolean;
}

export async function adminDeletePostById(postId: string, tokenOverride?: string): Promise<boolean> {
    const token = tokenOverride ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete post: ${res.status} ${text}`);
    }

    const data: AdminDeleteResponse = await res.json();
    return data.success;
}

export async function fetchAdminScheduledPosts(
    params: { page?: number; limit?: number; q?: string; userId?: string },
    tokenOverride?: string
): Promise<PaginatedPosts> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = new URL(`${base}/admin/posts/scheduled`);
    if (params.page != null) url.searchParams.set("page", String(params.page));
    if (params.limit != null) url.searchParams.set("limit", String(params.limit));
    if (params.q) url.searchParams.set("q", params.q);
    if (params.userId) url.searchParams.set("userId", params.userId);

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load scheduled posts: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const list = ((obj.data as unknown) ?? (obj.posts as unknown)) ?? (obj.result as unknown);
        const meta = (obj.meta as Record<string, unknown>) || (obj as Record<string, unknown>);
        const posts = Array.isArray(list) ? (list as RemotePost[]) : [];
        const total = (meta.total as number) ?? (obj.total as number) ?? posts.length;
        const page = (meta.page as number) ?? (obj.page as number) ?? (params.page ?? 1);
        const inferredLimit = params.limit ?? (posts.length || 10);
        const limit = (meta.limit as number) ?? (obj.limit as number) ?? inferredLimit;
        const totalPages = (meta.totalPages as number) ?? (obj.totalPages as number) ?? Math.max(1, Math.ceil(total / (limit || 1)));
        return { posts, total, page, limit, totalPages };
    }

    return { posts: [], total: 0, page: params.page ?? 1, limit: params.limit ?? 10, totalPages: 1 };
}

export type AdminMeProfile = {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    avatarUrl?: string;
    role?: string;
    createdAt?: string;
    city?: string;
    pincode?: string;
    phone?: string;
    skills?: string;
    bio?: string;
};

export async function fetchAdminMeProfile(tokenOverride?: string): Promise<AdminMeProfile> {
    const token = tokenOverride ?? getAdminToken() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) throw new Error("Admin token missing. Please login.");
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/me/profile`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load profile: ${res.status} ${text}`);
    }
    const data: unknown = await res.json();
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        return (obj.user as AdminMeProfile) || (obj.data as AdminMeProfile) || (data as AdminMeProfile);
    }
    throw new Error("Invalid profile response");
}

export type UpdateAdminProfilePayload = {
    fullName?: string;
    avatar?: File;
    socialLinks?: { twitter?: string; facebook?: string; instagram?: string; linkedin?: string };
    twitterUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
};

export async function updateAdminProfileAPI(payload: UpdateAdminProfilePayload, token?: string) {
    const _token = token ?? getAdminToken();
    if (!_token) throw new Error("Admin token missing. Please login as admin.");

    const formData = new FormData();
    if (payload.fullName) formData.append("fullName", payload.fullName);
    if (payload.avatar) formData.append("avatar", payload.avatar);
    // Map UI social links to API fields
    const fromObj = payload.socialLinks || {};
    const twitterUrl = payload.twitterUrl ?? fromObj.twitter;
    const facebookUrl = payload.facebookUrl ?? fromObj.facebook;
    const instagramUrl = payload.instagramUrl ?? fromObj.instagram;
    const linkedinUrl = payload.linkedinUrl ?? fromObj.linkedin;
    if (twitterUrl) formData.append("twitterUrl", twitterUrl);
    if (facebookUrl) formData.append("facebookUrl", facebookUrl);
    if (instagramUrl) formData.append("instagramUrl", instagramUrl);
    if (linkedinUrl) formData.append("linkedinUrl", linkedinUrl);

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/me/profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${_token}` },
        body: formData,
    });

    if (!res.ok) throw new Error(`Failed to update profile: ${res.status}`);
    return res.json();
}

export async function fetchPostById(id: string, token: string) {
    try {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/admin/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            const msg = errorData?.error?.message || "Failed to fetch post";
            toast.error(msg); // toast me show
            throw new Error(msg);
        }

        const data = await res.json();
        toast.success("Post loaded successfully!");
        return data;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(msg);
        throw err;
    }
}

// Frontend
export async function fetchSinglePostById(id: string) {
    // Try primary public API first
    const prim = process.env.NEXT_PUBLIC_API_URL || "";
    const alt = process.env.NEXT_PUBLIC_HOME_API_URL || "";

    // Helper to fetch and parse
    const hit = async (base: string) => {
        if (!base) throw new Error("Missing API base URL");
        const url = `${base}/posts/${id}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch post ${res.status}`);
        return res.json();
    };

    try {
        return await hit(prim);
    } catch (_) {
        if (alt && alt !== prim) {
            return await hit(alt);
        }
        throw _;
    }
}



// Dashboaed 
export type AdminDashboardData = {
    myPosts: number;
    users: number;
    scheduledPosts: number;
    categories: number;
    posts: number;
    publishedPosts: number;
};

export async function fetchAdminDashboard(tokenOverride?: string): Promise<AdminDashboardData> {
    const token =
        tokenOverride ??
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) throw new Error("Admin token missing. Please login as admin.");

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch dashboard: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();

    // Flexible parsing
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const dashboard = obj.data as AdminDashboardData;
        if (dashboard) return dashboard;
    }

    throw new Error("Invalid dashboard response");
}
