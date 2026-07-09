import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { lastBg: "#FAFAF8", lastText: "#121212", lastMuted: "#6B7280", lastBlue: "#4D7CFE", lastCard: "#FFFFFF" }, borderRadius: { last: "2rem" } } },
  plugins: []
};
export default config;
