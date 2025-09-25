import React from "react";
import DashboardLayout from "./DashBoardLayout";
import { BarChart3, Users, MessageSquare, Calendar } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: string;
}

interface DashboardPageProps {
    role?: "admin" | "user";
    user?: { name: string; email: string };
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className={`p-4 rounded-full mb-3 ${color}`}>{icon}</div>
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-gray-500 mt-1">{title}</span>
    </div>
);


export default function DashboardPage({role}: DashboardPageProps) {
    const statsAdmin = [
        { title: "All User Posts", value: 120, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
        { title: "All Likes", value: 450, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
        { title: "All Comments", value: 320, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
    ];

    const statsUser = [
        { title: "My Posts", value: 20, icon: <BarChart3 size={28} />, color: "bg-blue-100 text-blue-600" },
        { title: "My Likes", value: 200, icon: <Users size={28} />, color: "bg-pink-100 text-pink-600" },
        { title: "My Comments", value: 75, icon: <MessageSquare size={28} />, color: "bg-green-100 text-green-600" },
        { title: "Scheduled Posts", value: 5, icon: <Calendar size={28} />, color: "bg-yellow-100 text-yellow-600" },
    ];

    const statsToShow = role === "admin" ? statsAdmin : statsUser;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsToShow.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
}
