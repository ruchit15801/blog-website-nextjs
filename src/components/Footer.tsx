"use client";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [scrollY, setScrollY] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollY(scrollPercent);
      setShowButton(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const circumference = 2 * Math.PI * 45;
  const offset = ((100 - scrollY) / 100) * circumference;

  return (
    <>
      {/* Newsletter section removed as requested */}

      <footer className="footer text-black">
        {/* ========= TOP / INNER ========= */}
        <div className="footer-item-inner mx-auto ps-8 grid grid-cols-1 sm:grid-cols-2 gap-20 text-sm">
          {/* ===== LEFT SIDE ===== */}
          <div className="footer-item-inner-items">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="Logo" width={130} height={130} priority />
            </div>

            <p className="mb-4 opacity-80">
              Welcome to ultimate source for fresh perspectives! Explore curated content to enlighten, entertain and engage global readers.
            </p>

            <div className="social-icon flex gap-4 my-2">
              {/* social icons */}
              <a href="#" aria-label="Facebook" className="hover:opacity-80">
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z" fill="#29294B" />
                </svg>
              </a>
              <a href="#" aria-label="X" className="hover:opacity-80">
                <svg fill="none" width={24} height={24} viewBox="0 0 24 24">
                  <path d="M13.8999 10.472L21.3326 2.02222H19.5713L13.1175 9.35906L7.96285 2.02222H2.01758L9.81242 13.1168L2.01758 21.9777H3.77899L10.5944 14.2298L16.0381 21.9777H21.9834L13.8995 10.472H13.8999ZM11.4874 13.2146L10.6977 12.1098L4.41365 3.31901H7.11908L12.1903 10.4135L12.9801 11.5182L19.5722 20.7399H16.8667L11.4874 13.215V13.2146Z" fill="#29294B" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:opacity-80">
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path d="M7.85844 2.06995C6.79443 2.12015 6.06783 2.28995 5.43263 2.53955C4.77523 2.79575 4.21802 3.13955 3.66362 3.69596C3.10922 4.25236 2.76782 4.80996 2.51342 5.46836C2.26722 6.10497 2.10042 6.83217 2.05342 7.89677C2.00642 8.96138 1.99602 9.30358 2.00122 12.0192C2.00642 14.7348 2.01842 15.0752 2.07002 16.142C2.12082 17.2058 2.29002 17.9322 2.53962 18.5676C2.79622 19.225 3.13962 19.782 3.69622 20.3366C4.25282 20.8912 4.81003 21.2318 5.47003 21.4866C6.10603 21.7324 6.83343 21.9 7.89784 21.9466C8.96224 21.9932 9.30484 22.004 12.0197 21.9988C14.7345 21.9936 15.0763 21.9816 16.1429 21.931C17.2095 21.8804 17.9321 21.71 18.5677 21.4616C19.2251 21.2044 19.7825 20.8616 20.3367 20.3048C20.8909 19.748 21.2321 19.19 21.4863 18.5312C21.7327 17.8952 21.9001 17.1678 21.9463 16.1042C21.9929 15.0368 22.0039 14.696 21.9987 11.9808C21.9935 9.26558 21.9813 8.92518 21.9307 7.85877C21.8801 6.79237 21.7107 6.06817 21.4613 5.43236C21.2043 4.77496 20.8613 4.21836 20.3049 3.66336C19.7485 3.10835 19.1901 2.76735 18.5315 2.51375C17.8951 2.26755 17.1681 2.09975 16.1037 2.05375C15.0393 2.00775 14.6967 1.99595 11.9809 2.00115C9.26504 2.00635 8.92504 2.01795 7.85844 2.06995ZM7.97524 20.1476C7.00023 20.1052 6.47083 19.9432 6.11803 19.8076C5.65083 19.6276 5.31803 19.41 4.96643 19.0618C4.61483 18.7136 4.39882 18.3796 4.21642 17.9134C4.07942 17.5606 3.91442 17.0318 3.86882 16.0568C3.81922 15.003 3.80882 14.6866 3.80302 12.0168C3.79722 9.34698 3.80742 9.03098 3.85362 7.97677C3.89522 7.00257 4.05822 6.47257 4.19362 6.11997C4.37362 5.65216 4.59043 5.31996 4.93943 4.96856C5.28843 4.61716 5.62143 4.40076 6.08803 4.21836C6.44043 4.08076 6.96923 3.91716 7.94384 3.87076C8.99844 3.82076 9.31444 3.81076 11.9839 3.80496C14.6533 3.79916 14.9701 3.80916 16.0251 3.85556C16.9993 3.89796 17.5295 4.05936 17.8817 4.19556C18.3491 4.37556 18.6817 4.59176 19.0331 4.94136C19.3845 5.29096 19.6011 5.62276 19.7835 6.09037C19.9213 6.44177 20.0849 6.97037 20.1309 7.94557C20.1811 9.00018 20.1925 9.31638 20.1973 11.9856C20.2021 14.6548 20.1927 14.9718 20.1465 16.0256C20.1039 17.0006 19.9423 17.5302 19.8065 17.8834C19.6265 18.3504 19.4095 18.6834 19.0603 19.0346C18.7111 19.3858 18.3785 19.6022 17.9117 19.7846C17.5597 19.922 17.0303 20.086 16.0565 20.1324C15.0019 20.182 14.6859 20.1924 12.0155 20.1982C9.34504 20.204 9.03004 20.1932 7.97544 20.1476M16.1275 6.65537C16.1279 6.89272 16.1986 7.12463 16.3308 7.32176C16.463 7.51888 16.6507 7.67238 16.8702 7.76283C17.0896 7.85327 17.331 7.87661 17.5637 7.82989C17.7964 7.78317 18.01 7.66848 18.1776 7.50034C18.3451 7.3322 18.459 7.11815 18.5049 6.88527C18.5507 6.65239 18.5265 6.41113 18.4352 6.19202C18.344 5.97291 18.1898 5.78578 17.9922 5.65429C17.7946 5.52281 17.5624 5.45289 17.3251 5.45336C17.0069 5.454 16.702 5.58098 16.4774 5.80639C16.2528 6.0318 16.1269 6.33718 16.1275 6.65537ZM6.86543 12.01C6.87103 14.846 9.17424 17.1398 12.0097 17.1344C14.8451 17.129 17.1405 14.826 17.1351 11.99C17.1297 9.15398 14.8259 6.85957 11.9901 6.86517C9.15424 6.87077 6.86003 9.17438 6.86543 12.01ZM8.66664 12.0064C8.66534 11.3471 8.85956 10.7022 9.22476 10.1533C9.58995 9.60444 10.1097 9.17616 10.7183 8.92265C11.3269 8.66915 11.997 8.60181 12.6439 8.72915C13.2908 8.85649 13.8853 9.17279 14.3524 9.63805C14.8196 10.1033 15.1382 10.6966 15.2681 11.343C15.398 11.9894 15.3333 12.6597 15.0822 13.2693C14.8311 13.8789 14.4049 14.4004 13.8575 14.7677C13.31 15.1351 12.6659 15.3319 12.0067 15.3332C11.5689 15.3341 11.1352 15.2488 10.7304 15.0821C10.3257 14.9154 9.95768 14.6706 9.64752 14.3617C9.33736 14.0527 9.0911 13.6857 8.9228 13.2816C8.7545 12.8775 8.66745 12.4442 8.66664 12.0064Z" fill="#29294B" />
                </svg>
              </a>
              <a href="#" aria-label="Linkedin" className="hover:opacity-80">
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.66667 2C2.74619 2 2 2.74619 2 3.66667V20.3333C2 21.2538 2.74619 22 3.66667 22H20.3333C21.2538 22 22 21.2538 22 20.3333V3.66667C22 2.74619 21.2538 2 20.3333 2H3.66667ZM8.13418 6.44747C8.14043 7.50997 7.34512 8.16466 6.40137 8.15997C5.5123 8.15528 4.7373 7.44747 4.74199 6.44903C4.74668 5.50997 5.48887 4.75528 6.45293 4.77716C7.43106 4.79903 8.14043 5.51622 8.13418 6.44747ZM12.3108 9.51307H9.51079H9.50922V19.024H12.4686V18.8021C12.4686 18.38 12.4682 17.9578 12.4679 17.5354C12.467 16.409 12.466 15.2813 12.4718 14.1552C12.4733 13.8818 12.4858 13.5974 12.5561 13.3364C12.8201 12.3614 13.6968 11.7318 14.6749 11.8866C15.303 11.9849 15.7186 12.349 15.8936 12.9412C16.0014 13.3114 16.0499 13.7099 16.0546 14.0959C16.0672 15.2599 16.0654 16.4239 16.0637 17.588C16.063 17.9989 16.0623 18.41 16.0623 18.8209V19.0224H19.0311V18.7943C19.0311 18.2921 19.0309 17.79 19.0306 17.2879C19.03 16.0329 19.0293 14.7779 19.0327 13.5224C19.0342 12.9552 18.9733 12.3959 18.8342 11.8474C18.6264 11.0318 18.1968 10.3568 17.4983 9.86933C17.003 9.52243 16.4592 9.299 15.8514 9.274C15.7822 9.27112 15.7124 9.26736 15.6423 9.26357C15.3316 9.24677 15.0157 9.2297 14.7186 9.28962C13.8686 9.45993 13.1218 9.849 12.5577 10.5349C12.4921 10.6136 12.428 10.6934 12.3323 10.8127L12.3108 10.8397V9.51307ZM4.9796 19.0271H7.92491V9.51926H4.9796V19.0271Z" fill="#29294B"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* ===== RIGHT SIDE ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ps-30">

            {/* === Homepages === */}
            <div>
              <a href="#" className="home-page-list uppercase block text-base font-semibold mb-3">
                Homepages
              </a>
              <ul className="home-page-sub-menu space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">Classic List</a></li>
                <li><a href="#" className="hover:underline">Classic Grid</a></li>
                <li><a href="#" className="hover:underline">Classic Overlay</a></li>
                <li><a href="#" className="hover:underline">Hero Slider</a></li>
                <li><a href="#" className="hover:underline">Featured Posts</a></li>
              </ul>
            </div>

            {/* === Categories === */}
            <div>
              <a href="#" className="home-page-list uppercase block text-base font-semibold mb-3">
                Categories
              </a>
              <ul className="home-page-sub-menu space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">Technology</a></li>
                <li><a href="#" className="hover:underline">Travel</a></li>
                <li><a href="#" className="hover:underline">Sport</a></li>
                <li><a href="#" className="hover:underline">Business</a></li>
              </ul>
            </div>

            {/* === Pages === */}
            <div>
              <a href="#" className="home-page-list uppercase block text-base font-semibold mb-3">
                Pages
              </a>
              <ul className="home-page-sub-menu space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Categories</a></li>
                <li><a href="#" className="hover:underline">Contacts</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========= BOTTOM / COPYRIGHT ========= */}
        <div className="footer-item-bottom">
          <div className="px-8 text-sm opacity-60">
            © {year} – Revision. All Rights Reserved.
          </div>
        </div>
      </footer>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-50"
          style={{ cursor: 'pointer' }}
        >
          <svg className="w-13 h-13 absolute" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#5559d1"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <ChevronUp size={26} className="text-black z-10" />
        </button>
      )}
    </>
  );
}
