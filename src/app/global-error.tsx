"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, background: "#1a2e1a" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "3rem", fontFamily: "serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: "#f5f0e8" }}>
              THE <strong>SP<span style={{ color: "#8aad8a" }}>O</span>T</strong>
            </Link>
            <h1 style={{ fontFamily: "serif", fontSize: "1.5rem", color: "#f5f0e8", marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "0.875rem", marginBottom: "2.5rem" }}>
              We hit an unexpected error. Please try again.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{ background: "#c4a47c", color: "#1a2e1a", padding: "1rem 2rem", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{ border: "1px solid rgba(245,240,232,0.2)", color: "#f5f0e8", padding: "1rem 2rem", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
