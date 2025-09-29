import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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
  const res = await api.post("/posts", data, {
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