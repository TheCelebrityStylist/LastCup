import Link from "next/link";
import CaffeineCalculator from "@/components/CaffeineCalculator";
import HeroPhone from "@/components/HeroPhone";
import PricingCards from "@/components/PricingCards";
import { blogPosts } from "@/lib/blog";

export default function HomePage() {
  const appStoreUrl = process.env.NEXT_PUBLIC_APPSTORE_URL || "#";

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-2xl font-black tracking-[-0.05em]">Last Cup</Link>
        <div className="hidden items-center gap-7 text-sm font-black text-[#6b6256] md:flex">
          <Link href="/app">Web App</Link>
          <Link href="/blog">Blog</Link>
          <a href="#pricing">Pricing</a>
          <a href={appStoreUrl} className="rounded-full bg-[#15120f] px-5 py-3 text-white">App Store</a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-24">
        <div>
          <div className="inline-flex rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-black text-[#8f6a38] shadow-xl shadow-black/5">
            Coffee timing, turned into one decision
          </div>
          <h1 className="mt-8 max-w-4xl text-7xl font-black leading-[0.86] tracking-[-0.075em] md:text-8xl lg:text-9xl">
            Your last coffee should not be a guess.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-[#6b6256] md:text-2xl md:leading-10">
            Last Cup estimates when caffeine may still be active and tells you whether another coffee is worth the tradeoff.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" className="rounded-2xl bg-[#15120f] px-7 py-5 text-center text-lg font-black text-white shadow-2xl shadow-black/10">
              Try Coffee Clock
            </a>
            <Link href="/app" className="rounded-2xl bg-white px-7 py-5 text-center text-lg font-black text-[#15120f] shadow-2xl shadow-black/5">
              Open web app
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm font-black text-[#6b6256]">
            <div className="rounded-2xl bg-white/70 p-4">No account to try</div>
            <div className="rounded-2xl bg-white/70 p-4">Stripe ready</div>
            <div className="rounded-2xl bg-white/70 p-4">SEO engine live</div>
          </div>
        </div>
        <HeroPhone />
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 py-16">
        <CaffeineCalculator />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["Decision first", "The app answers whether another coffee is worth it instead of dumping data on the user."],
            ["Web app", "A working browser-based caffeine dashboard now lives at /app."],
            ["SEO weapon", "The blog is structured around high-intent caffeine and sleep searches."],
            ["Payments", "Stripe checkout is built for web Premium and lifetime offers."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
              <p className="mt-4 leading-7 text-[#6b6256]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">SEO starts here</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
              Content that captures coffee questions before competitors do.
            </h2>
          </div>
          <Link href="/blog" className="rounded-2xl bg-[#15120f] px-6 py-4 text-center font-black text-white">View blog</Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
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
        <p>Last Cup gives estimates only and is not medical advice.</p>
        <div className="flex gap-5">
          <Link href="/app">Web App</Link>
          <Link href="/blog">Blog</Link>
          <a href="#pricing">Pricing</a>
        </div>
      </footer>
    </main>
  );
}
