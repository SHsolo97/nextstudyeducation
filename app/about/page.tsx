import type { Metadata } from "next";
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

      <h3>Jassim Salam &middot; Founder &amp; Director</h3>
      <p>
        Jassim Salam is a Civil Engineering graduate from VIT University,
        Vellore, with more than five years of professional experience as a BIM
        Engineer and BIM Coordinator. Throughout his career, he has contributed
        to projects and worked with consultants across South Asian regions,
        including KEO International Consultants in Saudi Arabia and EKK
        Infrastructure in India. At Nextudy, he leads business operations,
        organizational management, and mentor coordination while ensuring that
        every program aligns closely with industry needs and practical outcomes.
      </p>

      <h3>Fahd Ikbal &middot; Co-Founder</h3>
      <p>
        Fahd Ikbal is an MBA graduate with a strong interest in entrepreneurship,
        business management, and building scalable systems. Prior to Nextudy, he
        operated &ldquo;Fraternity,&rdquo; a digital freelancer network designed to
        connect talented individuals with suitable opportunities in a localized
        ecosystem. At Nextudy, he drives marketing initiatives and business
        expansion strategies with the goal of growing meaningful learning
        opportunities and building stronger industry collaborations.
      </p>

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
