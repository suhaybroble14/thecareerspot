"use client";

import { useState } from "react";
import AnimateIn from "@/components/AnimateIn";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const contactInfo = [
    {
      label: "Email",
      value: "hello@thecareerspot.com",
      href: "mailto:hello@thecareerspot.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "+44 (0) 000 000 0000",
      href: "tel:+440000000000",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      ),
    },
    {
      label: "Location",
      value: "Address to be confirmed",
      href: null,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              Get In Touch
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Let&apos;s Start a<br />
              Conversation
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              Whether you have a question, want to book a space, or just want to
              say hello — we&apos;d love to hear from you.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-16">
            {/* Form */}
            <div className="md:col-span-3">
              <AnimateIn>
                <h2 className="font-serif text-3xl mb-8">Send Us a Message</h2>
              </AnimateIn>

              {submitted ? (
                <AnimateIn>
                  <div className="bg-sage/10 border border-sage/20 p-8">
                    <h3 className="font-serif text-xl mb-2">Message Sent</h3>
                    <p className="text-forest/60">
                      Thanks for reaching out. We&apos;ll get back to you as
                      soon as we can.
                    </p>
                  </div>
                </AnimateIn>
              ) : (
                <AnimateIn delay={0.1}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full bg-white border border-forest/10 px-5 py-4 text-sm focus:outline-none focus:border-camel transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-white border border-forest/10 px-5 py-4 text-sm focus:outline-none focus:border-camel transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full bg-white border border-forest/10 px-5 py-4 text-sm focus:outline-none focus:border-camel transition-colors appearance-none"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Enquiry</option>
                        <option value="membership">
                          Membership & Coworking
                        </option>
                        <option value="events">Events & Workshops</option>
                        <option value="mentorship">Mentorship</option>
                        <option value="partnership">
                          Partnerships & Collaborations
                        </option>
                        <option value="speaking">Speaking Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full bg-white border border-forest/10 px-5 py-4 text-sm focus:outline-none focus:border-camel transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-forest text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </AnimateIn>
              )}
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2">
              <AnimateIn delay={0.2}>
                <h2 className="font-serif text-3xl mb-8">Contact Info</h2>
              </AnimateIn>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info, i) => (
                  <AnimateIn key={info.label} delay={0.3 + i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="text-sage mt-0.5">{info.icon}</div>
                      <div>
                        <p className="text-xs tracking-widest uppercase text-forest/50 mb-1">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-forest hover:text-cocoa transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-forest">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>

              <AnimateIn delay={0.5}>
                <div className="border-t border-forest/10 pt-8">
                  <h3 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {["Instagram", "LinkedIn", "X"].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="text-forest/40 hover:text-forest text-sm transition-colors"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Map placeholder */}
              <AnimateIn delay={0.6}>
                <div className="mt-8 aspect-[4/3] bg-forest relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-cocoa/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-cream/30 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                      <p className="text-cream/30 text-xs tracking-[0.3em] uppercase">
                        Map Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
