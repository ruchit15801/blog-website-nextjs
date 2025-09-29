"use client";

import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { fetchAdminUsers, RemoteUser } from "@/lib/adminClient";

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RemoteUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🔎 Search + Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | mid | high

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchAdminUsers({ page, limit, q: searchTerm || undefined })
      .then((res) => {
        if (!active) return;
        setItems(res.users || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLimit(res.limit || limit);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [page, limit, searchTerm]);

  // Filter logic
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

  return (
    <DashboardLayout>
      {/* ---- Heading + Search + Filter ---- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage users, posts and scheduled posts</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or email"
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5559d1] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter dropdown */}
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

          {/* Page size */}
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

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => alert(`Edit ${user.fullName || user.name}`)}
                    className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-[#4447b3] transition-colors"
                    style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}
                  >
                    <Pencil className="w-5 h-5" />
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
    </DashboardLayout>
  );
}
