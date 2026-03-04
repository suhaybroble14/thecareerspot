"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getApplicationDetail,
  getCapacityPreview,
  updateApplicationStatus,
  addAdminNote,
} from "@/lib/actions/admin-applications";
import type { MembershipApplication, AdminNote } from "@/lib/supabase/types";

const statusStyles: Record<string, string> = {
  submitted: "bg-camel/20 text-cocoa",
  under_review: "bg-camel/20 text-cocoa",
  approved: "bg-sage/20 text-sage",
  rejected: "bg-forest/10 text-forest/40",
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmAction, setConfirmAction] = useState<"approved" | "rejected" | null>(null);
  const [capacityPreview, setCapacityPreview] = useState<{
    currentActiveMonthly: number;
    afterApproval: number;
    newDayPassCapacity: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const [data, capacity] = await Promise.all([
        getApplicationDetail(id),
        getCapacityPreview(),
      ]);
      setApplication(data.application);
      setNotes(data.notes as AdminNote[]);
      setCapacityPreview(capacity);
      setLoading(false);
    }
    load();
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleStatusUpdate = async (status: "under_review" | "approved" | "rejected") => {
    setConfirmAction(null);
    setActionLoading(status);
    setError("");
    const result = await updateApplicationStatus(id, status);
    if (result.success) {
      setApplication((prev) => (prev ? { ...prev, status } : null));
      const labels = { under_review: "Marked as under review", approved: "Application approved", rejected: "Application rejected" };
      showToast(labels[status]);
    } else {
      setError(result.error || "Failed to update status");
    }
    setActionLoading("");
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setActionLoading("note");
    const result = await addAdminNote("application", id, newNote.trim());
    if (result.success) {
      setNotes((prev) => [
        {
          id: Date.now().toString(),
          target_type: "application",
          target_id: id,
          note: newNote.trim(),
          created_by: null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewNote("");
      showToast("Note added");
    }
    setActionLoading("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-32 bg-forest/5 animate-pulse rounded" />
        <div className="h-10 w-64 bg-forest/5 animate-pulse rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-forest/10 p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-forest/5 animate-pulse rounded" />
                  <div className="h-4 w-48 bg-forest/5 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-forest/10 p-6 h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <svg className="w-12 h-12 text-forest/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        <p className="text-forest/40 mb-4">Application not found.</p>
        <Link href="/admin/applications" className="text-camel text-sm hover:underline">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-cream px-5 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 backdrop-blur-sm">
          <div className="bg-white p-8 max-w-sm mx-6 shadow-xl">
            <h3 className="font-serif text-xl text-forest mb-3">
              {confirmAction === "approved" ? "Approve this application?" : "Reject this application?"}
            </h3>
            <p className="text-forest/60 text-sm mb-2">
              {confirmAction === "approved"
                ? `This will approve, create a 30-day membership, and email ${application.email}.`
                : `This will send a rejection email to ${application.email}.`}
            </p>
            {confirmAction === "approved" && capacityPreview && (
              <div className="bg-sage/10 border border-sage/20 p-3 my-4 text-sm">
                <p className="text-forest font-medium mb-1">Capacity impact:</p>
                <p className="text-forest/60">
                  Active members: {capacityPreview.currentActiveMonthly} → {capacityPreview.afterApproval}
                </p>
                <p className="text-forest/60">
                  Day pass capacity: {14 - capacityPreview.currentActiveMonthly} → {capacityPreview.newDayPassCapacity}
                </p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 border border-forest/20 text-forest px-4 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(confirmAction)}
                disabled={!!actionLoading}
                className={`flex-1 px-4 py-3 text-sm tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  confirmAction === "approved"
                    ? "bg-sage/20 text-sage hover:bg-sage/30"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {actionLoading ? "..." : confirmAction === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/admin/applications"
        className="text-forest/40 text-sm hover:text-forest transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        All Applications
      </Link>

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-forest mb-1">
            {application.full_name}
          </h1>
          <p className="text-forest/50 text-sm">{application.email}</p>
        </div>
        <span
          className={`text-xs tracking-widest uppercase px-3 py-1 ${
            statusStyles[application.status] || "bg-forest/10 text-forest/50"
          }`}
        >
          {application.status.replace("_", " ")}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Application details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-forest/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
              Application Details
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-forest/40 mb-1">Full Name</dt>
                <dd className="text-sm text-forest">{application.full_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-forest/40 mb-1">Email</dt>
                <dd className="text-sm text-forest">{application.email}</dd>
              </div>
              {application.phone && (
                <div>
                  <dt className="text-xs text-forest/40 mb-1">Phone</dt>
                  <dd className="text-sm text-forest">{application.phone}</dd>
                </div>
              )}
              {application.message && (
                <div>
                  <dt className="text-xs text-forest/40 mb-1">Message</dt>
                  <dd className="text-sm text-forest whitespace-pre-wrap">
                    {application.message}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-forest/40 mb-1">Submitted</dt>
                <dd className="text-sm text-forest">
                  {new Date(application.created_at).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          {/* Capacity preview for pending applications */}
          {(application.status === "submitted" || application.status === "under_review") &&
            capacityPreview && (
              <div className="bg-forest/[0.03] border border-forest/10 p-5">
                <h3 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
                  If approved
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-forest/40 text-xs mb-1">Active members</p>
                    <p className="text-forest">
                      {capacityPreview.currentActiveMonthly} → {capacityPreview.afterApproval}
                    </p>
                  </div>
                  <div>
                    <p className="text-forest/40 text-xs mb-1">Day pass capacity</p>
                    <p className="text-forest">
                      {14 - capacityPreview.currentActiveMonthly} → {capacityPreview.newDayPassCapacity}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Admin notes */}
          <div className="bg-white border border-forest/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
              Notes
            </h2>
            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-white border border-forest/10 px-4 py-2 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
                placeholder="Add a note..."
              />
              <button
                type="submit"
                disabled={actionLoading === "note" || !newNote.trim()}
                className="bg-forest text-cream px-4 py-2 text-sm hover:bg-forest-light transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>
            {notes.length === 0 ? (
              <p className="text-forest/30 text-sm">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-forest/10 pl-3">
                    <p className="text-sm text-forest">{note.note}</p>
                    <p className="text-xs text-forest/30 mt-1">
                      {new Date(note.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-forest/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              {application.status === "submitted" && (
                <button
                  onClick={() => handleStatusUpdate("under_review")}
                  disabled={!!actionLoading}
                  className="w-full bg-camel/20 text-cocoa px-4 py-3 text-sm tracking-widest uppercase hover:bg-camel/30 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "under_review" ? "..." : "Mark Under Review"}
                </button>
              )}

              {(application.status === "submitted" || application.status === "under_review") && (
                <>
                  <button
                    onClick={() => setConfirmAction("approved")}
                    disabled={!!actionLoading}
                    className="w-full bg-sage/20 text-sage px-4 py-3 text-sm tracking-widest uppercase hover:bg-sage/30 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "approved" ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setConfirmAction("rejected")}
                    disabled={!!actionLoading}
                    className="w-full bg-red-50 text-red-600 px-4 py-3 text-sm tracking-widest uppercase hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "rejected" ? "..." : "Reject"}
                  </button>
                </>
              )}

              {application.status === "approved" && (
                <p className="text-xs text-sage leading-relaxed">
                  Membership is active. Approval email and admin notifications sent.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
