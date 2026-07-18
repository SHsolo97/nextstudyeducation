"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "@/lib/gsap";
import { programs } from "@/lib/content";
import Kicker from "../ui/Kicker";
import { ArrowRight } from "../ui/icons";

// SIGNATURE SECTION — a horizontal gallery of the five programs.
//
// Desktop (>= md, motion allowed): the section pins and vertical scroll is
// translated into a horizontal pan across the track (mirrors The Shift's pin
// idiom). A hairline progress bar reports horizontal progress.
// Mobile (< md) and prefers-reduced-motion: no pin — a native scroll-snap
// carousel keeps the experience smooth and fully accessible.
//
// The DOM is identical in both modes; only the scroll mechanics differ, swapped
// at runtime with gsap.matchMedia so each gets the right behaviour.

export default function Programs() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const progressWrap = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pinEl = pin.current;
      const scrollEl = scroller.current;
      const trackEl = track.current;
      if (!pinEl || !scrollEl || !trackEl) return;

      const reduce = prefersReducedMotion();

      // ---- Heading line-rise (signature kinetic headline) -------------------
      let split: SplitText | null = null;
      let headTween: gsap.core.Tween | null = null;
      const h = headline.current;

      if (h && reduce) {
        gsap.set(h, { autoAlpha: 1 });
      } else if (h) {
        document.fonts.ready.then(() => {
          if (!headline.current) return;
          split = new SplitText(h, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
          });
          gsap.set(h, { autoAlpha: 1 });
          gsap.set(split.lines, { yPercent: 110 });
          headTween = gsap.to(split.lines, {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "nx-out",
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          });
          ScrollTrigger.refresh();
        });
      }

      // ---- Supporting copy + cue entrance (once, before the pin) ------------
      // Synchronous tweens are auto-reverted by useGSAP's gsap.context.
      if (!reduce) {
        gsap.from(".pg-head-fade", {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "nx-out",
          scrollTrigger: { trigger: pinEl, start: "top 78%", once: true },
        });

        // Perpetual micro-nudge on the navigation cue arrow.
        gsap.to(".pg-cue-arrow", {
          x: 7,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ---- Pinned horizontal scroll: vertical scroll pans the cards ----------
      // Same scroll-driven behaviour on mobile and desktop. Reduced-motion users
      // keep the native swipe carousel (no pin).
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(0, trackEl.scrollWidth - pinEl.offsetWidth);

          // Hand the horizontal axis to GSAP; the pin wrapper clips overflow.
          scrollEl.style.overflow = "visible";
          gsap.set(progressWrap.current, { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinEl,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(trackEl, { x: () => -distance(), ease: "none" }, 0);
          if (progressBar.current) {
            tl.fromTo(
              progressBar.current,
              { scaleX: 0 },
              { scaleX: 1, ease: "none" },
              0,
            );
          }

          return () => {
            scrollEl.style.overflow = "";
            gsap.set(trackEl, { x: 0 });
            gsap.set(progressWrap.current, { autoAlpha: 0 });
          };
        },
      );

      return () => {
        headTween?.scrollTrigger?.kill();
        headTween?.kill();
        split?.revert();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="programs"
      aria-labelledby="programs-title"
      className="relative bg-ink"
    >
      <div
        ref={pin}
        className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden py-16 md:py-0"
      >
        {/* atmosphere */}
        <div
          className="bloom left-[-6%] top-1/4 h-[420px] w-[420px] opacity-30"
          aria-hidden="true"
        />

        <div
          ref={scroller}
          className="w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={track}
            className="flex items-stretch gap-5 px-[clamp(1.25rem,5vw,4rem)] py-8 will-change-transform md:gap-7"
          >
            {/* ---- Leading heading panel ------------------------------------ */}
            <div className="flex w-[85vw] max-w-[31rem] shrink-0 snap-center flex-col justify-center pr-2 md:w-[34rem] md:max-w-none md:pr-12">
              <span className="pg-head-fade">
                <Kicker>Programs</Kicker>
              </span>

              <h2
                ref={headline}
                id="programs-title"
                className="reveal-up mt-6 font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.025em] text-bone"
              >
                Five ways in.
                <br />
                <span className="text-accent">One workflow.</span>
              </h2>

              <p className="pg-head-fade mt-6 max-w-[34ch] text-lg leading-relaxed text-mute">
                Five programs, one through-line. Start where you stand and grow
                into the coordinated workflow employers are hiring for.
              </p>

              <div className="pg-head-fade mt-12 flex items-center gap-4 text-faint">
                <span className="eyebrow">Explore</span>
                <span className="h-px w-12 bg-line" aria-hidden="true" />
                <span className="font-display text-sm tracking-[0.18em]">
                  01 / 05
                </span>
                <ArrowRight
                  size={18}
                  className="pg-cue-arrow text-accent"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* ---- Program cards -------------------------------------------- */}
            {programs.map((p) => (
              <article
                key={p.id}
                className="group relative flex w-[80vw] max-w-[21rem] shrink-0 snap-center flex-col rounded-3xl border border-line bg-ink-800 p-8 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-1.5 hover:border-accent/50 hover:bg-ink-700 has-[a:focus-visible]:-translate-y-1.5 has-[a:focus-visible]:border-accent/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent/40 sm:w-[22rem] sm:max-w-none sm:min-h-[28rem] md:w-[23.5rem]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-[3.25rem] font-bold leading-none text-accent">
                    {p.index}
                  </span>
                  <span className="mt-2 h-2 w-2 rounded-full bg-line transition-colors duration-500 group-hover:bg-accent" aria-hidden="true" />
                </div>

                <h3 className="mt-6 font-display text-[1.75rem] font-medium leading-[1.05] tracking-tight text-bone md:text-[2rem]">
                  {p.name}
                </h3>

                <p className="mt-3 text-sm text-faint">For {p.for}</p>

                <p className="mt-5 text-mute leading-relaxed">{p.summary}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-line px-3 py-1 text-xs text-mute"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <div className="hairline" />

                  <div className="mt-6 flex items-center gap-2.5">
                    <span className="h-px w-6 bg-accent" aria-hidden="true" />
                    <span className="eyebrow text-faint">
                      You walk away with
                    </span>
                  </div>
                  <p className="mt-3 font-display text-[1.1rem] font-medium leading-snug text-bone">
                    {p.outcome}
                  </p>

                  <a
                    href="#lead"
                    className="mt-6 inline-flex items-center gap-2 font-display text-sm font-medium tracking-tight text-accent outline-none after:absolute after:inset-0 after:z-10 after:content-[''] focus:outline-none focus-visible:outline-none"
                  >
                    Explore this program
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                    />
                    <span className="sr-only">: {p.name}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* horizontal scroll progress (desktop, pinned) */}
        <div
          ref={progressWrap}
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-[3px] bg-line/40 opacity-0"
          aria-hidden="true"
        >
          <div
            ref={progressBar}
            className="h-full origin-left scale-x-0 bg-accent"
          />
        </div>
      </div>
    </section>
  );
}
