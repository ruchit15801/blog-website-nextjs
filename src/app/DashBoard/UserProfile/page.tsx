"use client";

import { PencilIcon } from "lucide-react";
import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchAdminMeProfile, type AdminMeProfile } from "@/lib/adminClient";
import { logoutAndRedirect } from "@/lib/auth";

type UserProfileType = {
    fullName: string;
    email: string;
    role?: string;
    createdAt?: string;
    avatar?: string;
};

export default function UserProfileWithCategories() {
    const [profile, setProfile] = useState<UserProfileType>(() => ({ fullName: "", email: "", role: "", createdAt: "", avatar: "" }));

    // Update localStorage whenever profile changes
    useEffect(() => {
        localStorage.setItem("userProfile", JSON.stringify({ fullName: profile.fullName, email: profile.email, avatar: profile.avatar, role: profile.role }));
        window.dispatchEvent(new Event("storage"));
    }, [profile]);

    // Load profile from API
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const me: AdminMeProfile = await fetchAdminMeProfile();
                if (!active) return;
                setProfile({
                    fullName: me.fullName || "",
                    email: me.email,
                    role: me.role,
                    createdAt: me.createdAt,
                    avatar: me.avatar || me.avatarUrl || "",
                });
            } catch {
                // keep local profile fallback
            }
        })();
        return () => { active = false; };
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        reader.readAsDataURL(file);
    };

    // removed unused category handlers
    const handleLogout = () => { logoutAndRedirect(); };

    return (
        <DashboardLayout>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
                >
                    Logout
                </button>
            </div>
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <div className="flex gap-6 items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profile.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-gray-500">No Avatar</span>
                            )}

                            {/* Edit Icon overlay */}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-25 opacity-0 hover:opacity-100 cursor-pointer rounded-full transition">
                                <PencilIcon className="w-5 h-5 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">{profile.fullName || "Unnamed"}</h1>
                            <p className="text-gray-600">{profile.email}</p>
                            <div className="mt-2 flex gap-2 text-sm">
                                {profile.role && (
                                    <span className="px-2 py-1 rounded-md text-white" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>{profile.role}</span>
                                )}
                                {profile.createdAt && (
                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">Joined {new Date(profile.createdAt).toDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
