import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link href="/" className="font-serif text-2xl tracking-wide text-cream inline-block mb-12">
          THE{" "}
          <span className="font-bold">
            SP<span className="text-sage">O</span>T
          </span>
        </Link>

        <p className="text-cream/30 text-[120px] font-serif leading-none mb-4">
          404
        </p>
        <h1 className="font-serif text-2xl text-cream mb-3">
          Page not found
        </h1>
        <p className="text-cream/50 text-sm mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-camel text-forest px-8 py-4 text-sm tracking-widest uppercase hover:bg-camel-light transition-colors text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="border border-cream/20 text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors text-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
