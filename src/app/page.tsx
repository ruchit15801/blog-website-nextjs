"use client";
import Hero from "@/components/Hero";
import ArticlesSection from "@/components/ArticlesSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {

  return (
    <div className="min-h-screen">
      <main>
          <Navbar/>
          <Hero />
          <ArticlesSection/>
          <Footer />
      </main>
    </div>
  );
}
