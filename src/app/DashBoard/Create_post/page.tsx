"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRemotePost, fetchCategories, getAdminToken, saveAdminToken, } from "@/lib/adminClient";
import DashboardLayout from "../DashBoardLayout";

type CategoryType = { _id: string; name: string };

export default function AdminLayout() {
    const [token, setToken] = useState<string>("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryId,] = useState("");
    const [categoryName, setCategoryName] = useState("");
    // const [categories, setCategories] = useState<RemoteCategory[]>([]);
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

    const [status, setStatus] = useState<"draft" | "published">("published");

    const editorRef = useRef<HTMLDivElement | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [images, setImageUrls] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);


    useEffect(() => {
        const existing = getAdminToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (existing) {
            setToken(existing);
        }
    }, []);

    // Auto-load categories once token is available
    useEffect(() => {
        if (token && token.length > 10) {
            loadCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    async function loadCategories() {
        setCatError(null);
        if (!token) return;
        setCatsLoading(true);
        try {
            const list = await fetchCategories(token);
            setCategories(list);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setCatError(message || "Failed to load categories");
        } finally {
            setCatsLoading(false);
        }
    }

    // Auto fetch when token becomes available (e.g., user pasted it)
    useEffect(() => {
        if (token && token.length > 10) {
            loadCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    const [contentHtml, setContentHtml] = useState("");
    const wordCount = useMemo(() => (contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length), [contentHtml]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        if (!token) {
            setMessage("Please enter admin token.");
            return;
        }
        if (!title.trim()) {
            setMessage("Title is required.");
            return;
        }
        try {
            setSubmitting(true);
            saveAdminToken(token);
            // Resolve categoryId from selected name if provided
            const resolvedCategoryId = categoryName
                ? (categories.find((c) => c.name === categoryName)?._id ?? "")
                : categoryId;

            await createRemotePost({
                title,
                subtitle,
                contentHtml: editorRef.current?.innerHTML ?? "",
                bannerFile,
                images,
                imageFiles,
                categoryId: resolvedCategoryId,
                tags: tagsList,
                status: "draft",
            });
            setMessage("Post created successfully.");
            // redirect to See all posts after brief delay
            setTimeout(() => { window.location.href = "/DashBoard/See_all_post"; }, 600);
            // Reset form fields (keep token locked)
            setTitle("");
            setSubtitle("");
            setCategoryName("");
            setTagsList([]);
            setStatus('published');
            setBannerFile(null);
            setImageFiles([]);
            setImageUrls("");
            if (editorRef.current) editorRef.current.innerHTML = "";
            setContentHtml("");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setMessage(message || "Failed to create post");
        } finally {
            setSubmitting(false);
        }
    }

    const addTag = (value: string) => {
        const newTag = value.trim();
        if (newTag && !tagsList.includes(newTag)) {
            setTagsList([...tagsList, newTag]);
        }
    };
    const removeTag = (i: number) => {
        setTagsList(tagsList.filter((_, idx) => idx !== i));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
            setTagInput("");
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <DashboardLayout>
                <div className="mx-auto max-w-7xl px-4 pb-10">
                    <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Create Post</h1>
                            <p className="text-gray-500">Compose, add media, choose category and publish with style.</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary shine"
                                onClick={() => setShowPreview((v) => !v)}
                            >
                                {showPreview ? "Hide Preview" : "Show Preview"}
                            </button>

                            <button
                                type="submit"
                                form="new-post-form"
                                disabled={submitting}
                                className="btn btn-primary shine disabled:opacity-60"
                            >
                                {submitting ? "Publishing..." : "Publish Post"}
                            </button>
                        </div>
                    </div>

                    <form id="new-post-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: form fields */}
                        <div className="space-y-5 bg-white rounded-2xl shadow p-6 card-hover">
                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Title *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Post title"
                                    className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Subtitle */}
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
                                <button type="button" className="btn btn-secondary" onClick={loadCategories} style={{ marginLeft: 8 }}>Refresh</button>
                                <input
                                    value={catSearch}
                                    onChange={(e) => setCatSearch(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full mt-1 px-3 h-10 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <select
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    onFocus={() => { if (!categories.length && token) { loadCategories(); } }}
                                    className="w-full mt-1 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
                                >
                                    <option value="">Select a category</option>
                                    {categories
                                        .filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                                        .map((c) => (
                                            <option key={c.name} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                </select>
                                <div className="absolute inset-y-0 top-5 right-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {catError && <p className="text-xs" style={{ color: "#ef4444" }}>{catError}</p>}
                                {catsLoading && <p className="text-xs text-gray-500">Loading categories…</p>}
                            </div>

                            {/* Tags */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Tags</label>
                                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Type a tag and press Enter" className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1" />
                                <div className="flex flex-wrap gap-2 my-2">
                                    {tagsList.map((tag, idx) => (
                                        <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}
                                            <button type="button" onClick={() => removeTag(idx)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold block">Images</label>

                                {/* Upload area with preview inside */}
                                <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:shadow-md">
                                    {imageFiles.length > 0 && (
                                        <div className="w-full flex flex-wrap gap-3 mb-3 justify-center">
                                            {imageFiles.map((file, idx) => {
                                                const objectUrl = URL.createObjectURL(file);
                                                return (
                                                    <div key={idx} className="relative w-20 h-20 rounded-md border border-gray-300">
                                                        {/* Image */}
                                                        <Image
                                                            src={objectUrl}
                                                            alt={`preview-${idx}`}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            sizes="80px"
                                                        />

                                                        {/* Remove button inside image corner */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Upload icon + text */}
                                    <svg
                                        className="w-8 h-8 mb-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                        Upload Images
                                    </span>

                                    {/* Hidden input */}
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImageFiles((prev) => [...prev, ...(Array.from(e.target.files ?? []))])
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                                    className="w-full mt-1 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8">
                                    <option value="draft">Draft</option>
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

                                {/* Upload area with preview */}
                                <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:border-blue-400 hover:shadow-md">

                                    {bannerFile && (
                                        <div className="relative w-32 h-20 rounded-lg border border-gray-300 mb-3">
                                            {/* Image */}
                                            <Image
                                                src={URL.createObjectURL(bannerFile)}
                                                alt="banner"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => setBannerFile(null)}
                                                className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">
                                                ×
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload icon + text */}
                                    <svg
                                        className="w-8 h-8 mb-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                        Upload Banner Image
                                    </span>

                                    {/* Hidden input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-3 bg-white rounded-2xl shadow p-6 card-hover">
                            <label className="text-sm font-semibold text-gray-700">Content (HTML) *</label>

                            {/* Toolbar */}
                            <div className="top-0 z-20 mt-1 flex flex-wrap gap-2 bg-gradient-to-r from-purple-100 to-blue-50 p-2 rounded-xl border border-gray-200 mb-2 shadow-md">
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("bold")}>Bold</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("italic")}>Italic</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("underline")}>Underline</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("insertUnorderedList")}>• List</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("insertOrderedList")}>1. List</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("formatBlock", "h2")}>H2</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("formatBlock", "h3")}>H3</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("formatBlock", "p")}>P</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("formatBlock", "blockquote")}>Quote</button>
                                <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => exec("createLink", prompt("Enter URL", "https://") || "")}>Link</button>
                                <button type="button" className="px-2 py-1 bg-red-400 hover:bg-red-500 text-xs font-medium rounded transition text-white" onClick={() => exec("removeFormat")}>Clear</button>
                                <span className="ml-auto text-xs text-gray-500">{wordCount} words</span>
                            </div>

                            {/* Editable area */}
                            <div
                                ref={editorRef}
                                className="min-h-[400px] mt-3 rounded-2xl p-6 border-2 border-gray-300 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-inner focus-within:ring-4 focus-within:ring-purple-300 focus:outline-none overflow-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 transition-all duration-300 hover:shadow-lg"
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => setContentHtml((e.target as HTMLDivElement).innerHTML)}
                            />

                            {/* Live Preview */}
                            {showPreview && (
                                <div className="rounded-xl border border-gray-300 p-4 bg-white shadow-md mt-3">
                                    <div className="text-sm text-gray-500 mb-2">Live Preview</div>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                                </div>
                            )}

                            {/* Message */}
                            {message && (
                                <div className={`text-sm ${message.startsWith("Post created") ? "text-green-600" : "text-red-500"}`}>
                                    {message}
                                </div>
                            )}
                        </div>

                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}