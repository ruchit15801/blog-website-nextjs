"use client";

import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { Pencil, Search } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "/images/aside_tech.webp", totalPosts: 12, scheduledPosts: 3 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "/images/aside_about.webp", totalPosts: 8, scheduledPosts: 1 },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", avatar: "/images/aside_tech2.webp", totalPosts: 20, scheduledPosts: 6 },
    { id: 4, name: "Diana Prince", email: "diana@example.com", avatar: "/images/aside_tech3.webp", totalPosts: 5, scheduledPosts: 0 },
    { id: 5, name: "Diana Prince", email: "diana@example.com", avatar: "/images/c1.jpeg", totalPosts: 15, scheduledPosts: 10 },
    { id: 6, name: "Diana Prince", email: "diana@example.com", avatar: "/images/c2.jpeg", totalPosts: 115, scheduledPosts: 20 },
    { id: 7, name: "Diana Prince", email: "diana@example.com", avatar: "/images/aside_tech1.webp", totalPosts: 25, scheduledPosts: 320 },
    { id: 8, name: "Diana Prince", email: "diana@example.com", avatar: "/images/about2.webp", totalPosts: 45, scheduledPosts: 43 },
    { id: 9, name: "Diana Prince", email: "diana@example.com", avatar: "/images/about1.webp", totalPosts: 35, scheduledPosts: 20 },
    { id: 10, name: "Diana Prince", email: "diana@example.com", avatar: "/images/favicon.png", totalPosts: 65, scheduledPosts: 70 },
  ];

  // 🔎 Search + Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | mid | high

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    let matchFilter = true;
    if (filter === "low") matchFilter = u.totalPosts < 10;
    else if (filter === "mid") matchFilter = u.totalPosts >= 10 && u.totalPosts <= 50;
    else if (filter === "high") matchFilter = u.totalPosts > 50;

    return matchSearch && matchFilter;
  });

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
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="table-auto w-full text-left text-sm">
          <thead style={{ background : "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }} className="text-white">
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
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>

                <td className="px-4 py-3">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-800">{user.totalPosts}</td>
                <td className="px-4 py-3 text-gray-800">{user.scheduledPosts}</td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => alert(`Edit ${user.name}`)}
                    className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-[#4447b3] transition-colors"
                    style={{ background : "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }} 
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
