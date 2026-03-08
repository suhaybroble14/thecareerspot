"use client";

import { useState } from "react";
import type { Booking } from "@/lib/supabase/types";
import { cancelBooking, requestRefund } from "@/lib/actions/bookings";
import QRCodeDisplay from "@/components/QRCodeDisplay";

type BookingCardProps = {
  booking: Booking;
  showQR?: boolean;
};

const statusStyles: Record<string, string> = {
  confirmed: "bg-sage/20 text-sage",
  pending: "bg-camel/20 text-cocoa",
  cancelled: "bg-forest/10 text-forest/40",
  checked_in: "bg-camel/20 text-forest",
  cancellation_requested: "bg-cocoa/20 text-cocoa",
};

const statusLabels: Record<string, string> = {
  cancellation_requested: "Refund pending",
};

const REFUND_REASONS = [
  "Change of plans",
  "Unable to attend",
  "Booked wrong date",
  "Other",
];

export default function BookingCard({ booking, showQR = false }: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(booking.status);
  const [error, setError] = useState("");
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [reason, setReason] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const isFuture = booking.booking_date > today;

  const handleRequestRefund = async () => {
    if (!reason) return;
    setLoading(true);
    setError("");

    const result = await requestRefund(booking.id, reason);
    if (result.success) {
      setLocalStatus("cancellation_requested");
      setShowRefundForm(false);
    } else {
      setError(result.error || "Failed to request refund");
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    setError("");

    const result = await cancelBooking(booking.id);
    if (result.success) {
      setLocalStatus("cancelled");
    } else {
      setError(result.error || "Failed to cancel");
    }
    setLoading(false);
  };

  const displayStatus = localStatus;
  const showRefundButton = localStatus === "confirmed" && isFuture && booking.amount_paid > 0;
  const showCancelButton = localStatus === "confirmed" && isFuture && booking.amount_paid === 0;

  return (
    <div className="bg-white border border-forest/10 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-serif text-xl text-forest">
              {new Date(booking.booking_date + "T00:00:00").toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <span
              className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                statusStyles[displayStatus] || "bg-forest/10 text-forest/50"
              }`}
            >
              {statusLabels[displayStatus] ?? displayStatus.replace(/_/g, " ")}
            </span>
          </div>

          <p className="text-forest/50 text-sm mb-1">
            Day Pass - £{booking.amount_paid.toFixed(2)}
          </p>

          {booking.qr_used && (
            <p className="text-sage text-xs mt-1">QR code has been scanned</p>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {showRefundButton && !showRefundForm && (
            <button
              onClick={() => setShowRefundForm(true)}
              className="text-cocoa/70 text-sm mt-3 hover:text-cocoa transition-colors"
            >
              Request refund
            </button>
          )}

          {showRefundButton && showRefundForm && (
            <div className="mt-4 border border-forest/10 p-4 bg-forest/5">
              <p className="text-sm text-forest/70 mb-3">Why do you want a refund?</p>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-forest/20 bg-white px-3 py-2 text-sm text-forest mb-3 focus:outline-none focus:border-camel"
              >
                <option value="">Select a reason...</option>
                {REFUND_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <p className="text-xs text-forest/40 mb-3">Our team will review your request and respond within 1–3 business days.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleRequestRefund}
                  disabled={loading || !reason}
                  className="bg-forest text-cream text-xs tracking-widest uppercase px-4 py-2 hover:bg-forest/80 transition-colors disabled:opacity-40"
                >
                  {loading ? "Submitting..." : "Submit request"}
                </button>
                <button
                  onClick={() => { setShowRefundForm(false); setReason(""); }}
                  className="text-forest/50 text-xs hover:text-forest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showCancelButton && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="text-red-600/70 text-sm mt-3 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>

        {showQR && localStatus === "confirmed" && !booking.qr_used && (
          <div className="shrink-0">
            <QRCodeDisplay code={booking.qr_code} size={140} />
          </div>
        )}
      </div>
    </div>
  );
}
