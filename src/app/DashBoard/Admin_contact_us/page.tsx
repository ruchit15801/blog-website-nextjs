"use client";

import DashboardLayout from "../DashBoardLayout";
import { AlertCircle, CheckCircle, ChevronDown, Mail, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import { fetchContactMessages, ContactMessage, markContactMessageRead } from "@/lib/adminClient";
import { useRouter } from "next/navigation";

export default function ContactUsAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const [isLimitDropdownOpen, setLimitDropdownOpen] = useState(false);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [subject, setSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [expandedMessages, setExpandedMessages] = useState<string[]>([]);

    // Helper to toggle expand/collapse
    const toggleMessage = (id: string) => {
        setExpandedMessages((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const loadMessages = useCallback(() => {
        if (!token) return;
        setLoading(true);
        setError(null);

        fetchContactMessages({ token, page, limit })
            .then((res) => {
                setMessages(res.data || []);
                setTotalPages(res.totalPages || 1);
            })
            .catch((err: unknown) => {
                console.error(err);
                toast.error("Failed to load messages");
            }).finally(() => setLoading(false));
    }, [page, limit, token]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleSendEmail = async () => {
        if (!token || !selectedMessage) return;

        try {
            toast.success("Email sent successfully!");
            setModalOpen(false);
            setSubject("");
            setEmailBody("");
        } catch (err: unknown) {
            console.log(err);
            toast.error("Failed to send email");
        }
    };

    return (
        <DashboardLayout>
            <div>
                {/* Header Section */}
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white px-8 py-12" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Contact Messages
                        </h1>

                        {/* Right Section: Search + Sort */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                            {/* Search */}
                            <div className="custom-search w-full sm:w-64">
                                <Search />
                                <input
                                    type="text"
                                    placeholder="Search name or email"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full mt-2 sm:mt-0 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>

                            {/* Page Size */}
                            <div className="custom-dropdown w-full sm:w-auto relative">
                                <button
                                    onClick={() => setLimitDropdownOpen(!isLimitDropdownOpen)}
                                    className="flex items-center justify-between w-full sm:w-auto px-3 h-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    {limit} / page
                                    <ChevronDown
                                        className={`w-4 h-4 ml-2 transition-transform ${isLimitDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isLimitDropdownOpen && (
                                    <div className="absolute mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                        {[5, 10, 20, 50].map((l) => (
                                            <div
                                                key={l}
                                                className={`option ${limit === l ? "selected" : ""}`}
                                                onClick={() => {
                                                    setLimit(l);
                                                    setPage(1);
                                                    setLimitDropdownOpen(false);
                                                }}>
                                                {l} / page
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table view */}
                <div className="hidden lg:block overflow-x-auto  border border-gray-200">
                    <table className="table-auto w-full text-left text-sm">
                        <thead className="text-white" style={{ background: "linear-gradient(180deg, #9895ff 100%, #514dcc 0%)" }}>
                            <tr>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center">
                                        <Loader inline label="Loading messages..." />
                                    </td>
                                </tr>
                            )}
                            {error && !loading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-red-600">{error}</td>
                                </tr>
                            )}
                            {!loading && !error && messages.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-600">No messages found.</td>
                                </tr>
                            )}
                            {!loading && !error && messages.map((msg, index) => (
                                <tr
                                    key={msg._id}
                                    onClick={async () => {
                                        if (msg.status !== "read" && token) {
                                            try {
                                                await markContactMessageRead(msg._id, token);
                                                setMessages((prev) =>
                                                    prev.map((m) =>
                                                        m._id === msg._id ? { ...m, status: "read" } : m
                                                    )
                                                );
                                            } catch {
                                                toast.error("Failed to mark as read");
                                            }
                                        }
                                        router.push(`/DashBoard/Admin_contact_detail_page/${msg._id}`);
                                    }}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                                >

                                    <td className="px-4 py-3">{index + 1 + (page - 1) * limit}</td>
                                    <td className="px-4 py-3">{msg.name}</td>
                                    <td className="px-4 py-3">{msg.email}</td>
                                    <td className="px-4 py-3">
                                        {msg.message.length > 100 && !expandedMessages.includes(msg._id)
                                            ? (
                                                <>
                                                    {msg.message.slice(0, 100)}...
                                                    <button
                                                        className="text-indigo-500 ml-1"
                                                        onClick={() => toggleMessage(msg._id)}>
                                                        Read more
                                                    </button>
                                                </>
                                            )
                                            : (
                                                <>
                                                    {msg.message}
                                                    {msg.message.length > 100 && (
                                                        <button
                                                            className="text-indigo-500 ml-1"
                                                            onClick={() => toggleMessage(msg._id)}>
                                                            Show less
                                                        </button>
                                                    )}
                                                </>
                                            )
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${msg.status === "new"
                                                ? "bg-red-100 text-red-700 border border-red-200"
                                                : "bg-green-100 text-green-800 border border-green-200"
                                                }`}>
                                            {msg.status === "new" ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                            {msg.status === "new" ? "New" : "Read"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">{new Date(msg.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="p-2 rounded-full text-white bg-indigo-500 hover:bg-indigo-700 transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMessage(msg);
                                                setModalOpen(true);
                                            }}>
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile / Card view */}
                <div className="lg:hidden flex flex-col gap-4">
                    {loading && <Loader inline label="Loading messages..." />}
                    {!loading && messages.map((msg) => (
                        <div key={msg._id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">{msg.name}</p>
                                    <p className="text-gray-500 text-sm">{msg.email}</p>
                                </div>
                                <button
                                    className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        setModalOpen(true);
                                    }}>
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                                {msg.message.length > 100 && !expandedMessages.includes(msg._id)
                                    ? (
                                        <>
                                            {msg.message.slice(0, 100)}...
                                            <button
                                                className="text-indigo-500 ml-1"
                                                onClick={() => toggleMessage(msg._id)}>
                                                Read more
                                            </button>
                                        </>
                                    )
                                    : (
                                        <>
                                            {msg.message}
                                            {msg.message.length > 100 && (
                                                <button
                                                    className="text-indigo-500 ml-1"
                                                    onClick={() => toggleMessage(msg._id)}>
                                                    Show less
                                                </button>
                                            )}
                                        </>
                                    )
                                }
                            </p>

                            <div className="flex justify-between text-sm mt-2">
                                <span>Status: {msg.status}</span>
                                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>

                {/* Email Modal */}
                {modalOpen && selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
                        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Send Email to {selectedMessage.name}</h2>
                            <input
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mb-3"
                            />
                            <textarea
                                placeholder="Message"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mb-3 h-32"
                            />
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 shine hover:scale-103 hover:text-white" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-indigo-500 text-white rounded shine hover:scale-103 hover:bg-indigo-600" onClick={handleSendEmail}>Send</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
