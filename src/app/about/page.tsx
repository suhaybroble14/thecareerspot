"use client";

import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/SectionHeading";

const values = [
  {
    title: "Accessibility",
    description:
      "Career growth shouldn't come with a price tag or a postcode requirement. We break down barriers and make resources available to everyone.",
  },
  {
    title: "Representation",
    description:
      "Our space reflects the world as it is — diverse, layered, and full of perspectives that deserve to be heard and centred.",
  },
  {
    title: "Community",
    description:
      "Individual ambition thrives within a supportive network. We build genuine connections, not transactional ones.",
  },
  {
    title: "Growth",
    description:
      "Everything we do is oriented around forward motion — learning, building, evolving, and helping others do the same.",
  },
];

const timeline = [
  {
    phase: "The Idea",
    description:
      "Recognising the gap between career ambition and accessible support — especially for underrepresented communities.",
  },
  {
    phase: "Building the Foundation",
    description:
      "Developing the concept, engaging with early community members, and designing a space that genuinely serves people.",
  },
  {
    phase: "Community First",
    description:
      "Growing organically through word-of-mouth, running pilot workshops, and learning from the people who'll use the space.",
  },
  {
    phase: "The Launch",
    description:
      "Opening our doors to a community-led career hub that combines physical presence with digital accessibility.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <span className="text-xs tracking-[0.3em] uppercase text-camel">
              About Us
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mt-4 leading-tight">
              Redefining What a<br />
              Career Space Can Be
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
              The Career Spot was born from a simple observation: the people who
              need career support the most are often the ones with the least
              access to it.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <AnimateIn>
                <span className="text-xs tracking-[0.3em] uppercase text-cocoa">
                  Our Story
                </span>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 leading-tight">
                  Founded on Purpose, Driven by People
                </h2>
              </AnimateIn>
              <AnimateIn delay={0.2}>
                <p className="text-forest/70 text-lg leading-relaxed mb-6">
                  The Spot isn&apos;t another coworking space with a mission
                  statement bolted on. It was built from lived experience —
                  from understanding what it feels like to navigate a career
                  without a roadmap, without mentors who look like you, without
                  a community that gets it.
                </p>
              </AnimateIn>
              <AnimateIn delay={0.3}>
                <p className="text-forest/70 text-lg leading-relaxed mb-6">
                  We&apos;re founder-led, not corporate-driven. Every decision
                  is filtered through a single question: does this serve our
                  community? If not, we don&apos;t do it.
                </p>
              </AnimateIn>
              <AnimateIn delay={0.4}>
                <p className="text-forest/70 text-lg leading-relaxed">
                  The result is a space where workshops happen weekly, mentorship
                  is built in (not an upsell), and the people around you are
                  genuinely invested in each other&apos;s success.
                </p>
              </AnimateIn>
            </div>

            {/* Placeholder image */}
            <AnimateIn direction="right" delay={0.2}>
              <div className="aspect-[4/5] bg-forest relative overflow-hidden sticky top-32">
                <div className="absolute inset-0 bg-gradient-to-bl from-sage/20 to-cocoa/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 border border-cream/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif text-cream/40 text-2xl">
                        F
                      </span>
                    </div>
                    <p className="text-cream/30 text-xs tracking-[0.3em] uppercase">
                      Founder Photo
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="What We Stand For"
            title="Our Values"
            description="These aren't words on a wall — they're the framework for every decision we make."
          />

          <div className="grid sm:grid-cols-2 gap-12">
            {values.map((value, i) => (
              <AnimateIn key={value.title} delay={i * 0.1}>
                <div className="border-l-2 border-camel pl-8">
                  <h3 className="font-serif text-2xl mb-3">{value.title}</h3>
                  <p className="text-forest/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-24 md:py-32 bg-blush">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            label="Our Journey"
            title="How We Got Here"
          />

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <AnimateIn key={item.phase} delay={i * 0.15}>
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-cocoa" />
                    {i < timeline.length - 1 && (
                      <div className="w-[1px] h-16 bg-cocoa/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-serif text-xl mb-2">{item.phase}</h3>
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

      {/* Team placeholder */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="The People"
            title="Meet the Team"
            description="The faces behind The Spot — a team that's as diverse and driven as the community we serve."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { role: "Founder", initials: "FS" },
              { role: "Community Lead", initials: "CL" },
              { role: "Events Coordinator", initials: "EC" },
            ].map((member, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="aspect-square bg-forest mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-transparent" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 border border-cream/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-serif text-cream/50 text-xl">
                          {member.initials}
                        </span>
                      </div>
                      <p className="text-cream/30 text-xs tracking-[0.2em] uppercase">
                        Photo Coming Soon
                      </p>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg mb-1">Team Member</h3>
                  <p className="text-forest/50 text-sm">{member.role}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Ready to Find Your Spot?
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-cream/60 text-lg leading-relaxed mb-10">
              Whether you&apos;re exploring, building, or pivoting — there&apos;s
              a place for you here.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="border border-cream/30 text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
