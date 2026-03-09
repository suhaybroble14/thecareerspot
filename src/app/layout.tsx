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
  title: "The Spot | Work Create Connect",
  description:
    "The Career Spot is a career hub in Bristol with coworking, workshops, mentorship, and community events. Day passes and monthly memberships available.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
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
    title: "The Spot | Work Create Connect",
    description:
      "A career hub in Bristol with coworking, workshops, mentorship, and community events.",
    type: "website",
    url: "https://thecareerspot.uk",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "The Career Spot",
  "url": "https://thecareerspot.uk",
  "logo": "https://thecareerspot.uk/icon.svg",
  "description": "A coworking space and career hub in Bristol, UK. Day passes and monthly memberships available.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Unit 13, 14 King Square",
    "addressLocality": "Bristol",
    "postalCode": "BS2 8JH",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.4583,
    "longitude": -2.5933
  },
  "areaServed": "Bristol, United Kingdom",
  "priceRange": "££",
  "telephone": "",
  "sameAs": [
    "https://www.instagram.com/thecareerspot_/",
    "https://www.tiktok.com/@thecareerspot"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
