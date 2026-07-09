import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Last Cup — Know when another coffee is worth it", description: "Last Cup helps you know when caffeine is likely to affect your sleep." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en"><body>{children}</body></html>); }
