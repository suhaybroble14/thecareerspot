"use client";

import { useState } from "react";
import type { Booking } from "@/lib/supabase/types";
import { cancelBooking } from "@/lib/actions/bookings";
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
};

export default function BookingCard({ booking, showQR = false }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    setError("");

    const result = await cancelBooking(booking.id);
    if (result.success) {
      setCancelled(true);
    } else {
      setError(result.error || "Failed to cancel");
    }
    setCancelling(false);
  };

  const isCancellable =
    !cancelled &&
    booking.status === "confirmed" &&
    booking.booking_date > new Date().toISOString().split("T")[0];

  const displayStatus = cancelled ? "cancelled" : booking.status;

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
              {displayStatus.replace("_", " ")}
            </span>
          </div>

          <p className="text-forest/50 text-sm mb-1">
            Day Pass - £{booking.amount_paid.toFixed(2)}
          </p>

          {booking.qr_used && (
            <p className="text-sage text-xs mt-1">QR code has been scanned</p>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {isCancellable && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-red-600/70 text-sm mt-3 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>

        {showQR && booking.status === "confirmed" && !booking.qr_used && (
          <div className="shrink-0">
            <QRCodeDisplay code={booking.qr_code} size={140} />
          </div>
        )}
      </div>
    </div>
  );
}
