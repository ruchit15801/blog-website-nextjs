"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Tag,
  Clipboard,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAdminMeProfile,
  type AdminMeProfile,
} from "@/lib/adminClient";
import { fetchMyProfile, MeProfile } from "@/lib/api";

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
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : "user";

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        })
      );
      window.dispatchEvent(new Event("storage"));
    }
  }, [user]);

  // 🔹 Load profile dynamically based on role
  useEffect(() => {
    if (!token) {
      toast.error("Token missing. Redirecting to login...");
      router.replace("/auth");
      return;
    }

    let active = true;

    (async () => {
      try {
        let me: MeProfile | AdminMeProfile;

        if (storedRole === "admin") {
          me = await fetchAdminMeProfile(token);
        } else {
          me = await fetchMyProfile(token);
        }

        if (!active) return;

        const avatarUrl =
          "avatarUrl" in me ? me.avatarUrl : "avatar" in me ? me.avatar : "";

        const normalizedRole =
          me.role === "admin" || me.role === "user" ? me.role : "user";

        setUser({
          fullName: me.fullName || "",
          email: me.email || "",
          avatar: avatarUrl || "/images/default-avatar.png",
          role: normalizedRole,
          createdAt: me.createdAt,
        });

        setRole(normalizedRole);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to fetch user. Redirecting to login...");
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [token, storedRole, router]);

  if (loading) return <Loader />;

  // ✅ Menus
  const adminMenu = [
    { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
    { icon: <BarChart3 />, label: "Create Posts", path: "/DashBoard/Create_post" },
    { icon: <FileText />, label: "See Posts", path: "/DashBoard/See_all_post" },
    { icon: <Users />, label: "Users", path: "/DashBoard/Users" },
    { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/Schedule_post" },
    { icon: <Clipboard />, label: "User Posts", path: "/DashBoard/User_post" },
    { icon: <Tag />, label: "Categories", path: "/DashBoard/Categories" },
    { icon: <Settings />, label: "Setting", path: "/DashBoard/UserProfile" },
  ];

  const userMenu = [
    { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
    { icon: <BarChart3 />, label: "Create Post", path: "/DashBoard/Create_post" },
    { icon: <FileText />, label: "See Posts", path: "/DashBoard/See_all_post" },
    { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/Schedule_post" },
    { icon: <Settings />, label: "Setting", path: "/DashBoard/UserProfile" },
  ];

  const menus = role === "admin" ? adminMenu : userMenu;

  return (
    <div className="flex min-h-screen bg-gray-100 dashboard-skin">
      <aside className={`bg-white shadow-md flex flex-col p-4 fixed top-0 left-0 h-screen overflow-auto transition-transform duration-200 w-64 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <Link href="/" className="navbar-logo">
          <Image src="/images/BlogCafe_Logo.svg" alt="BlogCafeAI" width={130} height={130} priority />
        </Link>

        <nav className="flex flex-col gap-2 mt-6">
          {menus.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-gray-700 ${pathname === item.path
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="bg-white shadow flex justify-between items-center px-4 md:px-6 h-16 sticky top-0 z-20">
          <button className="md:hidden p-2 rounded-lg border border-gray-200" onClick={() => setOpen(v => !v)} aria-label="Toggle sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="#29294b" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <div className="flex items-center gap-4 ml-auto">
            {user && (
              <>
                <div className="flex flex-col text-right">
                  <span className="font-medium text-gray-700">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>

                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={user.avatar || "/images/default-avatar.png"}
                    alt={user.fullName || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
