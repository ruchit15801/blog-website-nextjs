"use client";
import Image from "next/image";
import TiptapEditor from "@/components/TiptapEditor";
import Loader from "@/components/Loader";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminUpdatePostById, createRemotePost, fetchCategories, fetchPostById, getAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../DashBoardLayout";
import toast from "react-hot-toast";
import { createPost, updatePost } from "@/lib/api";

type CategoryType = { _id: string; name: string };
type PostType = {
    _id: string;
    title: string;
    subtitle?: string;
    category?: string;
    categoryName?: string;
    tags?: string[] | string;
    contentHtml?: string;
    status?: "published" | "scheduled";
    bannerImageUrl?: string;
    images?: string[];
};

export default function AdminLayout() {
    const [postId, setPostId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPostId(params.get("id"));
    }, []);

    // Post state for edit
    const [editPost, setEditPost] = useState<PostType | null>(null);

    const [token, setToken] = useState<string>("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryType[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("categories");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [catsLoading, setCatsLoading] = useState(false);
    const [catError, setCatError] = useState<string | null>(null);
    const [catSearch, setCatSearch] = useState("");

    const [tagsList, setTagsList] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [status, setStatus] = useState<"published" | "scheduled">("published");

    const editorRef = useRef<HTMLDivElement | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [contentHtml, setContentHtml] = useState("");
    const prefilledRef = useRef(false);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Fetch admin token from localStorage
    useEffect(() => {
        const existing = getAdminToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (existing) setToken(existing);
    }, []);

    // Load categories
    const loadCategories = useCallback(async () => {
        if (!token) return;
        setCatsLoading(true);
        setCatError(null);
        try {
            const list = await fetchCategories(token);
            setCategories(list);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message || "Failed to load categories");
        } finally {
            setCatsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && token.length > 10) loadCategories();
    }, [token, loadCategories]);

    // Load post for editing
    const loadPostData = useCallback(async () => {
        if (!postId || !token || prefilledRef.current) return;
        try {
            const res = await fetchPostById(postId, token);
            const post = res.post;

            setEditPost(post);

            setTitle(post.title || "");
            setSubtitle(post.subtitle || "");
            setStatus(post.status as "published" | "scheduled" || "published");

            // Tags
            const tagsFromPost = post.tags
                ? Array.isArray(post.tags)
                    ? post.tags
                    : typeof post.tags === "string"
                        ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                        : []
                : [];

            setTagsList(tagsFromPost);

            // Content HTML
            setContentHtml(post.contentHtml || "");
            if (editorRef.current) editorRef.current.innerHTML = post.contentHtml || "";

            // Category: match name from categories list
            setCategoryId(post.category || "");
            const catName = categories.find(c => c._id === post.category)?.name || "";
            setCategoryName(catName);

            // Banner & images previews
            if (post.bannerImageUrl) setBannerPreview(post.bannerImageUrl);
            if (Array.isArray(post.imageUrls)) setImagePreviews(post.imageUrls);

            prefilledRef.current = true;
        } catch (err) {
            console.error("Failed to load post:", err);
            toast.error("Failed to load post data");
        }
    }, [postId, token, categories]);

    useEffect(() => {
        if (postId && token && categories.length > 0 && !prefilledRef.current) {
            loadPostData();
        }
    }, [postId, token, categories, loadPostData]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exec = (_cmd: string, _value?: string) => { /* handled by TiptapEditor */ };

    const addTag = (value: string) => {
        const newTag = value.trim();
        if (newTag && !tagsList.includes(newTag)) setTagsList([...tagsList, newTag]);
    };
    const removeTag = (i: number) => setTagsList(tagsList.filter((_, idx) => idx !== i));
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); setTagInput(""); }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        if (!title.trim()) return toast.error("Title is required.");

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const role = typeof window !== "undefined" ? localStorage.getItem("role") : "user";

        if (!token) return toast.error("Please login first.");

        try {
            setSubmitting(true);

            // Resolve category ID
            const resolvedCategoryId = categoryName
                ? (categories.find((c) => c.name === categoryName)?._id ?? "")
                : categoryId;

            // Prepare data based on role
            if (role === "admin") {
                // Admin API
                const postData = {
                    title,
                    subtitle,
                    contentHtml,
                    bannerFile,
                    imageFiles,
                    categoryId: resolvedCategoryId,
                    tags: tagsList,
                    status,
                };

                if (editPost?._id) {
                    await adminUpdatePostById(editPost._id, postData, token);
                    toast.success("Post updated successfully.");
                } else {
                    await createRemotePost(postData);
                    toast.success("Post created successfully.");
                }

            } else {
                const postData = {
                    title,
                    subtitle,
                    contentHtml,
                    bannerFile: bannerFile ?? undefined,
                    imageFiles: imageFiles ?? [],
                    categoryId: resolvedCategoryId,
                    tags: tagsList,
                    status,
                };

                if (editPost?._id) {
                    await updatePost(editPost._id, postData, token);
                    toast.success("Post updated successfully.");
                } else {
                    await createPost(postData, token);
                    toast.success("Post created successfully.");
                }
            }

            setTimeout(() => { window.location.href = "/DashBoard/See_all_post"; }, 600);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message || "Failed to save post");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">

                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{editPost ? "Edit Post" : "Create Post"}</h1>
                        <p className="text-gray-500 text-sm sm:text-base">Compose, add media, choose category and publish with style.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className="btn btn-secondary shine" onClick={() => setShowPreview(v => !v)}>
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <button type="submit" form="new-post-form" disabled={submitting} className="btn btn-primary shine disabled:opacity-60">
                            {submitting ? (editPost ? "Updating..." : "Publishing...") : (editPost ? "Update Post" : "Publish Post")}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form id="new-post-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    {/* Left Column */}
                    <div className="space-y-5 bg-white rounded-2xl shadow p-4 sm:p-6 card-hover w-full">
                        {/* Title & Subtitle */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Title *</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post title"
                                className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Subtitle</label>
                            <input
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="Optional subtitle"
                                className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1 relative">
                            <label className="text-sm font-semibold">Category</label>
                            <button type="button" className="btn btn-secondary mt-1" onClick={loadCategories}>Refresh</button>
                            <div className="relative w-full mt-2">
                                <button
                                    type="button"
                                    className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    {categoryName || "Select a category"}
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <input
                                            value={catSearch}
                                            onChange={(e) => setCatSearch(e.target.value)}
                                            placeholder="Search categories..."
                                            className="w-full px-3 h-10 rounded-t-lg border-b border-gray-300 focus:outline-none"/>
                                        {categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                                            .map(c => (
                                                <div key={c.name} className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => { setCategoryName(c.name); setDropdownOpen(false); setCatSearch(""); }}>
                                                    {c.name}
                                                </div>
                                            ))
                                        }
                                        {categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).length === 0 && (
                                            <div className="px-3 py-2 text-gray-400">No categories found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {catError && <p className="text-xs text-red-500">{catError}</p>}
                            {catsLoading && <div className="pt-1"><Loader inline label="Loading categories" /></div>}
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Tags</label>
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Type a tag and press Enter"
                                className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"/>
                            <div className="flex flex-wrap gap-2 my-2">
                                {tagsList.map((tag, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(idx)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Images</label>
                            <div className="relative flex flex-col items-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:shadow-md">
                                {/* Existing previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="w-full flex flex-wrap gap-3 mb-3 justify-center sm:justify-start">
                                        {imagePreviews.map((url, idx) => (
                                            <div key={`prev-${idx}`} className="relative w-20 h-20 rounded-md border border-gray-300">
                                                <Image src={url} alt={`preview-${idx}`} fill className="object-cover rounded-md" sizes="80px" />
                                                <button type="button" onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* New uploads */}
                                {imageFiles.length > 0 && (
                                    <div className="w-full flex flex-wrap gap-3 mb-3 justify-center sm:justify-start">
                                        {imageFiles.map((file, idx) => {
                                            const objectUrl = URL.createObjectURL(file);
                                            return (
                                                <div key={`new-${idx}`} className="relative w-20 h-20 rounded-md border border-gray-300">
                                                    <Image src={objectUrl} alt={`new-${idx}`} fill className="object-cover rounded-md" sizes="80px" />
                                                    <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                                                        className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {/* Upload button */}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm text-gray-600">Upload Images</span>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(prev => [...prev, ...(Array.from(e.target.files ?? []))])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-1 relative">
                            <label className="text-sm font-semibold">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as "published" | "scheduled")} className="w-full mt-1 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8">
                                <option value="published">Published</option>
                            </select>
                            <div className="absolute inset-y-0 top-5 right-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Banner Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Banner Image</label>
                            <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:border-blue-400 hover:shadow-md">
                                {(bannerFile || bannerPreview) && (
                                    <div className="relative w-32 h-20 rounded-lg border border-gray-300 mb-3">
                                        <Image src={bannerFile ? URL.createObjectURL(bannerFile) : bannerPreview!} alt="banner" fill className="object-cover rounded-lg" />
                                        <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(null); }} className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                    </div>
                                )}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm text-gray-600">Upload Banner Image</span>
                                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 bg-white rounded-2xl shadow p-4 sm:p-6 card-hover w-full">
                        {/* Instruction panel */}
                        <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%)' }}>
                            <div className="text-sm font-semibold mb-2" style={{ color: '#29294b' }}>Posting guide</div>
                            <ul className="list-disc pl-5 text-sm space-y-1" style={{ color: '#696981' }}>
                                <li>Write a clear Title and optional Subtitle.</li>
                                <li>Select a Category; use Refresh to sync latest categories.</li>
                                <li>Add Tags: type a tag and press Enter; click × to remove.</li>
                                <li>Upload a Banner and optional gallery images. Use × to remove any preview.</li>
                                <li>Use the editor on the right to format content (H2/H3, lists, quotes, links).</li>
                                <li>Click Show Preview to review before publishing.</li>
                            </ul>
                        </div>
                        <label className="text-sm font-semibold text-gray-700">Content *</label>
                        <TiptapEditor initialHtml={contentHtml || "<p></p>"} onChange={(html) => { setContentHtml(html); if (editorRef.current) editorRef.current.innerHTML = html; }} showPreview={showPreview} />

                        {showPreview && (
                            <div className="rounded-xl border border-gray-300 p-4 bg-white shadow-md mt-3 overflow-auto">
                                <div className="text-sm text-gray-500 mb-2">Live Preview</div>
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                            </div>
                        )}

                        {message && (
                            <div className={`text-sm ${message.startsWith("Post created") ? "text-green-600" : "text-red-500"}`}>
                                {message}
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}