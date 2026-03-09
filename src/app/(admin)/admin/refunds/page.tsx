"use client";

import { useState, useEffect, useCallback } from "react";
import { getRefundRequests, getRefundHistory, approveRefund, denyRefund } from "@/lib/actions/admin";

type RefundRequest = {
  id: string;
  booking_date: string;
  amount_paid: number;
  stripe_session_id: string | null;
  refund_reason: string | null;
  updated_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
};

type HistoryItem = {
  id: string;
  booking_date: string;
  amount_paid: number;
  refund_reason: string | null;
  updated_at: string;
  status: string;
  profiles: { full_name: string | null; email: string | null }[] | { full_name: string | null; email: string | null } | null;
};

export default function RefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string; type: "success" | "error" | "warning" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [pending, hist] = await Promise.all([
      getRefundRequests(),
      getRefundHistory(),
    ]);
    setRequests(pending as RefundRequest[]);
    setHistory(hist as unknown as HistoryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (bookingId: string) => {
    if (!confirm("Approve this refund? This will issue a Stripe refund and cannot be undone.")) return;
    setProcessing(bookingId);
    setMessage(null);

    try {
      const result = await approveRefund(bookingId);
      if (result.success) {
        if ("warning" in result && result.warning) {
          setMessage({ id: bookingId, text: result.warning as string, type: "warning" });
        } else {
          setMessage({ id: bookingId, text: "Refund approved and issued.", type: "success" });
        }
        setRequests((prev) => prev.filter((r) => r.id !== bookingId));
        const hist = await getRefundHistory();
        setHistory(hist as unknown as HistoryItem[]);
      } else {
        setMessage({ id: bookingId, text: result.error || "Failed to approve refund.", type: "error" });
      }
    } catch {
      setMessage({ id: bookingId, text: "Something went wrong. Please try again.", type: "error" });
    }
    setProcessing(null);
  };

  const handleDeny = async (bookingId: string) => {
    if (!confirm("Deny this refund request? The booking will be restored to confirmed.")) return;
    setProcessing(bookingId);
    setMessage(null);

    try {
      const result = await denyRefund(bookingId);
      if (result.success) {
        setMessage({ id: bookingId, text: "Refund request denied. Booking restored.", type: "success" });
        setRequests((prev) => prev.filter((r) => r.id !== bookingId));
      } else {
        setMessage({ id: bookingId, text: result.error || "Failed to deny refund.", type: "error" });
      }
    } catch {
      setMessage({ id: bookingId, text: "Something went wrong. Please try again.", type: "error" });
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

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const totalRefunded = history.reduce((sum, h) => sum + h.amount_paid, 0);

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
      ) : (
        <>
          {/* ── PENDING ── */}
          {requests.length === 0 ? (
            <div className="bg-white border border-forest/10 p-12 text-center mb-8">
              <p className="text-forest/40 text-sm">No pending refund requests.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-10">
              {requests.map((req) => (
                <div key={req.id} className="bg-white border border-camel/30 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif text-lg text-forest">
                          {req.profiles?.full_name || "Unknown"}
                        </h3>
                        <span className="text-xs tracking-widest uppercase px-2 py-0.5 bg-camel/20 text-cocoa">
                          Pending
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
                          Requested: <span className="text-forest">{formatDateTime(req.updated_at)}</span>
                        </span>
                        {req.refund_reason && (
                          <span className="text-forest/50">
                            Reason: <span className="text-forest">{req.refund_reason}</span>
                          </span>
                        )}
                      </div>

                      {message?.id === req.id && (
                        <p className={`text-sm mt-3 ${
                          message.type === "success" ? "text-sage" :
                          message.type === "warning" ? "text-camel" : "text-red-600"
                        }`}>
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

          {/* ── HISTORY ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-forest">Refund History</h2>
              {history.length > 0 && (
                <div className="text-right">
                  <p className="text-xs text-forest/40">{history.length} total refund{history.length !== 1 ? "s" : ""}</p>
                  <p className="text-sm text-forest font-medium">£{totalRefunded.toFixed(2)} refunded</p>
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white border border-forest/10 p-8 text-center">
                <p className="text-forest/40 text-sm">No refund history yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-forest/10 divide-y divide-forest/5">
                {history.map((item) => {
                  const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
                  return (
                    <div key={item.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-forest text-sm font-medium">
                            {profile?.full_name || profile?.email || "Unknown"}
                          </p>
                          <span className="text-xs tracking-widest uppercase px-2 py-0.5 bg-forest/5 text-forest/40">
                            Refunded
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-forest/50">
                          <span>Booking: <span className="text-forest">{formatDate(item.booking_date)}</span></span>
                          <span>Amount: <span className="text-forest">£{item.amount_paid.toFixed(2)}</span></span>
                          <span>Processed: <span className="text-forest">{formatDateTime(item.updated_at)}</span></span>
                        </div>
                        {item.refund_reason && (
                          <p className="text-xs text-forest/40 mt-1">
                            Reason: <span className="text-forest/60">{item.refund_reason}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
