import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import BlogCover from "@/components/blog/BlogCover";
import { ArrowRight } from "@/components/ui/icons";
import { getAllPosts, getPost, type BlogBlock } from "@/lib/blogs";
import { SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blogs/${post.slug}`,
    },
  };
}

function ArticleBlocks({ blocks }: { blocks: BlogBlock[] }) {
  const output: React.ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "list-item") {
      const items: string[] = [];
      let current = blocks[index];
      while (current?.type === "list-item") {
        items.push(current.text);
        index += 1;
        current = blocks[index];
      }
      index -= 1;
      output.push(
        <ul key={`list-${index}`}>
          {items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}
        </ul>,
      );
    } else if (block.type === "heading") {
      const id = headingId(block.text, index);
      output.push(
        block.level === 2
          ? <h2 id={id} key={`heading-${index}`}>{block.text}</h2>
          : <h3 id={id} key={`heading-${index}`}>{block.text}</h3>,
      );
    } else if (block.type === "callout") {
      output.push(<p className="blog-callout" key={`callout-${index}`}>{block.text}</p>);
    } else if (block.type === "table") {
      output.push(
        <div className="blog-table-wrap" key={`table-${index}`}>
          <table>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) =>
                    rowIndex === 0 ? <th key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else {
      output.push(
        <p className={block.emphasis ? "blog-emphasis" : index === 0 ? "blog-lead" : undefined} key={`paragraph-${index}`}>
          {block.text}
        </p>,
      );
    }
  }

  return output;
}

function headingId(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
  return `${slug || "section"}-${index}`;
}

export default async function BlogArticlePage({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = getPost(slug);
  if (!post) notFound();

  const postIndex = posts.findIndex((item) => item.slug === post.slug);
  const nextPost = posts[(postIndex + 1) % posts.length];
  const outline = post.blocks
    .map((block, index) => ({ block, index }))
    .filter(
      (item): item is { block: Extract<BlogBlock, { type: "heading" }>; index: number } =>
        item.block.type === "heading" && item.block.level === 2,
    )
    .slice(0, 9);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    author: { "@type": "Organization", name: "Nextudy" },
    publisher: { "@type": "Organization", name: "Nextudy" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main>
        <header className="relative overflow-hidden border-b border-line/60 pb-14 pt-32 md:pb-20 md:pt-40">
          <div className="bloom -right-40 -top-40 h-[480px] w-[640px] opacity-20" />
          <div className="shell relative">
            <Link href="/blogs" className="group inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-bone">
              <span className="rotate-180 transition-transform group-hover:-translate-x-1"><ArrowRight size={17} /></span>
              All insights
            </Link>
            <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.55fr)]">
              <div>
                <span className="eyebrow text-accent">{post.category}</span>
                <h1 className="display mt-5 max-w-[19ch] text-[clamp(2.65rem,5.8vw,5.5rem)] text-bone">
                  {post.title}
                </h1>
                <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-mute">
                  {post.excerpt}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
                  <span>Nextudy Editorial</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {post.updated ? <><span>{post.updated}</span><span className="h-1 w-1 rounded-full bg-accent" /></> : null}
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
              <BlogCover index={postIndex} category={post.category} className="aspect-[4/3] rounded-2xl border border-line" />
            </div>
          </div>
        </header>

        <div className="shell py-14 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[12rem_minmax(0,46rem)] lg:justify-center">
            <aside className="hidden lg:block">
              <div className="sticky top-32 border-l border-line pl-5">
                <span className="eyebrow text-faint">In this guide</span>
                <nav aria-label="Article contents" className="mt-4">
                  <ol className="space-y-3">
                    {outline.map(({ block, index }) => (
                      <li key={index}>
                        <a href={`#${headingId(block.text, index)}`} className="text-sm leading-snug text-mute transition-colors hover:text-accent">
                          {block.text.replace(/^\d+\.\s*/, "")}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>
            <article className="blog-prose">
              <ArticleBlocks blocks={post.blocks} />
            </article>
          </div>
        </div>

        <section className="border-t border-line bg-ink-800/45 py-16 md:py-20">
          <div className="shell">
            <span className="eyebrow text-faint">Continue reading</span>
            <Link href={`/blogs/${nextPost.slug}`} className="group mt-5 flex max-w-4xl items-end justify-between gap-8">
              <h2 className="font-display text-[clamp(1.8rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-bone transition-colors group-hover:text-accent">
                {nextPost.title}
              </h2>
              <span className="mb-2 shrink-0 text-accent transition-transform group-hover:translate-x-2"><ArrowRight size={30} /></span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
