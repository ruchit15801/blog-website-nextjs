"use client";
import { Home, BarChart3, Users, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRemotePost, fetchCategories, getAdminToken, saveAdminToken, type RemoteCategory } from "@/lib/adminClient";


export default function AdminLayout() {
    const pathname = usePathname();
    const [token, setToken] = useState<string>("");
    const [tokenLocked, setTokenLocked] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    console.log("Categories :-", setCategoryId);
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

    const [role, setRole] = useState<"admin" | "user">("user");
    const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });

    useEffect(() => {
        const storedRole = localStorage.getItem("role") as "admin" | "user" | null;
        if (storedRole) setRole(storedRole);

        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/signUp";
    };

    // Menu based on role
    const adminMenu = [
        { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
        { icon: <BarChart3 />, label: "Create Posts", path: "/DashBoard/create-posts" },
        { icon: <Settings />, label: "See Posts", path: "/DashBoard/posts" },
        { icon: <Users />, label: "Users", path: "/DashBoard/users" },
        { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/schedule" },
        { icon: <Settings />, label: "User Posts", path: "/DashBoard/user-posts" },
        { icon: <Settings />, label: "Categories", path: "/DashBoard/categories" },
    ];

    const userMenu = [
        { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
        { icon: <BarChart3 />, label: "Create Post", path: "/DashBoard/create_post" },
        { icon: <Settings />, label: "See Posts", path: "/DashBoard/posts" },
        { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/schedule" },
    ];

    const menus = role === "admin" ? adminMenu : userMenu;

    return (
        <>
            {/* Header */}
            <header className="navbar-header bg-white shadow px-4 py-2 flex justify-between items-center">
                <Link href="/" className="navbar-logo">
                    <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col text-right">
                        <span className="font-medium text-gray-700">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md flex flex-col p-4 fixed top-0 left-0 h-screen overflow-auto">
                    <nav className="flex flex-col gap-2 mt-14">
                        {menus.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path ?? "/Dashboard"}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-gray-700
                                    ${pathname === item.path ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 ml-64 p-8 overflow-auto">
                    <div className="mx-auto max-w-6xl px-4 pb-10">
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-gray-300 transition font-medium"
                                    style={{ color: "#5559d1", backgroundColor: "#f0f0f0" }} 
                                    onClick={() => setShowPreview((v) => !v)}
                                >
                                    {showPreview ? "Hide Preview" : "Show Preview"}
                                </button>

                                <button
                                    type="submit"
                                    form="new-post-form"
                                    disabled={submitting}
                                    className="px-4 py-2 rounded-lg text-white transition font-medium"
                                    style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }} 
                                >
                                    {submitting ? "Publishing..." : "Publish Post"}
                                </button>
                            </div>

                        </div>

                        <form id="new-post-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left column: form fields */}
                            <div className="space-y-5">
                                {/* Admin Token */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        Admin Token
                                        {!tokenLocked ? (
                                            <button
                                                type="button"
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                                onClick={() => {
                                                    saveAdminToken(token);
                                                    setTokenLocked(true);
                                                    loadCategories();
                                                }}
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                                onClick={() => setTokenLocked(false)}
                                            >
                                                Update
                                            </button>
                                        )}
                                    </label>
                                    <input
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="Paste Bearer token"
                                        className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        disabled={tokenLocked}
                                    />
                                    <p className="text-xs text-gray-500">{tokenLocked ? "(Locked)" : "Paste and click Save."}</p>
                                </div>

                                {/* Title */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Title *</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Post title"
                                        className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Subtitle</label>
                                    <input
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        placeholder="Optional subtitle"
                                        className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-1 relative">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        Category
                                        <button
                                            type="button"
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                            onClick={loadCategories}
                                        >
                                            {catsLoading ? "Loading..." : "Refresh"}
                                        </button>
                                    </label>
                                    <select
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 top-5 right-3 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {catError && <p className="text-xs text-red-500">{catError}</p>}
                                </div>

                                {/* Tags */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Tags (comma separated)</label>
                                    <input
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="design, nextjs, ui"
                                        className="w-full px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Images */}
                                <div className="space-y-1 flex items-center gap-3">
                                    <label className="text-sm font-semibold">Images</label>
                                    <label className="px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 text-xs">
                                        Choose Files
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {imageFiles.map((f, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-lg border border-gray-300 overflow-hidden relative">
                                                <Image
                                                    src={URL.createObjectURL(f)}
                                                    alt={`preview-${idx}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-1 relative">
                                    <label className="text-sm font-semibold">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                                        className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
                                    >
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
                                <div className="space-y-1 flex items-center gap-3">
                                    <label className="text-sm font-semibold">Banner</label>
                                    <label className="px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 text-xs">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                            className="hidden"
                                        />
                                    </label>
                                    {bannerFile && (
                                        <div className="w-32 h-20 rounded-lg border border-gray-300 overflow-hidden relative">
                                            <Image
                                                src={URL.createObjectURL(bannerFile)}
                                                alt="banner"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold">Content (HTML) *</label>
                                <div className="sticky top-0 z-10 flex flex-wrap gap-2 bg-white p-2 rounded-lg border border-gray-300 mb-2 shadow-sm">
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("bold")}>Bold</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("italic")}>Italic</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("underline")}>Underline</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("insertUnorderedList")}>• List</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("insertOrderedList")}>1. List</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("formatBlock", "h2")}>H2</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("formatBlock", "h3")}>H3</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("formatBlock", "p")}>P</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("formatBlock", "blockquote")}>Quote</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("createLink", prompt("Enter URL", "https://") || "")}>Link</button>
                                    <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => exec("removeFormat")}>Clear</button>
                                    <span className="ml-auto text-xs text-gray-500">{wordCount} words</span>
                                </div>

                                <div
                                    ref={editorRef}
                                    className="min-h-[320px] rounded-lg p-4 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => setContentHtml((e.target as HTMLDivElement).innerHTML)}
                                />

                                {showPreview && (
                                    <div className="rounded-lg border border-gray-300 p-4 bg-white shadow-sm mt-3">
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
                </main>

            </div>
        </>
    );
}