import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: "Last Cup Blog",
    };
  }

  return {
    title: `${post.title} — Last Cup`,
    description: post.description,
    keywords: [post.keyword, "caffeine calculator", "coffee and sleep", "when does caffeine wear off"],
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#f7f2e9] px-6 py-20 text-[#15120f]">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8">
          <h1 className="text-4xl font-black">Post not found</h1>
          <Link href="/blog" className="mt-6 inline-flex font-black">Back to blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-xl font-black tracking-[-0.03em]">Last Cup</Link>
        <Link href="/blog" className="text-sm font-black text-[#6b6256]">Blog</Link>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">{post.keyword}</p>
        <h1 className="mt-5 text-6xl font-black leading-[0.93] tracking-[-0.06em] md:text-7xl">{post.title}</h1>
        <p className="mt-7 text-xl leading-9 text-[#6b6256]">{post.description}</p>
        <div className="mt-6 flex gap-3 text-sm font-black text-[#8a8175]">
          <span>{post.readTime}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#15120f] p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">Try Last Cup</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Before your next coffee, check the calculator.</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/#calculator" className="rounded-2xl bg-white px-5 py-4 text-center font-black text-[#15120f]">Use calculator</Link>
            <Link href="/app" className="rounded-2xl bg-white/10 px-5 py-4 text-center font-black text-white">Open web app</Link>
          </div>
        </div>

        <div className="prose prose-lg mt-14 max-w-none prose-headings:font-black prose-headings:tracking-[-0.04em] prose-p:leading-8 prose-p:text-[#4f473f]">
          {post.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="text-4xl font-black leading-[1] tracking-[-0.04em]">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-lg leading-9 text-[#4f473f]">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/5">
          <h2 className="text-3xl font-black tracking-[-0.04em]">Coffee without the guesswork.</h2>
          <p className="mt-3 leading-8 text-[#6b6256]">Last Cup turns caffeine timing into a clear decision.</p>
          <Link href="/" className="mt-6 inline-flex rounded-2xl bg-[#15120f] px-5 py-4 font-black text-white">Go to Last Cup</Link>
        </div>
      </article>
    </main>
  );
}
