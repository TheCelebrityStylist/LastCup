import type { Metadata } from "next";
import WebAppClient from "@/components/WebAppClient";

export const metadata: Metadata = {
  title: "Last Cup Web App — Coffee Decision Dashboard",
  description: "Use the Last Cup web app to log caffeine and estimate whether another coffee is worth it.",
};

export default function AppPage() {
  return <WebAppClient />;
}
