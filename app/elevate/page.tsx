import type { Metadata } from "next";
import ElevateLeadForm from "@/components/ElevateLeadForm";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Nextudy Elevate — Nextudy",
  description:
    "Nextudy Elevate is a members-only learning ecosystem with year-round learning benefits and career support.",
};

const BENEFITS = [
  "Training for any program provided by Nextudy can be bought at 30% discount.",
  "Refer two students who successfully enroll in a program and unlock an 80% (non-stackable) discount on your enrollment in the same program.",
  "Receive a free Career Yearbook which explores the upcoming global career trends.",
  "Get priority in enrollment for all programs provided by Nextudy.",
  "Receive monthly career newsletter to your mailbox.",
  "Avail free resume reviews provided by our career experts once a month.",
  "Attend exclusive career webinars provided by us once in two months.",
  "Access to Nextudy Elevate members-only networking community.",
];

export default function ElevatePage() {
  return (
    <PageLayout
      eyebrow="Nextudy Elevate"
      title="A learning ecosystem that moves with your career."
      intro="Every meaningful career transformation begins with a decision to keep learning, growing, and staying ahead of change. If you're committed to building a future that stands out, you deserve a learning ecosystem that rewards your ambition every step of the way."
    >
      <p>
        Nextudy Elevate was created for professionals who see learning as a
        lifelong investment rather than a one-time achievement. The most
        successful careers are built by those who consistently adapt, expand
        their expertise, and stay prepared for the opportunities that tomorrow
        brings. We believe that commitment deserves more than quality training
        alone, and it deserves a community, resources, and an ecosystem that
        continuously supports your growth. Whether you&rsquo;re aiming for a
        promotion, transitioning into a new field, or preparing for the next
        stage of your career, Nextudy Elevate is designed to keep you moving
        forward with confidence. Because when your ambition is matched with the
        right support system, career transformation becomes a journey of
        continuous progress rather than a single milestone.
      </p>

      <h2>Benefits of Joining Nextudy Elevate</h2>
      <ul>
        {BENEFITS.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>

      <p>
        Every year you delay investing in your growth is another year someone
        else builds the skills employers are looking for. Join the
        professionals who have already chosen to stay future-ready.
      </p>

      <ElevateLeadForm />
    </PageLayout>
  );
}
