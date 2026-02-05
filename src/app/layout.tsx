import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    "The Career Spot is a hybrid career hub combining physical spaces and digital tools to empower professionals. Workshops, mentorship, coworking, and community events.",
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
      "A hybrid career hub combining physical spaces and digital tools to empower professionals.",
    type: "website",
    url: "https://thecareerspot.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
