"use client";

import { useState, useEffect, useCallback } from "react";
import { getRefundRequests, approveRefund, denyRefund } from "@/lib/actions/admin";

type RefundRequest = {
  id: string;
  booking_date: string;
  amount_paid: number;
  stripe_session_id: string | null;
  updated_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
};

export default function RefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getRefundRequests();
    setRequests(data as RefundRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (bookingId: string) => {
    if (!confirm("Approve this refund? This will issue a Stripe refund and cannot be undone.")) return;
    setProcessing(bookingId);
    setMessage(null);

    const result = await approveRefund(bookingId);
    if (result.success) {
      setMessage({ id: bookingId, text: "Refund approved and issued.", type: "success" });
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));
    } else {
      setMessage({ id: bookingId, text: result.error || "Failed to approve refund.", type: "error" });
    }
    setProcessing(null);
  };

  const handleDeny = async (bookingId: string) => {
    if (!confirm("Deny this refund request? The booking will be restored to confirmed.")) return;
    setProcessing(bookingId);
    setMessage(null);

    const result = await denyRefund(bookingId);
    if (result.success) {
      setMessage({ id: bookingId, text: "Refund request denied. Booking restored.", type: "success" });
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));
    } else {
      setMessage({ id: bookingId, text: result.error || "Failed to deny refund.", type: "error" });
    }
    setProcessing(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatRequested = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Refund Requests</h1>
      <p className="text-forest/50 text-sm mb-8">
        Review and action pending refund requests from members.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">No pending refund requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-forest/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-lg text-forest">
                      {req.profiles?.full_name || "Unknown"}
                    </h3>
                    <span className="text-xs tracking-widest uppercase px-2 py-0.5 bg-cocoa/20 text-cocoa">
                      Refund pending
                    </span>
                  </div>
                  <p className="text-forest/50 text-sm">{req.profiles?.email}</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <span className="text-forest/50">
                      Booking: <span className="text-forest">{formatDate(req.booking_date)}</span>
                    </span>
                    <span className="text-forest/50">
                      Amount: <span className="text-forest">£{req.amount_paid.toFixed(2)}</span>
                    </span>
                    <span className="text-forest/50">
                      Requested: <span className="text-forest">{formatRequested(req.updated_at)}</span>
                    </span>
                  </div>

                  {message?.id === req.id && (
                    <p className={`text-sm mt-3 ${message.type === "success" ? "text-sage" : "text-red-600"}`}>
                      {message.text}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => handleDeny(req.id)}
                    disabled={processing === req.id}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-forest/20 text-forest/60 hover:bg-forest/5 transition-colors disabled:opacity-40"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={processing === req.id}
                    className="px-4 py-2 text-xs tracking-widest uppercase bg-forest text-cream hover:bg-forest/80 transition-colors disabled:opacity-40"
                  >
                    {processing === req.id ? "Processing..." : "Approve Refund"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
