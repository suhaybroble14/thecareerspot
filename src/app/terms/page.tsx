import AnimateIn from "@/components/AnimateIn";

export const metadata = {
  title: "Terms of Service | The Spot",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-forest pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <h1 className="font-serif text-4xl md:text-5xl text-cream">
              Terms of Service
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-cream/50 text-sm mt-4">
              Last updated: February 2026
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-10 text-forest/80 leading-relaxed">
              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using thecareerspot.com (&quot;the
                  Site&quot;), you accept and agree to be bound by these Terms
                  of Service. If you do not agree to these terms, please do
                  not use the Site.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  2. Description of Service
                </h2>
                <p>
                  The Career Spot provides a hybrid career hub offering
                  coworking spaces, workshops, mentorship programmes, career
                  events, and community resources. Services may be accessed
                  through our physical location and digital platforms.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  3. User Responsibilities
                </h2>
                <p className="mb-4">When using our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and current information</li>
                  <li>
                    Treat all community members, staff, and mentors with
                    respect
                  </li>
                  <li>
                    Not use the space or services for any unlawful purposes
                  </li>
                  <li>
                    Comply with any posted rules or guidelines at our physical
                    location
                  </li>
                  <li>
                    Not reproduce, distribute, or create derivative works from
                    our content without permission
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  4. Event Bookings & Cancellations
                </h2>
                <p>
                  Event registrations are subject to availability. We reserve
                  the right to cancel or reschedule events with reasonable
                  notice. In such cases, registered attendees will be notified
                  and offered alternatives where possible.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  5. Intellectual Property
                </h2>
                <p>
                  All content on this Site, including text, graphics, logos,
                  and design elements, is the property of The Career Spot or
                  its content suppliers and is protected by intellectual
                  property laws.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  6. Limitation of Liability
                </h2>
                <p>
                  The Career Spot shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from
                  the use of our services or website. Our total liability
                  shall not exceed the amount paid by you, if any, for
                  accessing our services.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  7. Community Standards
                </h2>
                <p>
                  The Spot is built on respect, inclusion, and mutual support.
                  Any behaviour that undermines these values — including
                  harassment, discrimination, or disruptive conduct — may
                  result in removal from our community and services.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  8. Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these terms at any time.
                  Changes will be posted on this page with an updated revision
                  date. Continued use of the Site after changes constitutes
                  acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  9. Governing Law
                </h2>
                <p>
                  These terms shall be governed by and construed in accordance
                  with the laws of England and Wales. Any disputes shall be
                  subject to the exclusive jurisdiction of the courts of
                  England and Wales.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  10. Contact
                </h2>
                <p>
                  For questions regarding these terms, please contact us at{" "}
                  <a
                    href="mailto:hello@thecareerspot.com"
                    className="text-cocoa hover:underline"
                  >
                    hello@thecareerspot.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
