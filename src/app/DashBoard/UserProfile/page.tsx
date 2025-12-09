"use client";

import { Facebook, Instagram, Linkedin, LogOutIcon, PencilIcon, XIcon } from "lucide-react";
import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { logoutAndRedirect } from "@/lib/auth";
import {
    fetchMyProfile as fetchUserProfile,
    updateMyProfile as updateUserProfile,
    type MeProfile,
} from "@/lib/api";
import {
    fetchAdminMeProfile,
    updateAdminProfileAPI,
    type AdminMeProfile,
} from "@/lib/adminClient"; // admin API

type UserProfileType = {
    fullName: string;
    email: string;
    role?: string;
    createdAt?: string;
    avatar?: string;
};

export default function UserProfileWithCategories() {
    const [profile, setProfile] = useState<UserProfileType>({fullName: "", email: "", role: "", createdAt: "", avatar: "",});
    const [loading, setLoading] = useState(false);
    const [socialLinks, setSocialLinks] = useState<{ twitter?: string; facebook?: string; instagram?: string; linkedin?: string }>({});
    const isValidUrl = (u?: string) => {
        if (!u || !u.trim()) return false;
        try { new URL(u); return true; } catch { return false; }
    };

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : "user"; // store role in localStorage

    // Update localStorage whenever profile changes
    useEffect(() => {
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

    // Load profile from API based on role
    useEffect(() => {
        if (!token) return;
        let active = true;
        (async () => {
            try {
                let me: MeProfile | AdminMeProfile;
                if (role === "admin") {
                    me = await fetchAdminMeProfile(token);
                } else {
                    me = await fetchUserProfile(token);
                }
                if (!active) return;
                const avatarUrl = 'avatarUrl' in me ? me.avatarUrl : 'avatar' in me ? me.avatar : '/images/p1.jpg';
                setProfile({
                    fullName: me.fullName || "",
                    email: me.email,
                    role: me.role,
                    createdAt: me.createdAt,
                    avatar: avatarUrl,
                });
                type AnyProfile = Partial<MeProfile & AdminMeProfile & { socialLinks?: Record<string, string>; links?: Record<string, string>; twitterUrl?: string; facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string }>;
                const p = me as AnyProfile;
                const maybeSocial = p.socialLinks || p.links || {
                    twitter: p.twitterUrl,
                    facebook: p.facebookUrl,
                    instagram: p.instagramUrl,
                    linkedin: p.linkedinUrl,
                };
                if (maybeSocial && typeof maybeSocial === 'object') setSocialLinks({ ...maybeSocial });
            } catch {
                toast.error("Failed to fetch profile");
            }
        })();
        return () => {
            active = false;
        };
    }, [token, role]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return toast.error("User not authenticated");
        setLoading(true);
        toast.loading("Uploading avatar...", { id: "avatar-toast" });

        try {
            let result;
            if (role === "admin") {
                result = await updateAdminProfileAPI({ avatar: file }, token);
            } else {
                result = await updateUserProfile({ avatar: file }, token);
            }

            setProfile((prev) => ({ ...prev, avatar: result.avatarUrl || result.data.avatarUrl }));
            toast.success("Avatar updated successfully!", { id: "avatar-toast" });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update avatar", { id: "avatar-toast" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => logoutAndRedirect();

    const updateLink = (key: keyof typeof socialLinks, value: string) => setSocialLinks(prev => ({ ...prev, [key]: value || undefined }));
    const removeLink = (key: keyof typeof socialLinks) => setSocialLinks(prev => { const next: typeof socialLinks = { ...prev }; delete (next as Record<string, unknown>)[key as string]; return next; });
    const saveLinks = async () => {
        if (!token) return toast.error("User not authenticated");
        setLoading(true);
        toast.loading("Saving social links...", { id: "links" });
        try {
            if (role === "admin") {
                await updateAdminProfileAPI({ socialLinks }, token);
            } else {
                await updateUserProfile({ socialLinks }, token);
            }
            toast.success("Social links saved", { id: "links" });
        } catch {
            toast.error("Failed to save links", { id: "links" });
        } finally { setLoading(false); }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 hover:scale-105 text-white font-medium transition">
                    <LogOutIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                            {profile.avatar ? (
                                <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <span className="text-gray-400 font-medium">No Avatar</span>
                            )}
                            <label className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer rounded-full transition`}>
                                <PencilIcon className="w-6 h-6 text-white" />
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>
                        </div>

                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{profile.fullName || "Unnamed"}</h1>
                                <p className="text-gray-500 mt-1">{profile.email}</p>
                                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                                    {profile.role && (
                                        <span className="px-3 py-1 rounded-full text-white bg-gradient-to-b from-indigo-400 to-indigo-700">{profile.role}</span>
                                    )}
                                    {profile.createdAt && (
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                            Joined {new Date(profile.createdAt).toDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Manager */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h2 className="text-lg font-semibold" style={{ color: '#29294b' }}>Social Links</h2>
                        <span className="text-xs px-2 py-1 rounded-full mt-2 sm:mt-0" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)', color: '#fff' }}>Public</span>
                    </div>

                    <p className="text-sm mb-4" style={{ color: '#696981' }}>Connect your profiles. Clean, trusted links help readers follow you.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Twitter */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border border-gray-200 hover:shadow-sm transition w-full">
                            <span className="w-9 h-9 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" /></svg>
                            </span>

                            <div className="flex-1 flex flex-col w-full">
                                <input
                                    value={socialLinks.twitter || ""}
                                    onChange={e => updateLink('twitter', e.target.value)}
                                    placeholder="Twitter URL (https://twitter.com/you)"
                                    className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${isValidUrl(socialLinks.twitter) ? 'focus:ring-[#10b981] border-[#e5e7eb]' : 'focus:ring-[#f59e0b] border-[#e5e7eb]'}`}
                                />
                                <div className="text-[11px] mt-1 text-gray-400">Tip: use your handle’s public profile URL.</div>
                            </div>

                            {socialLinks.twitter && (
                                <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                                    <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                                        <svg width="18" height="18" viewBox="0 0 24 24" ><path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" /></svg>
                                    </a>
                                    <button onClick={() => removeLink('twitter')} className="p-2 rounded-full text-white" style={{ background: 'linear-gradient(180deg, #ff7b7b 0%, #ef4444 100%)' }}>
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Facebook */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border border-gray-200 hover:shadow-sm transition w-full">
                            <span className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.07z" /></svg>
                            </span>

                            <div className="flex-1 flex flex-col w-full">
                                <input
                                    value={socialLinks.facebook || ""}
                                    onChange={e => updateLink('facebook', e.target.value)}
                                    placeholder="Facebook URL (https://facebook.com/you)"
                                    className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${isValidUrl(socialLinks.facebook) ? 'focus:ring-[#10b981] border-[#e5e7eb]' : 'focus:ring-[#f59e0b] border-[#e5e7eb]'}`}
                                />
                                <div className="text-[11px] mt-1 text-gray-400">Paste your public page/profile link.</div>
                            </div>

                            {socialLinks.facebook && (
                                <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                                    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => removeLink('facebook')} className="p-2 rounded-full text-white" style={{ background: 'linear-gradient(180deg, #ff7b7b 0%, #ef4444 100%)' }}>
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Instagram */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border border-gray-200 hover:shadow-sm transition w-full">
                            <span className="w-9 h-9 rounded-full bg-[#E1306C]/10 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm4.75-2.25a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75z" /></svg>
                            </span>

                            <div className="flex-1 flex flex-col w-full">
                                <input
                                    value={socialLinks.instagram || ""}
                                    onChange={e => updateLink('instagram', e.target.value)}
                                    placeholder="Instagram URL (https://instagram.com/you)"
                                    className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${isValidUrl(socialLinks.instagram) ? 'focus:ring-[#10b981] border-[#e5e7eb]' : 'focus:ring-[#f59e0b] border-[#e5e7eb]'}`}
                                />
                                <div className="text-[11px] mt-1 text-gray-400">Must be a public profile for readers to view.</div>
                            </div>

                            {socialLinks.instagram && (
                                <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => removeLink('instagram')} className="p-2 rounded-full text-white" style={{ background: 'linear-gradient(180deg, #ff7b7b 0%, #ef4444 100%)' }}>
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* LinkedIn */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border border-gray-200 hover:shadow-sm transition w-full">
                            <span className="w-9 h-9 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0zM8 8h4.8v2.2h.06c.67-1.2 2.3-2.46 4.74-2.46 5.07 0 6 3.34 6 7.68V24h-5v-7.38c0-1.76-.03-4.02-2.45-4.02-2.46 0-2.84 1.92-2.84 3.9V24H8z" /></svg>
                            </span>

                            <div className="flex-1 flex flex-col w-full">
                                <input
                                    value={socialLinks.linkedin || ""}
                                    onChange={e => updateLink('linkedin', e.target.value)}
                                    placeholder="LinkedIn URL (https://linkedin.com/in/you)"
                                    className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${isValidUrl(socialLinks.linkedin) ? 'focus:ring-[#10b981] border-[#e5e7eb]' : 'focus:ring-[#f59e0b] border-[#e5e7eb]'}`}
                                />
                                <div className="text-[11px] mt-1 text-gray-400">Ideal for professional audience discovery.</div>
                            </div>

                            {socialLinks.linkedin && (
                                <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => removeLink('linkedin')} className="p-2 rounded-full text-white" style={{ background: 'linear-gradient(180deg, #ff7b7b 0%, #ef4444 100%)' }}>
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <button onClick={saveLinks} disabled={loading} className="btn btn-primary shine hover:scale-102">
                            Save Links
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl p-6 shadow-md bg-gradient-to-b from-[#f5f7ff] to-white">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">How to use Social Links</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 text-blue-500">•</span>
                            Paste full URLs only (e.g., https://twitter.com/yourhandle).
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 text-green-500">•</span>
                            Click Save Links to apply. You can Remove any link anytime.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 text-purple-500">•</span>
                            These links appear on your profile and author cards across the site.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 text-red-400">•</span>
                            Keep links relevant and professional to build trust with readers.
                        </li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
