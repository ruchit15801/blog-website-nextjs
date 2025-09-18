"use client";
import Hero from "@/components/Hero";
import ArticlesSection from "@/components/ArticlesSection";

export default function Home() {

  return (
    <div className="min-h-screen">
      <main>
          <Hero />
          <ArticlesSection/>
      </main>
    </div>
  );
}
