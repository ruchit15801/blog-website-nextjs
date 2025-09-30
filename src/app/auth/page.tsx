"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { signupUser, loginUser } from "@/lib/api";

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        rememberMe: false,
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Step for forgot password flow
    const [step, setStep] = useState<"signin" | "forgotEmail" | "otp" | "resetPassword">("signin");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            if (isSignUp) {
                // ✅ Your signup API call
                const res = await signupUser({
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                });

                localStorage.setItem("token", res.token);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("userProfile", JSON.stringify(res.user));
                localStorage.setItem("role", res.user.role);

                setMessage("Sign Up successful!");
                router.push("/DashBoard");
            } else {
                // Sign In flow OR Forgot Password flow
                if (step === "signin") {
                    // ✅ Your login API call
                    const res = await loginUser({ email: formData.email, password: formData.password });

                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refreshToken", res.refreshToken);
                    localStorage.setItem("userProfile", JSON.stringify(res.user));
                    localStorage.setItem("role", res.user.role);

                    setMessage("Sign In successful!");
                    router.push("/DashBoard");
                } else if (step === "forgotEmail") {
                    // Send OTP to email API
                    setMessage("OTP sent to your email!");
                    setStep("otp");
                } else if (step === "otp") {
                    // Verify OTP API
                    setMessage("OTP verified!");
                    setStep("resetPassword");
                } else if (step === "resetPassword") {
                    // Reset password API
                    setMessage("Password reset successful!");
                    setStep("signin");
                    setFormData({ ...formData, password: "", newPassword: "", confirmPassword: "", otp: "" });
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="flex items-center justify-center bg-gradient-to-b from-cs-light-site-background-start to-cs-light-site-background-end py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
                    {isSignUp
                        ? "Sign Up"
                        : step === "signin"
                            ? "Sign In"
                            : step === "forgotEmail"
                                ? "Forgot Password"
                                : step === "otp"
                                    ? "Verify OTP"
                                    : "Reset Password"}
                </h1>

                {/* Toggle Switch */}
                {(step === "signin" || isSignUp) && (
                    <div className="relative w-full max-w-md mx-auto mb-6 border border-gray-300 bg-white rounded-full p-1">
                        <div
                            className="absolute top-1 rounded-full transition-all duration-300"
                            style={{
                                left: isSignUp ? "0.25rem" : "50%",
                                height: "calc(100% - 0.5rem)",
                                width: "50%",
                                background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)",
                            }}
                        ></div>
                        <div className="flex relative z-10">
                            <button
                                onClick={() => {
                                    setIsSignUp(true);
                                    setStep("signin");
                                    setMessage("");
                                    setFormData({
                                        firstName: "",
                                        lastName: "",
                                        email: "",
                                        mobile: "",
                                        password: "",
                                        rememberMe: false,
                                        otp: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className={`w-1/2 py-2 rounded-full font-semibold text-center transition-colors duration-300 ${isSignUp ? "text-white" : "text-[#5559d1]"
                                    }`}
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => {
                                    setIsSignUp(false);
                                    setStep("signin");
                                    setMessage("");
                                    setFormData({
                                        firstName: "",
                                        lastName: "",
                                        email: "",
                                        mobile: "",
                                        password: "",
                                        rememberMe: false,
                                        otp: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className={`w-1/2 py-2 rounded-full font-semibold text-center transition-colors duration-300 ${!isSignUp ? "text-white" : "text-[#5559d1]"
                                    }`}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Sign Up Form */}
                    {isSignUp && (
                        <>
                            <div className="flex gap-4 w-full">
                                <div className="flex-1 flex flex-col">
                                    <label className="text-gray-700 font-medium">
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
                                    <label className="text-gray-700 font-medium">
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
                                <label className="text-gray-700 font-medium">
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
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-medium">
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
                            <button type="submit" className="sign-up-btn btn w-full mt-2">
                                Sign Up
                            </button>
                        </>
                    )}

                    {/* Sign In Form */}
                    {!isSignUp && step === "signin" && (
                        <>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">
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
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-medium">
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
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />{" "}
                                    Remember Me
                                </label>
                                <button
                                    type="button"
                                    className="text-blue-600 underline"
                                    onClick={() => setStep("forgotEmail")}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <button type="submit" className="sign-up-btn btn w-full mt-2">
                                Sign In
                            </button>
                        </>
                    )}

                    {/* Forgot Password Email */}
                    {step === "forgotEmail" && (
                        <>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="input-theme mt-1"
                            />
                            <button type="submit" className="sign-up-btn btn w-full mt-2">
                                Send OTP
                            </button>
                            <button
                                type="button"
                                className="underline mt-2"
                                onClick={() => setStep("signin")}
                            >
                                Back to Sign In
                            </button>
                        </>
                    )}

                    {/* OTP */}
                    {step === "otp" && (
                        <>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter OTP"
                                required
                                className="input-theme mt-1"
                            />
                            <button type="submit" className="sign-up-btn btn w-full mt-2">
                                Verify OTP
                            </button>
                        </>
                    )}

                    {/* Reset Password */}
                    {step === "resetPassword" && (
                        <>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                required
                                className="input-theme mt-1"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                                className="input-theme mt-1"
                            />
                            <button type="submit" className="sign-up-btn btn w-full mt-2">
                                Reset Password
                            </button>
                        </>
                    )}
                </form>

                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}
