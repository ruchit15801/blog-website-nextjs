"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRemotePost, fetchCategories, getAdminToken, saveAdminToken, type RemoteCategory } from "@/lib/adminClient";
import Image from "next/image";

export default function NewPostPage() {
    const [token, setToken] = useState<string>("");
    const [tokenLocked, setTokenLocked] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<RemoteCategory[]>([]);
    const [catsLoading, setCatsLoading] = useState(false);
    const [catError, setCatError] = useState<string | null>(null);
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState<"draft" | "published">("published");
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [images, setImageUrls] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const existing = getAdminToken();
        if (existing) {
            setToken(existing);
            setTokenLocked(true);
        }
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
                tags,
                status,
            });
            setMessage("Post created successfully.");
            // Reset form fields (keep token locked)
            setTitle("");
            setSubtitle("");
            setCategoryName("");
            setTags("");
            setStatus("published");
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

    return (
        <>
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <div className="flex gap-2">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowPreview((v) => !v)}>
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <button disabled={submitting} type="submit" form="new-post-form" className="btn btn-primary shine">
                            {submitting ? "Publishing..." : "Publish Post"}
                        </button>
                    </div>
                </div>

                <form id="new-post-form" onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                    {/* Left column: fields */}
                    <div className="space-y-5">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">Admin Token
                                {!tokenLocked ? (
                                    <button type="button" className="btn btn-secondary" onClick={() => { saveAdminToken(token); setTokenLocked(true); loadCategories(); }}>Save</button>
                                ) : (
                                    <button type="button" className="btn btn-secondary" onClick={() => setTokenLocked(false)}>Update</button>
                                )}
                            </label>
                            <input
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste Bearer token"
                                className="rounded-xl px-3 h-11 bg-white/5 border border-white/10"
                                disabled={tokenLocked}
                            />
                            <p className="text-xs text-muted">Stored locally; used in Authorization header. {tokenLocked ? "(Locked)" : "Paste and click Save."}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Title <span style={{ color: "var(--brand-amber)" }}>*</span></label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Subtitle</label>
                            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle" className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">Category
                                <button type="button" className="btn btn-secondary" onClick={loadCategories}>
                                    {catsLoading ? "Loading..." : "Refresh"}
                                </button>
                            </label>
                            <select
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onFocus={() => { if (!categories.length && token) loadCategories(); }}
                                className="rounded-xl px-3 h-11 bg-white/5 border border-white/10"
                            >
                                <option value="">Select a category</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            {catError && <p className="text-xs" style={{ color: "#ef4444" }}>{catError}</p>}
                            {!catError && catsLoading && <p className="text-xs text-muted">Loading categories…</p>}
                            {!catError && !catsLoading && !categories.length && token && (
                                <p className="text-xs text-muted">No categories found.</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Tags (comma separated)</label>
                            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, nextjs, ui" className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                            />
                            {imageFiles.length > 0 && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {imageFiles.map((f, idx) => (
                                        <div key={idx} className="rounded-lg overflow-hidden border border-white/10" style={{ width: 96, height: 96 }}>
                                            <Image src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* <p className="text-xs text-muted">You can also paste URLs below (optional).</p> */}
                            {/* <input value={images} onChange={(e) => setImageUrls(e.target.value)} placeholder="https://..., https://..." className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" /> */}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="rounded-xl px-3 h-11 bg-white/5 border border-white/10">
                                <option value="draft">draft</option>
                                <option value="published">published</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Banner Image</label>
                            <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
                            {bannerFile && (
                                <div className="relative mt-2 w-full max-w-sm rounded-xl overflow-hidden border border-white/10">
                                    <Image src={URL.createObjectURL(bannerFile)} alt="banner" className="w-full aspect-[16/9] object-cover" />
                                    <button type="button" className="btn btn-secondary" style={{ position: "absolute", top: 8, right: 8 }} onClick={() => setBannerFile(null)}>Remove</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column: editor + preview */}
                    <div className="space-y-3">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Content (HTML) <span style={{ color: "var(--brand-amber)" }}>*</span></label>
                            <div className="sticky top-[64px] z-10 flex flex-wrap gap-2 bg-background/80 backdrop-blur p-2 rounded-xl border border-white/10">
                                <button type="button" className="btn btn-secondary" onClick={() => exec("bold")}>Bold</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("italic")}>Italic</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("underline")}>Underline</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("insertUnorderedList")}>• List</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("insertOrderedList")}>1. List</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("formatBlock", "h2")}>H2</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("formatBlock", "h3")}>H3</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("formatBlock", "p")}>P</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("formatBlock", "blockquote")}>Quote</button>
                                <button type="button" className="btn btn-secondary" onClick={() => exec("createLink", prompt("Enter URL", "https://") || "")}>Link</button>
                                <button type="button" className="btn btn-secondary" onClick={() => { document.execCommand("removeFormat"); }}>Clear</button>
                                <span className="ml-auto text-xs text-muted">{wordCount} words</span>
                            </div>
                            <div
                                ref={editorRef}
                                className="min-h-[260px] rounded-xl p-4 bg-white/5 border border-white/10 card-hover editor-area"
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => setContentHtml((e.target as HTMLDivElement).innerHTML)}
                            />
                        </div>

                        {showPreview && (
                            <div className="rounded-xl border border-white/10 p-4" style={{ background: "linear-gradient(180deg, var(--surface), transparent)" }}>
                                <div className="text-sm text-muted mb-2">Live preview</div>
                                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                            </div>
                        )}

                        {message && (
                            <div className="text-sm" style={{ color: message.startsWith("Post created") ? "var(--brand-teal)" : "#ef4444" }}>{message}</div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}


