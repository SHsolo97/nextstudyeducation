"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Spinner } from "@/components/ui/icons";

const MESSAGE_MAX = 750;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  message: string;
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const initialValues: Values = {
  firstName: "",
  lastName: "",
  email: "",
  whatsapp: "",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-line bg-ink-700 px-4 py-3 text-bone transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:opacity-60";

export default function ElevateLeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const update = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Errors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "Required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Required.";
    if (!values.email.trim()) nextErrors.email = "We need an email to contact you.";
    else if (!EMAIL_RE.test(values.email.trim())) nextErrors.email = "That email doesn't look right.";

    const digits = values.whatsapp.replace(/\D/g, "");
    if (!values.whatsapp.trim()) nextErrors.whatsapp = "A WhatsApp number is required.";
    else if (digits.length < 7 || digits.length > 15) {
      nextErrors.whatsapp = "That number doesn't look complete.";
    }
    if (values.message.length > MESSAGE_MAX) {
      nextErrors.message = `Keep it under ${MESSAGE_MAX} characters.`;
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const first = (["firstName", "lastName", "email", "whatsapp", "message"] as FieldName[])
        .find((field) => nextErrors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    // Simulated handoff until the site's lead endpoint is connected.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="not-prose my-12 flex min-h-[26rem] flex-col items-center justify-center rounded-3xl border border-line bg-ink-800/60 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
          <Check size={30} />
        </span>
        <h2 className="mt-7 font-display text-3xl font-semibold text-bone">
          Thanks, {values.firstName.trim()}.
        </h2>
        <p className="mt-3 max-w-[38ch] leading-relaxed text-mute">
          We&rsquo;ve received your Nextudy Elevate inquiry. A member of our team will reach out by
          email or WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div id="elevate-inquiry" className="not-prose my-12 scroll-mt-28 rounded-3xl border border-line bg-ink-800/60 p-7 sm:p-10">
      <h2 className="font-display text-2xl font-semibold text-bone">Start your Elevate inquiry</h2>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        Share your details and we&rsquo;ll help you understand whether Nextudy Elevate fits your goals.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <ReadOnlyField label="Inquiry type" name="inquiryType" value="Individual" />
          <ReadOnlyField label="Product / service interest" name="interest" value="Nextudy Elevate" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputField label="First name" name="firstName" value={values.firstName} onChange={(value) => update("firstName", value)} error={errors.firstName} autoComplete="given-name" disabled={status === "submitting"} />
          <InputField label="Last name" name="lastName" value={values.lastName} onChange={(value) => update("lastName", value)} error={errors.lastName} autoComplete="family-name" disabled={status === "submitting"} />
        </div>

        <InputField label="Email address" name="email" type="email" inputMode="email" value={values.email} onChange={(value) => update("email", value)} error={errors.email} autoComplete="email" disabled={status === "submitting"} />
        <InputField label="WhatsApp number" name="whatsapp" type="tel" inputMode="tel" value={values.whatsapp} onChange={(value) => update("whatsapp", value)} error={errors.whatsapp} autoComplete="tel" helper="Include your country code." disabled={status === "submitting"} />

        <div className="flex flex-col gap-2">
          <label htmlFor="elevate-message" className="flex justify-between gap-3 font-display text-sm font-medium text-bone">
            <span>What are you looking to achieve through Nextudy Elevate?</span>
            <span className="shrink-0 text-xs font-normal text-faint">Optional</span>
          </label>
          <textarea
            id="elevate-message"
            name="message"
            value={values.message}
            onChange={(event) => update("message", event.target.value.slice(0, MESSAGE_MAX))}
            maxLength={MESSAGE_MAX}
            rows={4}
            disabled={status === "submitting"}
            aria-invalid={!!errors.message}
            aria-describedby="elevate-message-help"
            className={`${inputClass} resize-none`}
          />
          <div className="flex justify-between gap-3 text-xs">
            <span id="elevate-message-help" className={errors.message ? "text-orange-300" : "text-faint"}>{errors.message ?? ""}</span>
            <span className="text-faint">{values.message.length}/{MESSAGE_MAX}</span>
          </div>
        </div>

        <button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"} className="group mt-1 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 font-display text-[0.95rem] font-medium text-accent-ink transition-[transform,background-color] duration-200 hover:bg-accent-bright active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:cursor-not-allowed disabled:opacity-70">
          {status === "submitting" ? (
            <><Spinner size={18} /> Sending inquiry&hellip;</>
          ) : (
            <>Submit Elevate inquiry <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" /></>
          )}
        </button>
        <p className="text-center text-xs text-faint">We&rsquo;ll only use your details to respond to your Nextudy Elevate inquiry.</p>
      </form>
    </div>
  );
}

function ReadOnlyField({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`elevate-${name}`} className="font-display text-sm font-medium text-bone">{label}</label>
      <input id={`elevate-${name}`} name={name} value={value} readOnly className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-mute" />
    </div>
  );
}

function InputField({ label, name, type = "text", inputMode, value, onChange, error, helper, autoComplete, placeholder, disabled }: {
  label: string;
  name: FieldName;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled: boolean;
}) {
  const id = `elevate-${name}`;
  const helpId = `${id}-help`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-sm font-medium text-bone">{label}</label>
      <input id={id} name={name} type={type} inputMode={inputMode} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} placeholder={placeholder} disabled={disabled} aria-invalid={!!error} aria-describedby={helpId} className={inputClass} />
      {(error || helper) && <span id={helpId} className={`text-xs ${error ? "text-orange-300" : "text-faint"}`}>{error ?? helper}</span>}
    </div>
  );
}
