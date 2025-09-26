import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
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