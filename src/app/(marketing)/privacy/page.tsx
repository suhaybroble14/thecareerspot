import AnimateIn from "@/components/AnimateIn";

export const metadata = {
  title: "Privacy Policy | The Spot",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-forest pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <h1 className="font-serif text-4xl md:text-5xl text-cream">
              Privacy Policy
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
        <div className="max-w-4xl mx-auto px-6 prose-custom">
          <AnimateIn>
            <div className="space-y-10 text-forest/80 leading-relaxed">
              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  1. Introduction
                </h2>
                <p>
                  The Career Spot (&quot;The Spot&quot;, &quot;we&quot;,
                  &quot;us&quot;, &quot;our&quot;) is committed to protecting
                  your personal data and respecting your privacy. This privacy
                  policy explains how we collect, use, and protect information
                  when you use our website (thecareerspot.uk) and services.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  2. Information We Collect
                </h2>
                <p className="mb-4">We may collect the following information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Contact information:</strong> name, email address,
                    phone number when you submit forms or register for events.
                  </li>
                  <li>
                    <strong>Usage data:</strong> information about how you
                    interact with our website, including pages visited and time
                    spent.
                  </li>
                  <li>
                    <strong>Communications:</strong> records of correspondence
                    when you contact us directly.
                  </li>
                  <li>
                    <strong>Event registrations:</strong> details provided when
                    booking workshops, events, or mentorship sessions.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Process event bookings and registrations</li>
                  <li>
                    Send you updates about events, workshops, and community
                    news (only if you&apos;ve opted in)
                  </li>
                  <li>Respond to your enquiries</li>
                  <li>Analyse website usage to improve the user experience</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  4. Data Sharing
                </h2>
                <p>
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share information with trusted service
                  providers who assist in operating our website and services,
                  subject to confidentiality agreements.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organisational measures
                  to protect your personal data against unauthorised access,
                  alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  6. Your Rights
                </h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  7. Cookies
                </h2>
                <p>
                  Our website may use cookies to enhance your browsing
                  experience. You can control cookie settings through your
                  browser preferences.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-forest mb-4">
                  8. Contact Us
                </h2>
                <p>
                  If you have any questions about this privacy policy or how we
                  handle your data, please contact us at{" "}
                  <a
                    href="mailto:thecareerspot0@mail.com"
                    className="text-cocoa hover:underline"
                  >
                    thecareerspot0@mail.com
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
