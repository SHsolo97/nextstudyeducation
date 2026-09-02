import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import BlogCover from "@/components/blog/BlogCover";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";
import { getAllPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "BIM Insights & Career Guides",
  description:
    "Practical BIM guides, career roadmaps, industry insights, and training advice for civil engineers, architects, and construction professionals.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Nav />
      <main>
        <header className="relative overflow-hidden border-b border-line/60 pb-16 pt-36 md:pb-24 md:pt-44">
          <div className="bloom -top-44 left-1/2 h-[480px] w-[760px] -translate-x-1/2 opacity-25" />
          <div className="blueprint-grid absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="shell relative">
            <Kicker>Insights for the AEC industry</Kicker>
            <div className="mt-6 grid items-end gap-7 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
              <h1 className="display max-w-[13ch] text-[clamp(3rem,7.2vw,6.5rem)] text-bone">
                Learn what moves <span className="text-accent">BIM forward.</span>
              </h1>
              <p className="max-w-[50ch] pb-2 text-lg leading-relaxed text-mute">
                Clear thinking on BIM skills, careers, technology, and training—written for
                people building their place in modern construction.
              </p>
            </div>
          </div>
        </header>

        <section className="shell py-16 md:py-24" aria-labelledby="featured-story">
          <Reveal>
            <Link
              href={`/blogs/${featured.slug}`}
              className="group grid overflow-hidden rounded-[1.75rem] border border-line bg-ink-800 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/50 md:grid-cols-[1.1fr_0.9fr]"
            >
              <BlogCover index={0} category={featured.category} className="min-h-72 md:order-2 md:min-h-[31rem]" />
              <div className="flex flex-col p-7 md:p-11 lg:p-14">
                <span className="eyebrow text-accent">Featured reading</span>
                <h2 id="featured-story" className="mt-5 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.06] tracking-[-0.025em] text-bone">
                  {featured.title}
                </h2>
                <p className="mt-6 line-clamp-3 max-w-[55ch] leading-relaxed text-mute">
                  {featured.excerpt}
                </p>
                <div className="mt-10 flex items-center justify-between gap-5 border-t border-line/70 pt-5 md:mt-auto">
                  <span className="text-sm text-faint">
                    {featured.updated ? `${featured.updated} · ` : ""}{featured.readingTime} min read
                  </span>
                  <span className="flex items-center gap-2 font-display text-sm font-semibold text-bone transition-colors group-hover:text-accent">
                    Read article <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </section>

        <section className="border-t border-line/60 bg-ink-800/35 py-20 md:py-28" aria-labelledby="all-insights">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <div>
                <Kicker>Explore the library</Kicker>
                <h2 id="all-insights" className="display mt-5 text-[clamp(2.2rem,4vw,4rem)] text-bone">
                  More from Nextudy
                </h2>
              </div>
              <span className="hidden text-sm text-faint sm:block">{posts.length} field guides</span>
            </div>

            <div className="mt-12 grid gap-x-7 gap-y-10 md:grid-cols-2">
              {rest.map((post, index) => (
                <Reveal key={post.slug} delay={(index % 2) * 0.08}>
                  <article className="group">
                    <Link href={`/blogs/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      <BlogCover
                        index={index + 1}
                        category={post.category}
                        className={`aspect-[16/10] rounded-2xl border border-line transition-[border-color,transform] duration-500 group-hover:-translate-y-1 group-hover:border-accent/50 ${index % 3 === 0 ? "md:aspect-[16/12]" : ""}`}
                      />
                      <div className="mt-5 flex items-start justify-between gap-5">
                        <div>
                          <span className="text-xs uppercase tracking-[0.16em] text-faint">
                            {post.updated ? `${post.updated} · ` : ""}{post.readingTime} min read
                          </span>
                          <h3 className="mt-2 max-w-[24ch] font-display text-[clamp(1.35rem,2.3vw,2rem)] font-semibold leading-tight tracking-[-0.015em] text-bone transition-colors group-hover:text-accent">
                            {post.title}
                          </h3>
                        </div>
                        <span className="mt-6 shrink-0 text-mute transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent">
                          <ArrowUpRight />
                        </span>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

