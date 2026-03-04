"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";

type QRCodeDisplayProps = {
  code: string;
  size?: number;
};

export default function QRCodeDisplay({ code, size = 200 }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(code, {
      width: size,
      margin: 2,
      color: {
        dark: "#2F3D38",
        light: "#F0EDE8",
      },
    }).then(setQrDataUrl);
  }, [code, size]);

  // Show the first 8 characters as a fallback alphanumeric code
  const shortCode = code.slice(0, 8).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      {qrDataUrl ? (
        <Image
          src={qrDataUrl}
          alt="QR Code"
          width={size}
          height={size}
          unoptimized
          className="border border-forest/10"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-cream/50 border border-forest/10 flex items-center justify-center"
        >
          <span className="text-forest/30 text-sm">Loading...</span>
        </div>
      )}
      <p className="text-xs text-forest/40 tracking-widest font-mono">
        {shortCode}
      </p>
    </div>
  );
}
