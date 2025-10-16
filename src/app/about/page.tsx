import Image from "next/image";
import aboutImg from "../../../public/images/about_img_3.jpeg";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail } from "lucide-react";

export default function AboutPage() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span> About</span>
                </div>

                {/* HERO */}
                <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0 pointer-events-none" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 sm:px-10 py-12 relative z-10">
                        <div className="space-y-4">
                            <h1 className="text-white font-extrabold" style={{ fontSize: '2.75rem', lineHeight: 1.1, letterSpacing: '-.04em' }}>
                                Welcome to BlogCafeAI
                            </h1>
                            <p className="text-white/90" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                A creative hub where ideas brew, stories flow, and every voice finds a place to be heard.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link href="/auth" className="btn btn-primary shine">Start Writing</Link>
                                <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
                            </div>
                        </div>
                        <div className="relative hidden md:block aspect-[16/9]">
                            <Image
                                src={aboutImg}
                                alt="About"
                                fill
                                priority
                                quality={90}
                                placeholder="blur"
                                sizes="(min-width: 1280px) 720px, (min-width: 768px) 640px, 100vw"
                                className="object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* INTRO COPY */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow p-6 card-hover">
                            <h2 className="text-2xl font-bold mb-3" style={{ color: '#29294b' }}>Our Story</h2>
                            <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                                We believe everyone has a story, an idea, or an experience worth sharing. BlogCafeAI is designed to give writers, thinkers, and creators a simple and open platform to publish their blogs and connect with a wider audience. Whether you’re passionate about technology, lifestyle, travel, business, or personal experiences – this is your space to express, inspire, and engage.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white rounded-2xl shadow p-6">
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#29294b' }}>What We Offer</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>Open Platform – Anyone can write and publish their blogs.</li>
                                    <li>Diverse Content – From personal stories to professional insights, we welcome all categories of writing.</li>
                                    <li>Community Spirit – Connect with like-minded readers and writers across the globe.</li>
                                    <li>Easy Sharing – Share your voice effortlessly and let your ideas reach people everywhere.</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl shadow p-6">
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#29294b' }}>Our Mission</h3>
                                <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                                    At BlogCafeAI, our mission is simple – to make blogging accessible for everyone. We want to empower individuals to share knowledge, express creativity, and build meaningful connections through words.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ASIDE CARDS */}
                    <div className="space-y-6">
                        <div className="aside-shadow rounded-2xl shadow p-6 bg-white">
                            <h3 className="text-lg font-bold mb-2" style={{ color: '#29294b' }}>Why BlogCafeAI?</h3>
                            <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                                Because we’re not just another blogging site. We’re a community café of ideas, fueled by creativity and powered by people like you.
                            </p>
                        </div>
                        <div className="rounded-2xl shadow p-6 text-center" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                            <h4 className="text-white text-xl font-bold">Ready to share your story?</h4>
                            <p className="text-white/90 mt-1">Grab your virtual cup of coffee and start writing.</p>
                            <div className="mt-3">
                                <Link href="/auth" className="btn btn-secondary">Create your account</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECOND BLOCK (ALT COPY) */}
                <section className="bg-white rounded-2xl shadow p-6 card-hover">
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#29294b' }}>Welcome to BlogCafeAI.com</h2>
                    <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                        A community-driven platform where ideas, stories, and knowledge come together. We believe everyone has a voice worth sharing. At BlogCafeAI, users can create, publish, and share their blogs with a global audience. Whether you’re passionate about technology, lifestyle, travel, business, or personal experiences, our platform gives you the space to express yourself.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-6 mt-6">
                        <div>
                            <h4 className="font-semibold mb-1" style={{ color: '#29294b' }}>Empower Creators</h4>
                            <p className="text-gray-700">Empower writers, thinkers, and creators to share their perspectives.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1" style={{ color: '#29294b' }}>Build Community</h4>
                            <p className="text-gray-700">Build a community where learning, creativity, and inspiration flow freely.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1" style={{ color: '#29294b' }}>Delight Readers</h4>
                            <p className="text-gray-700">Provide readers with diverse content to explore, learn, and enjoy.</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mt-6" style={{ lineHeight: 1.7 }}>
                        Think of BlogCafeAI as your digital café – where conversations never end, ideas are served hot, and creativity has no boundaries.
                    </p>
                </section>

                {/* SOCIAL + LOCATION */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-xl font-bold mb-3" style={{ color: '#29294b' }}>Connect with us</h3>
                        <p className="text-gray-700 mb-4">Follow BlogCafeAI on social and stay updated.</p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="https://facebook.com" target="_blank" className="btn btn-secondary flex items-center gap-2"><Facebook size={16} /> Facebook</Link>
                            <Link href="https://twitter.com" target="_blank" className="btn btn-secondary flex items-center gap-2"><Twitter size={16} /> Twitter/X</Link>
                            <Link href="https://instagram.com" target="_blank" className="btn btn-secondary flex items-center gap-2"><Instagram size={16} /> Instagram</Link>
                            <Link href="https://linkedin.com" target="_blank" className="btn btn-secondary flex items-center gap-2"><Linkedin size={16} /> LinkedIn</Link>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-xl font-bold mb-3" style={{ color: '#29294b' }}>Our Location</h3>
                        <p className="text-gray-700">BlogCafeAI HQ (Remote-first)</p>
                        <p className="text-gray-700">Ahmedabad, Gujarat, India</p>
                        <div className="mt-3 flex flex-col gap-2 text-gray-700">
                            <div className="flex items-center gap-2"><MapPin size={16} /> <span>Available worldwide</span></div>
                            <div className="flex items-center gap-2"><Mail size={16} /> <span>support@blogcafeai.com</span></div>
                        </div>
                    </div>
                </section>

                {/* CONTACT STRIP */}
                {/* <section className="mt-10">
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--surface), transparent)' }}>
                        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 items-stretch">
                            <div className="p-6 md:p-10">
                                <h3 className="text-2xl font-bold" style={{ color: '#29294b' }}>Contact Us</h3>
                                <p className="text-gray-700 mt-1" style={{ lineHeight: 1.7 }}>Have a question or want to collaborate? We’re here.</p>
                                <form className="mt-5 grid gap-3 max-w-xl">
                                    <input placeholder="Your name" className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" />
                                    <input placeholder="Your email" className="rounded-xl px-3 h-11 bg-white/5 border border-white/10" />
                                    <textarea placeholder="Your message" className="rounded-xl px-3 py-2 min-h-[120px] bg-white/5 border border-white/10" />
                                    <button type="button" className="btn btn-primary shine w-fit">Send Message</button>
                                </form>
                            </div>
                            <div className="relative min-h-[260px]">
                                <Image src="/images/a10.webp" alt="workspace" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </section> */}
            </div>
        </>
    );
}
