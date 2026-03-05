"use client";

import { useState } from "react";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { submitApplication } from "@/lib/actions/applications";

export default function MembershipApplyPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await submitApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        message: selectedServices.length > 0 ? `Interested in: ${selectedServices.join(", ")}` : undefined,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    }

    setSubmitting(false);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              Monthly Membership
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Apply for Membership
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              Monthly memberships give you 24/7 access to the workspace. Fill in
              the form below and we&apos;ll get back to you.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-2xl mx-auto px-6">
          {submitted ? (
            <AnimateIn>
              <div className="bg-white p-8 sm:p-12 text-center">
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
                <h2 className="font-serif text-3xl text-forest mb-4">
                  Application submitted
                </h2>
                <p className="text-forest/60 leading-relaxed mb-8">
                  Thanks for your interest in joining The Spot. We review every
                  application personally and will be in touch within a few days.
                </p>
                <Link
                  href="/"
                  className="bg-forest text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors inline-block"
                >
                  Back to Homepage
                </Link>
              </div>
            </AnimateIn>
          ) : (
            <>
              <AnimateIn>
                <h2 className="font-serif text-3xl text-forest mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-forest/50 text-sm mb-10">
                  All fields marked with * are required.
                </p>
              </AnimateIn>

              <AnimateIn delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                    >
                      Full name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                    >
                      Email address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <p className="block text-xs tracking-widest uppercase text-forest/60 mb-3">
                      Which facilities are you interested in?
                    </p>
                    <div className="space-y-3">
                      {[
                        "Solo desk space",
                        "Collaborative desk space",
                        "Dual monitors",
                        "Projector",
                        "PS5 & TV",
                      ].map((service) => (
                        <label key={service} className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={(e) => {
                              setSelectedServices(
                                e.target.checked
                                  ? [...selectedServices, service]
                                  : selectedServices.filter((s) => s !== service)
                              );
                            }}
                            className="mt-0.5 accent-camel w-4 h-4 shrink-0"
                          />
                          <span className="text-sm text-forest/70 group-hover:text-forest transition-colors">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </AnimateIn>
            </>
          )}
        </div>
      </section>

      {/* What to expect */}
      {!submitted && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <AnimateIn>
              <h2 className="font-serif text-3xl text-forest mb-12 text-center">
                What Happens Next
              </h2>
            </AnimateIn>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "We review your application",
                  description:
                    "Every application is read by a real person. We want to make sure The Spot is the right fit for you.",
                },
                {
                  step: "2",
                  title: "We get in touch",
                  description:
                    "You'll hear from us within a few days. We might arrange a quick chat or invite you to visit.",
                },
                {
                  step: "3",
                  title: "You're in",
                  description:
                    "Once approved, we'll set up your membership and send you everything you need to get started.",
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
                    <p className="text-forest/50 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership benefits */}
      {!submitted && (
        <section className="py-24 md:py-32 bg-forest text-cream">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <AnimateIn>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                What You Get
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p className="text-cream/60 text-lg leading-relaxed mb-12">
                Monthly members get full access to everything The Spot has to
                offer.
              </p>
            </AnimateIn>

            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                "24/7 access to the workspace",
                "Free WiFi throughout",
                "Quiet zones and collaborative areas",
                "A proper community that has your back",
              ].map((benefit, i) => (
                <AnimateIn key={i} delay={0.2 + i * 0.05}>
                  <div className="flex items-start gap-3">
                    <span className="text-camel mt-0.5">✓</span>
                    <span className="text-cream/80 text-sm">{benefit}</span>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
