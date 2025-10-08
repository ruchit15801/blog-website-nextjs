import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, signupUser,forgotPasswordAPI } from "../../lib/api";
import axios from "axios";

// --- Types ---
export interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    isEmailVerified?: boolean;
}

export interface Post {
    _id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;

    posts: Post[];
    postLoading: boolean;
    postError: string | null;

    forgotLoading: boolean;
    forgotMessage: string | null;
    forgotError: string | null;

    resetLoading: boolean;
    resetMessage: string | null;
    resetError: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    posts: [],
    postLoading: false,
    postError: null,

    forgotLoading: false,
    forgotMessage: null,
    forgotError: null,

    resetLoading: false,
    resetMessage: null,
    resetError: null,
};

// --- Async Thunks ---

export const login = createAsyncThunk<
    { user: User; token: string; refreshToken: string },
    { email: string; password: string },
    { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = await loginUser(data);
        return res;
    } catch (err: unknown) {
        let message = "Login failed";
        if (axios.isAxiosError(err)) message = err.response?.data?.error?.message || err.message;
        else if (err instanceof Error) message = err.message;
        return rejectWithValue(message);
    }
});

export const signup = createAsyncThunk<
    { user: User; token: string; refreshToken: string },
    { fullName: string; email: string; password: string },
    { rejectValue: string }
>("auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = await signupUser(data);
        return res;
    } catch (err: unknown) {
        let message = "Signup failed";
        if (axios.isAxiosError(err)) message = err.response?.data?.error?.message || err.message;
        else if (err instanceof Error) message = err.message;
        return rejectWithValue(message);
    }
});


export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await forgotPasswordAPI(email);
            return res;
        } catch (err: unknown) {
            if (err instanceof Error) return rejectWithValue(err.message);
            return rejectWithValue("Something went wrong");
        }
    }
);

// --- Slice ---
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.error = null;
            state.posts = [];
            state.postError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Login failed";
            })

            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Signup failed";
            })

            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.forgotLoading = true;
                state.forgotMessage = null;
                state.forgotError = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.forgotLoading = false;
                state.forgotMessage = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.forgotLoading = false;
                state.forgotError = action.payload as string;
            })

    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
