import React from "react";
import "./globals.css";
import "../../public/css/style.css";
import ClientShell from "@/components/ClientShell";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicons for browsers and Google SERP */}
        <link rel="icon" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
        <link rel="shortcut icon" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/images/favicon-72.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96.png" />
        <link rel="icon" type="image/png" sizes="120x120" href="/images/favicon-120.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/images/favicon-144.png" />
        <link rel="icon" type="image/png" sizes="152x152" href="/images/favicon-152.png" />
        <link rel="icon" type="image/png" sizes="167x167" href="/images/favicon-167.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/images/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon-512.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        <link rel="mask-icon" href="/images/favicon.png" color="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="BlogCafeAI" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title="BlogCafeAI RSS" href="/rss.xml" />
        {/* Primary Meta Tags (defaults; page-level generateMetadata can override) */}
        <title>BlogCafeAI - Your Ultimate Blogging Media</title>
        <meta name="title" content="BlogCafeAI - Your Ultimate Blogging Media" />
        <meta name="description" content="From technology to business, and fashion to education, explore all types of information, trends, tips, and tricks here." />
        {/* Keywords */}
        <meta name="keywords" content="AI tools, artificial intelligence blog, AI news, productivity tips, tech trends, coding tutorials, ChatGPT, machine learning, automation, BlogCafeAI, AI updates" />
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com/"} />
        <meta property="og:title" content="BlogCafeAI - Your Ultimate Blogging Media" />
        <meta property="og:description" content="From technology to business, and fashion to education, explore all types of information, trends, tips, and tricks here." />
        <meta property="og:image" content="https://www.blogcafeai.com/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com/"} />
        <meta name="twitter:title" content="BlogCafeAI - Your Ultimate Blogging Media" />
        <meta name="twitter:description" content="From technology to business, and fashion to education, explore all types of information, trends, tips, and tricks here." />
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
        {/* SiteNavigationElement JSON-LD helps Google understand main navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SiteNavigationElement',
              name: ['Home', 'Blog', 'All Posts', 'About', 'Contact'],
              url: [
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/',
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/blog',
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/all-posts',
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/about',
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com') + '/contact'
              ]
            })
          }}
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
              alternateName: [
                'BlogCafe',
                'BlogCafe AI',
                'Blog Cafe',
                'Blog Cafe AI',
                'Cafe AI',
                'AI BlogCafe',
                'AI Blog Cafe',
                'Blog Studio',
                'Blog Studio AI',
                'AI Blog Studio',
                'BlogLab',
                'BlogLab AI',
                'AI BlogLab',
                'Blog Hub',
                'Blog Hub AI',
                'AI Blog Hub',
                'Blogly AI',
                'WriteCafe',
                'WriteCafe AI',
                'Writer Cafe',
                'Writer Cafe AI',
                'BlogNest',
                'BlogNest AI',
                'AI BlogNest',
                'SmartBlog',
                'SmartBlog AI',
                'AI Smart Blog',
                'NextBlog',
                'NextBlog AI',
                'Blogly',
                'Blogly AI',
                'BlogVerse',
                'BlogVerse AI',
                'AI BlogVerse',
                'BlogBeam',
                'BlogBeam AI',
                'AI BlogBeam',
                'BlogSmith',
                'BlogSmith AI',
                'AI BlogSmith',
                'WordCafe',
                'WordCafe AI',
                'AI WordCafe',
                'ContentCafe',
                'ContentCafe AI',
                'AI ContentCafe',
                'ContentHub',
                'ContentHub AI',
                'AI ContentHub',
                'WriteLab',
                'WriteLab AI',
                'AI WriteLab',
                'BlogCraft',
                'BlogCraft AI',
                'AI BlogCraft',
                'BlogZen',
                'BlogZen AI',
                'AI BlogZen',
                'BlogFlow',
                'BlogFlow AI',
                'AI BlogFlow',
                'BlogAura',
                'BlogAura AI',
                'AI BlogAura',
                'InspireBlog',
                'InspireBlog AI',
                'AI InspireBlog',
                'ProBlog',
                'ProBlog AI',
                'AI ProBlog',
                'BlogBot',
                'BlogBot AI',
                'AI BlogBot',
                'BlogMate',
                'BlogMate AI',
                'AI BlogMate'
              ],
              sameAs: [
                (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com'),
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
        {/* WebSite JSON-LD for sitelinks searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BlogCafeAI',
              alternateName: ['BlogCafe', 'BlogCafe AI'],
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blogcafeai.com',
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
        <ClientShell>{children}</ClientShell>

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