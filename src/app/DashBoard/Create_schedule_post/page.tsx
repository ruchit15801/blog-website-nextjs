"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import {
    adminUpdatePostById,
    createScheduledPost,
    fetchCategories,
    fetchPostById,
    getAdminToken,
    saveAdminToken
} from "@/lib/adminClient";
import DashboardLayout from "../DashBoardLayout";
import Loader from "@/components/Loader";

type CategoryType = { _id: string; name: string };

export default function CreateSchedulePost() {
    const [postId, setPostId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPostId(params.get("id"));
    }, []);


    const [token, setToken] = useState<string>("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [categoryId, setCategoryId] = useState<string>("");
    const [catsLoading, setCatsLoading] = useState(false);
    const [catError, setCatError] = useState<string | null>(null);
    const [catSearch, setCatSearch] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tagsList, setTagsList] = useState<string[]>([]);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduleDate, setScheduleDate] = useState<string>("");
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [contentHtml, setContentHtml] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // word count handled by TiptapEditor

    // Load admin token
    useEffect(() => {
        const existing = getAdminToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (existing) setToken(existing);
    }, []);

    // Load categories
    const loadCategories = useCallback(async () => {
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
    }, [token]); // include token as dependency

    // Now use it in useEffect
    useEffect(() => {
        if (token && token.length > 10) loadCategories();
    }, [token, loadCategories]); // include loadCategories


    // When categories load, pre-fill categoryName if editing
    useEffect(() => {
        if (categoryId && categories.length > 0) {
            const cat = categories.find(c => c._id === categoryId);
            if (cat) setCategoryName(cat.name);
        }
    }, [categories, categoryId]);


    // Load post if editing
    useEffect(() => {
        if (!token || !postId) return;

        const loadPost = async () => {
            try {
                setSubmitting(true);
                const res = await fetchPostById(postId, token);
                const post = res.post;
                if (!post) return;

                setTitle(post.title);
                setSubtitle(post.subtitle || "");
                setTagsList(post.tags || []);
                setScheduleDate(post.publishedAt ? post.publishedAt.slice(0, 16) : "");
                setContentHtml(post.contentHtml || "");
                if (editorRef.current) editorRef.current.innerHTML = post.contentHtml || "";

                // Banner preview
                if (post.bannerImageUrl) setBannerPreviewUrl(post.bannerImageUrl);

                // Image previews
                if (post.imageUrls && Array.isArray(post.imageUrls)) {
                    setImagePreviewUrls(post.imageUrls);
                }

                // Category pre-fill
                const catName = categories.find(c => c._id === post.category)?.name || "";
                setCategoryName(catName);


            } catch (err) {
                console.error(err);
            } finally {
                setSubmitting(false);
            }
        };

        loadPost();
    }, [token, postId, categories]);

    // After both categories and post are loaded
    useEffect(() => {
        if (categories.length === 0) return;
        if (postId && token) {
            const loadPost = async () => {
                try {
                    setSubmitting(true);
                    const res = await fetchPostById(postId, token);
                    const post = res.post;
                    if (!post) return;

                    setTitle(post.title);
                    setSubtitle(post.subtitle || "");
                    setTagsList(post.tags || []);
                    setScheduleDate(post.publishedAt ? post.publishedAt.slice(0, 16) : "");
                    setContentHtml(post.contentHtml || "");
                    if (editorRef.current) editorRef.current.innerHTML = post.contentHtml || "";

                    if (post.bannerImageUrl) setBannerPreviewUrl(post.bannerImageUrl);
                    if (post.imageUrls && Array.isArray(post.imageUrls)) setImagePreviewUrls(post.imageUrls);

                    if (post.category) {
                        setCategoryId(post.category);
                        const cat = categories.find(c => c._id === post.category);
                        if (cat) setCategoryName(cat.name);
                    }

                } catch (err) {
                    console.error(err);
                } finally {
                    setSubmitting(false);
                }
            };
            loadPost();
        }
    }, [categories, postId, token]);


    // Legacy placeholder kept for UI compatibility
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exec = (_cmd: string, _value?: string) => { /* handled by TiptapEditor */ };

    const addTag = (value: string) => {
        const v = value.trim();
        if (v && !tagsList.includes(v)) setTagsList(prev => [...prev, v]);
    };

    const removeTag = (idx: number) => setTagsList(prev => prev.filter((_, i) => i !== idx));

    const handleBannerChange = (file: File | null) => {
        setBannerFile(file);
        if (file) setBannerPreviewUrl(URL.createObjectURL(file));
        else setBannerPreviewUrl("");
    };

    const handleImagesChange = (files: File[]) => {
        setImageFiles(files);
        setImagePreviewUrls(files.map(f => URL.createObjectURL(f)));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        if (!token) { setMessage("Please enter admin token."); return; }
        if (!title.trim()) { setMessage("Title is required."); return; }
        if (!scheduleDate) { setMessage("Schedule date/time is required."); return; }

        try {
            setSubmitting(true);
            saveAdminToken(token);

            const postData = {
                title,
                subtitle,
                contentHtml,
                publishedAt: new Date(scheduleDate).toISOString(),
                bannerFile: bannerFile ?? undefined,
                images: "",
                imageFiles: imageFiles,
                categoryId: categoryId,
                tags: tagsList,
                status: "scheduled" as const,
            };


            if (postId) {
                // EDIT MODE
                await adminUpdatePostById(postId, postData);
                setMessage("Scheduled post updated.");
            } else {
                // CREATE MODE
                await createScheduledPost(postData);
                setMessage("Scheduled post created.");
            }

            // redirect
            setTimeout(() => { window.location.href = "/DashBoard/Schedule_post"; }, 600);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setMessage(message || "Failed to save scheduled post");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-6xl px-4 pb-10">
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{postId ? "Edit Scheduled Post" : "Create Scheduled Post"}</h1>
                    <div className="flex gap-2">
                        <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 transition font-medium" style={{ color: "#5559d1", backgroundColor: "#f0f0f0" }} onClick={() => setShowPreview(v => !v)}>
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        <button type="submit" form="schedule-post-form" disabled={submitting} className="px-4 py-2 rounded-lg text-white transition font-medium" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                            {submitting ? "Saving..." : "Save Schedule"}
                        </button>
                    </div>
                </div>

                <form id="schedule-post-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side: Title, Subtitle, Category, Tags, Images */}
                    <div className="space-y-5">
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Title *</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        {/* Subtitle */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Subtitle</label>
                            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle" className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        {/* Category */}
                        <div className="space-y-1 relative">
                            <label className="text-sm font-semibold">Category</label>
                            <button type="button" className="btn btn-secondary" onClick={loadCategories} style={{ marginLeft: 8 }}>Refresh</button>
                            <div className="relative w-full mt-1">
                                <button type="button" className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    {categoryName || "Select a category"}
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <input value={catSearch} onChange={(e) => setCatSearch(e.target.value)} placeholder="Search categories..." className="w-full px-3 h-10 rounded-t-lg border-b border-gray-300 focus:outline-none" />
                                        {categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).map(c => (
                                            <div
                                                key={c._id}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setCategoryName(c.name);
                                                    setCategoryId(c._id);
                                                    setDropdownOpen(false);
                                                    setCatSearch("");
                                                }}
                                            >
                                                {c.name}
                                            </div>
                                        ))}

                                        {categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).length === 0 && (
                                            <div className="px-3 py-2 text-gray-400">No categories found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {catError && <p className="text-xs" style={{ color: "#ef4444" }}>{catError}</p>}
                            {catsLoading && <div className="pt-1"><Loader inline label="Loading categories" /></div>}
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Tags</label>
                            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); setTagInput(""); } }} placeholder="Type a tag and press Enter" className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1" />
                            <div className="flex flex-wrap gap-2 my-2">
                                {tagsList.map((tag, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}<button type="button" onClick={() => removeTag(idx)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">×</button></span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Images</label>
                            <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition">
                                {(imagePreviewUrls.length > 0) && (
                                    <div className="w-full flex flex-wrap gap-3 mb-3 justify-center">
                                        {imagePreviewUrls.map((url, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-md border border-gray-300">
                                                <Image src={url} alt={`preview-${idx}`} fill className="object-cover rounded-md" sizes="80px" />
                                                <button type="button" onClick={() => { setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx)); setImageFiles(prev => prev.filter((_, i) => i !== idx)) }} className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                <span className="text-sm text-gray-600">Upload Images</span>
                                <input type="file" multiple accept="image/*" onChange={(e) => handleImagesChange([...imageFiles, ...Array.from(e.target.files ?? [])])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Banner Image</label>
                            <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:border-blue-400">
                                {bannerPreviewUrl && (
                                    <div className="relative w-32 h-20 rounded-lg border border-gray-300 mb-3">
                                        <Image src={bannerPreviewUrl} alt="banner" fill className="object-cover rounded-lg" />
                                        <button type="button" onClick={() => handleBannerChange(null)} className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                    </div>
                                )}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                <span className="text-sm text-gray-600">Upload Banner Image</span>
                                <input type="file" accept="image/*" onChange={(e) => handleBannerChange(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Right side: Content */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Text Editor (HTML) *</label>
                        <TiptapEditor
                            initialHtml={contentHtml || "<p></p>"}
                            onChange={(html) => {
                                setContentHtml(html);
                                if (editorRef.current) editorRef.current.innerHTML = html;
                            }}
                            showPreview={showPreview}
                        />
                        {/* Synced HTML textarea */}
                        {/* <div className="mt-3 space-y-1">
                            <label className="text-xs font-medium text-gray-600">Content (HTML) - synced</label>
                            <textarea
                                value={contentHtml}
                                onChange={(e) => setContentHtml(e.target.value)}
                                className="w-full min-h-[140px] rounded-xl border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div> */}
                        {message && (<div className={`text-sm ${message.startsWith("Scheduled post") ? "text-green-600" : "text-red-500"}`}>{message}</div>)}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
