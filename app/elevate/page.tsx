import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import RazorpayButton from "@/components/RazorpayButton";

export const metadata: Metadata = {
  title: "Nextudy Elevate — Nextudy",
  description:
    "Nextudy Elevate is a members-only learning ecosystem that rewards your ambition with year-round benefits, discounts, and career support.",
};

const PRICE = {
  // Annual price in INR (paise for Razorpay).
  currentInr: 5299,
  strikeInr: 9199,
  rzpAmountPaise: 529900,
  rzpPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ELEVATE ?? "",
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

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

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
        {BENEFITS.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <p>
        Every year you delay investing in your growth is another year someone
        else builds the skills employers are looking for. Join the
        professionals who have already chosen to stay future-ready.
      </p>

      {/* Pricing card */}
      <div className="not-prose my-12 flex flex-col items-center gap-6 rounded-3xl border border-line bg-ink-800/60 p-8 backdrop-blur md:flex-row md:items-end md:justify-between md:p-10">
        <div className="text-center md:text-left">
          <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-faint">
            Annual membership
          </p>
          <div className="mt-3 flex items-baseline justify-center gap-3 md:justify-start">
            <span className="font-display text-5xl font-bold tracking-tight text-bone md:text-6xl">
              {INR(PRICE.currentInr)}
            </span>
            <span className="font-display text-base text-mute">/ year</span>
          </div>
          <p className="mt-2 text-sm text-mute">
            <span className="text-faint line-through">
              {INR(PRICE.strikeInr)} / year
            </span>{" "}
            &middot; Launch pricing for our first cohort
          </p>
        </div>

        <RazorpayButton
          amount={PRICE.rzpAmountPaise}
          planId={PRICE.rzpPlanId}
          label={`Join Nextudy Elevate — ${INR(PRICE.currentInr)} / year`}
        />
      </div>

      <p className="text-sm text-faint">
        Payments are processed securely by Razorpay. You can cancel your
        membership at any time; benefits remain active until the end of the
        current billing cycle.
      </p>
    </PageLayout>
  );
}
