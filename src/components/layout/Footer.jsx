import Image from "next/image";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#020c17] footer-animated">
      {/* animated ambient orbs */}
      <span className="footer-orb fo1" aria-hidden="true" />
      <span className="footer-orb fo2" aria-hidden="true" />
      <span className="footer-orb fo3" aria-hidden="true" />
      <span className="footer-beam" aria-hidden="true" />
      <div className="mx-auto w-full max-w-screen px-[20.2rem]   max-lg:px-5 border-t border-[#ffffff1c] text-[#abb7c4] text-[14px] ">
        <div className="footer-grid max-md:flex-col">
          {/*img  */}
          <div>
            <a href="/">
              <span className="logo-spark-wrap">
                <Image
                  alt="main logo"
                  loading="lazy"
                  width="100"
                  height="70"
                  decoding="async"
                  data-nimg="1"
                  style={{ color: "transparent" }}
                  src="/BlogCafe_Logo.svg"
                  className="logo-glow"
                />
                <span className="logo-spark s1" />
                <span className="logo-spark s2" />
                <span className="logo-spark s3" />
              </span>
            </a>
          </div>

          {/* resourse */}
          <div className="Footer_footerheading__0emrr">
            <h4 className="mb-6 text-lg capitalize font-semibold   text-white">
              Resources
            </h4>
            <ul className="Footer_footertext__IQnDc nunito-fons">
              <li className="mb-2">
                <a href="/" className="hover:text-[#dcf836]">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/aboutus" className="hover:text-[#dcf836]">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/developer" className="hover:text-[#dcf836]">
                  Developers
                </a>
              </li>
              <li className="mb-2">
                <a href="/affiliates" className="hover:text-[#dcf836]">
                  Affiliates
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy-policy" className="hover:text-[#dcf836]">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/*games  */}
          <div className="Footer_footerheading__0emrr">
            <h4 className="mb-6 text-lg capitalize font-semibold   text-white">
              Games
            </h4>
            <div className="flex justify-between w-full gap-8 max-md:flex-col max-md:gap-0">
              <ul className="Footer_footertext__IQnDc nunito-fons ">
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10065">
                    MR RACER : Car Racing
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10162">
                    Among Us
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10133">
                    Snake Color
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10193">
                    Stickman Ghost
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10187">
                    Magical Archer
                  </a>
                </li>
              </ul>
              <ul className="Footer_footertext__IQnDc nunito-fons ">
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10149">
                    Geometry Rash
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10191">
                    Survival Race
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10114">
                    Doors Awakening
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10079">
                    Mini Tennis
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:text-[#dcf836]" href="/10126">
                    Snow Plowing
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* connect */}
          <div className="Footer_footerheading__0emrr">
            <h4 className="mb-6 text-lg capitalize font-semibold   text-white max-xxss:text-start">
              Connect
            </h4>
            <ul className="Footer_footertext__IQnDc nunito-fons flex flex-col xxss:justify-start justify-center xxss:items-start">
              <li className="mb-2 flex items-center gap-2">
                <FaFacebook />
                <a
                  href="https://www.facebook.com/profile.php?id=61578035056259"
                  target="_blank"
                  aria-label="Facebook : Blogcafeai"
                  className="hover:text-[#dcf836]"
                >
                  Facebook
                </a>
              </li>
              <li className="mb-2 flex items-center gap-2">
                <FaInstagram />
                <a
                  href="https://www.instagram.com/Blogcafeai?igsh=MTE1bzhvNHk4bmRteQ=="
                  aria-label="Instagram : Blogcafeai"
                  className="hover:text-[#dcf836]"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
            </ul>
            <div className="hidden xxss:justify-start justify-end contact-us-btn mt-4">
              <a href="/contactus">
                <button className="text-white bg-[#dd003f] rounded-[20px] px-[25px] py-[11px] font-[600] text-[12px] xxss:py-[8px] xxss:px-[20px] max-md:px-[25px] max-md:py-[11px] max-lg:py-[11px] max-lg:px-[22px] max-xxl:py-[8px] max-xxl:px-[20px] ">
                  CONTACT US
                </button>
              </a>
            </div>
          </div>

          {/* button */}
          <div className="final-btn">
            <div className="flex xxss:justify-start justify-end">
              <a href="/contactus">
                <button className="text-white bg-[#dd003f] rounded-[20px] px-[25px] py-[11px] font-[600] text-[12px] xxss:py-[8px] xxss:px-[20px] max-md:px-[25px] max-md:py-[11px] max-lg:py-[11px] max-lg:px-[22px] max-xxl:py-[8px] max-xxl:px-[20px] ">
                  CONTACT US
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
