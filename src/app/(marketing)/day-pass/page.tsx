"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AnimateIn from "@/components/AnimateIn";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import type { User } from "@supabase/supabase-js";

type DayAvailability = {
  date: string;
  total: number;
  activeMonthly: number;
  bookedDayPasses: number;
  available: number;
};

export default function DayPassPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState<DayAvailability | null>(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleSelectDate = (date: string, availability: DayAvailability) => {
    setSelectedDate(date);
    setSelectedAvailability(availability);
    setError("");
  };

  const handleBook = async () => {
    if (!user) {
      window.location.href = `/login?next=/day-pass`;
      return;
    }

    if (!selectedDate) return;

    setBooking(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setBooking(false);
        return;
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect. Please try again.");
      setBooking(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              Day Pass
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Book Your Spot
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              Pick a date, grab a desk, and get to work. Your day pass gives you
              10 hours of access to the workspace and everything in it.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Calendar */}
            <div className="md:col-span-3">
              <AnimateIn>
                <h2 className="font-serif text-3xl text-forest mb-2">
                  Choose a Date
                </h2>
                <p className="text-forest/50 text-sm mb-8">
                  Select an available date to book your day pass.
                </p>
              </AnimateIn>

              <AnimateIn delay={0.1}>
                <div className="bg-white p-6 sm:p-8">
                  <AvailabilityCalendar
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                  />
                </div>
              </AnimateIn>
            </div>

            {/* Booking Summary */}
            <div className="md:col-span-2">
              <AnimateIn delay={0.2}>
                <div className="bg-white p-8 sticky top-32">
                  <h3 className="font-serif text-2xl text-forest mb-6">
                    Day Pass
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-forest/10">
                      <span className="text-forest/60 text-sm">Price</span>
                      <span className="font-serif text-2xl text-forest">
                        £9.99
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-forest/60 text-sm">Duration</span>
                      <span className="text-forest text-sm">
                        10 hours active
                      </span>
                    </div>

                    {selectedDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-forest/60 text-sm">Date</span>
                        <span className="text-forest text-sm">
                          {formatDate(selectedDate)}
                        </span>
                      </div>
                    )}

                    {selectedAvailability && (
                      <div className="flex justify-between items-center">
                        <span className="text-forest/60 text-sm">
                          Spots left
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            selectedAvailability.available <= 3
                              ? "text-cocoa"
                              : "text-sage"
                          }`}
                        >
                          {selectedAvailability.available} of{" "}
                          {selectedAvailability.total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8 text-sm text-forest/60">
                    <div className="flex items-start gap-2">
                      <span className="text-camel mt-0.5">✓</span>
                      <span>Access to workspace and facilities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-camel mt-0.5">✓</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-camel mt-0.5">✓</span>
                      <span>QR code for check-in</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                  )}

                  {!user ? (
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("openLoginModal", { detail: { redirectTo: "/day-pass" } }))}
                      className="block w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors text-center"
                    >
                      Sign in to book
                    </button>
                  ) : (
                    <button
                      onClick={handleBook}
                      disabled={!selectedDate || booking}
                      className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {booking
                        ? "Redirecting to checkout..."
                        : selectedDate
                          ? "Book & Pay £9.99"
                          : "Select a date"}
                    </button>
                  )}
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-serif text-3xl text-forest mb-12 text-center">
              How It Works
            </h2>
          </AnimateIn>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Pick a date",
                description:
                  "Choose an available day from the calendar above.",
              },
              {
                step: "2",
                title: "Pay securely",
                description:
                  "Complete your booking through our secure checkout.",
              },
              {
                step: "3",
                title: "Show your QR",
                description:
                  "Arrive on the day and scan your QR code to check in.",
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-camel/20 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-lg text-cocoa">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-forest mb-2">
                    {item.title}
                  </h3>
                  <p className="text-forest/50 text-sm">{item.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
