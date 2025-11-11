import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail } from "lucide-react";
import aboutImg from "../../../public/images/about_img_3.jpeg";

export const metadata: Metadata = {
  title: "About BlogCafeAI — Our Story & Mission",
  description:
    "Learn about BlogCafeAI: our mission, community, and platform empowering writers to share stories, tutorials, and insights.",
  alternates: {
    canonical:
      (process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com") + "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &gt; <span>About</span>
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative mb-10 overflow-hidden rounded-3xl"
        style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 md:grid-cols-2">
          <div className="space-y-4">
            <h1
              className="text-white font-extrabold"
              style={{ fontSize: "2.75rem", lineHeight: 1.1, letterSpacing: "-.04em" }}>
              Welcome to BlogCafeAI
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              A creative hub where ideas brew, stories flow, and every voice finds a place
              to be heard.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/auth" className="btn btn-primary shine">
                Start Writing
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative hidden aspect-[16/9] md:block">
            <Image
              src={aboutImg}
              alt="About BlogCafeAI"
              fill
              priority
              quality={90}
              placeholder="blur"
              sizes="(min-width: 1280px) 720px, (min-width: 768px) 640px, 100vw"
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Our Story */}
          <article className="card-hover rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-[#29294b] mb-3">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe everyone has a story, an idea, or an experience worth sharing.
              BlogCafeAI is designed to give writers, thinkers, and creators a simple and
              open platform to publish their blogs and connect with a wider audience.
              Whether you’re passionate about technology, lifestyle, travel, business, or
              personal experiences – this is your space to express, inspire, and engage.
            </p>
          </article>

          {/* Offer + Mission */}
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-[#29294b] mb-2">What We Offer</h3>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Open Platform – Anyone can write and publish their blogs.</li>
                <li>
                  Diverse Content – From personal stories to professional insights, we
                  welcome all categories of writing.
                </li>
                <li>
                  Community Spirit – Connect with like-minded readers and writers across
                  the globe.
                </li>
                <li>
                  Easy Sharing – Share your voice effortlessly and let your ideas reach
                  people everywhere.
                </li>
              </ul>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-[#29294b] mb-2">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                At BlogCafeAI, our mission is simple – to make blogging accessible for
                everyone. We want to empower individuals to share knowledge, express
                creativity, and build meaningful connections through words.
              </p>
            </article>
          </div>
        </div>

        {/* ASIDE SECTION */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-bold text-[#29294b] mb-2">Why BlogCafeAI?</h3>
            <p className="text-gray-700 leading-relaxed">
              Because we’re not just another blogging site. We’re a community café of
              ideas, fueled by creativity and powered by people like you.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 text-center shadow"
            style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
            <h4 className="text-xl font-bold text-white">Ready to share your story?</h4>
            <p className="mt-1 text-white/90">
              Grab your virtual cup of coffee and start writing.
            </p>
            <div className="mt-3">
              <Link href="/auth" className="btn btn-secondary">
                Create your account
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* ABOUT BLOCK */}
      <section className="card-hover rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-[#29294b] mb-3">
          Welcome to BlogCafeAI.com
        </h2>
        <p className="text-gray-700 leading-relaxed">
          A community-driven platform where ideas, stories, and knowledge come together.
          We believe everyone has a voice worth sharing. At BlogCafeAI, users can create,
          publish, and share their blogs with a global audience. Whether you’re passionate
          about technology, lifestyle, travel, business, or personal experiences, our
          platform gives you the space to express yourself.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Empower Creators",
              text: "Empower writers, thinkers, and creators to share their perspectives.",
            },
            {
              title: "Build Community",
              text: "Build a community where learning, creativity, and inspiration flow freely.",
            },
            {
              title: "Delight Readers",
              text: "Provide readers with diverse content to explore, learn, and enjoy.",
            },
          ].map(({ title, text }) => (
            <div key={title}>
              <h4 className="font-semibold text-[#29294b] mb-1">{title}</h4>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-gray-700 leading-relaxed">
          Think of BlogCafeAI as your digital café – where conversations never end, ideas
          are served hot, and creativity has no boundaries.
        </p>
      </section>

      {/* SOCIAL + LOCATION */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Social */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-[#29294b] mb-3">Connect with us</h3>
          <p className="mb-4 text-gray-700">
            Follow BlogCafeAI on social and stay updated.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "https://facebook.com", icon: <Facebook size={16} />, name: "Facebook" },
              { href: "https://twitter.com", icon: <Twitter size={16} />, name: "Twitter/X" },
              { href: "https://instagram.com", icon: <Instagram size={16} />, name: "Instagram" },
              { href: "https://linkedin.com", icon: <Linkedin size={16} />, name: "LinkedIn" },
            ].map(({ href, icon, name }) => (
              <Link
                key={name}
                href={href}
                target="_blank"
                className="btn btn-secondary flex items-center gap-2">
                {icon} {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-[#29294b] mb-3">Our Location</h3>
          <p className="text-gray-700">BlogCafeAI HQ (Remote-first)</p>
          <p className="text-gray-700">Ahmedabad, Gujarat, India</p>
          <div className="mt-3 flex flex-col gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> <span>Available worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} /> <span>support@blogcafeai.com</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
