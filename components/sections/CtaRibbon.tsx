"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";
import { ArrowRight } from "../ui/icons";

// Compact CTA strip that lives between the narrative sections and the
// Programs carousel. It collapses the lead form's purpose into one line
// and hands off to #lead with a smooth scroll. Visually it is a single
// dark band on the same `bg-ink` canvas so it does not interrupt the
// page rhythm.

export default function CtaRibbon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;

      const tl = gsap.timeline({
        defaults: { ease: "nx-out" },
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });

      tl.from(".cr-fade", {
        y: 20,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.08,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-ink py-20 md:py-28"
    >
      <div
        className="bloom left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-30"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="flex flex-col items-start gap-10 rounded-3xl border border-line bg-ink-800/60 p-8 backdrop-blur md:flex-row md:items-center md:justify-between md:gap-12 md:p-12">
          <div className="max-w-2xl">
            <span className="cr-fade">
              <Kicker>Ready when you are</Kicker>
            </span>

            <TextReveal
              as="h2"
              lines={["Get the course syllabus", "and a mentor's read on your fit."]}
              trigger
              className="cr-fade display mt-5 text-[clamp(1.7rem,3.2vw,2.6rem)] text-bone"
            />

            <p className="cr-fade mt-4 max-w-[58ch] leading-relaxed text-mute">
              A mentor reviews every request personally and walks you through
              which program fits, what it covers, and what it does not. No
              pressure, no script.
            </p>
          </div>

          <a
            href="#lead"
            className="cr-fade group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-7 py-4 font-display text-sm font-semibold tracking-tight text-accent-ink transition-colors duration-300 hover:bg-accent-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
          >
            <span>Talk to a mentor</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
