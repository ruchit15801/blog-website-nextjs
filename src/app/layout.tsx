"use client";
import React from "react";
import "./globals.css";
import "../../public/css/style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let timeout: number | undefined;
    const start = () => setLoading(true);
    const done = () => {
      timeout = window.setTimeout(() => setLoading(false), 250);
    };

    // Simulate route transitions for loader
    let last = pathname;
    const observer = new MutationObserver(() => {
      if (last !== pathname) {
        last = pathname;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

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
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Primary Meta Tags (defaults; page-level generateMetadata can override) */}
        <title>BlogCafeAI — Explore AI Tools, Tech Trends & Smart Productivity Tips</title>
        <meta name="title" content="BlogCafeAI — Explore AI Tools, Tech Trends & Smart Productivity Tips" />
        <meta name="description" content="BlogCafeAI brings you the latest AI tools, technology insights, productivity hacks, and coding tutorials. Stay ahead with deep-dive articles and expert-curated content for creators, developers, and AI enthusiasts." />
        {/* Keywords */}
        <meta name="keywords" content="AI tools, artificial intelligence blog, AI news, productivity tips, tech trends, coding tutorials, ChatGPT, machine learning, automation, BlogCafeAI, AI updates" />
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com/"} />
        <meta property="og:title" content="BlogCafeAI — AI Tools, Tech Trends & Smart Productivity" />
        <meta property="og:description" content="Stay updated with the world of Artificial Intelligence. Discover the best AI tools, tutorials, and guides that power creators and developers." />
        <meta property="og:image" content="https://www.blogcafeai.com/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com/"} />
        <meta name="twitter:title" content="BlogCafeAI — AI Tools, Tech Trends & Smart Productivity" />
        <meta name="twitter:description" content="Explore AI tools, automation tricks, and coding insights on BlogCafeAI — your daily AI knowledge shot." />
        <meta name="twitter:image" content="https://www.blogcafeai.com/og-image.jpg" />
        {/* Canonical */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com/"} />

        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8481647724806223"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          id="ga-external"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GJM1MCPF9S"
          strategy="afterInteractive"
        />
        <Script
          id="ga-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-GJM1MCPF9S');
            `,
          }}
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-8481647724806223"
        />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BlogCafeAI',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com',
              logo: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/images/BlogCafe_Logo.svg',
              sameAs: [
                'https://www.facebook.com/',
                'https://twitter.com/',
                'https://www.instagram.com/',
                'https://www.linkedin.com/'
              ],
              potentialAction: {
                '@type': 'SearchAction',
                target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'}/all-posts?search={search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
      </head>

      <body>
        <div className="min-h-screen flex flex-col">
          {loading && (
            <div className="loader-overlay">
              <div className="loader-ring">
                <span className="loader-dot"></span>
              </div>
            </div>
          )}

          {!pathname.startsWith("/DashBoard") && <Navbar />}
          <main className="flex-1">{children}</main>
          {!pathname.startsWith("/DashBoard") && <Footer />}
        </div>

        {/* ✅ Global toast provider (works in all pages/components) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontSize: "14px" },
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var observer = new IntersectionObserver(function(entries){
                  entries.forEach(function(entry){
                    if(entry.isIntersecting){
                      entry.target.classList.add('revealed');
                      observer.unobserve(entry.target);
                    }
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
