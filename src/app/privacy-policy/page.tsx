"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span> Privacy Policy</span>
                </div>

                {/* HERO */}
                <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                    <div className="px-6 sm:px-10 py-12">
                        <h1 className="text-white font-extrabold" style={{ fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-.04em' }}>Privacy Policy</h1>
                        <p className="text-white/90 mt-2" style={{ fontSize: '1.05rem' }}>We respect your privacy and protect your data with care.</p>
                    </div>
                </section>

                {/* CONTENT */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-2xl shadow p-6 card-hover">
                        <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                            At blogcafeai.com, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                        </p>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Information We Collect</h2>
                            <div className="mt-3 space-y-4">
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Personal Information</h3>
                                    <p className="text-gray-700">Name, email address, or any details you provide through contact forms or newsletter subscriptions.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Non-Personal Information</h3>
                                    <p className="text-gray-700">Browser type, IP address, device information, and browsing behavior through analytics tools (e.g., Google Analytics).</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Cookies and Tracking Technologies</h3>
                                    <p className="text-gray-700">We may use cookies to improve user experience, analyze traffic, and personalize content.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>How We Use Your Information</h2>
                            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                                <li>Providing and improving our blog content and services.</li>
                                <li>Sending newsletters, updates, or promotional materials (only if you subscribe).</li>
                                <li>Monitoring website performance and user behavior to enhance user experience.</li>
                                <li>Ensuring website security and preventing fraudulent activity.</li>
                            </ul>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Third-Party Services</h2>
                            <p className="text-gray-700 mt-2">We may use third-party services such as Google Analytics, AdSense, or affiliate networks that collect and process data according to their own privacy policies. These third-party tools may use cookies or similar tracking technologies.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Data Protection</h2>
                            <p className="text-gray-700 mt-2">We take appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Your Rights</h2>
                            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                                <li>Access, update, or delete your personal data.</li>
                                <li>Opt-out of email communications anytime.</li>
                                <li>Disable cookies through your browser settings.</li>
                            </ul>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Children’s Privacy</h2>
                            <p className="text-gray-700 mt-2">Our website is not intended for children under the age of 13, and we do not knowingly collect their data.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Updates to This Privacy Policy</h2>
                            <p className="text-gray-700 mt-2">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Contact Us</h2>
                            <p className="text-gray-700 mt-2">If you have any questions about this Privacy Policy, please contact us at:</p>
                            <div className="mt-2 text-gray-700">
                                <div>Email: <a href="mailto:support@blogcafeai.com" className="link-underline" style={{ color: '#5955d1' }}>support@blogcafeai.com</a></div>
                                <div>Website: <a href="https://blogcafeai.com" target="_blank" rel="noreferrer" className="link-underline" style={{ color: '#5955d1' }}>https://blogcafeai.com</a></div>
                            </div>
                        </section>
                    </article>

                    {/* Aside CTA */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl shadow p-6 text-center" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                            <h3 className="text-white text-xl font-bold">Your privacy matters</h3>
                            <p className="text-white/90 mt-1">Manage your preferences anytime.</p>
                            <div className="mt-3 flex gap-2 justify-center">
                                <Link href="/contact" className="btn btn-secondary">Contact Support</Link>
                                <Link href="/" className="btn btn-primary shine">Go Home</Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6">
                            <h4 className="font-semibold mb-2" style={{ color: '#29294b' }}>Quick Links</h4>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li><Link href="/about" className="link-underline">About Us</Link></li>
                                <li><Link href="/contact" className="link-underline">Contact</Link></li>
                                <li><Link href="/auth" className="link-underline">Create Account</Link></li>
                            </ul>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
}


