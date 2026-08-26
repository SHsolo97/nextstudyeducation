"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const PRELOADER_SEEN_KEY = "nextudy:preloader-seen";

// First-paint reveal. Counts to 100, draws the brand mark, then the panel slides
// up to reveal the page. Locks scroll while running and signals the hero to
// begin its intro via the `nx:loaded` event (+ a window flag for late listeners).
function signalLoaded() {
  (window as unknown as { __nxLoaded?: boolean }).__nxLoaded = true;
  window.dispatchEvent(new Event("nx:loaded"));
  (window as unknown as { lenis?: { start?: () => void } }).lenis?.start?.();
  document.body.style.removeProperty("overflow");
}

function hasSeenPreloader() {
  if ((window as unknown as { __nxPreloaderSeen?: boolean }).__nxPreloaderSeen) return true;
  try {
    return window.sessionStorage.getItem(PRELOADER_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  (window as unknown as { __nxPreloaderSeen?: boolean }).__nxPreloaderSeen = true;
  try {
    window.sessionStorage.setItem(PRELOADER_SEEN_KEY, "true");
  } catch {
    // The in-memory flag still prevents repeats when storage is unavailable.
  }
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      if (hasSeenPreloader()) {
        gsap.set(el, { autoAlpha: 0, pointerEvents: "none", display: "none" });
        signalLoaded();
        return;
      }

      markPreloaderSeen();
      document.body.style.overflow = "hidden";
      (window as unknown as { lenis?: { stop?: () => void } }).lenis?.stop?.();

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
        signalLoaded();
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();
      let released = false;
      const releasePage = () => {
        released = true;
        signalLoaded();
      };

      tl.to(".pl-mark", { autoAlpha: 1, scale: 1, duration: 0.7, ease: "nx-out" }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current)
                count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.15,
        )
        .to(".pl-bar-fill", { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.15)
        .to(".pl-fade", { autoAlpha: 0, y: -14, duration: 0.5, ease: "nx-out" }, "+=0.15")
        .to(
          ".pl-curtain",
          {
            scaleY: 0,
            duration: 1,
            stagger: 0.07,
            ease: "nx-inout",
            transformOrigin: "top",
          },
          "-=0.1",
        )
        .set(el, { pointerEvents: "none", display: "none" })
        .add(releasePage, "-=0.55");

      return () => {
        tl.kill();
        if (!released) signalLoaded();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[120] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* layered curtains for depth on exit */}
      <div className="pl-curtain absolute inset-0 bg-ink-800" />
      <div className="pl-curtain absolute inset-0 bg-ink" />

      <div className="relative flex flex-col items-center gap-7 px-6">
        <Image
          src="/brand/mark.png"
          alt=""
          width={74}
          height={68}
          priority
          className="pl-mark pl-fade opacity-0"
          style={{ height: 64, width: "auto", transform: "scale(0.86)" }}
        />
        <div className="pl-fade flex flex-col items-center gap-4">
          <div className="pl-bar relative h-px w-44 overflow-hidden bg-line/60">
            <div className="pl-bar-fill absolute inset-0 origin-left scale-x-0 bg-accent" />
          </div>
          <div className="flex items-baseline gap-3 font-display">
            <span ref={count} className="text-sm tabular-nums tracking-[0.3em] text-mute">
              000
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-faint">
              Skill up now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
