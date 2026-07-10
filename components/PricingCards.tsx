"use client";

import { useState } from "react";

type Plan = "monthly" | "lifetime";

export default function PricingCards() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: Plan) {
    setLoading(plan);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setError(data.error || "Checkout is not configured yet.");
    setLoading(null);
  }

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Monetization-ready</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-6xl">
            Start free. Pay when Last Cup becomes a habit.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#6b6256]">
            The web version can sell Premium through Stripe now. The iOS app uses StoreKit for App Store-compliant premium access.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2.2rem] border border-black/10 bg-white p-7 shadow-2xl shadow-black/5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a8175]">Monthly</p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">Premium</h3>
            <p className="mt-3 leading-7 text-[#6b6256]">Full caffeine timeline, unlimited tracking, and smarter recommendations.</p>
            <p className="mt-8 text-5xl font-black tracking-[-0.05em]">€2.99<span className="text-base font-bold text-[#8a8175]">/mo</span></p>
            <button
              onClick={() => checkout("monthly")}
              className="mt-8 w-full rounded-2xl bg-[#15120f] px-5 py-4 font-black text-white transition hover:scale-[1.01]"
            >
              {loading === "monthly" ? "Opening checkout..." : "Start monthly"}
            </button>
          </div>

          <div className="rounded-[2.2rem] bg-[#15120f] p-7 text-white shadow-2xl shadow-black/20">
            <div className="inline-flex rounded-full bg-[#f2a23a] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#15120f]">
              Launch offer
            </div>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">Lifetime</h3>
            <p className="mt-3 leading-7 text-white/60">One payment. Keep Premium forever. Best for early adopters.</p>
            <p className="mt-8 text-5xl font-black tracking-[-0.05em]">€29</p>
            <button
              onClick={() => checkout("lifetime")}
              className="mt-8 w-full rounded-2xl bg-white px-5 py-4 font-black text-[#15120f] transition hover:scale-[1.01]"
            >
              {loading === "lifetime" ? "Opening checkout..." : "Get lifetime"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error} Add the Stripe environment variables in Vercel to enable live checkout.
        </div>
      )}
    </section>
  );
}
