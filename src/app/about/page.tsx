import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
} from "lucide-react";
import aboutImg from "../../../public/images/about_img_3.jpeg";

export const metadata: Metadata = {
  title: "About BlogCafeAI — Our Story & Mission",
  description: "Learn about BlogCafeAI: our mission, community, and platform empowering writers to share stories, tutorials, and insights.",
  alternates: {
    canonical:(process.env.NEXT_PUBLIC_SITE_URL || "https://www.blogcafeai.com") + "/about",
  },
};

const gradientBg = "bg-gradient-to-b from-[#9895ff] to-[#514dcc]";
const cardBase = "rounded-2xl bg-white p-6 shadow";

const offerings = [
  "Open Platform – Anyone can write and publish their blogs.",
  "Diverse Content – From personal stories to professional insights.",
  "Community Spirit – Connect with like-minded creators worldwide.",
  "Easy Sharing – Let your ideas reach people everywhere.",
];

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter/X" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

const features = [
  {
    title: "Empower Creators",
    text: "Empower writers, thinkers, and creators to share their perspectives.",
  },
  {
    title: "Build Community",
    text: "Build a community where creativity and inspiration flow freely.",
  },
  {
    title: "Delight Readers",
    text: "Provide readers with diverse content to explore and enjoy.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>{" "}
        &gt; <span>About</span>
      </nav>

      {/* HERO */}
      <section className={`relative mb-10 overflow-hidden rounded-3xl ${gradientBg}`}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-white font-extrabold text-[2.75rem] leading-[1.1] tracking-tight">
              Welcome to BlogCafeAI
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              A creative hub where ideas brew, stories flow, and every voice
              finds a place to be heard.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/auth" className="btn btn-primary shine">Start Writing</Link>
              <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>

          {/* Right Image */}
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
          <article className={`${cardBase}`}>
            <h2 className="text-2xl font-bold text-[#29294b] mb-3">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed">
              BlogCafeAI was built on a simple belief — every person has a story
              worth sharing. Whether you re passionate about technology,
              lifestyle, business, travel, or personal experiences, our platform
              gives you the space to express, inspire, and engage with readers
              worldwide.
            </p>
          </article>

          {/* Offer + Mission */}
          <div className="grid gap-6 sm:grid-cols-2">
            <article className={cardBase}>
              <h3 className="text-lg font-bold text-[#29294b] mb-2">
                What We Offer
              </h3>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {offerings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className={cardBase}>
              <h3 className="text-lg font-bold text-[#29294b] mb-2">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our mission is simple: make blogging accessible for everyone.
                BlogCafeAI empowers individuals to share knowledge and build
                meaningful connections through the power of words.
              </p>
            </article>
          </div>
        </div>

        {/* RIGHT ASIDE */}
        <aside className="space-y-6">
          <div className={cardBase}>
            <h3 className="text-lg font-bold text-[#29294b] mb-2">
              Why BlogCafeAI?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We’re more than a platform — we’re a café of ideas, creativity,
              and community. A place where every story matters.
            </p>
          </div>

          <div className={`rounded-2xl p-6 text-center shadow ${gradientBg}`}>
            <h4 className="text-xl font-bold text-white">
              Ready to share your story?
            </h4>
            <p className="mt-1 text-white/90">
              Grab your virtual cup of coffee and start writing.
            </p>
            <Link href="/auth" className="btn btn-secondary mt-3">
              Create your account
            </Link>
          </div>
        </aside>
      </section>

      {/* ABOUT BLOCK */}
      <section className={cardBase}>
        <h2 className="text-2xl font-bold text-[#29294b] mb-3">
          Welcome to BlogCafeAI.com
        </h2>
        <p className="text-gray-700 leading-relaxed">
          BlogCafeAI is a community-driven platform where ideas, stories, and
          knowledge come together. A space for creators to publish their blogs
          and connect with a global audience.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {features.map(({ title, text }) => (
            <div key={title}>
              <h4 className="font-semibold text-[#29294b] mb-1">{title}</h4>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-gray-700 leading-relaxed">
          Think of BlogCafeAI as your digital café – where conversations never
          end, ideas are served hot, and creativity has no boundaries.
        </p>
      </section>

      {/* SOCIAL + LOCATION */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Social */}
        <div className={cardBase}>
          <h3 className="text-xl font-bold text-[#29294b] mb-3">Connect with us</h3>
          <p className="mb-4 text-gray-700">
            Follow BlogCafeAI on social and stay updated.
          </p>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                aria-label={label}
                className="btn btn-secondary flex items-center gap-2">
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className={cardBase}>
          <h3 className="text-xl font-bold text-[#29294b] mb-3">Our Location</h3>
          <p className="text-gray-700">BlogCafeAI HQ (Remote-first)</p>
          <p className="text-gray-700">Ahmedabad, Gujarat, India</p>
          <div className="mt-3 flex flex-col gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Available worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>support@blogcafeai.com</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
