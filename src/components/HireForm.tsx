"use client";

import { useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import { submitHireEnquiry } from "@/lib/actions/hire";

export default function HireForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const result = await submitHireEnquiry({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      eventType: data.eventType,
      preferredDate: data.preferredDate,
      guestCount: data.guestCount,
      message: data.message,
    });
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateIn>
          <span className="text-xs tracking-[0.3em] uppercase text-camel">Hire the Space</span>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 mb-4">
            Host your event here
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-forest/60 text-lg mb-12 leading-relaxed">
            From graduation parties to workshops, team days to creative sessions — the space is available to hire. Get in touch and we&apos;ll sort the details.
          </p>
        </AnimateIn>

        {status === "success" ? (
          <AnimateIn>
            <div className="bg-forest text-cream p-8">
              <h3 className="font-serif text-2xl mb-2">Enquiry received</h3>
              <p className="text-cream/70">We&apos;ll be in touch shortly to discuss your event.</p>
            </div>
          </AnimateIn>
        ) : (
          <AnimateIn delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Full Name *</label>
                  <input name="fullName" required className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Email *</label>
                  <input name="email" type="email" required className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Phone</label>
                  <input name="phone" type="tel" className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Type of Event *</label>
                  <input name="eventType" required placeholder="e.g. Graduation party, Workshop" className="w-full border border-forest/20 bg-white px-4 py-3 text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Preferred Date</label>
                  <input name="preferredDate" type="date" className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Number of Guests</label>
                  <input name="guestCount" type="number" min="1" className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Tell us more</label>
                <textarea name="message" rows={4} className="w-full border border-forest/20 bg-white px-4 py-3 text-forest focus:outline-none focus:border-camel transition-colors resize-none" />
              </div>
              {status === "error" && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
