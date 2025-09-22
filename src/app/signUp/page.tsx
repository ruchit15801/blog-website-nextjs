"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    firstName?: string;
    lastName?: string;
    email: string;
    mobile?: string;
    password: string;
    role: "admin" | "user";
}

const tempUsers: User[] = [
    { email: "admin@example.com", password: "admin123", role: "admin" },
    { email: "user@example.com", password: "user123", role: "user" },
];

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignUp) {
            const userExists = tempUsers.find(u => u.email === formData.email);
            if (userExists) {
                setMessage("User already exists!");
            } else {
                tempUsers.push({ ...formData, role: "user" });
                setMessage("Sign Up successful!");
                router.push("/");
            }
        } else {
            const user = tempUsers.find(
                u => u.email === formData.email && u.password === formData.password
            );
            if (user) {
                setMessage(`Signed in as ${user.role}`);
                router.push("/");
            } else {
                setMessage("Invalid credentials");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cs-light-site-background-start to-cs-light-site-background-end dark:from-cs-site-background dark:to-cs-site-background p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h1>

                {/* Toggle Switch */}
                <div className="relative w-full max-w-md mx-auto mb-6 bg-white dark:bg-gray-700 rounded-full p-1">
                    <div
                        className="absolute top-1 rounded-full transition-all duration-300"
                        style={{
                            left: isSignUp ? "0.25rem" : "50%",
                            height: "calc(100% - 0.5rem)",
                            width: "50%",
                            background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)"
                        }}
                    ></div>

                    <div className="flex relative z-10">
                        <button
                            onClick={() => {
                                setIsSignUp(true);
                                setMessage("");
                                setFormData({ firstName: "", lastName: "", email: "", mobile: "", password: "" });
                            }}
                            className={`w-1/2 py-2 rounded-full font-semibold text-center transition-colors duration-300 ${isSignUp ? "text-white" : "text-[#5559d1]"}`}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => {
                                setIsSignUp(false);
                                setMessage("");
                                setFormData({ firstName: "", lastName: "", email: "", mobile: "", password: "" });
                            }}
                            className={`w-1/2 py-2 rounded-full font-semibold text-center transition-colors duration-300 ${!isSignUp ? "text-white" : "text-[#5559d1]"}`}
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {isSignUp && (
                        <>
                            <div className="flex gap-4 w-full">
                                <div className="flex-1 flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-200 font-medium">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="input-theme mt-1 w-full"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-200 font-medium">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="input-theme mt-1 w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 dark:text-gray-200 font-medium">
                                    Mobile
                                </label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="input-theme mt-1"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-gray-200 font-medium">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-theme mt-1"
                        />
                    </div>

                    {/* Password with show/hide */}
                    <div className="flex flex-col relative">
                        <label className="text-gray-700 dark:text-gray-200 font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input-theme mt-1 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-12 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.14.196-2.23.55-3.25M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="sign-up-btn btn w-full mt-2"
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        className="w-full mt-2 border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition"
                        onClick={() => alert("Google Sign In clicked")}
                    >
                        {/* Google SVG */}
                        <svg width="20" height="20" viewBox="0 0 533.5 544.3">
                            <path fill="#4285F4" d="M533.5 278.4c0-17.7-1.4-35-4-51.8H272v98h146.9c-6.3 34.3-25.1 63.3-53.6 82.7v68h86.6c50.8-46.8 80.6-115.8 80.6-197z" />
                            <path fill="#34A853" d="M272 544.3c72.6 0 133.5-24 178-65.2l-86.6-68c-24 16-54.6 25.5-91.4 25.5-70.3 0-129.8-47.5-151.1-111.2h-89.7v69.8C78.7 481.5 169.2 544.3 272 544.3z" />
                            <path fill="#FBBC05" d="M120.9 332.4c-8.7-25.3-8.7-52.7 0-78h-89.7v-69.8c-36.7 72.2-36.7 156.7 0 228.9l89.7-81.1z" />
                            <path fill="#EA4335" d="M272 107.7c37.7 0 71.4 13 98 34.6l73.6-73.6C405.5 28.1 344.6 4 272 4 169.2 4 78.7 66.8 31.1 159.1l89.7 69.8C142.2 155.2 201.7 107.7 272 107.7z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-green-500 dark:text-green-400">{message}</p>
                )}
            </div>
        </div>
    );
}
