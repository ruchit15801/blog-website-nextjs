"use client";
import DashboardLayout from "../DashBoardLayout";
import { Edit2, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import Loader from "@/components/Loader";
import { listCategories, createCategory, type Category } from "@/lib/api";
import { deleteCategory, updateCategory, getAdminToken } from "@/lib/adminClient";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type CategoryType = {
  id: string | number;
  name: string;
  shortName: string;
  description: string;
  avatar?: string;
  imagePreview?: string;
  image?: File | null;
};

const CategoryCard = ({ cat, handleEdit, handleDelete }: { cat: CategoryType; handleEdit: (cat: CategoryType) => void; handleDelete: (id: string | number) => void }) => {
  const [showDesc, setShowDesc] = useState(false);
  const shortDesc = cat.description?.slice(0, 60) ?? "";

  return (
    <div className="relative flex items-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
      {/* Image */}
      <div className="relative w-1/3 h-35 bg-gray-100 flex-shrink-0">
        {cat.avatar ? (
          <Image src={cat.avatar} alt={cat.name} fill className="object-cover w-full h-full" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-4 w-2/3 relative">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button onClick={() => handleEdit(cat)} className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 shadow-sm" title="Edit Category">
            <Edit2 className="w-4 h-4 text-indigo-600" />
          </button>
          <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 shadow-sm" title="Delete Category">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
          <p className="text-indigo-600 text-sm font-medium py-1">{cat.shortName}</p>
          {cat.description && (
            <div className="mt-2 text-sm text-gray-600">
              <span>{showDesc ? cat.description : shortDesc}{!showDesc && cat.description.length > 60 && "..."}</span>
              {cat.description.length > 60 && (
                <button onClick={() => setShowDesc(!showDesc)} className="ml-1 text-indigo-600 font-bold hover:underline bg-transparent border-0 p-0">
                  {showDesc ? "View Less" : "View More"}
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
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && error) {
      router.replace("/error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) return;
        const { categories, data } = await listCategories(token);
        const list = (categories || data || []) as Category[];

        setCategories(
          list.map(c => ({
            id: c._id,
            name: c.name,
            shortName: c.slug,
            description: c.description || "",
            avatar: c.imageUrl,
          }))
        );
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Edit category
  const handleEdit = (cat: CategoryType) => {
    setForm({ ...cat, imagePreview: cat.avatar });
    setEditId(cat.id);
    setShowCreate(true);
  };

  // Delete category
  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const adminToken = getAdminToken();
      if (!adminToken) return toast.error("Admin token missing. Please login as admin.");
      await deleteCategory(String(id));
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted successfully!");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // Create / Update category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.shortName.trim()) {
      return toast.error("Name and Short Name are required");
    }
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");
    const payload = {
      name: form.name,
      slug: form.shortName,
      description: form.description,
      imageFile: form.image || undefined,
    };

    try {
      setCreating(true);
      if (editId) {
        const adminToken = getAdminToken();
        if (!adminToken) return toast.error("Admin token missing.");
        await updateCategory(String(editId), payload);

        setCategories(prev =>
          prev.map(c =>
            c.id === editId ? { ...form, id: editId, avatar: form.imagePreview } : c
          )
        );
        toast.success("Category updated successfully!");
        setEditId(null);
      } else {
        await createCategory(payload, token);
        const newCat = {
          ...form,
          id: Date.now(),
          avatar: form.imagePreview,
        };

        setCategories(prev => [newCat, ...prev]);
        toast.success("Category created successfully!");
      }
      setForm({ id: 0, name: "", shortName: "", description: "", avatar: "" });
      setShowCreate(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const filtered = useMemo(() => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.shortName.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);

  return (
    <DashboardLayout>
      <div className="flex flex-col shadow-xl pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-12 rounded-xl" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
          <h1 className="text-3xl font-bold text-white text-center lg:text-left w-full lg:w-auto">Categories</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-3 lg:mt-0">
            <div className="custom-search w-full sm:w-64 flex items-center gap-2">
              <Search />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full mt-2 sm:mt-0 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button onClick={() => setShowCreate(true)} className="create_schedule px-4 py-2 rounded-lg text-white transition font-medium shine hover:scale-105 sm:w-auto">Create Category</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {loading && <div className="col-span-full text-center py-10"><Loader inline label="Loading categories" /></div>}
          {error && <div className="col-span-full text-center text-red-500 py-4">{error}</div>}
          {!loading && paginated.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No categories found.</div>}
          {!loading && paginated.map(cat => <CategoryCard key={cat.id} cat={cat} handleEdit={handleEdit} handleDelete={handleDelete} />)}
        </div>

        {/* Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowCreate(false)} />
            <div className="relative z-10 w-full max-w-xl sm:max-w-lg md:max-w-xl bg-white rounded-2xl shadow-lg border border-[#e2e4ff] p-6 transform transition-all scale-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold text-[#2d2b5a]">{editId ? "Edit Category" : "Create New Category"}</h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-[#514dcc] transition-colors text-xl font-semibold">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-col md:flex-row gap-4 md:gap-5">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="font-medium text-[#29294b]">Category Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter category name" className="border border-[#d1d5db] rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#514dcc] focus:border-transparent transition-all shadow-sm placeholder:text-gray-400" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <label className="font-medium text-[#29294b]">Slug</label>
                    <input type="text" value={form.shortName} onChange={e => setForm(p => ({ ...p, shortName: e.target.value }))} placeholder="Enter slug" className="border border-[#d1d5db] rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#514dcc] focus:border-transparent transition-all shadow-sm placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-[#29294b]">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Write a short description..." className="border border-[#d1d5db] rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#514dcc] focus:border-transparent transition-all min-h-[90px] shadow-sm placeholder:text-gray-400" />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-[#29294b]">Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                    {form.imagePreview && <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#d1d5db] shadow-sm bg-[#f9fafb] hover:shadow-md transition-all"><Image src={form.imagePreview} alt="Preview" fill className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" /></div>}
                    <label htmlFor="cat-image-input" className="flex items-center justify-center border border-dashed border-[#514dcc]/50 rounded-xl px-4 py-2.5 w-full sm:w-60 bg-[#f7f8ff] hover:bg-[#f2f3ff] text-[#514dcc] font-medium cursor-pointer transition-all">
                      📁 Upload Image
                      <input id="cat-image-input" type="file" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setForm(p => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }));
                      }} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 w-full sm:w-auto text-gray-700 hover:bg-gray-100 transition-all">Cancel</button>
                  <button type="submit" disabled={creating} className="px-6 py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-60 w-full sm:w-auto transition-all bg-gradient-to-r from-[#7b79ff] to-[#514dcc] hover:shadow-lg hover:shadow-[#514dcc]/30">
                    {creating ? (editId ? "Updating..." : "Creating...") : (editId ? "Update" : "Create")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && paginated.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
