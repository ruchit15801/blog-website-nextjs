"use client";

import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { Pencil, Trash, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { fetchAdminUsers, RemoteUser, updateAdminUser, deleteAdminUser } from "@/lib/adminClient";

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RemoteUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); 

  // --- Edit Modal ---
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<RemoteUser | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    fetchAdminUsers({ page, limit, q: searchTerm || undefined })
      .then((res) => {
        setItems(res.users || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLimit(res.limit || limit);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [page, limit, searchTerm]);

  const filteredUsers = useMemo(() => items.filter((u) => {
    const matchSearch =
      (u.fullName || u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    let matchFilter = true;
    const totalPosts = u.totalPosts ?? 0;
    if (filter === "low") matchFilter = totalPosts < 10;
    else if (filter === "mid") matchFilter = totalPosts >= 10 && totalPosts <= 50;
    else if (filter === "high") matchFilter = totalPosts > 50;

    return matchSearch && matchFilter;
  }), [items, searchTerm, filter]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handleEdit = (user: RemoteUser) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        await deleteAdminUser(userId);
        loadUsers();
      } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setUpdating(true);
      const { _id, fullName, role } = editUser;
      await updateAdminUser(_id, { fullName, role });
      loadUsers();
      setShowModal(false);
      setEditUser(null);

    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      {/* ---- Heading + Search + Filter ---- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage users, posts and scheduled posts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or email"
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5559d1] text-sm"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
          >
            <option value="all">All Posts</option>
            <option value="low">Total Posts &lt; 10</option>
            <option value="mid">Total Posts 10–50</option>
            <option value="high">Total Posts &gt; 50</option>
          </select>
          <select
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="table-auto w-full text-left text-sm">
          <thead style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }} className="text-white">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Posts</th>
              <th className="px-4 py-3">Scheduled Posts</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center" colSpan={7}><Loader inline label="Loading users" /></td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-red-600" colSpan={7}>{error}</td>
              </tr>
            )}
            {!loading && !error && filteredUsers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-600" colSpan={7}>No users found.</td>
              </tr>
            )}
            {!loading && !error && filteredUsers.map((user, index) => (
              <tr
                key={user._id || user.email || String(index)}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{index + 1 + (page - 1) * limit}</td>

                <td className="px-4 py-3">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden">
                    <Image
                      src={user.avatarUrl || user.avatar || "/images/default-avatar.png"}
                      alt={(user.fullName || user.name || "User") as string}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-800">{user.fullName || user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-800">{user.totalPosts ?? 0}</td>
                <td className="px-4 py-3 text-gray-800">{user.scheduledPosts ?? 0}</td>

                <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-[#4447b3] transition-colors"
                    style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-red-700 transition-colors"
                    style={{ background: "linear-gradient(180deg, #ff5a5f 0%, #c12a2a 100%)" }}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Pagination ---- */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length ? (page - 1) * limit + 1 : 0}–{(page - 1) * limit + filteredUsers.length} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => canPrev && setPage((p) => p - 1)}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded border ${canPrev ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400"}`}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-sm text-gray-700 px-2">Page {page} / {totalPages}</span>
          <button
            disabled={!canNext}
            onClick={() => canNext && setPage((p) => p + 1)}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded border ${canNext ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400"}`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---- Edit Modal ---- */}
      {showModal && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
              <div className="flex flex-col gap-2">
                <label className="font-medium">Full Name</label>
                <input
                  type="text"
                  value={editUser.fullName || ""}
                  onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                  style={{background : '#f9fafb' , border : '1px solid #e5e7eb' , borderRadius : '10px' , padding : '10px 12px'}}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Role</label>
                <select
                  value={editUser.role || "user"}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
