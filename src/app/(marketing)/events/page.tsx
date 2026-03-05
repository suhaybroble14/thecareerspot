"use client";

import { useState } from "react";
import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/SectionHeading";

const upcomingEvents = [
  {
    id: 1,
    title: "Career Kickstart Workshop",
    date: "Date TBC",
    time: "10:00 AM - 1:00 PM",
    type: "Workshop",
    description:
      "A hands-on workshop for anyone starting or restarting their career. We'll cover goal-setting, personal branding basics, and building a career action plan you can actually follow.",
    spots: "Limited spots",
  },
  {
    id: 2,
    title: "Industry Panel: Careers in Tech",
    date: "Date TBC",
    time: "6:00 PM - 8:00 PM",
    type: "Panel",
    description:
      "Hear from professionals working across software engineering, product, design, and data. An honest look at how they got where they are, and what they wish they'd known earlier.",
    spots: "Limited spots",
  },
  {
    id: 3,
    title: "Community Networking Evening",
    date: "Date TBC",
    time: "6:30 PM - 9:00 PM",
    type: "Community",
    description:
      "An informal evening to meet other members, share ideas, and have a drink. No agenda, no pressure. Just good conversation with good people.",
    spots: "Open to all",
  },
  {
    id: 4,
    title: "CV & LinkedIn Overhaul Workshop",
    date: "Date TBC",
    time: "2:00 PM - 4:30 PM",
    type: "Workshop",
    description:
      "Bring your CV and LinkedIn profile. Leave with something that actually gets you noticed. Practical, personalised feedback in a supportive small-group setting.",
    spots: "Limited spots",
  },
  {
    id: 5,
    title: "Founder Fireside Chat",
    date: "Date TBC",
    time: "7:00 PM - 8:30 PM",
    type: "Talk",
    description:
      "A proper conversation with founders who've built businesses from nothing. Real stories, real challenges, and the stuff that doesn't make it into LinkedIn posts.",
    spots: "Limited spots",
  },
  {
    id: 6,
    title: "Creative Portfolio Workshop",
    date: "Date TBC",
    time: "11:00 AM - 2:00 PM",
    type: "Workshop",
    description:
      "For designers, writers, marketers, and anyone whose work needs to be seen. Learn how to present your work in a way that tells a story and gets you hired.",
    spots: "Limited spots",
  },
];

const typeColors: Record<string, string> = {
  Workshop: "bg-camel/20 text-cocoa",
  Panel: "bg-sage/20 text-forest",
  Community: "bg-blush text-cocoa",
  Talk: "bg-cocoa/10 text-cocoa",
};

export default function EventsPage() {
  const [bookingEventId, setBookingEventId] = useState<number | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState<number[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingEventId && formData.name && formData.email) {
      setBookingSubmitted([...bookingSubmitted, bookingEventId]);
      setBookingEventId(null);
      setFormData({ name: "", email: "" });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              What&apos;s On
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Events & Workshops
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              From workshops to community nights and career panels, there&apos;s
              always something going on at The Spot.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Events coming soon */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Upcoming"
            title="What's Coming Up"
            description="We're putting together something good. Drop your email and you'll be the first to know when dates are confirmed."
          />

          {/* Email signup */}
          <AnimateIn delay={0.3}>
            <div className="bg-forest text-cream p-8 md:p-12 max-w-2xl mx-auto text-center">
              <h3 className="font-serif text-2xl mb-3">Be the first to know</h3>
              <p className="text-cream/60 text-sm mb-8">Leave your email and we&apos;ll notify you as soon as events are confirmed.</p>
              {bookingSubmitted.length > 0 ? (
                <p className="text-camel font-medium tracking-wide">You&apos;re on the list. We&apos;ll be in touch!</p>
              ) : (
                <form onSubmit={handleBook} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 bg-transparent border border-cream/20 px-5 py-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-camel transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel/90 transition-colors shrink-0"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Past events */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Looking Back"
            title="Past Events"
            description="A look at some of what we've hosted so far."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/event1.jpeg", "/event2.jpeg", "/event3.jpeg", "/event4.jpeg"].map((src, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="aspect-square relative overflow-hidden">
                  <Image src={src} alt={`Past event ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Host an event CTA */}
      <section className="py-24 md:py-32 bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              Got an Idea?
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6">
              Want to Host or Speak?
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg leading-relaxed mb-10">
              We&apos;re always looking for people who want to share what they
              know. If you&apos;ve got something worth passing on, get in
              touch.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <a
              href="/contact"
              className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors inline-block"
            >
              Get In Touch
            </a>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
