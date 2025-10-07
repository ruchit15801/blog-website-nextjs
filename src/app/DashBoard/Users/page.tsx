"use client";

import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { Pencil, Trash, Search, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { fetchAdminUsers, RemoteUser, updateAdminUser, deleteAdminUser } from "@/lib/adminClient";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<RemoteUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isLimitDropdownOpen, setLimitDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "mid" | "high">("all");

  // Modal & Edit
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<RemoteUser | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadUsers = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchAdminUsers({ page, limit, q: searchTerm || undefined })
      .then((res) => {
        setUsers(res.users || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLimit(res.limit || limit);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [page, limit, searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        (user.fullName || user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      let matchFilter = true;
      const totalPosts = user.totalPosts ?? 0;
      if (filter === "low") matchFilter = totalPosts < 10;
      else if (filter === "mid") matchFilter = totalPosts >= 10 && totalPosts <= 50;
      else if (filter === "high") matchFilter = totalPosts > 50;

      return matchSearch && matchFilter;
    });
  }, [users, searchTerm, filter]);

  const handleEdit = (user: RemoteUser) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      await deleteAdminUser(userId);
      toast.success("User deleted successfully!");
      loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      setUpdating(true);
      const { _id, fullName, role } = editUser;
      await updateAdminUser(_id, { fullName, role });
      toast.success("User updated successfully!");
      loadUsers();
      setShowModal(false);
      setEditUser(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Heading + Search + Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage users, posts and scheduled posts</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="custom-search">
            <Search />
            <input
              type="text"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Filter */}
          <div className="custom-dropdown">
            <button
              onClick={() => setFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center justify-between w-full"
            >
              {filter === "all"
                ? "All Posts"
                : filter === "low"
                  ? "Total Posts < 10"
                  : filter === "mid"
                    ? "Total Posts 10–50"
                    : "Total Posts > 50"}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isFilterDropdownOpen && (
              <div className="options">
                <div
                  className={`option ${filter === "all" ? "selected" : ""}`}
                  onClick={() => {
                    setFilter("all");
                    setFilterDropdownOpen(false);
                  }}
                >
                  All Posts
                </div>
                <div
                  className={`option ${filter === "low" ? "selected" : ""}`}
                  onClick={() => {
                    setFilter("low");
                    setFilterDropdownOpen(false);
                  }}
                >
                  Total Posts &lt; 10
                </div>
                <div
                  className={`option ${filter === "mid" ? "selected" : ""}`}
                  onClick={() => {
                    setFilter("mid");
                    setFilterDropdownOpen(false);
                  }}
                >
                  Total Posts 10–50
                </div>
                <div
                  className={`option ${filter === "high" ? "selected" : ""}`}
                  onClick={() => {
                    setFilter("high");
                    setFilterDropdownOpen(false);
                  }}
                >
                  Total Posts &gt; 50
                </div>
              </div>
            )}
          </div>

          {/* Page Size */}
          <div className="custom-dropdown">
            <button
              onClick={() => setLimitDropdownOpen(!isLimitDropdownOpen)}
              className="flex items-center justify-between w-full"
            >
              {limit} / page
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${isLimitDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isLimitDropdownOpen && (
              <div className="options">
                {[5, 10, 20, 50].map((l) => (
                  <div
                    key={l}
                    className={`option ${limit === l ? "selected" : ""}`}
                    onClick={() => {
                      setLimit(l);
                      setPage(1);
                      setLimitDropdownOpen(false);
                    }}
                  >
                    {l} / page
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                <td colSpan={7} className="px-4 py-6 text-center">
                  <Loader inline label="Loading users" />
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-600">
                  No users found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id || user.email || String(index)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {index + 1 + (page - 1) * limit}
                  </td>

                  <td className="px-4 py-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <Image
                        src={user.avatarUrl || user.avatar || "/images/default-avatar.png"}
                        alt={user.fullName || user.name || "User"}
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
                      style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                      <Pencil className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-red-700 transition-colors"
                      style={{ background: "linear-gradient(180deg, #ff5a5f 0%, #c12a2a 100%)" }}>
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 lg:col-span-3">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>


      {/* Edit Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Full Name</label>
                <input
                  type="text"
                  value={editUser.fullName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, fullName: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
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
