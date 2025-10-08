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

export async function getHomeOverview(page: number = 1, limit: number = 12) {
  const url = new URL(`${HOME_API_BASE_URL}/home`);
  if (page) url.searchParams.set("page", String(page));
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Home overview failed: ${res.status}`);
  const data = await res.json();

  const topViewed = (data.topViewedPosts || []) as HomePost[];
  const topLiked = (data.topLikedPosts || []) as HomePost[];
  const topCommented = (data.topCommentedPosts || []) as HomePost[];
  const recentData = Array.isArray(data.recentPosts)
    ? { data: (data.recentPosts as HomePost[]), pagination: undefined }
    : { data: ((data.recentPosts?.data || []) as HomePost[]), pagination: data.recentPosts?.pagination };
  const authors = Array.isArray(data.topAuthors)
    ? (data.topAuthors as HomeAuthor[])
    : [];

  // Map to UI expectations
  const featuredPosts = topViewed; // use top viewed as featured
  const trendingPosts = topLiked.length ? topLiked : (topCommented.length ? topCommented : topViewed);
  const recentPosts = recentData.data;
  const recentPagination = recentData.pagination as undefined | { total: number; page: number; limit: number; totalPages: number };
  type RawAuthor = { authorId?: string; _id?: string; fullName?: string; avatarUrl?: string };
  const topAuthors = (authors as RawAuthor[]).map((a) => ({ _id: a.authorId || a._id || "", fullName: a.fullName, avatarUrl: a.avatarUrl })) as HomeAuthor[];

  return { featuredPosts, trendingPosts, recentPosts, topAuthors, recentPagination };
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

export type TrendingCategory = { _id: string; name: string; icon?: string; imageUrl?: string };

export async function listTrendingByCategory() {
  const url = `${HOME_API_BASE_URL}/home/trending-by-category`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Trending by category failed: ${res.status}`);
  const json = await res.json();
  type ApiEntry = { category?: { _id?: string; name?: string; imageUrl?: string } };
  const categories: TrendingCategory[] = ((json.data || []) as ApiEntry[])
    .map((e) => ({ _id: e.category?._id || "", name: e.category?.name || "", imageUrl: e.category?.imageUrl }))
    .filter((c) => c._id && c.name);
  const meta = json.meta as { categoriesLimit?: number; postsPerCategory?: number } | undefined;
  return { categories, meta };
}

