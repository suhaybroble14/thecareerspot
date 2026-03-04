import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Spot | Work - Create - Connect",
  description:
    "The Career Spot is a career hub in Bristol with coworking, workshops, mentorship, and community events. Day passes and monthly memberships available.",
  keywords: [
    "career development",
    "coworking",
    "workshops",
    "mentorship",
    "career hub",
    "community",
    "professional growth",
  ],
  openGraph: {
    title: "The Spot | Work - Create - Connect",
    description:
      "A career hub in Bristol with coworking, workshops, mentorship, and community events.",
    type: "website",
    url: "https://thecareerspot.uk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
