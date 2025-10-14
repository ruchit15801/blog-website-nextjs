"use client";
import DashboardLayout from "../DashBoardLayout";
import { Edit2, MoreHorizontal, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import Loader from "@/components/Loader";
import { listCategories, createCategory, type Category } from "@/lib/api";
import { deleteCategory, updateCategory, getAdminToken } from "@/lib/adminClient";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";

type CategoryType = {
    id: string | number;
    name: string;
    shortName: string;
    description: string;
    avatar?: string;
};

const CategoryCard = ({
    cat,
    handleEdit,
    handleDelete,
}: {
    cat: CategoryType;
    handleEdit: (cat: CategoryType) => void;
    handleDelete: (id: string | number) => void;
}) => {
    const [showDescription, setShowDescription] = useState(false);

    return (
        <div className="relative flex items-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
            {/* Left: Category Image */}
            <div className="relative w-1/3 h-35 bg-gray-100 flex-shrink-0">
                {cat.avatar ? (
                    <Image
                        src={cat.avatar}
                        alt={cat.name}
                        fill
                        className="object-cover w-full h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                    </div>
                )}
            </div>

            {/* Right: Content */}
            <div className="flex flex-col justify-between p-4 w-2/3 relative">
                {/* Top: Edit/Delete */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 shadow-sm"
                        title="Edit Category">
                        <Edit2 className="w-4 h-4 text-indigo-600" />
                    </button>
                    <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 shadow-sm"
                        title="Delete Category">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Info */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
                    <p className="text-indigo-600 text-sm font-medium py-1">{cat.shortName}</p>

                    {/* Description */}
                    {cat.description && (
                        <div className="mt-2 text-sm text-gray-600">
                            <span>
                                {showDescription
                                    ? cat.description
                                    : cat.description.length > 60
                                        ? cat.description.slice(0, 60)
                                        : cat.description}
                                {!showDescription && cat.description.length > 60 && "..."}
                            </span>
                            {cat.description.length > 60 && (
                                <button
                                    onClick={() => setShowDescription(!showDescription)}
                                    className="ml-1 text-indigo-600 font-bold hover:underline p-0 bg-transparent border-0">
                                    {showDescription ? "View Less" : "View More"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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
            toast.error("Name and Short Name are required");
            return;
        }
        try {
            setCreating(true);
            const userToken = localStorage.getItem("token");
            if (!userToken) {
                toast.error("Please login first");
                return;
            }

            const imageFile = (document.querySelector('#cat-image-input') as HTMLInputElement)?.files?.[0] || null;

            if (editId !== null) {
                // Update category using admin token
                const adminToken = getAdminToken();
                if (!adminToken) {
                    toast.error("Admin token missing. Please login as admin.");
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
                toast.success("Category updated successfully!");
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
                toast.success("Category created successfully!");
                setShowCreate(false);
            }

            setForm({ id: 0, name: "", shortName: "", description: "", avatar: "" });
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (cat: CategoryType) => {
        setForm(cat);
        setEditId(cat.id);
        setShowCreate(true);
        toast("Editing category...");
    };

    const handleDelete = async (id: string | number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                const adminToken = getAdminToken();
                if (!adminToken) {
                    toast.error("Admin token missing. Please login as admin.");
                    return;
                }
                await deleteCategory(String(id));
                setCategories(prev => prev.filter(cat => cat.id !== id));
                toast.success("Category deleted successfully!");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to delete category");
            }
        }
    };

    const filtered = useMemo(
        () => categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()) || cat.shortName.toLowerCase().includes(search.toLowerCase())),
        [search, categories]
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <DashboardLayout>
            <div className="flex flex-col shadow-xl pb-8">
                {/* Header + Search + Create */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-12 rounded-xl" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                    <h1 className="text-3xl font-bold text-white text-center lg:text-left w-full lg:w-auto">Categories</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-3 lg:mt-0">
                        <div className="custom-search w-full sm:w-64">
                            <Search />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full mt-2 sm:mt-0 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="create_schedule px-4 py-2 rounded-lg text-white transition font-medium shine hover:scale-105 sm:w-auto">Create Category</button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    {loading && (
                        <div className="col-span-full text-center py-10">
                            <Loader inline label="Loading categories" />
                        </div>
                    )}
                    {error && (
                        <div className="col-span-full text-center text-red-500 py-4">{error}</div>
                    )}
                    {!loading &&
                        paginated.map((cat) => (
                            <CategoryCard
                                key={cat.id}
                                cat={cat}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ))}
                    {paginated.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No categories found.
                        </div>
                    )}
                </div>


                {/* Modal */}
                {showCreate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
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
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                            style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px' }}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="font-medium">Slug</label>
                                        <input
                                            type="text"
                                            value={form.shortName}
                                            onChange={(e) => setForm(p => ({ ...p, shortName: e.target.value }))}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                            style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px' }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium">Image</label>
                                    <input
                                        id="cat-image-input"
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1] w-full sm:w-60"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-auto">Cancel</button>
                                    <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg text-white disabled:opacity-60 w-full sm:w-auto" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                                        {creating ? (editId ? "Updating..." : "Creating...") : (editId ? "Update" : "Create")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
