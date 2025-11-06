"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020C17] text-white flex items-center justify-center pt-20">
      <div className="text-center px-4 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[120px] font-bold text-[#DCF836] leading-none max-md:text-[80px] max-sm:text-[60px]">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-[36px] font-semibold text-white mb-4 max-md:text-[28px] max-sm:text-[24px]">
            Oops! Page Not Found
          </h2>
          <p className="text-[18px] text-[#abb7c4] leading-relaxed max-md:text-[16px]">
            The game you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry, we have plenty of other exciting games waiting for you!
          </p>
        </div>

        {/* Brand Logo (consistent with header/footer) */}
        <div className="mb-8 flex justify-center">
          <span className="relative inline-block logo-spark-wrap">
            <Image
              src="/BlogCafe_Logo.svg"
              alt="Blogcafeai logo"
              width={150}
              height={100}
              priority
              className="logo-glow w-[150px] h-auto max-md:w-[120px] object-contain transition-transform duration-200 will-change-transform hover:scale-105"
            />
            <span className="logo-spark s1" />
            <span className="logo-spark s2" />
            <span className="logo-spark s3" />
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/"
            className="bg-[#DCF836] hover:bg-[#c4e030] text-black font-bold py-3 px-8 rounded-[60px] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            🎮 Play Games
          </Link>
          <Link
            href="/aboutus"
            className="border-2 border-[#DCF836] text-[#DCF836] hover:bg-[#DCF836] hover:text-black font-bold py-3 px-8 rounded-[60px] transition-all duration-300 transform hover:-translate-y-1"
          >
            ℹ️ About Us
          </Link>
        </div>

        {/* Auto Redirect Message */}
        <div className="text-[#abb7c4] text-[14px] max-md:text-[12px]">
          <p>
            Redirecting to homepage in{" "}
            <span className="text-[#DCF836] font-bold">{countdown}</span> seconds...
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-4 opacity-30">
          <div className="w-2 h-2 bg-[#DCF836] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#DCF836] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#DCF836] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
} 