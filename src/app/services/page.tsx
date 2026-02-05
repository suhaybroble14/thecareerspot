"use client";

import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/SectionHeading";

const services = [
  {
    id: "workshops",
    title: "Workshops & Skill Development",
    description:
      "Weekly hands-on sessions designed to build practical skills that employers actually value. From CV overhauls and interview prep to personal branding and portfolio building — each workshop is led by experienced professionals who break things down without the jargon.",
    features: [
      "Weekly sessions on rotating topics",
      "Led by industry professionals",
      "Small group sizes for real interaction",
      "Practical takeaways you can use immediately",
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    id: "coworking",
    title: "Hot-Desking & Coworking",
    description:
      "A workspace that actually feels like somewhere you'd want to spend your day. No sterile cubicles or fluorescent lighting — just a warm, considered environment designed for focus, creativity, and the kind of spontaneous conversations that lead somewhere.",
    features: [
      "Flexible hot-desking with no long-term commitment",
      "High-speed wifi and power throughout",
      "Quiet zones and collaborative areas",
      "Tea, coffee, and a genuine welcome",
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    id: "mentorship",
    title: "Mentorship Programme",
    description:
      "Personalised guidance from mentors who genuinely care about your trajectory. This isn't a tick-box matching exercise — we pair you with people who've walked similar paths and can offer the kind of honest, specific advice that actually moves the needle.",
    features: [
      "One-to-one mentoring sessions",
      "Carefully matched based on goals and background",
      "Ongoing relationship, not a one-off chat",
      "Mentors from diverse industries and backgrounds",
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: "events",
    title: "Career Talks & Community Events",
    description:
      "Panels, fireside chats, and community gatherings that bring people together around shared goals. Hear from professionals who've navigated the exact challenges you're facing, and build a network that goes beyond LinkedIn connections.",
    features: [
      "Monthly career panels with industry leaders",
      "Informal networking evenings",
      "Fireside chats with founders and creatives",
      "Community-led social events",
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              What We Offer
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Everything You Need<br />
              to Move Forward
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              Whether you need a desk, a mentor, a workshop, or just a room full
              of people who get it — we&apos;ve got you covered.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 md:py-32 ${
            i % 2 === 0 ? "bg-cream" : "bg-white"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div
              className={`grid md:grid-cols-2 gap-16 items-center ${
                i % 2 !== 0 ? "md:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <AnimateIn>
                  <div className="text-sage mb-6">{service.icon}</div>
                </AnimateIn>
                <AnimateIn delay={0.1}>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                    {service.title}
                  </h2>
                </AnimateIn>
                <AnimateIn delay={0.2}>
                  <p className="text-forest/70 text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>
                </AnimateIn>

                <div className="space-y-4">
                  {service.features.map((feature, fi) => (
                    <AnimateIn key={fi} delay={0.3 + fi * 0.08}>
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-camel shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-forest/70">{feature}</span>
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              </div>

              {/* Placeholder visual */}
              <AnimateIn
                direction={i % 2 === 0 ? "right" : "left"}
                delay={0.2}
                className={i % 2 !== 0 ? "md:order-1" : ""}
              >
                <div className="aspect-[4/3] bg-forest relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-cocoa/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sage/40 mb-3">{service.icon}</div>
                      <p className="text-cream/30 text-xs tracking-[0.3em] uppercase">
                        Photo Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>
      ))}

      {/* Pricing / Membership hint */}
      <section className="py-24 md:py-32 bg-blush">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeading
            label="Getting Started"
            title="Flexible Access, No Long-Term Contracts"
            description="We believe in accessibility. Our pricing is designed to be fair, transparent, and without the usual barriers. Details coming soon — register your interest below."
          />
          <AnimateIn delay={0.3}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-forest text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors duration-300"
            >
              Register Your Interest
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Questions? Let&apos;s Talk.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-cream/60 text-lg leading-relaxed mb-10">
              Not sure which service is right for you? Drop us a message and
              we&apos;ll help you figure it out.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <Link
              href="/contact"
              className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors inline-block"
            >
              Contact Us
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
