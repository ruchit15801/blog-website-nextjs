"use client";
import Link from "next/link";
import { useState } from "react";
import { submitContact } from "@/lib/api";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null);
        setSubmitting(true);
        try {
            await submitContact({ name, email, message });
            setStatus("Thank you! We received your message.");
            setName(""); setEmail(""); setMessage("");
        } catch (err: unknown) {
            setStatus(err instanceof Error ? err.message : "Failed to send. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-12">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span>Contact</span>
                </div>

                {/* Header Section */}
                <div className="text-center">
                    <h3 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontSize: '2rem', color: '#29294b' }}>
                        Feel Free to Contact Us
                    </h3>
                    <p className="mx-auto" style={{ maxWidth: '520px', fontSize: '16px', lineHeight: 1.55, color: '#696981' }}>
                        We’d love to hear from you! Whether you have questions, feedback, or ideas to share, our team is always ready to connect. Every message matters to us because this space grows stronger with your voice.
                    </p>
                </div>

                {/* Contact Form */}
                <section className="mt-12 flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-4 sm:p-6 rounded-2xl max-w-xl w-full text-left bg-white" style={{ boxShadow: '0 5px 25px 0 rgba(114,114,255,.12)', borderRadius: '16px', maxWidth: '640px' }}>
                        <h5 className="text-xl" style={{ color: '#29294b', fontWeight: 700, lineHeight: 1.2, fontSize: '1.3rem', letterSpacing: '-.04em' }}>
                            Ready to Get Started?
                        </h5>

                        {/* Name */}
                        <div className="flex flex-col" style={{ color: '#29294b' }}>
                            <label htmlFor="name" className="mb-1 font-medium" style={{ fontWeight: 400 }}>Name <span>*</span></label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                style={{
                                    border: '1px solid #e1e1e8',
                                    borderRadius: '8px',
                                    width: '100%',
                                    minHeight: '40px',
                                    transition: '.25s'
                                }}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col" style={{ color: '#29294b' }}>
                            <label htmlFor="email" className="mb-1 font-medium" style={{ fontWeight: 400 }}>Email <span>*</span></label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                style={{
                                    border: '1px solid #e1e1e8',
                                    borderRadius: '8px',
                                    width: '100%',
                                    minHeight: '40px',
                                    transition: '.25s'
                                }}
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col" style={{ color: '#29294b' }}>
                            <label htmlFor="message" className="mb-1 font-medium" style={{ fontWeight: 400 }}>Message <span>*</span></label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{
                                    border: '1px solid #e1e1e8',
                                    height: '100px',
                                    borderRadius: '8px',
                                    minHeight: '40px',
                                    width: '100%'
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="submit-button text-white px-8 py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60">
                                {submitting ? "Sending..." : "Submit Request"}
                            </button>
                        </div>
                        {status && (
                            <p className="text-sm" style={{ color: status.startsWith("Thank") ? '#10b981' : '#ef4444' }}>{status}</p>
                        )}
                    </form>
                </section>
            </div>
        </>
    );
}
