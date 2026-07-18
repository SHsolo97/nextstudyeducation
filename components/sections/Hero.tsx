"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { hero } from "@/lib/content";
import Button from "../ui/Button";
import Kicker from "../ui/Kicker";
import WireframeBuilding from "../visuals/WireframeBuilding";
import BlueprintBackdrop from "../visuals/BlueprintBackdrop";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const [play, setPlay] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window as unknown as { __nxLoaded?: boolean }).__nxLoaded,
  );

  // Start the intro once the preloader signals it is done.
  useEffect(() => {
    if (play) return;
    const on = () => setPlay(true);
    window.addEventListener("nx:loaded", on, { once: true });
    // Safety: never leave the hero hidden if the loaded signal is missed.
    const fallback = window.setTimeout(() => setPlay(true), 4000);
    return () => {
      window.removeEventListener("nx:loaded", on);
      window.clearTimeout(fallback);
    };
  }, [play]);

  useGSAP(
    () => {
      const h = headline.current;
      if (!h) return;

      if (prefersReducedMotion()) {
        gsap.set([".h-eyebrow", ".h-sub", ".h-cta"], { autoAlpha: 1, y: 0 });
        return;
      }

      // Pre-hide so nothing flashes before the intro runs.
      gsap.set([".h-eyebrow", ".h-sub", ".h-cta"], { autoAlpha: 0, y: 22 });

      if (!play) return;

      let split: SplitText | null = null;
      let tl: gsap.core.Timeline | null = null;

      document.fonts.ready.then(() => {
        split = new SplitText(h, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(h, { autoAlpha: 1 });
        gsap.set(split.lines, { yPercent: 110 });

        tl = gsap.timeline({ defaults: { ease: "nx-out" } });
        tl.to(".h-eyebrow", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.05)
          .to(split.lines, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.15)
          .to(".h-sub", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.6")
          .to(".h-cta", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.65")
          .to(".h-scroll", { autoAlpha: 1, duration: 0.6 }, "-=0.3");
        ScrollTrigger.refresh();
      });

      // Parallax: building sinks and fades as the hero scrolls away.
      const ctx = gsap.context(() => {
        gsap.to(".h-building", {
          yPercent: 16,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".h-copy", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }, root);

      return () => {
        tl?.kill();
        split?.revert();
        ctx.revert();
      };
    },
    { scope: root, dependencies: [play] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pb-20 pt-28"
    >
      {/* atmosphere */}
      <div className="bloom -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2" />
      <BlueprintBackdrop fade="radial" className="opacity-70" />

      {/* custom BIM wireframe rising behind the type */}
      <div className="h-building pointer-events-none absolute inset-x-0 bottom-[-6%] z-0 flex justify-center">
        <WireframeBuilding
          play={play}
          className="h-[min(96vh,860px)] w-auto opacity-90 [mask-image:radial-gradient(ellipse_60%_75%_at_50%_62%,black,transparent_82%)]"
        />
      </div>
      {/* legibility wash over the building near the headline */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 42%, color-mix(in oklch, var(--color-ink) 72%, transparent), transparent 70%)",
        }}
      />

      <div className="h-copy shell relative z-10 flex flex-col items-center text-center">
        <span className="h-eyebrow">
          <Kicker>{hero.eyebrow}</Kicker>
        </span>

        <h1
          ref={headline}
          className="reveal-up mx-auto mt-7 max-w-[18ch] font-display text-[clamp(2.55rem,6.6vw,6rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
        >
          {hero.headline.flatMap((line, i): React.ReactNode[] =>
            i === 0
              ? [line]
              : [<br key={i} />, <span key="hl" className="text-accent">{line}</span>],
          )}
        </h1>

        <p className="h-sub mx-auto mt-7 max-w-[52ch] text-balance text-lg leading-relaxed text-mute sm:text-xl">
          {hero.sub}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3.5 sm:flex-row">
          <span className="h-cta">
            <Button href={hero.primaryCta.href} magnetic showArrow>
              {hero.primaryCta.label}
            </Button>
          </span>
          <span className="h-cta">
            <Button href={hero.secondaryCta.href} variant="ghost" showArrow={false}>
              {hero.secondaryCta.label}
            </Button>
          </span>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#shift"
        className="h-scroll absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-faint opacity-0"
        aria-label="Scroll to learn more"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.25em]">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-line">
          <span className="absolute inset-0 animate-[scrollcue_2s_ease-in-out_infinite] bg-accent" />
        </span>
      </a>
    </section>
  );
}
