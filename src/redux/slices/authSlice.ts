import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, signupUser, getMe, createPost as createPostApi, forgotPasswordAPI, resetPasswordAPI } from "../../lib/api";
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

// Reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await resetPasswordAPI(token, password);
            return res;
        } catch (err: unknown) {
            if (err instanceof Error) return rejectWithValue(err.message);
            return rejectWithValue("Something went wrong");
        }
    }
);

export const fetchMe = createAsyncThunk<
    { user: User },
    { token: string },
    { rejectValue: string }
>("auth/fetchMe", async ({ token }, { rejectWithValue }) => {
    try {
        const res = await getMe(token);
        return res;
    } catch (err: unknown) {
        let message = "Fetch user failed";
        if (axios.isAxiosError(err)) message = err.response?.data?.error?.message || err.message;
        else if (err instanceof Error) message = err.message;
        return rejectWithValue(message);
    }
});

// --- Create Post ---
export const createPost = createAsyncThunk<
    Post,
    { data: FormData; token: string },
    { rejectValue: string }
>("/admin/posts", async ({ data, token }, { rejectWithValue }) => {
    try {
        const res = await createPostApi(data, token);
        return res.post;
    } catch (err: unknown) {
        let message = "Post creation failed";
        if (axios.isAxiosError(err)) message = err.response?.data?.error?.message || err.message;
        else if (err instanceof Error) message = err.message;
        return rejectWithValue(message);
    }
});

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

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.resetLoading = true;
                state.resetMessage = null;
                state.resetError = null;
            })
            .addCase(resetPassword.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.resetLoading = false;
                state.resetMessage = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetLoading = false;
                state.resetError = action.payload as string;
            })

            // FetchMe
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
        .addCase(fetchMe.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
            state.loading = false;
            state.user = action.payload.user;
        })
        .addCase(fetchMe.rejected, (state) => {
            state.loading = false;
            state.user = null;
        })

        // Create Post
        .addCase(createPost.pending, (state) => {
            state.postLoading = true;
            state.postError = null;
        })
        .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
            state.postLoading = false;
            state.posts.push(action.payload);
        })
        .addCase(createPost.rejected, (state, action) => {
            state.postLoading = false;
            state.postError = action.payload ?? "Post creation failed";
        });
},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
