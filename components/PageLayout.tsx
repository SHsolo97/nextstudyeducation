import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Kicker from "@/components/ui/Kicker";

// Marketing-style page chrome shared by /about and /elevate, with the same
// persistent navigation and footer as the homepage.

export default function PageLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />

      <main className="relative">
        <div
          className="bloom left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 opacity-20"
          aria-hidden="true"
        />

        <div className="shell relative pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-3xl">
            <Kicker>{eyebrow}</Kicker>
            <h1 className="display mt-5 text-[clamp(2.2rem,5.4vw,3.8rem)] text-bone">
              {title}
            </h1>
            {intro ? (
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-mute">
                {intro}
              </p>
            ) : null}
            <div className="hairline mt-10" />
            <div className="legal-prose mt-10">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
