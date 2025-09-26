"use client";

import { PencilIcon, Trash2 } from "lucide-react";
import DashboardLayout from "../DashBoardLayout";
import Image from "next/image";
import { useState, useEffect } from "react";

type UserProfileType = {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    pincode: string;
    phone: string;
    avatar?: string;
    skills: string;
    bio: string;
};

type CategoryType = {
    id: number;
    name: string;
};

export default function UserProfileWithCategories() {
    const [profile, setProfile] = useState<UserProfileType>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("userProfile");
            return stored
                ? JSON.parse(stored)
                : {
                      firstName: "",
                      lastName: "",
                      email: "",
                      city: "",
                      pincode: "",
                      phone: "",
                      avatar: "",
                      skills: "",
                      bio: "",
                  };
        }
        return {
            firstName: "",
            lastName: "",
            email: "",
            city: "",
            pincode: "",
            phone: "",
            avatar: "",
            skills: "",
            bio: "",
        };
    });

    const [editingProfile, setEditingProfile] = useState(false);

    const [categories, setCategories] = useState<CategoryType[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("categories");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [newCategory, setNewCategory] = useState("");

    // Update localStorage whenever profile changes
    useEffect(() => {
        localStorage.setItem("userProfile", JSON.stringify(profile));
        // Trigger storage event manually for live header update
        window.dispatchEvent(new Event("storage"));
    }, [profile]);

    // Update localStorage whenever categories change
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = () => {
        if (!profile.firstName || !profile.lastName) {
            alert("First and Last Name required");
            return;
        }
        setEditingProfile(false);
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        setCategories(prev => [...prev, { id: Date.now(), name: newCategory }]);
        setNewCategory("");
    };

    const handleDeleteCategory = (id: number) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("userProfile");
        window.location.href = "/auth";
    };

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
            <div className="flex flex-col md:flex-row gap-6">
                {/* --- User Profile --- */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>

                    {/* Top Row: Avatar + Basic Info */}
                    <div className="flex gap-6 items-center">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profile.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt="Avatar"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-full"
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

                        {/* Basic Info */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["firstName", "lastName", "email", "phone"].map(field => (
                                <div key={field} className="flex flex-col gap-1">
                                    <label className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    {editingProfile ? (
                                        <input
                                            type={field === "email" ? "email" : "text"}
                                            name={field}
                                            value={profile[field as keyof UserProfileType] || ""}
                                            onChange={handleProfileChange}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{profile[field as keyof UserProfileType] || "Not set"}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row: City, Pincode, Skills, Bio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {["city", "pincode"].map(field => (
                            <div key={field} className="flex flex-col gap-1">
                                <label className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {editingProfile ? (
                                    <input
                                        type="text"
                                        name={field}
                                        value={profile[field as keyof UserProfileType] || ""}
                                        onChange={handleProfileChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                    />
                                ) : (
                                    <p className="text-gray-700">{profile[field as keyof UserProfileType] || "Not set"}</p>
                                )}
                            </div>
                        ))}

                        {/* Skills */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="font-medium">Skills</label>
                            {editingProfile ? (
                                <input
                                    type="text"
                                    name="skills"
                                    value={profile.skills}
                                    onChange={handleProfileChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                />
                            ) : (
                                <p className="text-gray-700">{profile.skills || "Not set"}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="font-medium">Bio</label>
                            {editingProfile ? (
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleProfileChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                                />
                            ) : (
                                <p className="text-gray-700">{profile.bio || "Not set"}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end mt-4">
                        {editingProfile ? (
                            <button
                                onClick={handleProfileSave}
                                className="bg-[#5559d1] text-white px-4 py-2 rounded-lg"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditingProfile(true)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Categories --- */}
                <div className="w-full md:w-84 bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Categories</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New category"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5559d1]"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="Add_Categories text-white px-4 py-2 rounded-lg bg-[#5559d1]"
                        >
                            Add
                        </button>
                    </div>

                    <ul className="mt-2 flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                className="flex justify-between items-center border border-gray-200 rounded-lg px-3 py-2"
                            >
                                {cat.name}
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="text-white text-sm bg-[#FF0000] px-2 py-1 rounded-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                        {categories.length === 0 && <p className="text-gray-500 text-sm">No categories added.</p>}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
