"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, Users, Calendar, FileText, Tag, Clipboard, Settings } from "lucide-react";
import { getMe } from "@/lib/api";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface UserType {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email: string;
  avatar?: string; 
  avatarUrl?: string; 
  role?: "admin" | "user";
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token not found. Redirecting to login...");
        router.replace("/auth");
        return;
      }

      try {
        const res = await getMe(token);
        const u: UserType = res.user;

        setUser({
          name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.email,
          avatar: u.avatarUrl || u.avatar || "/images/default-avatar.png",
          role: u.role,
        });

        setRole(u.role || null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user. Redirecting to login...");
        router.replace("/auth"); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <Loader />;

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
      <aside className="w-64 bg-white shadow-md flex flex-col p-4 fixed top-0 left-0 h-screen overflow-auto">
        <Link href="/" className="mb-4">
          <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
        </Link>

        <nav className="flex flex-col gap-2 mt-6">
          {menus.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-gray-700 ${pathname === item.path ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <header className="bg-white shadow flex justify-end items-center px-6 h-16 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex flex-col text-right">
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>

                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={user.avatar || "/images/default-avatar.png"}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
