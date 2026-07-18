"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { recognition } from "@/lib/content";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";

// Trust markers — cards that state what the organisation has actually earned.
// 2x2 grid on desktop, stacked on mobile, each with a large muted index,
// bold metric, accent highlight on the key phrase, and quiet supporting copy.
// Animated entrance: staggered rise + fade triggered once on scroll.

const cardBase =
  "rec-card reveal-up group relative flex flex-col rounded-3xl border border-line bg-ink-800 p-8 transition-[translate,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:[translate:0_-3px] hover:border-accent/50 md:p-10";

export default function Recognition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>(".rec-card", el);

      if (prefersReducedMotion()) {
        gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "transform" });
        return;
      }

      gsap.set(cards, { y: 32 });
      const tween = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "nx-out",
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="recognition"
      ref={root}
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      <div
        className="bloom -right-32 top-16 h-[400px] w-[500px] opacity-[0.22]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <header className="max-w-2xl">
          <Kicker>{recognition.eyebrow}</Kicker>
          <TextReveal
            lines={recognition.headline}
            trigger
            as="h2"
            className="display mt-6 text-[clamp(2rem,4.2vw,3.5rem)] text-bone"
          />
        </header>

        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-5">
          {recognition.cards.map((card) => (
            <div key={card.index} className={cardBase}>
              <span className="font-display text-[clamp(4rem,6vw,5.25rem)] font-bold leading-[0.85] tracking-[-0.04em] text-faint/40 transition-colors duration-300 group-hover:text-accent/50">
                {card.index}
              </span>

              <p className="mt-4 max-w-[28ch] font-display text-[clamp(1.3rem,2.2vw,1.75rem)] font-semibold leading-[1.15] tracking-tight text-bone">
                {card.metric}{" "}
                <span className="text-accent">{card.highlight}</span>
              </p>

              <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
                {card.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
