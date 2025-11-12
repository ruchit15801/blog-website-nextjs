"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  fetchAdminDashboard,
  fetchAdminMeProfile,
  type AdminDashboardData,
  type AdminMeProfile,
} from "@/lib/adminClient";
import { fetchMyProfile, fetchUserDashboard, MeProfile, UserDashboardData } from "@/lib/api";
import Loader from "@/components/Loader";

const DashboardLayout = dynamic(() => import("./DashBoardLayout"), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading layout...</p>,
});
const BarChart3 = dynamic(() => import("lucide-react").then(mod => mod.BarChart3), { ssr: false });
const Users = dynamic(() => import("lucide-react").then(mod => mod.Users), { ssr: false });
const Calendar = dynamic(() => import("lucide-react").then(mod => mod.Calendar), { ssr: false });
const MessageSquare = dynamic(() => import("lucide-react").then(mod => mod.MessageSquare), { ssr: false });

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color?: string }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
    <div className={`p-4 rounded-full mb-4 flex items-center justify-center ${color} shadow-inner`}>
      {icon}
    </div>
    <span className="text-3xl font-extrabold text-gray-900">{value}</span>
    <span className="text-gray-500 mt-2 text-sm">{title}</span>
  </div>
);

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | UserDashboardData | null>(null);
  const [profile, setProfile] = useState<AdminMeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "user";

  // Save profile in localStorage for global use
  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        fullName: profile.fullName,
        email: profile.email,
        avatar: profile.avatar,
        role: profile.role,
      })
    );
    window.dispatchEvent(new Event("storage"));
  }, [profile]);

  useEffect(() => {
    if (!token) {
      toast.error("User token missing. Please login again.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        let me: AdminMeProfile | MeProfile;
        let stats: AdminDashboardData | UserDashboardData;

        if (role === "admin") {
          me = await fetchAdminMeProfile(token);
          stats = await fetchAdminDashboard(token);
        } else {
          me = await fetchMyProfile(token);
          stats = await fetchUserDashboard(token);
        }

        if (!active) return;
        setProfile(me);
        setDashboard(stats);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        toast.error("Your session has expired. Please sign in again to continue.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [token, role]);

  if (loading) return <Loader inline label="Loading dashboard..." />;

  const isAdmin = profile?.role === "admin";

  const statsAdmin = [
    { title: "My Posts", value: (dashboard as AdminDashboardData)?.myPosts ?? 0, icon: <BarChart3 size={28} />, color: "bg-gradient-to-tr from-blue-200 to-blue-400 text-blue-700" },
    { title: "Total Users", value: (dashboard as AdminDashboardData)?.users ?? 0, icon: <Users size={28} />, color: "bg-gradient-to-tr from-pink-200 to-pink-400 text-pink-700" },
    { title: "Scheduled Posts", value: (dashboard as AdminDashboardData)?.scheduledPosts ?? 0, icon: <Calendar size={28} />, color: "bg-gradient-to-tr from-yellow-200 to-yellow-400 text-yellow-700" },
    { title: "Categories", value: (dashboard as AdminDashboardData)?.categories ?? 0, icon: <MessageSquare size={28} />, color: "bg-gradient-to-tr from-green-200 to-green-400 text-green-700" },
    { title: "Total Posts", value: (dashboard as AdminDashboardData)?.posts ?? 0, icon: <BarChart3 size={28} />, color: "bg-gradient-to-tr from-purple-200 to-purple-400 text-purple-700" },
    { title: "Published Posts", value: (dashboard as AdminDashboardData)?.publishedPosts ?? 0, icon: <Users size={28} />, color: "bg-gradient-to-tr from-indigo-200 to-indigo-400 text-indigo-700" },
  ];

  const statsUser = [
    { title: "My Posts", value: (dashboard as UserDashboardData)?.myPosts ?? 0, icon: <BarChart3 size={28} />, color: "bg-gradient-to-tr from-blue-200 to-blue-400 text-blue-700" },
    { title: "Scheduled Posts", value: (dashboard as UserDashboardData)?.scheduledPosts ?? 0, icon: <Calendar size={28} />, color: "bg-gradient-to-tr from-yellow-200 to-yellow-400 text-yellow-700" },
    { title: "My Likes", value: (dashboard as UserDashboardData)?.likes ?? 0, icon: <Users size={28} />, color: "bg-gradient-to-tr from-pink-200 to-pink-400 text-pink-700" },
    { title: "My Comments", value: (dashboard as UserDashboardData)?.comments ?? 0, icon: <MessageSquare size={28} />, color: "bg-gradient-to-tr from-green-200 to-green-400 text-green-700" },
  ];

  const statsToShow = isAdmin ? statsAdmin : statsUser;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-8 py-12 rounded-xl text-white shadow-lg"
           style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-200">Welcome back, {profile?.fullName}</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold hover:bg-purple-100 transition">
            <Link href='/DashBoard/Create_post'>Add Post</Link>
          </button>
          {isAdmin && (
            <button className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-100 transition">
              <Link href='/DashBoard/Users'> View Users</Link>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsToShow.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>
    </DashboardLayout>
  );
}
