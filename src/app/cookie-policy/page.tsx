"use client";

import Link from "next/link";

export default function CookiePolicyPage() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span> Cookie Policy</span>
                </div>

                {/* HERO */}
                <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                    <div className="px-6 sm:px-10 py-12">
                        <h1 className="text-white font-extrabold" style={{ fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-.04em' }}>Cookie Policy</h1>
                        <p className="text-white/90 mt-2" style={{ fontSize: '1.05rem' }}>How and why we use cookies, your choices, and controls.</p>
                    </div>
                </section>

                {/* CONTENT */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-2xl shadow p-6 card-hover">
                        <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                            This Cookie Policy explains how blogcafeai.com (“we,” “our,” or “us”) uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
                        </p>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>1. What Are Cookies?</h2>
                            <p className="text-gray-700 mt-2">Cookies are small data files that are placed on your computer, tablet, or mobile device when you visit a website. They are widely used to make websites work more efficiently, improve user experience, and provide information to website owners.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>2. How We Use Cookies</h2>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Essential Cookies</h3>
                                    <p className="text-gray-700">Necessary for the proper functioning of our website (e.g., login, security, navigation).</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Performance & Analytics Cookies</h3>
                                    <p className="text-gray-700">Used to understand how visitors use our website, improve functionality, and analyze traffic.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Functionality Cookies</h3>
                                    <p className="text-gray-700">Remember your preferences (such as language or display settings).</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#29294b' }}>Advertising & Marketing Cookies</h3>
                                    <p className="text-gray-700">Deliver relevant ads, measure campaign effectiveness, and limit the number of times you see an advertisement.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>3. Third-Party Cookies</h2>
                            <p className="text-gray-700 mt-2">In addition to our own cookies, we may also use third-party cookies (such as Google Analytics, AdSense, or social media plugins) to:</p>
                            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                                <li>Measure and analyze traffic</li>
                                <li>Show personalized advertisements</li>
                                <li>Enable social sharing features</li>
                            </ul>
                            <p className="text-gray-700 mt-2">These third parties may collect information about your online activities over time and across different websites.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>4. Your Choices & Control</h2>
                            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                                <li>Browser Settings: Most browsers allow you to control cookies through their settings. You can block or delete cookies if you prefer.</li>
                                <li>Opt-Out Tools: You can opt out of targeted advertising by using tools such as Your Online Choices or Google Ads Settings.</li>
                            </ul>
                            <p className="text-gray-700 mt-2">Please note that disabling cookies may impact the functionality and user experience of our website.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>5. Updates to This Policy</h2>
                            <p className="text-gray-700 mt-2">We may update this Cookie Policy from time to time to reflect changes in technology, law, or our business practices. Any updates will be posted on this page with a revised “Last Updated” date.</p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>6. Contact Us</h2>
                            <div className="mt-2 text-gray-700">
                                <div>Email: <a href="mailto:support@blogcafeai.com" className="link-underline" style={{ color: '#5955d1' }}>support@blogcafeai.com</a></div>
                                <div>Website: <a href="https://www.blogcafeai.com" target="_blank" rel="noreferrer" className="link-underline" style={{ color: '#5955d1' }}>www.blogcafeai.com</a></div>
                            </div>
                        </section>
                    </article>

                    {/* Aside CTA */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl shadow p-6 text-center" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                            <h3 className="text-white text-xl font-bold">Manage preferences</h3>
                            <p className="text-white/90 mt-1">You can change your cookie settings anytime in your browser.</p>
                            <div className="mt-3 flex gap-2 justify-center">
                                <Link href="/privacy-policy" className="btn btn-secondary">Privacy Policy</Link>
                                <Link href="/disclaimer" className="btn btn-primary shine">Disclaimer</Link>
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


