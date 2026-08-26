import type { Metadata } from "next";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "About Us — Nextudy",
  description:
    "Nextudy is a career transformation platform built to help individuals prepare for careers that will remain valuable in the evolving job market.",
};

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="About Us"
      title="What is Nextudy?"
      intro="Nextudy is a career transformation platform built to help individuals prepare for careers that will remain valuable in the evolving job market. Our mission is to continuously analyze market trends and identify high-demand career paths for the coming decade, then deliver quality training through experienced mentors who have real industry expertise. We believe education should not simply teach skills, but create professionals who are prepared to thrive in the industries of tomorrow."
    >
      <h2>Who are we?</h2>
      <p>
        Nextudy was founded by two professionals from different backgrounds who
        shared a common vision of making career growth more practical,
        industry-focused, and future-ready. By combining technical expertise,
        business understanding, and a passion for creating opportunities, they
        built a platform designed to bridge the gap between learning and real
        career outcomes.
      </p>

      <div className="not-prose my-12 grid gap-8">
        <article className="grid overflow-hidden rounded-3xl border border-line bg-ink-800/60 md:grid-cols-[16rem_1fr]">
          <div className="relative aspect-[3/4] min-h-[22rem] md:aspect-auto">
            <Image
              src="/founders/JassimSalam.jpeg"
              alt="Jassim Salam, Founder and Director of Nextudy"
              fill
              sizes="(min-width: 768px) 256px, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
          <div className="p-7 md:p-9">
            <h3 className="font-display text-2xl font-semibold text-bone">
              Jassim Salam
            </h3>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-accent">
              Founder &amp; Director
            </p>
            <p className="mt-5 leading-relaxed text-mute">
              Jassim Salam is a Civil Engineering graduate from VIT University,
              Vellore, with more than five years of professional experience as a BIM
              Engineer and BIM Coordinator. Throughout his career, he has contributed
              to projects and worked with consultants across South Asian regions,
              including KEO International Consultants in Saudi Arabia and EKK
              Infrastructure in India. At Nextudy, he leads business operations,
              organizational management, and mentor coordination while ensuring that
              every program aligns closely with industry needs and practical outcomes.
            </p>
          </div>
        </article>

        <article className="grid overflow-hidden rounded-3xl border border-line bg-ink-800/60 md:grid-cols-[16rem_1fr]">
          <div className="relative aspect-[3/4] min-h-[22rem] md:aspect-auto">
            <Image
              src="/founders/FahdIkbal.jpeg"
              alt="Fahd Ikbal, Co-Founder of Nextudy"
              fill
              sizes="(min-width: 768px) 256px, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
          <div className="p-7 md:p-9">
            <h3 className="font-display text-2xl font-semibold text-bone">Fahd Ikbal</h3>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-accent">
              Co-Founder
            </p>
            <p className="mt-5 leading-relaxed text-mute">
              Fahd Ikbal is an MBA graduate with a strong interest in entrepreneurship,
              business management, and building scalable systems. Prior to Nextudy, he
              operated &ldquo;Fraternity,&rdquo; a digital freelancer network designed to
              connect talented individuals with suitable opportunities in a localized
              ecosystem. At Nextudy, he drives marketing initiatives and business
              expansion strategies with the goal of growing meaningful learning
              opportunities and building stronger industry collaborations.
            </p>
          </div>
        </article>
      </div>

      <h2>What we do?</h2>
      <p>
        At Nextudy, we focus on transforming learning into real career
        opportunities through practical, industry-driven programs and support
        systems. Our approach combines structured training with mentorship and
        hands-on exposure to help learners build confidence and become
        career-ready.
      </p>
      <p>
        We currently provide BIM training programs, mentorship and career
        guidance, portfolio and resume development support, placement
        assistance, exposure to industry projects, and corporate training
        solutions. We also collaborate with academies and training institutions
        to strengthen their offerings and create wider access to quality
        education and career-focused opportunities.
      </p>
    </PageLayout>
  );
}
