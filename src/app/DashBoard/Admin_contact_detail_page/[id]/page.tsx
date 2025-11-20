"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../DashBoardLayout";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Reply,
  CheckCircle,
  Clock,
} from "lucide-react";
import { fetchContactMessageById } from "@/lib/adminClient";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  sentEmail?: {
    subject?: string;
    body?: string;
    sentAt?: string;
  };
}

export default function ContactMessageDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);

    fetchContactMessageById({ id: id as string, token })
      .then((res) => setMessage(res))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch message details");
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader label="Loading contact details..." />
      </DashboardLayout>
    );
  }

  if (!message) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">Message not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col shadow-xl pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-white px-8 py-10 rounded-xl" style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)' }}>
          <button
            onClick={() => router.back()}
            className="create_schedule flex items-center gap-2 text-white btn transition shine hover:scale-102">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Contact Message Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100 p-8">
          {/* Top Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="p-3 bg-indigo-100 rounded-full">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold text-gray-900 text-lg">{message.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-900 text-lg">{message.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="p-3 bg-green-100 rounded-full">
                {message.status === "read" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${message.status === "read"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}>
                  {message.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Received On</p>
                <p className="font-medium text-gray-900">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Message Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Message</h2>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 whitespace-pre-line shadow-inner">
              {message.message}
            </div>
          </div>

          {/* Sent Email Section */}
           {message.sentEmail && (message.sentEmail.subject || message.sentEmail.body) && (
            <div className="mt-10 flex flex-col items-end">
              {/* Bubble Container */}
              <div className="relative max-w-2xl w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-2xl shadow-lg border border-indigo-200 p-6 animate-fadeIn">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 rounded-full text-white shadow-md">
                      <Reply className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-indigo-800">You replied</h2>
                  </div>

                  <span className="text-xs text-gray-500">
                    {message.sentEmail.sentAt
                      ? new Date(message.sentEmail.sentAt).toLocaleString()
                      : "—"}
                  </span>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500 font-medium mb-1">Subject</p>
                  <p className="text-gray-900 font-semibold bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg px-3 py-2">
                    {message.sentEmail.subject || "—"}
                  </p>
                </div>

                {/* Reply Body */}
                <div className="relative bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-inner">
                  <div className="absolute -top-3 right-6 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200">
                    Reply Message
                  </div>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {message.sentEmail.body || "—"}
                  </p>
                </div>

                {/* Footer / Status */}
                <div className="mt-4 flex items-center justify-end gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    ✅ Sent Successfully
                  </span>
                </div>

                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-3 right-10 w-5 h-5 bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rotate-45 border-b border-r border-indigo-200"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
