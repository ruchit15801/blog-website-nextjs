"use client";

import Link from "next/link";

export default function DisclaimerPage() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span> Disclaimer</span>
                </div>

                {/* HERO */}
                <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)" }}>
                    <div className="px-6 sm:px-10 py-12">
                        <h1 className="text-white font-extrabold" style={{ fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-.04em' }}>Disclaimer</h1>
                        <p className="text-white/90 mt-2" style={{ fontSize: '1.05rem' }}>Transparency about content, links, and responsibility.</p>
                    </div>
                </section>

                {/* CONTENT */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-2xl shadow p-6 card-hover">
                        <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                            The information provided on blogcafeai.com (“Website”) is for general informational purposes only. All content, posts, and opinions published on this platform are the sole responsibility of the respective authors.
                        </p>
                        <p className="text-gray-700 mt-4" style={{ lineHeight: 1.7 }}>
                            While we strive to ensure that the information shared is accurate and up to date, blogcafeai.com makes no warranties or representations regarding the completeness, reliability, or accuracy of any content. Any action you take based on the information found on this Website is strictly at your own risk.
                        </p>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>User-Generated Content</h2>
                            <p className="text-gray-700 mt-2" style={{ lineHeight: 1.7 }}>
                                This Website allows users to post their own blogs and opinions. The views and opinions expressed in user-generated content do not necessarily reflect the views of blogcafeai.com, its owners, or administrators. We are not liable for any content published by users, including but not limited to errors, omissions, or any loss or damage incurred as a result of reliance on such content.
                            </p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>External Links</h2>
                            <p className="text-gray-700 mt-2" style={{ lineHeight: 1.7 }}>
                                The Website may contain links to external websites or resources. We are not responsible for the content, accuracy, or reliability of any third-party websites linked to or from this platform.
                            </p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>No Professional Advice</h2>
                            <p className="text-gray-700 mt-2" style={{ lineHeight: 1.7 }}>
                                The content published on this Website should not be considered as professional, legal, financial, or medical advice. For such matters, please consult a qualified professional.
                            </p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-xl font-bold" style={{ color: '#29294b' }}>Limitation of Liability</h2>
                            <p className="text-gray-700 mt-2" style={{ lineHeight: 1.7 }}>
                                By using this Website, you agree that blogcafeai.com will not be held responsible for any loss, liability, or damage—direct or indirect—that may arise from the use of the Website or reliance on any information available here.
                            </p>
                        </section>
                    </article>

                    {/* Aside CTA */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl shadow p-6 text-center" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
                            <h3 className="text-white text-xl font-bold">Stay informed</h3>
                            <p className="text-white/90 mt-1">Explore more about our policies and guidelines.</p>
                            <div className="mt-3 flex gap-2 justify-center">
                                <Link href="/privacy-policy" className="btn btn-secondary">Privacy Policy</Link>
                                <Link href="/contact" className="btn btn-primary shine">Contact</Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6">
                            <h4 className="font-semibold mb-2" style={{ color: '#29294b' }}>Quick Links</h4>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li><Link href="/about" className="link-underline">About Us</Link></li>
                                <li><Link href="/privacy-policy" className="link-underline">Privacy Policy</Link></li>
                                <li><Link href="/auth" className="link-underline">Create Account</Link></li>
                            </ul>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
}


