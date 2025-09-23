"use client";

import React, { useEffect, useState } from "react";
import { Home, BarChart3, Users, MessageSquare, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: string;
}

const StatCard = ({ title, value, icon, color = "bg-blue-100 text-blue-600" }: StatCardProps) => {
    return (
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className={`p-4 rounded-full mb-3 ${color}`}>{icon}</div>
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-gray-500 mt-1">{title}</span>
        </div>
    );
};

export default function DashboardPage() {
    const [role, setRole] = useState<"admin" | "user">("user");
    const pathname = usePathname();

    useEffect(() => {
        const storedRole = localStorage.getItem("role") as "admin" | "user" | null;
        if (storedRole) setRole(storedRole);
    }, []);

    // Menus with routes
    const adminMenu = [
        { icon: <Home />, label: "Dashboard", path: "/DashBoard" },
        { icon: <BarChart3 />, label: "Create Posts", path: "/DashBoard/create-posts" },
        { icon: <Settings />, label: "See Posts", path: "/DashBoard/posts" },
        { icon: <Users />, label: "Users", path: "/DashBoard/users" },
        { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/schedule" },
        { icon: <Settings />, label: "User Posts", path: "/DashBoard/user-posts" },
        { icon: <Settings />, label: "Categories", path: "/DashBoard/categories" },
    ];

    const userMenu = [
        { icon: <Home />, label: "Dashboard" , path: "/DashBoard" },
        { icon: <BarChart3 />, label: "Create Post", path: "DashBoard/Create_post" },
        { icon: <Settings />, label: "See Posts", path: "/DashBoard/posts" },
        { icon: <Calendar />, label: "Schedule Post", path: "/DashBoard/schedule" },
    ];

    const adminStats = [
        { title: "Total Posts", value: 500, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
        { title: "User Posts", value: 320, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
        { title: "User Scheduled", value: 80, icon: <Calendar size={28} />, color: "bg-orange-100 text-orange-600" },
        { title: "Admin Scheduled", value: 40, icon: <Calendar size={28} />, color: "bg-purple-100 text-purple-600" },
        { title: "Total Users", value: 120, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
    ];

    const userStats = [
        { title: "My Posts", value: 20, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
        { title: "My Likes", value: 200, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
        { title: "My Comments", value: 75, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
    ];

    const stats = role === "admin" ? adminStats : userStats;
    const menus = role === "admin" ? adminMenu : userMenu;

    const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/signUp";
    };

    return (
        <>
            <header className="navbar-header bg-white shadow px-4 py-2 flex justify-between items-center">
                <Link href="/" className="navbar-logo">
                    <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col text-right">
                        <span className="font-medium text-gray-700">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md flex flex-col p-4 fixed top-0 left-0 h-screen overflow-auto">
                    <nav className="flex flex-col gap-2 mt-14">
                        {menus.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path ?? "/Dashboard"} // agar undefined ho toh default dashboard use hoga
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-gray-700
    ${pathname === item.path ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>

                        ))}
                    </nav>
                </aside>

                {/* Main */}
                <main className="flex-1 p-8 ml-64">
                    <h1 className="text-3xl font-semibold mb-6">
                        {menus.find(m => m.path === pathname)?.label || "Dashboard"} ({role})
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <StatCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                color={stat.color}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
