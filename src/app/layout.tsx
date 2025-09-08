import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MustBlog – World-class Next.js Blog UI",
    template: "%s – MustBlog",
  },
  description: "Subtle animations, premium color palette, and delightful reading experience.",
  metadataBase: new URL("https://example.com"),
  keywords: ["Next.js", "Blog", "UI", "Animations", "Design"],
  openGraph: {
    title: "MustBlog – World-class Next.js Blog UI",
    description: "Subtle animations, premium color palette, and delightful reading experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MustBlog – World-class Next.js Blog UI",
    description: "Subtle animations, premium color palette, and delightful reading experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
