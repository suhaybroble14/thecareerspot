"use client";

import { useState, useCallback } from "react";
import QRScanner from "@/components/QRScanner";

type CheckInResult = {
  success?: boolean;
  error?: string;
  type?: string;
  name?: string;
  date?: string;
};

export default function CheckInPage() {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [manualCode, setManualCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);

  const handleCheckIn = useCallback(async (code: string) => {
    if (processing) return;
    setProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          type: data.type,
          name: data.name,
          date: data.date,
        });
      } else {
        setResult({ error: data.error || "Check-in failed" });
      }
    } catch {
      setResult({ error: "Network error. Please try again." });
    }

    setProcessing(false);
  }, [processing]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleCheckIn(manualCode.trim());
    }
  };

  const reset = () => {
    setResult(null);
    setManualCode("");
  };

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Check In</h1>
      <p className="text-forest/50 text-sm mb-8">
        Scan a QR code or enter a code manually to check someone in.
      </p>

      {/* Result display */}
      {result && (
        <div
          className={`p-6 mb-8 ${
            result.success
              ? "bg-sage/10 border border-sage/30"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-forest mb-1">
                Checked in
              </h2>
              <p className="text-forest text-lg font-medium">{result.name}</p>
              <p className="text-forest/50 text-sm capitalize">
                {result.type?.replace("_", " ")}
                {result.date && ` (${result.date})`}
              </p>
              <button
                onClick={reset}
                className="mt-6 bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors"
              >
                Scan Next
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-forest mb-1">
                Check-in failed
              </h2>
              <p className="text-red-600 text-sm">{result.error}</p>
              <button
                onClick={reset}
                className="mt-6 bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode toggle */}
      {!result && (
        <>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("scan")}
              className={`px-4 py-2 text-sm tracking-widest uppercase transition-colors ${
                mode === "scan"
                  ? "bg-forest text-cream"
                  : "border border-forest/20 text-forest hover:bg-forest/5"
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 text-sm tracking-widest uppercase transition-colors ${
                mode === "manual"
                  ? "bg-forest text-cream"
                  : "border border-forest/20 text-forest hover:bg-forest/5"
              }`}
            >
              Manual Entry
            </button>
          </div>

          {mode === "scan" && (
            <div className="bg-white border border-forest/10 p-6 mb-6">
              <QRScanner onScan={handleCheckIn} active={!processing} />
              {processing && (
                <p className="text-center text-forest/50 text-sm mt-4">
                  Processing...
                </p>
              )}
            </div>
          )}

          {mode === "manual" && (
            <div className="bg-white border border-forest/10 p-6 max-w-md">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
                  >
                    QR Code or Membership ID
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors font-mono"
                    placeholder="Paste or type the code"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing || !manualCode.trim()}
                  className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Checking..." : "Check In"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}
