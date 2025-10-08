"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashBoardLayout";
import { BarChart3, Users, MessageSquare, Calendar } from "lucide-react";
import {
  fetchAdminDashboard,
  fetchAdminMeProfile,
  type AdminDashboardData,
  type AdminMeProfile,
} from "@/lib/adminClient";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { fetchMyProfile, fetchUserDashboard, MeProfile, UserDashboardData } from "@/lib/api";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center justify-center">
    <div className={`p-4 rounded-full mb-3 ${color}`}>{icon}</div>
    <span className="text-3xl font-bold">{value}</span>
    <span className="text-gray-500 mt-1">{title}</span>
  </div>
);

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | UserDashboardData | null>(null);
  const [profile, setProfile] = useState<AdminMeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "user"; // store role in localStorage

  // Save profile info to localStorage whenever it updates
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

  // Load dashboard data (profile + stats) based on role
  useEffect(() => {
    if (!token) {
      toast.error("User token missing. Please login again.");
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        let me: AdminMeProfile | MeProfile;
        let stats: AdminDashboardData | UserDashboardData;

        if (role === "admin") {
          // Admin API calls
          me = await fetchAdminMeProfile(token);
          stats = await fetchAdminDashboard(token);
        } else {
          // User API calls
          me = await fetchMyProfile(token);
          stats = await fetchUserDashboard(token);
        }

        if (!active) return;

        // Set data in state
        setProfile(me);
        setDashboard(stats);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        toast.error("Failed to load dashboard. Please login again.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [token, role]);



  if (loading) return <Loader inline label="Loading dashboard..." />;

  const isAdmin = profile?.role === "admin";

  // Admin Stats
  const statsAdmin = [
    { title: "My Posts", value: (dashboard as AdminDashboardData)?.myPosts ?? 0, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
    { title: "Total Users", value: (dashboard as AdminDashboardData)?.users ?? 0, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
    { title: "Scheduled Posts", value: (dashboard as AdminDashboardData)?.scheduledPosts ?? 0, icon: <Calendar size={28} />, color: "bg-yellow-100 text-yellow-600" },
    { title: "Categories", value: (dashboard as AdminDashboardData)?.categories ?? 0, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
    { title: "Total Posts", value: (dashboard as AdminDashboardData)?.posts ?? 0, icon: <BarChart3 size={28} />, color: "bg-purple-100 text-purple-600" },
    { title: "Published Posts", value: (dashboard as AdminDashboardData)?.publishedPosts ?? 0, icon: <Users size={28} />, color: "bg-indigo-100 text-indigo-600" },
  ];

  // User Stats (from API)
  const statsUser = [
    { title: "My Posts", value: (dashboard as UserDashboardData)?.myPosts ?? 0, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
    { title: "Scheduled Posts", value: (dashboard as UserDashboardData)?.scheduledPosts ?? 0, icon: <Calendar size={28} />, color: "bg-yellow-100 text-yellow-600" },
    { title: "My Likes", value: (dashboard as UserDashboardData)?.likes ?? 0, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
    { title: "My Comments", value: (dashboard as UserDashboardData)?.comments ?? 0, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
  ];

  const statsToShow = isAdmin ? statsAdmin : statsUser;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsToShow.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </DashboardLayout>
  );
}

