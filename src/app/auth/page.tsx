"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import {
    signupUser,
    loginUser,
    forgotPasswordAPI,
    verifyOtpAPI,
    changePasswordAPI,
    resendOtpAPI,
} from "@/lib/api";

export default function AuthPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(true);

    useEffect(() => {
        const mode = searchParams.get("mode");
        setIsSignUp(mode !== "signin");
    }, [searchParams]);

    const [step, setStep] = useState<"signin" | "forgotEmail" | "otp" | "resetPassword">(
        "signin"
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const resetForm = () =>
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            if (isSignUp) {
                const res = await signupUser({
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                });

                localStorage.clear();
                localStorage.setItem("token", res.token);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("userProfile", JSON.stringify(res.user));
                localStorage.setItem("role", res.user.role);
                localStorage.setItem("userId", res.user._id);

                toast.success("Sign Up successful!");
                router.push("/DashBoard");
            } else {
                if (step === "signin") {
                    const res = await loginUser({ email: formData.email, password: formData.password });

                    localStorage.clear();
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refreshToken", res.refreshToken);
                    localStorage.setItem("userProfile", JSON.stringify(res.user));
                    localStorage.setItem("role", res.user.role);
                    localStorage.setItem("userId", res.user._id);

                    toast.success("Sign In successful!");
                    router.push("/DashBoard");
                } else if (step === "forgotEmail") {
                    const res = await forgotPasswordAPI(formData.email);
                    if (res.success) {
                        toast.success("OTP sent to your email!");
                        setStep("otp");
                    } else {
                        toast.error(res.message || "Failed to send OTP");
                    }
                } else if (step === "otp") {
                    const res = await verifyOtpAPI(formData.email, formData.otp);
                    if (res.success && res.verified) {
                        toast.success("OTP verified successfully!");
                        setStep("resetPassword");
                    } else {
                        toast.error(res.error?.message || "Invalid OTP");
                    }
                } else if (step === "resetPassword") {
                    if (formData.newPassword !== formData.confirmPassword) {
                        toast.error("Passwords do not match!");
                    } else {
                        const res = await changePasswordAPI(formData.email, formData.otp, formData.newPassword);
                        if (res.success) {
                            toast.success("Password reset successful!");
                            setStep("signin");
                            if (res.success) {
                                toast.success("Password reset successful!");
                                setFormData((prev) => ({
                                    ...prev,
                                    otp: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                }));
                                setStep("signin");
                            }
                        } else {
                            toast.error(res.error?.message || "Failed to reset password");
                        }
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Something went wrong");
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
                                type="button"
                                onClick={() => {
                                    setIsSignUp(true);
                                    setStep("signin");
                                    resetForm();
                                    setMessage("");
                                }}
                                className={`w-1/2 py-2 rounded-full font-semibold text-center transition-colors duration-300 ${isSignUp ? "text-white" : "text-[#5559d1]"
                                    }`}>
                                Sign Up
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(false);
                                    setStep("signin");
                                    resetForm();
                                    setMessage("");
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.14.196-2.23.55-3.25M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
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

                    {/* Sign In / Forgot / OTP / ResetPassword Forms */}
                    {!isSignUp && (
                        <>
                            {step === "signin" && (
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
                                            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                                            Remember Me
                                        </label>
                                        <button type="button" className="text-blue-600 underline" onClick={() => setStep("forgotEmail")}>
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <button type="submit" className="sign-up-btn btn w-full mt-2">
                                        Sign In
                                    </button>
                                </>
                            )}

                            {/* Forgot Email */}
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
                                    <button type="button" className="underline mt-2" onClick={() => setStep("signin")}>
                                        Back to Sign In
                                    </button>
                                </>
                            )}

                            {/* OTP */}
                            {step === "otp" && (
                                <>
                                    <p className="text-center mb-2 text-gray-700 font-medium">Enter the 6-digit OTP sent to your email</p>
                                    <div className="flex gap-2 justify-center mt-4">
                                        {Array(6)
                                            .fill(0)
                                            .map((_, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    maxLength={1}
                                                    value={formData.otp[i] || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/, "");
                                                        if (!val) return;
                                                        const otpArray = formData.otp.split("");
                                                        otpArray[i] = val;
                                                        setFormData({ ...formData, otp: otpArray.join("") });
                                                        const next = e.target.nextElementSibling as HTMLInputElement | null;
                                                        if (next) next.focus();
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        if (e.key === "Backspace") {
                                                            const otpArray = formData.otp.split("");
                                                            otpArray[i] = "";
                                                            setFormData({ ...formData, otp: otpArray.join("") });
                                                            const prev = target.previousElementSibling as HTMLInputElement | null;
                                                            if (prev) prev.focus();
                                                        }
                                                    }}
                                                    className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-xl"
                                                />
                                            ))}
                                    </div>
                                    <button type="submit" className="sign-up-btn btn w-full mt-4">
                                        Verify OTP
                                    </button>
                                    <p className="text-center mt-3 text-gray-600">
                                        Did not receive the code?{" "}
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setLoading(true);
                                                try {
                                                    const res = await resendOtpAPI(formData.email);
                                                    if (res.success) setMessage("OTP resent successfully!");
                                                } catch {
                                                    setMessage("Failed to resend OTP");
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="text-blue-600 underline hover:text-blue-800 font-medium"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </>
                            )}

                            {/* Reset Password */}
                            {step === "resetPassword" && (
                                <>
                                    <div className="flex flex-col relative mb-4">
                                        <label className="text-gray-700 font-medium">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            required
                                            className="input-theme mt-1 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-12 -translate-y-1/2 text-gray-500"
                                        >
                                            {showNewPassword ? (
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

                                    <div className="flex flex-col relative mb-4">
                                        <label className="text-gray-700 font-medium">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            required
                                            className="input-theme mt-1 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-12 -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPassword ? (
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
                                        Reset Password
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </form>

                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}
