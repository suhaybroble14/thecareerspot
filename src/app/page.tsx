import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import ImageSlider from "@/components/ImageSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center bg-forest overflow-hidden pt-20 md:pt-0">
          <div className="absolute inset-0">
            <div className="hidden md:block absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-sage/10 blur-[120px]" />
            <div className="hidden md:block absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-cocoa/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
            <AnimateIn>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-cream leading-tight mb-6">
                Work where you belong
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <p className="text-cream/60 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                A proper workspace for proper people. Day passes or 30 day memberships. No joining fees. Cancel anytime.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/day-pass"
                  className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors duration-300 text-center"
                >
                  Book a Day Pass
                </Link>
                <Link
                  href="/membership/apply"
                  className="border border-cream/30 text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors duration-300 text-center"
                >
                  Apply for Membership
                </Link>
              </div>
            </AnimateIn>
          </div>

        </section>

        {/* Membership Pricing */}
        <section className="py-24 md:py-32 bg-cream relative">
          <div className="max-w-6xl mx-auto px-6">
            <AnimateIn>
              <h2 className="font-serif text-4xl md:text-5xl text-forest mb-4">
                Choose your way
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p className="text-forest/60 text-lg mb-16 max-w-2xl">
                Simple pricing. No surprises. Use your membership whenever you need it.
              </p>
            </AnimateIn>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Day Pass */}
              <AnimateIn delay={0.2}>
                <div className="bg-white border-2 border-forest/10 p-8 hover:border-camel transition-colors duration-300">
                  <h3 className="font-serif text-2xl mb-2 text-forest">
                    Day Pass
                  </h3>
                  <p className="text-forest/60 text-sm mb-6">
                    Perfect for testing it out or occasional use
                  </p>

                  <div className="mb-8">
                    <span className="font-serif text-4xl text-forest">
                      £9.99
                    </span>
                    <p className="text-forest/60 text-sm mt-2">
                      Active for 10 hours
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Access to workspace and facilities</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Free WiFi</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Pass active for 10 hours</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>PlayStation 5 &amp; TV access</span>
                    </li>
                  </ul>

                  <Link
                    href="/day-pass"
                    className="block w-full bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors text-center"
                  >
                    View Availability
                  </Link>
                </div>
              </AnimateIn>

              {/* Monthly */}
              <AnimateIn delay={0.3}>
                <div className="bg-white border-2 border-camel p-8 shadow-lg relative">
                  <div className="absolute -top-4 right-6 bg-camel text-forest px-4 py-1 text-xs tracking-widest uppercase font-medium">
                    Popular
                  </div>

                  <h3 className="font-serif text-2xl mb-2 text-forest">
                    Monthly Membership
                  </h3>
                  <p className="text-forest/60 text-sm mb-6">
                    Join a curated community of focused professionals
                  </p>

                  <div className="mb-8">
                    <span className="font-serif text-4xl text-forest">
                      Enquire Now
                    </span>
                    <p className="text-forest/60 text-sm mt-2">
                      30-day rolling membership
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>24/7 access to workspace</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Free WiFi</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Personal key fob &amp; door code</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Members discount on events</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>Priority access to the workspace</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-forest/80">
                      <span className="text-camel mt-1">✓</span>
                      <span>PlayStation 5 &amp; TV access</span>
                    </li>
                  </ul>

                  <Link
                    href="/membership/apply"
                    className="block w-full bg-camel text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors text-center font-medium"
                  >
                    Enquire Now
                  </Link>
                </div>
              </AnimateIn>
            </div>

            <AnimateIn delay={0.4}>
              <div className="bg-forest text-cream p-8 text-center max-w-2xl mx-auto">
                <p className="text-sm">
                  No joining fees. Cancel anytime. All memberships are personal and non-transferable.
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Community Proof */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <AnimateIn>
              <h2 className="font-serif text-4xl text-forest mb-2">
                What is happening
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p className="text-forest/60 text-lg mb-16">
                People using The Spot to build better work
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <ImageSlider images={["/wih1.jpg", "/wih2.jpg", "/wih4.jpg", "/wih6.jpg"]} />
            </AnimateIn>
          </div>
        </section>

        {/* Founders */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <AnimateIn>
              <h2 className="font-serif text-3xl text-forest mb-16">
                Built by people from here
              </h2>
            </AnimateIn>

            <div className="grid sm:grid-cols-2 gap-12 max-w-2xl">
              {[
                { name: "Abdijabar Osman", role: "Co-Founder", image: "/Founder_2.jpeg" },
                { name: "Mustafa Mirreh", role: "Co-Founder", image: "/IMG_9022.jpg", zoom: true },
              ].map((founder, i) => (
                <AnimateIn key={i} delay={0.2 + i * 0.1}>
                  <div>
                    <div className="aspect-square bg-cream mb-4 overflow-hidden relative rounded-full">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className={"zoom" in founder && founder.zoom ? "object-cover scale-125" : "object-cover"}
                      />
                    </div>
                    <h3 className="font-serif text-lg text-forest mb-1">
                      {founder.name}
                    </h3>
                    <p className="text-forest/60 text-sm">{founder.role}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Find Us */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimateIn>
                <span className="text-xs tracking-[0.3em] uppercase text-camel">
                  Location
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 mb-6">
                  Find us
                </h2>
                <p className="text-forest/60 text-lg leading-relaxed mb-8">
                  We&apos;re in the heart of Bristol, easy to reach by foot, bike, or public transport.
                </p>
                <div className="space-y-2">
                  <p className="text-forest font-medium">The Career Spot</p>
                  <p className="text-forest/60">Unit 13, 14 King Square</p>
                  <p className="text-forest/60">Bristol, BS2 8JH</p>
                  <p className="text-forest/60">England</p>
                </div>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <div className="w-full h-[400px] overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=Unit+13,+14+King+Square,+Bristol+BS2+8JH&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="The Career Spot location"
                  />
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 md:py-32 bg-forest text-cream">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <AnimateIn>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Stay in the loop
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p className="text-cream/60 text-lg mb-10">
                News about The Spot, events happening, and opportunities. One email per week.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-transparent border border-cream/20 px-5 py-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-camel transition-colors"
                />
                <button
                  type="submit"
                  className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </AnimateIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
