"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <svg
        className="w-12 h-12 text-forest/20 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h2 className="font-serif text-xl text-forest mb-2">
        Something went wrong
      </h2>
      <p className="text-forest/50 text-sm mb-2">
        There was an error loading this admin page.
      </p>
      {error?.message && (
        <p className="text-red-600 text-xs font-mono mb-6 max-w-md mx-auto bg-red-50 px-4 py-2 rounded">
          {error.message}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-cocoa text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-cocoa/90 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="border border-forest/20 text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
        >
          Admin Home
        </Link>
      </div>
    </div>
  );
}
