"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import { nav } from "@/lib/content";

type Lenis = { stop: () => void; start: () => void };

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.removeProperty("overflow");
      lenis?.start();
    }
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] flex justify-center pt-3 sm:pt-4">
        <nav
          className={`shell-wide flex items-center justify-between rounded-full py-2.5 pl-4 pr-2.5 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? "border border-line/70 bg-ink-800/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
              : "border border-transparent bg-transparent"
          }`}
          style={{ maxWidth: "min(72rem, calc(100% - 1.5rem))" }}
        >
          <Link href="/" aria-label="Nextudy home" className="shrink-0">
            <Logo height={26} priority />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm text-mute transition-colors duration-200 hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <Button href="/#lead" magnetic showArrow={false} className="px-5 py-2.5 text-sm">
                Get the syllabus
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line/70 text-bone transition-colors hover:border-accent/60 md:hidden"
            >
              <span className="relative block h-3 w-[18px]">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[99] flex flex-col bg-ink/98 transition-[opacity,visibility] duration-400 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mt-24 flex flex-col gap-1 px-7">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`border-b border-line/50 py-5 font-display text-3xl tracking-tight text-bone transition-[transform,opacity] duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${open ? 80 + i * 55 : 0}ms` }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="mt-auto p-7">
          <Button href="/#lead" className="w-full justify-center" onClick={() => setOpen(false)}>
            Get the course syllabus
          </Button>
        </div>
      </div>
    </>
  );
}
