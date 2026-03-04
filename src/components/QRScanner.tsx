"use client";

import { useEffect, useRef, useState } from "react";

type QRScannerProps = {
  onScan: (code: string) => void;
  active: boolean;
};

export default function QRScanner({ onScan, active }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<unknown>(null);
  const [error, setError] = useState("");
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    if (!active || !containerRef.current) return;

    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !containerRef.current) return;

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // Ignore scan failures (no QR in frame)
          }
        );
      } catch (err) {
        if (mounted) {
          setError(
            "Camera access denied or not available."
          );
          console.error("QR Scanner error:", err);
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      const scanner = scannerRef.current as {
        stop?: () => Promise<void>;
        clear?: () => void;
      } | null;
      if (scanner?.stop) {
        scanner
          .stop()
          .then(() => {
            scanner.clear?.();
          })
          .catch(() => {});
      }
    };
  }, [active, onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode("");
    }
  };

  // Show inline manual entry when camera fails
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-camel/10 border border-camel/20 p-4 text-center">
          <svg
            className="w-8 h-8 text-camel mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
          <p className="text-cocoa text-sm">{error}</p>
          <p className="text-forest/40 text-xs mt-1">
            Enter the code manually instead.
          </p>
        </div>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 bg-white border border-forest/10 px-4 py-3 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors font-mono"
            placeholder="Paste QR code or membership ID"
            autoFocus
          />
          <button
            type="submit"
            disabled={!manualCode.trim()}
            className="bg-forest text-cream px-5 py-3 text-sm hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            Check In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div
        id="qr-reader"
        ref={containerRef}
        className="w-full max-w-sm mx-auto overflow-hidden rounded"
      />
    </div>
  );
}
