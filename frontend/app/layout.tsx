import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import MobileCTABar from "./components/MobileCTABar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://sambaram.events";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SAMBARAM · Heirloom Event Planning Studio · Warangal · Hyderabad",
    template: "%s · SAMBARAM Events",
  },
  description:
    "SAMBARAM is a premium South-Indian event planning studio designing weddings, celebrations and cultural gatherings across Warangal, Hyderabad, Bengaluru and beyond. Plan your event with our AI-guided planner.",
  keywords: [
    "event planner",
    "wedding planner Warangal",
    "wedding planner Hyderabad",
    "South Indian wedding planner",
    "luxury event planner India",
    "birthday planner",
    "corporate event planner",
    "SAMBARAM",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "SAMBARAM · Heirloom Event Planning Studio",
    description:
      "Weddings, celebrations & cultural gatherings — planned with an AI-guided studio experience.",
    siteName: "SAMBARAM Events",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMBARAM · Heirloom Event Planning Studio",
    description:
      "Weddings, celebrations & cultural gatherings — planned with an AI-guided studio experience.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {/* Structured data — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "SAMBARAM Events",
              image: `${SITE_URL}/og-image.jpg`,
              url: SITE_URL,
              telephone: "+91-98765-43210",
              priceRange: "₹₹₹",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Warangal",
                addressRegion: "Telangana",
                addressCountry: "IN",
              },
              areaServed: ["Warangal", "Hyderabad", "Bengaluru", "India"],
              description:
                "Premium South-Indian event planning studio for weddings, birthdays, corporate events, engagements and cultural gatherings.",
            }),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileCTABar />
      </body>
    </html>
  );
}
