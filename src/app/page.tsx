"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/SectionHeading";
import { useState } from "react";

const services = [
  {
    title: "Workshops",
    description:
      "Hands-on sessions covering everything from CV writing to personal branding, led by industry professionals who've been where you are.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Coworking",
    description:
      "Hot-desking in a space designed for focus and connection. No sterile cubicles — just a warm, inviting environment to get your best work done.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    title: "Mentorship",
    description:
      "Personalised guidance from mentors who genuinely care about your trajectory. Real advice, real connections, real progress.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: "Career Talks",
    description:
      "Panels and fireside chats with professionals across industries. Hear real stories, ask real questions, build real networks.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
];

const differentiators = [
  {
    number: "01",
    title: "Founder-Led",
    description:
      "Not a corporate franchise. Built by someone who understands the gaps in career support firsthand.",
  },
  {
    number: "02",
    title: "Intentional Representation",
    description:
      "We centre underrepresented voices and make sure our space reflects the diversity of the real world.",
  },
  {
    number: "03",
    title: "Education Built In",
    description:
      "Every week brings new learning. Workshops, talks, and mentorship aren't add-ons — they're the core.",
  },
  {
    number: "04",
    title: "Community Before Profit",
    description:
      "Decisions are made for the community first. Growth that doesn't serve our people isn't growth.",
  },
];

const audiences = [
  "Starting their careers and seeking guidance",
  "Launching innovative projects or ventures",
  "Looking for clarity, direction, and momentum",
  "Transitioning into new industries",
];

export default function Home() {
  const [heroEmail, setHeroEmail] = useState("");
  const [heroSubscribed, setHeroSubscribed] = useState(false);

  const handleHeroSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail) {
      setHeroSubscribed(true);
      setHeroEmail("");
    }
  };

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center bg-forest overflow-hidden">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-sage/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-cocoa/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-camel text-xs tracking-[0.4em] uppercase mb-8">
              Redefining Career Growth
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-8"
          >
            Built for Growth,
            <br />
            <span className="text-sage">Not Gatekeeping</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A hybrid career hub combining physical spaces and digital tools to
            empower professionals. Work, create, and connect with purpose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/services"
              className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors duration-300 w-full sm:w-auto"
            >
              Explore Our Space
            </Link>
            <Link
              href="/about"
              className="border border-cream/30 text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors duration-300 w-full sm:w-auto"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Tagline at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-cream/30 text-xs tracking-[0.3em] uppercase"
          >
            <span>Work</span>
            <span className="w-1 h-1 rounded-full bg-camel" />
            <span>Create</span>
            <span className="w-1 h-1 rounded-full bg-camel" />
            <span>Connect</span>
          </motion.div>
        </div>
      </section>

      {/* ==================== MISSION ==================== */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <AnimateIn>
                <span className="text-xs tracking-[0.3em] uppercase text-cocoa">
                  Who We Are
                </span>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 leading-tight">
                  More Than a Workspace
                </h2>
              </AnimateIn>
              <AnimateIn delay={0.2}>
                <p className="text-forest/70 text-lg leading-relaxed mb-6">
                  The Career Spot is where ambition meets opportunity. We
                  believe career growth shouldn&apos;t be reserved for those who
                  already have access — it should be open, inclusive, and built
                  around community.
                </p>
              </AnimateIn>
              <AnimateIn delay={0.3}>
                <p className="text-forest/70 text-lg leading-relaxed mb-8">
                  Whether you&apos;re taking your first steps or pivoting into
                  something new, this is the space where you&apos;ll find
                  the support, resources, and people to make it happen.
                </p>
              </AnimateIn>
              <AnimateIn delay={0.4}>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-cocoa hover:text-forest transition-colors group"
                >
                  Learn More About Us
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </AnimateIn>
            </div>

            {/* Abstract placeholder image */}
            <AnimateIn direction="right" delay={0.2}>
              <div className="aspect-[4/5] bg-forest relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sage/30 to-cocoa/20" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-forest/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 border border-cream/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif text-cream/40 text-3xl">S</span>
                    </div>
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

      {/* ==================== SERVICES OVERVIEW ==================== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="What We Offer"
            title="Everything You Need to Grow"
            description="From focused workspaces to hands-on workshops and genuine mentorship — we've built a space where career development happens naturally."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <AnimateIn key={service.title} delay={i * 0.1}>
                <div className="group p-8 bg-cream hover:bg-forest transition-all duration-500 h-full">
                  <div className="text-sage group-hover:text-camel transition-colors duration-500 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-xl mb-3 group-hover:text-cream transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="text-forest/60 text-sm leading-relaxed group-hover:text-cream/60 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.5} className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-forest text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors duration-300"
            >
              View All Services
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== WHO WE SERVE ==================== */}
      <section className="py-24 md:py-32 bg-forest text-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Abstract placeholder */}
            <AnimateIn direction="left">
              <div className="aspect-square bg-forest-light relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/20 to-sage/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
                    <div className="bg-sage/10 flex items-center justify-center">
                      <span className="text-cream/20 text-xs tracking-[0.2em] uppercase">Create</span>
                    </div>
                    <div className="bg-camel/10 flex items-center justify-center">
                      <span className="text-cream/20 text-xs tracking-[0.2em] uppercase">Connect</span>
                    </div>
                    <div className="bg-cocoa/20 flex items-center justify-center">
                      <span className="text-cream/20 text-xs tracking-[0.2em] uppercase">Work</span>
                    </div>
                    <div className="bg-blush/10 flex items-center justify-center">
                      <span className="text-cream/20 text-xs tracking-[0.2em] uppercase">Grow</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>

            <div>
              <AnimateIn>
                <span className="text-xs tracking-[0.3em] uppercase text-camel">
                  Who We Serve
                </span>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 leading-tight">
                  Empowering Careers, Building Communities
                </h2>
              </AnimateIn>
              <AnimateIn delay={0.2}>
                <p className="text-cream/60 text-lg leading-relaxed mb-8">
                  Built for individuals who are ready to take the next step —
                  with a special focus on underrepresented groups who deserve
                  better access to career resources.
                </p>
              </AnimateIn>

              <div className="space-y-4">
                {audiences.map((item, i) => (
                  <AnimateIn key={i} delay={0.3 + i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-camel mt-2 shrink-0" />
                      <p className="text-cream/80">{item}</p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIFFERENTIATORS ==================== */}
      <section className="py-24 md:py-32 bg-blush">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="What Sets Us Apart"
            title="More Than a Workspace, a Hub for Growth"
          />

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
            {differentiators.map((item, i) => (
              <AnimateIn key={item.number} delay={i * 0.1}>
                <div className="flex gap-6">
                  <span className="font-serif text-5xl text-cocoa/20 leading-none shrink-0">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                    <p className="text-forest/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== UPCOMING EVENTS PREVIEW ==================== */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="What's On"
            title="Upcoming Events"
            description="Workshops, talks, and community events designed to spark new ideas and connections."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                date: "Coming Soon",
                title: "Career Kickstart Workshop",
                desc: "A hands-on session for anyone starting or restarting their career journey.",
                tag: "Workshop",
              },
              {
                date: "Coming Soon",
                title: "Industry Panel: Tech Careers",
                desc: "Hear from professionals across the tech industry about their paths and insights.",
                tag: "Panel",
              },
              {
                date: "Coming Soon",
                title: "Community Networking Evening",
                desc: "An informal evening to meet fellow members, share ideas, and build connections.",
                tag: "Community",
              },
            ].map((event, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="bg-white p-8 h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs tracking-[0.2em] uppercase text-cocoa">
                      {event.tag}
                    </span>
                    <span className="text-xs text-forest/40">{event.date}</span>
                  </div>
                  <h3 className="font-serif text-xl mb-3">{event.title}</h3>
                  <p className="text-forest/60 text-sm leading-relaxed mb-6 flex-grow">
                    {event.desc}
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-cocoa hover:text-forest transition-colors group/link"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4} className="text-center mt-12">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border border-forest/20 text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-forest hover:text-cream transition-all duration-300"
            >
              View All Events
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== CTA / NEWSLETTER ==================== */}
      <section className="py-24 md:py-32 bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              Join the Community
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 leading-tight">
              Built With the Community. Grown With Purpose.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg leading-relaxed mb-10">
              Be the first to know about new events, workshops, and everything
              happening at The Spot. Join our community and let&apos;s grow
              together.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            {heroSubscribed ? (
              <div className="bg-sage/20 border border-sage/30 p-6 max-w-md mx-auto">
                <p className="text-camel font-serif text-lg">Welcome aboard.</p>
                <p className="text-cream/60 text-sm mt-2">
                  We&apos;ll keep you in the loop.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleHeroSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent border border-cream/20 px-5 py-4 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-camel transition-colors"
                />
                <button
                  type="submit"
                  className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors duration-300 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
