import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://last-cup.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Last Cup — Know when another coffee is worth it",
    template: "%s — Last Cup",
  },
  description:
    "Last Cup helps you estimate when caffeine may affect your sleep, so you can decide whether another coffee is worth it.",
  openGraph: {
    title: "Last Cup — Coffee without the guesswork",
    description:
      "Estimate when caffeine may affect your sleep and decide whether another coffee is worth it.",
    url: siteUrl,
    siteName: "Last Cup",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Last Cup — Coffee without the guesswork",
    description:
      "Estimate when caffeine may affect your sleep and decide whether another coffee is worth it.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
