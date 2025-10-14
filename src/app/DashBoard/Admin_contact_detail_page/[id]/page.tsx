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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white btn transition shine hover:scale-102"
          style={{ background: 'linear-gradient(180deg, #9895ff 0%, #514dcc 100%)'}}>
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Contact Message Details</h1>
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
                className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                  message.status === "read"
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
        {message.sentEmail && (
          <div className="mt-8 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Reply className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-indigo-700">Reply Sent</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium text-gray-900">
                  {message.sentEmail.subject || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Message</p>
                <p className="whitespace-pre-line border p-3 rounded-lg bg-white text-gray-800">
                  {message.sentEmail.body || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Sent At</p>
                <p className="text-gray-800">
                  {message.sentEmail.sentAt
                    ? new Date(message.sentEmail.sentAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
