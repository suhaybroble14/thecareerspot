"use client";

import { useState } from "react";
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
      "A hands-on workshop for anyone starting or restarting their career journey. We'll cover goal-setting, personal branding basics, and building a career action plan you can actually follow.",
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
      "An informal evening to meet fellow members, share ideas, and build connections over drinks. No agenda, no pressure — just good conversation with good people.",
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
      "An intimate conversation with founders who've built businesses from scratch. Unfiltered stories, real challenges, and the lessons that don't make it into the LinkedIn posts.",
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
              From skills-based workshops to community gatherings and career
              panels — there&apos;s always something happening at The Spot.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Upcoming"
            title="What's Coming Up"
            description="Dates are being finalised. Register your interest to get priority access and early notifications."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, i) => (
              <AnimateIn key={event.id} delay={i * 0.08}>
                <div className="bg-white p-8 h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs tracking-wider uppercase px-3 py-1 ${
                        typeColors[event.type] || "bg-cream text-forest"
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs text-forest/40">{event.spots}</span>
                  </div>

                  <h3 className="font-serif text-xl mb-2">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-forest/50 mb-4">
                    <span>{event.date}</span>
                    <span className="w-1 h-1 rounded-full bg-forest/30" />
                    <span>{event.time}</span>
                  </div>

                  <p className="text-forest/60 text-sm leading-relaxed mb-6 flex-grow">
                    {event.description}
                  </p>

                  {bookingSubmitted.includes(event.id) ? (
                    <div className="bg-sage/10 border border-sage/20 p-4">
                      <p className="text-forest text-sm font-medium">
                        Interest registered
                      </p>
                      <p className="text-forest/50 text-xs mt-1">
                        We&apos;ll notify you when details are confirmed.
                      </p>
                    </div>
                  ) : bookingEventId === event.id ? (
                    <form onSubmit={handleBook} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-cream border border-forest/10 px-4 py-3 text-sm focus:outline-none focus:border-camel transition-colors"
                      />
                      <input
                        type="email"
                        placeholder="Your email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-cream border border-forest/10 px-4 py-3 text-sm focus:outline-none focus:border-camel transition-colors"
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-forest text-cream text-sm tracking-widest uppercase px-6 py-3 hover:bg-forest-light transition-colors flex-1"
                        >
                          Register Interest
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingEventId(null)}
                          className="border border-forest/20 text-forest text-sm px-4 py-3 hover:bg-forest/5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setBookingEventId(event.id)}
                      className="bg-forest text-cream text-sm tracking-widest uppercase px-6 py-3 hover:bg-forest-light transition-colors w-full"
                    >
                      Register Interest
                    </button>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Past events placeholder */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeading
            label="Looking Back"
            title="Past Events"
            description="A library of past workshops, talks, and community events. Recaps and resources from previous sessions will be shared here."
          />
          <AnimateIn delay={0.2}>
            <div className="bg-cream p-12 border border-forest/5">
              <p className="text-forest/40 font-serif text-lg">
                Past event recaps coming soon.
              </p>
              <p className="text-forest/30 text-sm mt-2">
                Follow us on social media to stay updated.
              </p>
            </div>
          </AnimateIn>
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
              We&apos;re always looking for community members who want to share
              their expertise. If you&apos;ve got knowledge worth passing on,
              we&apos;d love to hear from you.
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
