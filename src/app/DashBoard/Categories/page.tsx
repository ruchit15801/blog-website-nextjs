"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import Loader from "@/components/Loader";
import { listCategories, createCategory, type Category } from "@/lib/api";
import { deleteCategory, updateCategory, getAdminToken } from "@/lib/adminClient";

type CategoryType = {
    id: string | number;
    name: string;
    shortName: string;
    description: string;
    avatar?: string;
};

// --- Category Card Component ---
const CategoryCard = ({
    cat,
    handleEdit,
    handleDelete,
}: {
    cat: CategoryType;
    handleEdit: (cat: CategoryType) => void;
    handleDelete: (id: string | number) => void;
}) => (
    <div className="relative group flex flex-col overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
        <div className="relative w-full h-40 bg-gray-100 rounded-t-2xl">
            {cat.avatar && (
                <Image
                    src={cat.avatar}
                    alt={cat.name}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            )}
        </div>
        <div className="p-4 flex flex-col gap-2">
            <h2 className="text-lg font-bold text-gray-800">{cat.name}</h2>
            <p className="text-gray-500 text-sm">{cat.shortName}</p>
            <p className="text-gray-600 text-sm">{cat.description}</p>
        </div>
        <details className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
            <summary className="list-none cursor-pointer p-2 bg-black/90 text-white rounded-full shadow flex items-center justify-center [&::-webkit-details-marker]:hidden marker:content-none">
                <MoreHorizontal className="w-4 h-4" />
            </summary>
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <button onClick={() => handleEdit(cat)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                    Delete
                </button>
            </div>
        </details>
    </div>
);

export default function Categories() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const [form, setForm] = useState<CategoryType>({ id: 0, name: "", shortName: "", description: "", avatar: "" });
    const [editId, setEditId] = useState<string | number | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 6;
    const [creating, setCreating] = useState(false);

    // Load categories
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await listCategories(token);
                const list: Category[] = (res.categories || res.data || []) as Category[];
                setCategories(list.map(c => ({ id: c._id, name: c.name, shortName: c.slug, description: c.description || "", avatar: c.imageUrl })));
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.shortName) {
            alert("Name and Short Name are required");
            return;
        }
        try {
            setCreating(true);
            const userToken = localStorage.getItem("token");
            if (!userToken) {
                alert("Please login first");
                return;
            }

            const imageFile = (document.querySelector('#cat-image-input') as HTMLInputElement)?.files?.[0] || null;

            if (editId !== null) {
                // Update category using admin token
                const adminToken = getAdminToken();
                if (!adminToken) {
                    alert("Admin token missing. Please login as admin.");
                    return;
                }
                await updateCategory(String(editId), {
                    name: form.name,
                    description: form.description,
                    imageFile: imageFile || undefined,
                });

                const res = await listCategories(userToken);
                const list: Category[] = (res.categories || res.data || []) as Category[];
                setCategories(list.map(c => ({
                    id: c._id,
                    name: c.name,
                    shortName: c.slug,
                    description: c.description || "",
                    avatar: c.imageUrl
                })));

                setEditId(null);
                setShowCreate(false);
            } else {
                // Create new category
                await createCategory({
                    name: form.name,
                    slug: form.shortName,
                    description: form.description,
                    image: imageFile || null
                }, userToken);

                const res = await listCategories(userToken);
                const list: Category[] = (res.categories || res.data || []) as Category[];
                setCategories(list.map(c => ({
                    id: c._id,
                    name: c.name,
                    shortName: c.slug,
                    description: c.description || "",
                    avatar: c.imageUrl
                })));

                setShowCreate(false);
            }

            setForm({ id: 0, name: "", shortName: "", description: "", avatar: "" });
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : String(err));
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (cat: CategoryType) => {
        setForm(cat);
        setEditId(cat.id);
        setShowCreate(true);
    };

    const handleDelete = async (id: string | number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                const adminToken = getAdminToken();
                console.log("admin token is :-", adminToken)
                if (!adminToken) {
                    alert("Admin token missing. Please login as admin.");
                    return;
                }
                await deleteCategory(String(id));
                setCategories(prev => prev.filter(cat => cat.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : String(err));
            }
        }
    };

    const filtered = useMemo(
        () => categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()) || cat.shortName.toLowerCase().includes(search.toLowerCase())),
        [search, categories]
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const goTo = (p: number) => { if (p >= 1 && p <= totalPages) setPage(p); };

    return (
        <DashboardLayout>
            {/* Header + Search + Create */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="custom-search w-full md:w-64">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-4 py-3 rounded-lg text-white transition font-medium"
                        style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}
                    >
                        Create Category
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading && <div className="col-span-full text-center py-10"><Loader inline label="Loading categories" /></div>}
                {error && <div className="col-span-full text-center text-red-500 py-4">{error}</div>}
                {!loading && paginated.map(cat => (
                    <CategoryCard key={cat.id} cat={cat} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
                {paginated.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No categories found.</div>}
            </div>

            {/* Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold" style={{ color: '#29294b' }}>{editId ? "Edit Category" : "Create New Category"}</h2>
                            <button onClick={() => setShowCreate(false)} className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100">Close</button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="font-medium">Category Name</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]" style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px' }} />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="font-medium">Slug</label>
                                    <input type="text" value={form.shortName} onChange={(e) => setForm(p => ({ ...p, shortName: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]" style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px' }} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Image</label>
                                <input id="cat-image-input" type="file" accept="image/*" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1] w-60" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
                                <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg text-white disabled:opacity-60" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>{creating ? (editId ? "Updating..." : "Creating...") : (editId ? "Update" : "Create")}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                    <button onClick={() => goTo(page - 1)} disabled={page === 1} className={`px-3 py-1 rounded-md ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}>
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pnum => (
                        <button key={pnum} onClick={() => goTo(pnum)} className={`px-3 py-1 rounded-md font-medium transition-colors ${page === pnum ? "bg-[#5559d1] text-white shadow-md" : "bg-white text-[#5559d1] hover:bg-[#5559d1] hover:text-white shadow-sm"}`}>{pnum}</button>
                    ))}
                    <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className={`px-3 py-1 rounded-md ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}>
                        Next
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
}
