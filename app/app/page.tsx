import type { Metadata } from "next";
import WebAppClient from "@/components/WebAppClient";

export const metadata: Metadata = {
  title: "Coffee Clock — Last Cup",
  description: "Log caffeine, see your Coffee Clock, and decide whether another coffee is worth it.",
};

export default function AppPage() {
  return <WebAppClient />;
}