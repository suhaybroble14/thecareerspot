"use client";

import { useState } from "react";
import { approveRefund, denyRefund } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

export default function RefundActions({ bookingId }: { bookingId: string }) {
  const [processing, setProcessing] = useState<"approve" | "deny" | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
  const router = useRouter();

  const handle = async (action: "approve" | "deny") => {
    const confirmed = action === "approve"
      ? confirm("Approve this refund? This will issue a Stripe refund and cannot be undone.")
      : confirm("Deny this refund request? The booking will be restored to confirmed.");
    if (!confirmed) return;

    setProcessing(action);
    setMessage(null);

    try {
      const result = action === "approve" ? await approveRefund(bookingId) : await denyRefund(bookingId);

      if (result.success) {
        if ("warning" in result && result.warning) {
          setMessage({ text: result.warning as string, type: "warning" });
        } else {
          router.refresh();
        }
      } else {
        setMessage({ text: result.error || "Something went wrong.", type: "error" });
        setProcessing(null);
      }
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
      setProcessing(null);
    }
  };

  if (message) {
    return (
      <p className={`text-xs max-w-xs ${message.type === "warning" ? "text-camel" : "text-red-600"}`}>
        {message.text}
      </p>
    );
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => handle("deny")}
        disabled={!!processing}
        className="px-4 py-2 text-xs tracking-widest uppercase border border-forest/20 text-forest/60 hover:bg-forest/5 transition-colors disabled:opacity-40"
      >
        Deny
      </button>
      <button
        onClick={() => handle("approve")}
        disabled={!!processing}
        className="px-4 py-2 text-xs tracking-widest uppercase bg-forest text-cream hover:bg-forest/80 transition-colors disabled:opacity-40"
      >
        {processing === "approve" ? "Processing..." : "Approve"}
      </button>
    </div>
  );
}