// New: Top trending categories (maps { category, totalViews, totalPosts })
export async function listTopTrendingCategories(limit = 9) {
  const build = (base: string) => {
    const u = new URL(`${base}/home/top-trending-categories`);
    if (limit) u.searchParams.set("limit", String(limit));
    return u;
  };
  const primary = build(HOME_API_BASE_URL);
  const fallback = build("http://localhost:3000/api");
  let res = await fetch(primary.toString(), { cache: "no-store" }).catch(() => undefined);
  if (!res || !res.ok) res = await fetch(fallback.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Top trending categories failed: ${res.status}`);
  const json = await res.json();
  const entries = (json.data || []) as Array<{ category: { _id: string; name: string; slug?: string }; totalViews?: number; totalPosts?: number }>;
  const categories: TrendingCategory[] = entries.map(e => ({ _id: e.category._id, name: e.category.name }));
  return { categories, meta: json.meta } as { categories: TrendingCategory[]; meta?: { limit?: number } };
}

// New: Top trending authors (maps { author, totals })
export async function listTopTrendingAuthors(limit = 5) {
  const build = (base: string) => {
    const u = new URL(`${base}/home/top-trending-authors`);
    if (limit) u.searchParams.set("limit", String(limit));
    return u;
  };
  const primary = build(HOME_API_BASE_URL);
  const fallback = build("http://localhost:3000/api");
  let res = await fetch(primary.toString(), { cache: "no-store" }).catch(() => undefined);
  if (!res || !res.ok) res = await fetch(fallback.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Top trending authors failed: ${res.status}`);
  const json = await res.json();
  const entries = (json.data || []) as Array<{ author: { _id: string; fullName?: string; email?: string; avatarUrl?: string } }>;
  const authors: HomeAuthor[] = entries.map(e => ({ _id: e.author._id, fullName: e.author.fullName, avatarUrl: e.author.avatarUrl }));
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

// ---------- Password Reset / OTP APIs ----------
export const forgotPasswordAPI = async (email: string) => {
  const res = await api.post("/auth/otp/forgot", { email });
  return res.data;
};

export const resendOtpAPI = async (email: string) => {
  const res = await api.post("/auth/otp/resend", { email });
  return res.data;
};

export const verifyOtpAPI = async (email: string, otp: string) => {
  const res = await api.post("/auth/otp/verify", { email, otp });
  return res.data;
};

export const changePasswordAPI = async (email: string, otp: string, newPassword: string) => {
  const res = await api.post("/auth/otp/change", { email, otp, newPassword });
  return res.data;
};

export const resetPasswordAPI = async (email: string, otp: string, newPassword: string) => {
  const res = await api.post("/auth/reset", { email, otp, newPassword });
  return res.data;
};

// src/lib/types.ts
export type UserPost = {
  _id: string;
  id: string; // for compatibility
  title: string;
  slug: string;
  summary?: string;
  bannerImageUrl?: string;
  author?: { _id: string; fullName?: string } | string;
  category?: { _id: string; name?: string; slug?: string } | string;
  publishedAt?: string;
  tags?: string[];
  createdAt?: string;
  readingTimeMinutes?: number;
  contentHtml?: string;
};

export type PaginatedPosts = {
  success: boolean;
  data: UserPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

// export async function fetchAllUserPosts(params: {
//     page?: number;
//     limit?: number;
//     category?: string;
//     tag?: string;
//     search?: string;
//     sort?: 'latest' | 'trending' | 'featured';
//     authorId?: string;
// }) {
//     const base = process.env.NEXT_PUBLIC_API_URL || '';
//     const url = new URL(`${base}/posts`);

//     Object.entries(params).forEach(([key, value]) => {
//         if (value) url.searchParams.set(key, String(value));
//     });

//     const res = await fetch(url.toString());
//     if (!res.ok) throw new Error('Failed to fetch posts');
//     return res.json();
// }

export async function fetchAllUserPosts(params: {
  page?: number;
  limit?: number;
  token: string;
  category?: string;
  tag?: string;
  search?: string;
  authorId: string;
  sort?: 'latest' | 'trending' | 'featured';
}) {
  const { token, ...rest } = params;
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = new URL(`${base}/posts`);

  Object.entries(rest).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("user api res is :- ", res);

  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}


// Get a single post by slug
export const fetchPostBySlug = async (slug: string, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  return res.json();
};

// Create a new post
export const createPost = async (
  data: {
    title: string;
    subtitle?: string;
    contentHtml: string;
    categoryId?: string;
    tags?: string[];
    status?: string;
    publishedAt?: string;
    bannerImage?: File | null;
    images?: File[];
  },
  token: string
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.subtitle) formData.append("subtitle", data.subtitle);
  formData.append("contentHtml", data.contentHtml);
  if (data.categoryId) formData.append("categoryId", data.categoryId);
  if (data.status) formData.append("status", data.status);
  if (data.publishedAt) formData.append("publishedAt", data.publishedAt);
  if (data.tags && data.tags.length > 0)
    data.tags.forEach((tag) => formData.append("tags", tag));
  if (data.bannerImage) formData.append("bannerImage", data.bannerImage);
  if (data.images && data.images.length > 0)
    data.images.forEach((img) => formData.append("images", img));

  const res = await api.post("/posts", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

type PostUpdateInput = {
  title?: string;
  subtitle?: string;
  contentHtml?: string;
  categoryId?: string;
  tags?: string[];
  status?: string;
  publishedAt?: string;
  bannerImage?: File | null;
  images?: File[];
};

// Update a post
export const updatePost = async (
  id: string,
  data: PostUpdateInput,
  token: string
) => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.subtitle) formData.append("subtitle", data.subtitle);
  if (data.contentHtml) formData.append("contentHtml", data.contentHtml);
  if (data.categoryId) formData.append("categoryId", data.categoryId);
  if (data.status) formData.append("status", data.status);
  if (data.publishedAt) formData.append("publishedAt", data.publishedAt);
  if (data.tags && data.tags.length > 0)
    data.tags.forEach((t) => formData.append("tags", t));
  if (data.bannerImage) formData.append("bannerImage", data.bannerImage);
  if (data.images && data.images.length > 0)
    data.images.forEach((img) => formData.append("images", img));

  const res = await api.patch(`/posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


// Delete a post
export const deletePost = async (id: string, token: string) => {
  const res = await api.delete(`/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// List scheduled posts (paginated)
export async function fetchScheduledPosts(params: {
  page?: number;
  limit?: number;
  token: string;
  userId?: string;
  q?: string; // optional search query
}) {
  const { token, ...rest } = params;
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = new URL(`${base}/posts/scheduled`);

  Object.entries(rest).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch scheduled posts');
  return res.json();
}

// Create a scheduled post
export async function createUserScheduledPost(
  data: {
    title: string;
    subtitle?: string;
    contentHtml: string;
    categoryId?: string;
    tags?: string[];
    publishedAt: string;
    bannerImage?: File | null;
    images?: File[];
    status?: string;
  },
  token: string,
  authorId?: string // optional: pass if creating for specific user
) {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  formData.append('contentHtml', data.contentHtml);
  if (data.categoryId) formData.append('categoryId', data.categoryId);
  formData.append('publishedAt', data.publishedAt);
  if (data.tags && data.tags.length > 0) data.tags.forEach(tag => formData.append('tags', tag));
  if (data.bannerImage) formData.append('bannerImage', data.bannerImage);
  if (data.images && data.images.length > 0) data.images.forEach(img => formData.append('images', img));
  if (data.status) formData.append('status', data.status);
  if (authorId) formData.append('authorId', authorId);

  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const res = await fetch(`${base}/posts/scheduled`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('Failed to create scheduled post');
  return res.json();
}


// Publish a post
export const publishPost = async (id: string, token: string) => {
  const res = await api.post(
    `/posts/${id}/publish`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get post meta (views, comments, favorites)
export const fetchPostMeta = async (id: string, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/posts/${id}/meta`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch post meta: ${res.status}`);
  return res.json();
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

// Contact form
export async function submitContact(payload: { name: string; email: string; message: string }) {
  const url = `${HOME_API_BASE_URL}/home/contact`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `Contact failed: ${res.status}`);
  }
  return res.json().catch(() => ({}));
}


// Dashboaed

export type UserDashboardData = {
  myPosts: number;
  scheduledPosts: number;
  likes: number;
  comments: number;
};

export const fetchUserDashboard = async (token: string): Promise<UserDashboardData> => {
  const res = await api.get("/users/me/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res || res.status !== 200) {
    throw new Error(res?.data?.message || "Failed to fetch user dashboard");
  }

  return res.data.data as UserDashboardData;
};


// ----------------- Types -----------------
export type MeProfile = {
  _id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
};

// Payload for updating profile
export type UpdateProfilePayload = {
  fullName?: string;
  avatar?: File;
  socialLinks?: { twitter?: string; facebook?: string; instagram?: string; linkedin?: string };
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
};

// Get current user profile
export const fetchMyProfile = async (token: string): Promise<MeProfile> => {
  const res = await api.get("/users/me/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res || res.status !== 200) throw new Error("Failed to fetch profile");
  return res.data.data as MeProfile;
};

// Update current user profile
export const updateMyProfile = async (
  payload: UpdateProfilePayload,
  token: string
): Promise<MeProfile> => {
  const formData = new FormData();
  if (payload.fullName) formData.append("fullName", payload.fullName);
  if (payload.avatar) formData.append("avatar", payload.avatar);
  // Map social link fields to API expected keys
  const fromObj = payload.socialLinks || {};
  const twitterUrl = payload.twitterUrl ?? fromObj.twitter;
  const facebookUrl = payload.facebookUrl ?? fromObj.facebook;
  const instagramUrl = payload.instagramUrl ?? fromObj.instagram;
  const linkedinUrl = payload.linkedinUrl ?? fromObj.linkedin;
  if (twitterUrl) formData.append("twitterUrl", twitterUrl);
  if (facebookUrl) formData.append("facebookUrl", facebookUrl);
  if (instagramUrl) formData.append("instagramUrl", instagramUrl);
  if (linkedinUrl) formData.append("linkedinUrl", linkedinUrl);

  const res = await api.patch("/users/me/profile", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });

  if (!res || res.status !== 200) throw new Error("Failed to update profile");
  return res.data.data as MeProfile;
};
