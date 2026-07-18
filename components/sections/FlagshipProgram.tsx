"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "@/lib/gsap";
import { flagship } from "@/lib/content";
import Kicker from "../ui/Kicker";
import { ArrowRight } from "../ui/icons";

// Centered "flagship course" spot that sits between Recognition and the
// DisciplineMarquee. Composition mirrors a single product reveal:
// eyebrow -> headline (line-rise) -> sub-copy -> category tab pills ->
// flagship course card. Heading animation matches the rest of the site
// (SplitText line masks via useGSAP). Reduced-motion path paints the
// final visible state and skips the entrance choreography.

export default function FlagshipProgram() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const card = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const cardEl = card.current;
      const h = headline.current;
      if (!el) return;

      const reduce = prefersReducedMotion();

      // ---- Heading line-rise ------------------------------------------------
      if (h) {
        if (reduce) {
          gsap.set(h, { autoAlpha: 1 });
        } else {
          document.fonts.ready.then(() => {
            if (!headline.current) return;
            const split = new SplitText(h, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
            });
            gsap.set(h, { autoAlpha: 1 });
            gsap.set(split.lines, { yPercent: 110 });
            const tween = gsap.to(split.lines, {
              yPercent: 0,
              duration: 1.05,
              stagger: 0.1,
              ease: "nx-out",
              scrollTrigger: { trigger: h, start: "top 88%", once: true },
            });
            ScrollTrigger.refresh();
            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
              split.revert();
            };
          });
        }
      }

      if (reduce) return;

      // ---- Supporting copy + tabs + card entrance (fires once on scroll) ----
      const tl = gsap.timeline({
        defaults: { ease: "nx-out" },
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      tl.from(".fp-fade", {
        y: 22,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.08,
      })
        .from(
          cardEl,
          { y: 32, autoAlpha: 0, duration: 1 },
          "-=0.4",
        )
        .from(
          ".fp-card .fp-detail",
          {
            y: 14,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.06,
          },
          "-=0.5",
        );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  const c = flagship.course;

  return (
    <section
      ref={root}
      id="flagship"
      aria-labelledby="flagship-title"
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      {/* ambient glows — same vocabulary as Recognition / DisciplineMarquee */}
      <div
        className="bloom left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 opacity-25"
        aria-hidden="true"
      />
      <div
        className="bloom -right-40 bottom-0 h-[380px] w-[380px] opacity-20"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="fp-fade">
            <Kicker>{flagship.eyebrow}</Kicker>
          </span>

          <h2
            ref={headline}
            id="flagship-title"
            className="reveal-up mt-6 font-display text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.025em] text-bone"
          >
            {flagship.headline[0]}
            <br />
            <span className="text-accent">{flagship.headline[1]}</span>
          </h2>

          <p className="fp-fade mx-auto mt-6 max-w-[58ch] text-lg leading-relaxed text-mute">
            {flagship.sub}
          </p>

          {/* Category tab pills — "Flagship Program" filled with Nextudy
              Vibrant Orange; "Other Programs" is semi-transparent and scrolls
              to the #programs section when activated. */}
          <div
            role="tablist"
            aria-label="Course category"
            className="fp-fade mx-auto mt-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-ink-800/60 p-1.5 backdrop-blur"
          >
            {flagship.categoryTabs.map((tab) => {
              const active = tab.id === flagship.activeCategory;
              const base =
                "rounded-full px-6 py-2.5 font-display text-sm font-medium tracking-tight transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a11d]/60";
              const activeCls =
                "bg-[#f9a11d] text-[#1a0f00] shadow-[0_0_0_1px_rgba(249,161,29,0.35)]";
              const inactiveCls =
                "bg-transparent text-bone/70 hover:text-bone";

              const classes = `${base} ${active ? activeCls : inactiveCls}`;

              if (tab.href) {
                return (
                  <a
                    key={tab.id}
                    href={tab.href}
                    role="tab"
                    aria-selected={!active ? false : undefined}
                    className={classes}
                  >
                    {tab.label}
                  </a>
                );
              }
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={classes}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flagship course card — body tinted in Nextudy Vibrant Orange so the
            flagship announcement reads as the literal hero of the section. */}
        <article
          ref={card}
          className="fp-card group relative mx-auto mt-14 max-w-md overflow-hidden rounded-3xl border border-[#f9a11d]/70 bg-[#f9a11d] p-5 shadow-[0_30px_80px_-30px_rgba(249,161,29,0.55)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-1.5 hover:border-[#f9a11d] md:mt-20"
        >
          {/* Visual — stylised sky-and-skyline composition with a blueprint
              grid overlay, used in lieu of a real course hero image. */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="relative aspect-[16/9] w-full blueprint-grid"
              role="img"
              aria-label={c.imageAlt}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.32 0.045 36) 0%, oklch(0.45 0.075 45) 35%, oklch(0.55 0.110 55) 60%, oklch(0.34 0.055 50) 100%)",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.92 0.18 64) 0%, oklch(0.78 0.18 64 / 0.6) 30%, transparent 70%)",
                  filter: "blur(2px)",
                }}
                aria-hidden="true"
              />

              <svg
                viewBox="0 0 400 225"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden="true"
              >
                <g fill="oklch(0.16 0.012 68)">
                  <rect x="20" y="120" width="40" height="105" />
                  <rect x="70" y="95" width="55" height="130" />
                  <rect x="135" y="80" width="70" height="145" />
                  <rect x="215" y="100" width="45" height="125" />
                  <rect x="270" y="115" width="55" height="110" />
                  <rect x="335" y="130" width="50" height="95" />
                </g>
                <g fill="oklch(0.83 0.15 70)" opacity="0.85">
                  <rect x="78" y="115" width="3" height="3" />
                  <rect x="84" y="115" width="3" height="3" />
                  <rect x="78" y="125" width="3" height="3" />
                  <rect x="146" y="100" width="3" height="3" />
                  <rect x="156" y="100" width="3" height="3" />
                  <rect x="146" y="110" width="3" height="3" />
                  <rect x="166" y="115" width="3" height="3" />
                  <rect x="280" y="135" width="3" height="3" />
                  <rect x="290" y="135" width="3" height="3" />
                </g>
              </svg>

              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1.5 font-display text-xs font-semibold tracking-tight text-[#7a3b00] shadow-sm">
                {c.badge}
              </span>
            </div>
          </div>

          <div className="px-3 pb-4 pt-5">
            <h3 className="font-display text-[1.7rem] font-bold leading-[1.05] tracking-tight text-[#1a0f00] md:text-[1.95rem]">
              {c.name}
            </h3>

            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6">
              {c.details.map((d) => (
                <div key={d.label} className="fp-detail">
                  <p className="font-display text-xs font-medium tracking-wide text-[#1a0f00]/65">
                    {d.label}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold tracking-tight text-[#1a0f00]">
                    {d.value}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={c.cta.href}
              className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-[#1a0f00] px-6 py-4 font-display text-sm font-semibold tracking-tight text-[#f9a11d] transition-colors duration-300 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a0f00]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9a11d]"
            >
              {c.cta.label}
              <ArrowRight size={16} className="text-[#f9a11d]" />
              <span className="sr-only">: {c.name}</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
