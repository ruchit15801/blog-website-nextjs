"use client";
import React from "react";
import "./globals.css";
import "../../public/css/style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let timeout: number | undefined;
    const start = () => { setLoading(true); };
    const done = () => { timeout = window.setTimeout(() => setLoading(false), 250); };

    // Next App Router doesn't expose router events, so approximate with history changes
    let last = pathname;
    const observer = new MutationObserver(() => {
      if (last !== pathname) { last = pathname; }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Start immediately, end after paint
    start();
    requestAnimationFrame(() => done());

    return () => {
      if (timeout) clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-8481647724806223"></meta>
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          {loading ? (
            <div className="loader-overlay">
              <div className="loader-ring">
                <span className="loader-dot"></span>
              </div>
            </div>
          ) : null}
          {!pathname.startsWith("/DashBoard") && <Navbar />}
          <main className="flex-1">{children}</main>
          {!pathname.startsWith("/DashBoard") && <Footer />}

        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              var observer = new IntersectionObserver(function(entries){
                entries.forEach(function(entry){
                  if(entry.isIntersecting){ entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
                });
              }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
              document.addEventListener('DOMContentLoaded', function(){
                var selectors = [
                  'article',
                  'section',
                  'header',
                  'footer',
                  '.aside-shadow',
                  '.navbar-container',
                  '.footer-item-inner',
                  '.feature-posts .group',
                  '.full-list article',
                  '.grid article'
                ];
                var nodes = document.querySelectorAll(selectors.join(','));
                nodes.forEach(function(el){ el.classList.add('reveal'); observer.observe(el); });
                document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
              });
            })();
          `,
          }}
        />
      </body>
    </html>
  );
}
