import Link from "next/link";
import CaffeineCalculator from "@/components/CaffeineCalculator";
import HeroPhone from "@/components/HeroPhone";
import PricingCards from "@/components/PricingCards";
import { blogPosts } from "@/lib/blog";

const productCards = [
  {
    title: "Before the order",
    body: "See whether another cup is likely to be worth it before you drink it.",
  },
  {
    title: "Before bedtime",
    body: "Estimate when caffeine may be low enough for sleep, based on your usual cutoff.",
  },
  {
    title: "Before tomorrow",
    body: "Avoid the cycle of late caffeine, poor sleep, and needing more coffee the next morning.",
  },
];

const premiumCards = [
  "Unlimited drink logs",
  "Full Coffee Clock timeline",
  "What-if planning before your next cup",
  "History and weekly patterns",
  "Sensitivity controls",
  "Lifetime launch offer",
];

export default function HomePage() {
  const appStoreUrl = process.env.NEXT_PUBLIC_APPSTORE_URL || "#";

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-2xl font-black tracking-[-0.05em]">Last Cup</Link>
        <div className="hidden items-center gap-7 text-sm font-black text-[#6b6256] md:flex">
          <Link href="/app">Coffee Clock</Link>
          <Link href="/blog">Guides</Link>
          <a href="#pricing">Pricing</a>
          <a href={appStoreUrl} className="rounded-full bg-[#15120f] px-5 py-3 text-white">App Store</a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-24">
        <div>
          <div className="inline-flex rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-black text-[#8f6a38] shadow-xl shadow-black/5">
            Coffee Clock for better sleep
          </div>
          <h1 className="mt-8 max-w-4xl text-7xl font-black leading-[0.86] tracking-[-0.075em] md:text-8xl lg:text-9xl">
            Your last coffee should not be a guess.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-[#6b6256] md:text-2xl md:leading-10">
            Last Cup estimates when caffeine may still be active, shows whether another cup is worth it, and helps you choose what to drink next.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className="rounded-2xl bg-[#15120f] px-7 py-5 text-center text-lg font-black text-white shadow-2xl shadow-black/10">
              Open Coffee Clock
            </Link>
            <a href="#calculator" className="rounded-2xl bg-white px-7 py-5 text-center text-lg font-black text-[#15120f] shadow-2xl shadow-black/5">
              Try free calculator
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 text-sm font-black text-[#6b6256] sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4">No account to try</div>
            <div className="rounded-2xl bg-white/70 p-4">Saves your day</div>
            <div className="rounded-2xl bg-white/70 p-4">Premium planning</div>
          </div>
        </div>
        <HeroPhone />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Why Last Cup exists</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            You do not need another tracker. You need an answer before your next coffee.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {productCards.map((card) => (
            <div key={card.title} className="rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black tracking-[-0.04em]">{card.title}</h3>
              <p className="mt-4 leading-7 text-[#6b6256]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Free preview</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-6xl">Try the free caffeine calculator.</h2>
          <p className="mt-5 text-lg leading-8 text-[#6b6256]">
            Pick a drink and time. This quick estimate gives you a taste of Last Cup. Open Coffee Clock to save your day and see your full timeline.
          </p>
        </div>
        <CaffeineCalculator />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Meet Coffee Clock</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">Your daily caffeine timeline.</h2>
            <p className="mt-6 text-xl leading-9 text-[#6b6256]">
              Save each drink, see your caffeine estimate update, and understand what another cup may do to tonight.
            </p>
            <Link href="/app" className="mt-8 inline-flex rounded-2xl bg-[#15120f] px-7 py-5 text-lg font-black text-white shadow-2xl shadow-black/10">
              Open Coffee Clock
            </Link>
          </div>
          <div className="rounded-[2.5rem] border-[14px] border-[#15120f] bg-[#fffdf8] p-8 shadow-2xl shadow-black/10">
            <div className="rounded-[2rem] bg-[#15120f] p-7 text-white">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Today</p>
              <h3 className="mt-4 text-5xl font-black tracking-[-0.055em]">Better not.</h3>
              <p className="mt-4 max-w-md text-lg leading-8 text-white/60">A latte now may leave caffeine active too close to your 22:30 bedtime.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Active", "86 mg"],
                ["Clear around", "22:41"],
                ["Next", "Decaf"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] bg-white p-5 shadow-xl shadow-black/5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a8175]">{label}</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Premium</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">Unlock your full caffeine timeline.</h2>
          <p className="mt-6 text-xl leading-9 text-[#6b6256]">Premium turns a quick estimate into a daily decision tool.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {premiumCards.map((item) => (
            <div key={item} className="rounded-[2rem] bg-white p-6 text-xl font-black shadow-2xl shadow-black/5">{item}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Guides</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
              Helpful guides for coffee and sleep.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b6256]">
              Clear answers to common caffeine questions, with Coffee Clock when you need a personal estimate.
            </p>
          </div>
          <Link href="/blog" className="rounded-2xl bg-[#15120f] px-6 py-4 text-center font-black text-white">Read guides</Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/5 transition hover:-translate-y-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">{post.keyword}</p>
              <h3 className="mt-5 text-3xl font-black leading-[1] tracking-[-0.04em]">{post.title}</h3>
              <p className="mt-4 leading-7 text-[#6b6256]">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <PricingCards />

      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-12 text-sm font-bold text-[#6b6256] md:flex-row">
        <p>Estimates only. Caffeine sensitivity varies by person. Last Cup is not medical advice.</p>
        <div className="flex gap-5">
          <Link href="/app">Coffee Clock</Link>
          <Link href="/blog">Guides</Link>
          <a href="#pricing">Pricing</a>
        </div>
      </footer>
    </main>
  );
}