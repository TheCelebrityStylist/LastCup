import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Last Cup Blog — Coffee, Caffeine and Sleep Guides",
  description: "SEO-focused guides about caffeine timing, coffee before bed, and how to decide when your last cup should be.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-xl font-black tracking-[-0.03em]">Last Cup</Link>
        <div className="flex gap-4 text-sm font-black text-[#6b6256]">
          <Link href="/app">Web App</Link>
          <Link href="/#pricing">Pricing</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">SEO engine</p>
        <h1 className="mt-4 max-w-4xl text-6xl font-black leading-[0.93] tracking-[-0.06em] md:text-8xl">
          Coffee timing guides built to answer real searches.
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-9 text-[#6b6256]">
          Last Cup will use content as a serious acquisition channel: practical, search-focused guides that lead into the calculator and web app.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/5 transition hover:-translate-y-1">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">{post.keyword}</p>
            <h2 className="mt-5 text-3xl font-black leading-[1] tracking-[-0.04em] group-hover:text-[#8f6a38]">{post.title}</h2>
            <p className="mt-4 leading-7 text-[#6b6256]">{post.description}</p>
            <p className="mt-8 text-sm font-black text-[#15120f]">Read guide →</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
