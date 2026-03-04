"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AnimateIn from "@/components/AnimateIn";
import QRCode from "qrcode";

type BookingData = {
  id: string;
  booking_date: string;
  qr_code: string;
  status: string;
};

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("bookings")
        .select("id, booking_date, qr_code, status")
        .eq("stripe_session_id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setBooking(data);

        try {
          const url = await QRCode.toDataURL(data.qr_code, {
            width: 280,
            margin: 2,
            color: {
              dark: "#2F3D38",
              light: "#F0EDE8",
            },
          });
          setQrDataUrl(url);
        } catch (err) {
          console.error("QR generation error:", err);
        }
      }

      setLoading(false);
    }

    fetchBooking();
  }, [sessionId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <p className="text-forest/40">Loading your booking...</p>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-center max-w-md px-6">
          <h1 className="font-serif text-3xl text-forest mb-4">
            Booking Not Found
          </h1>
          <p className="text-forest/60 mb-8">
            We couldn&apos;t find your booking. It may still be processing.
          </p>
          <Link
            href="/dashboard/bookings"
            className="bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors inline-block"
          >
            View My Bookings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">
              You&apos;re booked in
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg">
              Your day pass for{" "}
              <span className="text-camel font-medium">
                {formatDate(booking.booking_date)}
              </span>{" "}
              is confirmed.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-md mx-auto px-6">
          <AnimateIn delay={0.3}>
            <div className="bg-white p-8 text-center">
              <h2 className="font-serif text-xl text-forest mb-2">
                Your QR Code
              </h2>
              <p className="text-forest/50 text-sm mb-6">
                Show this when you arrive to check in.
              </p>

              {qrDataUrl && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={qrDataUrl}
                    alt="Booking QR Code"
                    width={224}
                    height={224}
                    unoptimized
                  />
                </div>
              )}

              <p className="text-forest/30 text-xs font-mono tracking-wider mb-6">
                {booking.qr_code.slice(0, 8).toUpperCase()}
              </p>

              <div className="border-t border-forest/10 pt-6 space-y-2 text-sm text-forest/60">
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="text-forest">
                    {formatDate(booking.booking_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="text-forest">10 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-sage font-medium">Confirmed</span>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/dashboard/bookings"
                className="block w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors text-center"
              >
                View in Dashboard
              </Link>
              <Link
                href="/"
                className="block w-full border border-forest/20 text-forest px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors text-center"
              >
                Back to Homepage
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-cream flex items-center justify-center pt-20">
          <p className="text-forest/40">Loading your booking...</p>
        </section>
      }
    >
      <BookingConfirmedContent />
    </Suspense>
  );
}
