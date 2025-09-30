import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const HOME_API_BASE_URL = process.env.NEXT_PUBLIC_HOME_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Home APIs ----------
export type HomePost = {
  _id: string;
  title: string;
  bannerImageUrl?: string;
  tags?: string[];
  author?: { _id: string; fullName?: string; name?: string; email?: string } | string;
  publishedAt?: string | null;
  createdAt?: string;
  readingTimeMinutes?: number;
};

export type HomeAuthor = {
  _id: string;
  fullName?: string;
  avatarUrl?: string;
};

// Top Tags
export type TopTag = {
  name: string;
  totalPosts?: number;
  totalViews?: number;
};

export async function getHomeOverview() {
  const url = `${HOME_API_BASE_URL}/home`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Home overview failed: ${res.status}`);
  const data = await res.json();

  const topViewed = (data.topViewedPosts || []) as HomePost[];
  const topLiked = (data.topLikedPosts || []) as HomePost[];
  const topCommented = (data.topCommentedPosts || []) as HomePost[];
  const recent = Array.isArray(data.recentPosts)
    ? (data.recentPosts as HomePost[])
    : ((data.recentPosts?.data || []) as HomePost[]);
  const authors = Array.isArray(data.topAuthors)
    ? (data.topAuthors as HomeAuthor[])
    : [];

  // Map to UI expectations
  const featuredPosts = topViewed; // use top viewed as featured
  const trendingPosts = topLiked.length ? topLiked : (topCommented.length ? topCommented : topViewed);
  const recentPosts = recent;
  type RawAuthor = { authorId?: string; _id?: string; fullName?: string; avatarUrl?: string };
  const topAuthors = (authors as RawAuthor[]).map((a) => ({ _id: a.authorId || a._id || "", fullName: a.fullName, avatarUrl: a.avatarUrl })) as HomeAuthor[];

  return { featuredPosts, trendingPosts, recentPosts, topAuthors };
}

export type ListAllPostsParams = {
  page?: number;
  limit?: number;
  sort?: "latest" | "oldest" | "random";
  category?: string | null;
};

export async function listAllHomePosts(params: ListAllPostsParams = {}) {
  const url = new URL(`${HOME_API_BASE_URL}/home/all-posts`);
  if (params.page != null) url.searchParams.set("page", String(params.page));
  if (params.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.category != null) url.searchParams.set("category", String(params.category));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Home posts failed: ${res.status}`);
  const data = await res.json();
  const list = (data.data || data.posts || data.result || []) as HomePost[];
  const meta = (data.meta || data) as Partial<{ total: number; page: number; limit: number; totalPages: number }>;
  const total = meta.total ?? list.length;
  const page = meta.page ?? (params.page ?? 1);
  const inferredLimit = params.limit ?? (list.length || 12);
  const limit = meta.limit ?? inferredLimit;
  const totalPages = meta.totalPages ?? Math.max(1, Math.ceil(total / (limit || 1)));
  return { posts: list, total, page, limit, totalPages };
}

export type TrendingCategory = { _id: string; name: string; icon?: string };

export async function listTrendingByCategory() {
  const url = `${HOME_API_BASE_URL}/home/trending-by-category`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Trending by category failed: ${res.status}`);
  const data = await res.json();
  const categories = (data.data || []) as TrendingCategory[];
  const meta = data.meta as { categoriesLimit?: number; postsPerCategory?: number } | undefined;
  return { categories, meta };
}

// New: Top trending categories (maps { category, totalViews, totalPosts })
export async function listTopTrendingCategories(limit = 9) {
  const url = new URL(`${HOME_API_BASE_URL}/home/top-trending-categories`);
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Top trending categories failed: ${res.status}`);
  const json = await res.json();
  const entries = (json.data || []) as Array<{ category: { _id: string; name: string; slug?: string }; totalViews?: number; totalPosts?: number }>;
  const categories: TrendingCategory[] = entries.map(e => ({ _id: e.category._id, name: e.category.name }));
  return { categories, meta: json.meta } as { categories: TrendingCategory[]; meta?: { limit?: number } };
}

// New: Top trending authors (maps { author, totals })
export async function listTopTrendingAuthors(limit = 5) {
  const url = new URL(`${HOME_API_BASE_URL}/home/top-trending-authors`);
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Top trending authors failed: ${res.status}`);
  const json = await res.json();
  const entries = (json.data || []) as Array<{ author: { _id: string; fullName?: string; email?: string } }>;
  const authors: HomeAuthor[] = entries.map(e => ({ _id: e.author._id, fullName: e.author.fullName }));
  return { authors, meta: json.meta } as { authors: HomeAuthor[]; meta?: { limit?: number } };
}

// New: Top Tags for homepage hero chips
export async function listTopTags(limit = 12) {
  const url = new URL(`${HOME_API_BASE_URL}/home/top-tags`);
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Top tags failed: ${res.status}`);
  const json = await res.json();
  const entries = (json.data || json.tags || []) as Array<{ name: string; totalPosts?: number; totalViews?: number }>;
  const tags: TopTag[] = entries.map(t => ({ name: t.name, totalPosts: t.totalPosts, totalViews: t.totalViews }));
  return { tags, meta: json.meta } as { tags: TopTag[]; meta?: { limit?: number } };
}

// Signup
export const signupUser = async (data: { fullName: string; email: string; password: string }) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// Login
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Forgot Password
export const forgotPasswordAPI = async (email: string) => {
  const res = await api.post("/auth/forgot", { email });
  return res.data; // { success: true, message: "Reset link sent" }
};

// Reset Password
export const resetPasswordAPI = async (token: string, password: string) => {
  const res = await api.post("/auth/reset", { token, password });
  return res.data; // { success: true, message: "Password updated" }
};


// Get current user
export const getMe = async (token: string) => {
  const response = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// create Post
export const createPost = async (
  data: FormData,
  token: string
) => {
  const res = await api.post("/admin/posts", data, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Categories
export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
};

export const listCategories = async (token: string) => {
  const res = await api.get("/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as { data?: Category[]; categories?: Category[] };
};

export const createCategory = async (
  payload: { name: string; slug: string; description?: string; image?: File | null },
  token: string
) => {
  const body = new FormData();
  body.append("name", payload.name);
  body.append("slug", payload.slug);
  body.append("description", payload.description || "");
  if (payload.image) body.append("image", payload.image);
  const res = await api.post("/categories", body, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return res.data;
};