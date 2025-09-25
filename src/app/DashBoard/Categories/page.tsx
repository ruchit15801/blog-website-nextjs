"use client";
import DashboardLayout from "../DashBoardLayout";
import { MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

type CategoryType = {
    id: number;
    name: string;
    shortName: string;
    description: string;
    avatar?: string;
};

const CategoryForm = ({
    form,
    setForm,
    handleSubmit,
    editId,
    handleAvatarChange,
}: {
    form: CategoryType;
    setForm: React.Dispatch<React.SetStateAction<CategoryType>>;
    handleSubmit: (e: React.FormEvent) => void;
    editId: number | null;
    handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium">Category Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium">Short Name</label>
                <input
                    type="text"
                    name="shortName"
                    value={form.shortName}
                    onChange={(e) => setForm(prev => ({ ...prev, shortName: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label className="font-medium">Description</label>
            <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="font-medium">Avatar</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1] w-60"
            />
            {form.avatar && (
                <div className="mt-2 w-24 h-24 relative rounded-2xl overflow-hidden">
                    <Image src={form.avatar} alt="Avatar" fill className="object-cover" />
                </div>
            )}
        </div>

        <button type="submit" className="Add_Categories text-white px-6 py-2 rounded-lg w-50">
            {editId !== null ? "Update Category" : "Add Category"}
        </button>
    </form>
);

// --- Category Card Component ---
const CategoryCard = ({
    cat,
    handleEdit,
    handleDelete,
}: {
    cat: CategoryType;
    handleEdit: (cat: CategoryType) => void;
    handleDelete: (id: number) => void;
}) => (
    <div className="relative group flex flex-col overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
        <div className="relative w-full h-40 bg-gray-100 rounded-t-2xl">
            {cat.avatar && <Image src={cat.avatar} alt={cat.name} fill className="object-cover rounded-t-2xl" />}
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
    // --- Hydration-safe initial state from localStorage ---
    const [categories, setCategories] = useState<CategoryType[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("categories");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    const [form, setForm] = useState<CategoryType>({ id: 0, name: "", shortName: "", description: "", avatar: "" });
    const [editId, setEditId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 6;

    // --- Save to localStorage whenever categories change ---
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setForm(prev => ({ ...prev, avatar: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.shortName) {
            alert("Name and Short Name are required");
            return;
        }

        if (editId !== null) {
            setCategories(prev => prev.map(cat => (cat.id === editId ? { ...cat, ...form } : cat)));
            setEditId(null);
        } else {
            setCategories(prev => [...prev, { ...form, id: Date.now() }]);
        }
        setForm({ id: 0, name: "", shortName: "", description: "", avatar: "" });
    };

    const handleEdit = (cat: CategoryType) => {
        setForm(cat);
        setEditId(cat.id);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(prev => prev.filter(cat => cat.id !== id));
        }
    };

    const filtered = useMemo(
        () => categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()) || cat.shortName.toLowerCase().includes(search.toLowerCase())),
        [search, categories]
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const goTo = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    return (
        <DashboardLayout>
            {/* Header + Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Category Form */}
            <CategoryForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                editId={editId}
                handleAvatarChange={handleAvatarChange}
            />

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paginated.map(cat => (
                    <CategoryCard key={cat.id} cat={cat} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
                {paginated.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No categories found.</div>}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                    <button onClick={() => goTo(page - 1)} disabled={page === 1} className={`px-3 py-1 rounded-md ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}>
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pnum => (
                        <button
                            key={pnum}
                            onClick={() => goTo(pnum)}
                            className={`px-3 py-1 rounded-md font-medium transition-colors ${page === pnum ? "bg-[#5559d1] text-white shadow-md" : "bg-white text-[#5559d1] hover:bg-[#5559d1] hover:text-white shadow-sm"}`}
                        >
                            {pnum}
                        </button>
                    ))}
                    <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className={`px-3 py-1 rounded-md ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#5559d1] shadow-sm"}`}>
                        Next
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
}
