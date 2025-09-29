"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createScheduledPost, fetchCategories, getAdminToken, saveAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../DashBoardLayout";
import Loader from "@/components/Loader";

type CategoryType = { _id: string; name: string };

export default function CreateSchedulePost() {
    const [token, setToken] = useState<string>("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [catsLoading, setCatsLoading] = useState(false);
    const [catError, setCatError] = useState<string | null>(null);
    const [catSearch, setCatSearch] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tagsList, setTagsList] = useState<string[]>([]);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduleDate, setScheduleDate] = useState<string>("");
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [contentHtml, setContentHtml] = useState("");
    const wordCount = useMemo(() => (contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length), [contentHtml]);

    useEffect(() => {
        const existing = getAdminToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (existing) { setToken(existing); }
    }, []);

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

    useEffect(() => {
        if (token && token.length > 10) loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    const addTag = (value: string) => {
        const v = value.trim();
        if (v && !tagsList.includes(v)) setTagsList(prev => [...prev, v]);
    };
    const removeTag = (idx: number) => setTagsList(prev => prev.filter((_, i) => i !== idx));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        if (!token) { setMessage("Please enter admin token."); return; }
        if (!title.trim()) { setMessage("Title is required."); return; }
        if (!scheduleDate) { setMessage("Schedule date/time is required."); return; }
        try {
            setSubmitting(true);
            saveAdminToken(token);
            await createScheduledPost({
                title,
                subtitle,
                contentHtml: editorRef.current?.innerHTML ?? "",
                publishedAt: new Date(scheduleDate).toISOString(),
                bannerFile,
                images: "",
                imageFiles,
                categoryId: categories.find(c => c.name === categoryName)?._id ?? "",
                tags: tagsList,
                status: "scheduled",
            });
            setMessage("Scheduled post created.");
            // redirect to scheduled posts listing
            setTimeout(() => { window.location.href = "/DashBoard/Schedule_post"; }, 600);
            setTitle(""); setSubtitle(""); setCategoryName(""); setTagsList([]); setBannerFile(null); setImageFiles([]); setContentHtml("");
            if (editorRef.current) editorRef.current.innerHTML = "";
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
                    <h1 className="text-3xl font-bold text-gray-800">Create Schedule Post</h1>
                    <div className="flex gap-2">
                        <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 transition font-medium" style={{ color: "#5559d1", backgroundColor: "#f0f0f0" }} onClick={() => setShowPreview(v => !v)}>
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        <button type="submit" form="schedule-post-form" disabled={submitting} className="px-4 py-2 rounded-lg text-white transition font-medium" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                            {submitting ? "Saving..." : "Save Draft"}
                        </button>
                    </div>
                </div>

                <form id="schedule-post-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Title *</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Subtitle</label>
                            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle" className="w-full mt-1 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div className="space-y-1 relative">
                            <label className="text-sm font-semibold">Category</label>
                            <input value={catSearch} onChange={(e) => setCatSearch(e.target.value)} placeholder="Search categories..." className="w-full mt-1 px-3 h-10 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} onFocus={() => { if (!categories.length && token) loadCategories(); }} className="w-full mt-1 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8">
                                <option value="">Select a category</option>
                                {categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).map((c) => (<option key={c._id} value={c.name}>{c.name}</option>))}
                            </select>
                            <div className="absolute inset-y-0 top-5 right-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                            {catError && <p className="text-xs" style={{ color: "#ef4444" }}>{catError}</p>}
                            {catsLoading && <div className="pt-1"><Loader inline label="Loading categories" /></div>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Tags</label>
                            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); setTagInput(""); } }} placeholder="Type a tag and press Enter" className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1" />
                            <div className="flex flex-wrap gap-2 my-2">
                                {tagsList.map((tag, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}<button type="button" onClick={() => removeTag(idx)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">×</button></span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Images</label>
                            <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition">
                                {imageFiles.length > 0 && (
                                    <div className="w-full flex flex-wrap gap-3 mb-3 justify-center">
                                        {imageFiles.map((file, idx) => {
                                            const objectUrl = URL.createObjectURL(file);
                                            return (
                                                <div key={idx} className="relative w-20 h-20 rounded-md border border-gray-300">
                                                    <Image src={objectUrl} alt={`preview-${idx}`} fill className="object-cover rounded-md" sizes="80px" />
                                                    <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                <span className="text-sm text-gray-600">Upload Images</span>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles((prev) => [...prev, ...(Array.from(e.target.files ?? []))])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">Banner Image</label>
                            <div className="relative flex flex-col items-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition hover:border-blue-400">
                                {bannerFile && (
                                    <div className="relative w-32 h-20 rounded-lg border border-gray-300 mb-3">
                                        <Image src={URL.createObjectURL(bannerFile)} alt="banner" fill className="object-cover rounded-lg" />
                                        <button type="button" onClick={() => setBannerFile(null)} className="absolute -top-2 -right-2 z-30 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600">×</button>
                                    </div>
                                )}
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                <span className="text-sm text-gray-600">Upload Banner Image</span>
                                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Content (HTML) *</label>
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
                        <div ref={editorRef} className="min-h-[400px] mt-3 rounded-2xl p-6 border-2 border-gray-300 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-inner focus-within:ring-4 focus-within:ring-purple-300 focus:outline-none overflow-auto" contentEditable suppressContentEditableWarning onInput={(e) => setContentHtml((e.target as HTMLDivElement).innerHTML)} />
                        {showPreview && (
                            <div className="rounded-xl border border-gray-300 p-4 bg-white shadow-md mt-3">
                                <div className="text-sm text-gray-500 mb-2">Live Preview</div>
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                            </div>
                        )}
                        {message && (<div className={`text-sm ${message.startsWith("Scheduled post") ? "text-green-600" : "text-red-500"}`}>{message}</div>)}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}


