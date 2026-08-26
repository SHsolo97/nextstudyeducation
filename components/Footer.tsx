import Link from "next/link";
import Logo from "./ui/Logo";
import { Social } from "./ui/icons";
import { brand, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-line/60 bg-ink pt-16 pb-10">
      <div className="shell-wide">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="Nextudy home" className="inline-flex">
              <Logo height={30} />
            </Link>
            <p className="mt-5 text-mute leading-relaxed">
              Mentor-led, project-based BIM training for civil engineers, architects, and
              graduates moving into modern construction careers.
            </p>
            <p className="mt-5 font-display text-lg font-medium tracking-tight text-accent">
              {brand.tagline}.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="eyebrow text-faint">Explore</span>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-mute transition-colors duration-200 hover:text-bone"
              >
                {item.label}
              </a>
            ))}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- in-page smooth-scroll anchor, handled by SmoothScroll */}
            <a href="/#lead" className="w-fit text-mute transition-colors duration-200 hover:text-bone">
              Get the syllabus
            </a>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="eyebrow text-faint">Contact</span>
            <a
              href={`mailto:${brand.email}`}
              className="w-fit text-mute transition-colors duration-200 hover:text-bone"
            >
              {brand.email}
            </a>
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              className="w-fit text-mute transition-colors duration-200 hover:text-bone"
            >
              {brand.phone}
            </a>
            <div className="mt-3 flex items-center gap-3">
              {brand.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line/70 text-mute transition-colors duration-200 hover:border-accent/60 hover:text-accent"
                >
                  <Social name={s.label} size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-line/50 pt-6 text-sm text-faint md:flex-row md:items-center md:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-bone">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-bone">
              Terms &amp; Conditions
            </Link>
          </div>

          <span>
            Powered by{" "}
            <a
              href="https://pixelandpunch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-bone transition-colors duration-200 hover:text-accent"
            >
              Pixel and Punch
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
