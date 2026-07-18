"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "./ui/icons";

// Minimal Razorpay checkout integration.
//
// Loads https://checkout.razorpay.com/v1/checkout.js on demand, then opens a
// styled checkout for either:
//   - a one-time payment (`amount` in paise), or
//   - a recurring subscription (`planId` provided, `amount` ignored).
//
// Configuration is sourced from public env vars so the keys are not bundled
// into the client payload beyond the public key, which Razorpay expects:
//   NEXT_PUBLIC_RAZORPAY_KEY_ID
//   NEXT_PUBLIC_RAZORPAY_PLAN_ELEVATE (optional; recommended for recurring)
//
// Hook points (handler / modal close) are exposed so a real backend can plug
// in: replace `onSuccess` with a server-side verification call before
// flipping the user into a "member" state.

type RazorpayCheckoutConfig = {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  image?: string;
  subscription_id?: string;
  plan_id?: string;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (
      config: RazorpayCheckoutConfig,
    ) => { open: () => void; on: (...args: unknown[]) => void };
  }
}

const SCRIPT_ID = "razorpay-checkout-js";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  if (typeof window === "undefined")
    return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (document.getElementById(SCRIPT_ID)) {
    return new Promise((resolve) => {
      const existing = document.getElementById(SCRIPT_ID);
      existing?.addEventListener("load", () => resolve(true));
      existing?.addEventListener("error", () => resolve(false));
    });
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({
  amount,
  planId,
  label,
  className = "",
}: {
  amount?: number;
  planId?: string;
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    // Pre-warm the script on mount so the click is instant.
    void loadScript();
  }, []);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const key =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
        (window as unknown as { __rzpKey?: string }).__rzpKey ??
        "";
      if (!key) {
        // Loud, recoverable failure so the operator knows to set the env var.
        setError(
          "Razorpay is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID to enable checkout.",
        );
        setLoading(false);
        return;
      }
      const loaded = await loadScript();
      if (!loaded || !window.Razorpay) {
        setError("Could not load Razorpay. Check your network and try again.");
        setLoading(false);
        return;
      }

      const config: RazorpayCheckoutConfig = {
        key,
        name: "Nextudy",
        description: "Nextudy Elevate annual membership",
        image: "/icon-512.png",
        currency: "INR",
        theme: { color: "#f9a11d" },
        handler: (response) => {
          // TODO: send the response to the backend to verify the signature
          // before unlocking membership.
          console.info("[Razorpay] success", response);
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            if (!dismissedRef.current) {
              dismissedRef.current = true;
              setLoading(false);
            }
          },
        },
      };
      if (planId) {
        config.plan_id = planId;
        config.subscription_id = "";
      } else if (typeof amount === "number") {
        config.amount = amount;
      }

      const checkout = new window.Razorpay(config);
      checkout.open();
    } catch (e) {
      console.error(e);
      setError("Something went wrong opening checkout.");
      setLoading(false);
    }
  }, [amount, planId]);

  const baseCls =
    "group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 font-display text-sm font-semibold tracking-tight text-accent-ink transition-colors duration-300 hover:bg-accent-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto";

  return (
    <div className="w-full md:w-auto">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading || undefined}
        className={`${baseCls} ${className}`}
      >
        <span>{loading ? "Opening checkout…" : label}</span>
        <ArrowRight
          size={18}
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
        />
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
