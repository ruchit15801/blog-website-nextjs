"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, Users, Calendar, FileText,Tag, Clipboard, Settings, MessageCircle,} from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminMeProfile } from "@/lib/adminClient";
import { fetchMyProfile } from "@/lib/api";
import { logoutAndRedirect } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface UserType {
  fullName: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
  createdAt?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedRole = (typeof window !== "undefined" ? localStorage.getItem("role") : "user") as | "admin" | "user";

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("userProfile", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
  }, [user]);

  useEffect(() => {
    if (!token) {
      toast.error("Token missing. Redirecting to login...");
      router.replace("/auth");
      return;
    }
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const fetchProfile = storedRole === "admin" ? fetchAdminMeProfile : fetchMyProfile;
        const me = await fetchProfile(token);
        if (!isMounted) return;
        const avatar = me.avatarUrl || "/images/p1.jpg";
        setUser({
          fullName: me.fullName ?? "",
          email: me.email ?? "",
          avatar,
          role: me.role === "admin" ? "admin" : "user", 
          createdAt: me.createdAt,
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        router.replace("/auth");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [token, storedRole, router]);

  if (loading) return <Loader />;

  const menus =
    user?.role === "admin" ? [
      { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
      { icon: <BarChart3 />, label: "Create Posts", path: "/DashBoard/Create_post" },
      { icon: <FileText />, label: "See Posts", path: "/DashBoard/See_all_post" },
      { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/Schedule_post" },
      { icon: <Tag />, label: "Categories", path: "/DashBoard/Categories" },
      { icon: <Users />, label: "Users", path: "/DashBoard/Users" },
      { icon: <Clipboard />, label: "User Posts", path: "/DashBoard/User_post" },
      { icon: <MessageCircle />, label: "Contact Us", path: "/DashBoard/Admin_contact_us" },
      { icon: <Settings />, label: "Profile", path: "/DashBoard/UserProfile" },
    ]
      : [
        { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
        { icon: <BarChart3 />, label: "Create Post", path: "/DashBoard/Create_post" },
        { icon: <FileText />, label: "See Posts", path: "/DashBoard/See_all_post" },
        { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/Schedule_post" },
        { icon: <Settings />, label: "Profile", path: "/DashBoard/UserProfile" },
      ];

  const handleLogout = () => logoutAndRedirect();

  return (
    <div className="relative flex min-h-screen bg-gray-50 dashboard-skin overflow-x-hidden">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-white to-gray-50 shadow-lg flex flex-col p-4 
        fixed top-0 left-0 h-screen transition-transform duration-300 w-64 z-30 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <Image
            src="/images/BlogCafe_Logo.svg"
            alt="BlogCafeAI"
            width={140}
            height={140}
            priority
            className="hover:scale-105 transition-transform"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {menus.map(({ icon, label, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                className={`group flex items-center gap-4 px-4 py-2.5 rounded-xl font-medium transition-colors ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white !text-white shadow-md" : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:!text-white hover:shadow-md"}`}
                onClick={() => setOpen(false)}>
                <span className={`transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {icon}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Sidebar Footer */}
        {user && (
          <div className="mt-auto pt-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100">
              <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                <Image src={user.avatar || '/images/p1.jpg'} alt={user.fullName} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">{user.fullName}</span>
                <span className="text-xs text-gray-500">{user.role.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Backdrop (Mobile) */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow flex justify-between items-center px-4 md:px-6 h-16 sticky top-0 z-20">
          <button
            className="md:hidden p-2 rounded-lg border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle sidebar">
            <svg width="24" height="24" stroke="#29294b" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          {/* Right User Area */}
          {user && (
            <div className="flex items-center gap-4 ml-auto relative">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setDropdownOpen((v) => !v)}>
                <div className="text-right">
                  <span className="font-medium">{user.fullName}</span>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="w-10 h-10 relative rounded-full overflow-hidden border hover:shadow-md">
                  <Image src={user.avatar || '/images/p1.jpg'} alt={user.fullName} fill className="object-cover" />
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-14 right-0 w-52 bg-white shadow-lg rounded-xl overflow-hidden animate-fadeIn">
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-4 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={() => setDropdownOpen(false)}>
                    🏠 <span>Home</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-4 text-sm bg-red-500 hover:bg-red-700 text-white transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main
          className="flex-1 p-2"
          style={{ background: "linear-gradient(180deg, #fdfdff 0%, #f8f7ff 100%)", }}>
          {children}
        </main>
      </div>
    </div>
  );
}