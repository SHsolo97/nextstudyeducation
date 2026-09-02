"use client";

import { useReducer, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  businessInterestOptions,
  lead,
  interestOptions,
  inquiryTypes,
  leadMagnet,
} from "@/lib/content";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";
import Reveal from "../ui/Reveal";
import Magnetic from "../ui/Magnetic";
import BlueprintBackdrop from "../visuals/BlueprintBackdrop";
import { Check, Spinner, ArrowRight } from "../ui/icons";
import { submitLead } from "@/lib/leads";

// ── Conversion moment. Dark register: a trustworthy inquiry form that, once
// completed, delivers the BIM Foundation syllabus as a lead magnet. ───────────

const MESSAGE_MAX = 750;
const INQUIRY = inquiryTypes.map((t) => t.label); // ["Individual", "Business"]

type FieldName =
  | "inquiryType"
  | "firstName"
  | "lastName"
  | "contactName"
  | "company"
  | "email"
  | "whatsapp"
  | "interest"
  | "businessInterests"
  | "teamSize"
  | "message";
type TextFieldName = Exclude<FieldName, "businessInterests">;
type Values = Record<TextFieldName, string> & { businessInterests: string[] };
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success";

type State = { values: Values; errors: Errors; status: Status; submitError: string };
type Action =
  | { type: "change"; field: TextFieldName; value: string }
  | { type: "toggleBusinessInterest"; value: string }
  | { type: "errors"; errors: Errors }
  | { type: "submitting" }
  | { type: "success" }
  | { type: "failure"; message: string };

const initialState: State = {
  values: {
    inquiryType: "",
    firstName: "",
    lastName: "",
    contactName: "",
    company: "",
    email: "",
    whatsapp: "",
    interest: "",
    businessInterests: [],
    teamSize: "",
    message: "",
  },
  errors: {},
  status: "idle",
  submitError: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "change":
      if (action.field === "inquiryType") {
        return {
          ...state,
          values: {
            ...state.values,
            inquiryType: action.value,
            company: "",
            firstName: "",
            lastName: "",
            contactName: "",
            interest: "",
            businessInterests: [],
            teamSize: "",
          },
          errors: {},
          submitError: "",
        };
      }
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
        submitError: "",
      };
    case "toggleBusinessInterest": {
      const selected = state.values.businessInterests.includes(action.value);
      return {
        ...state,
        values: {
          ...state.values,
          businessInterests: selected
            ? state.values.businessInterests.filter((item) => item !== action.value)
            : [...state.values.businessInterests, action.value],
        },
        errors: { ...state.errors, businessInterests: undefined },
        submitError: "",
      };
    }
    case "errors":
      return { ...state, errors: action.errors };
    case "submitting":
      return { ...state, status: "submitting", errors: {}, submitError: "" };
    case "success":
      return { ...state, status: "success" };
    case "failure":
      return { ...state, status: "idle", submitError: action.message };
    default:
      return state;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.inquiryType) e.inquiryType = "Let us know who's reaching out.";

  if (v.inquiryType === "Individual") {
    if (!v.firstName.trim()) e.firstName = "Required.";
    if (!v.lastName.trim()) e.lastName = "Required.";
  } else if (v.inquiryType === "Business") {
    if (!v.contactName.trim()) e.contactName = "Tell us who we should contact.";
    if (!v.company.trim()) e.company = "Tell us your company name.";
    if (!v.businessInterests.length) e.businessInterests = "Select at least one program.";
    if (!v.teamSize) e.teamSize = "Select your team size.";
  }

  if (!v.email.trim()) e.email = "We need an email to send the syllabus.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look right.";

  const digits = v.whatsapp.replace(/\D/g, "");
  if (!v.whatsapp.trim()) e.whatsapp = "A number a mentor can reach you on.";
  else if (digits.length < 7 || digits.length > 15) e.whatsapp = "That number doesn't look complete.";

  if (v.inquiryType === "Individual" && !v.interest) {
    e.interest = "Pick what you're interested in.";
  }

  if (v.message.length > MESSAGE_MAX) e.message = `Keep it under ${MESSAGE_MAX} characters.`;
  return e;
}

function focusOrder(v: Values): FieldName[] {
  const names: FieldName[] =
    v.inquiryType === "Individual"
      ? ["inquiryType", "firstName", "lastName"]
      : v.inquiryType === "Business"
        ? ["inquiryType", "contactName", "company"]
        : ["inquiryType"];
  return v.inquiryType === "Business"
    ? [...names, "email", "whatsapp", "businessInterests", "teamSize", "message"]
    : [...names, "email", "whatsapp", "interest", "message"];
}

const TRUST_LINE = "No pressure, no script.";
const BODY_COPY = lead.copy.replace(TRUST_LINE, "").trim();
const TEAM_SIZES = [
  "1–5 employees",
  "6–15 employees",
  "16–50 employees",
  "51–200 employees",
  "201+ employees",
];

function openSyllabus() {
  const a = document.createElement("a");
  a.href = leadMagnet.href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function LeadCapture({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const submitting = state.status === "submitting";
  const v = state.values;
  const set = (field: TextFieldName) => (value: string) => dispatch({ type: "change", field, value });
  const isIndividual = v.inquiryType === "Individual";
  const isBusiness = v.inquiryType === "Business";
  const leadName = isBusiness ? v.contactName.trim().split(/\s+/)[0] : v.firstName.trim();

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting) return;

    const errors = validate(v);
    if (Object.values(errors).some(Boolean)) {
      dispatch({ type: "errors", errors });
      const first = focusOrder(v).find((f) => errors[f]);
      if (first) {
        requestAnimationFrame(() =>
          formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(),
        );
      }
      return;
    }

    dispatch({ type: "submitting" });
    try {
      await submitLead(
        isBusiness
          ? {
              inquiryType: "Business",
              contactName: v.contactName,
              companyName: v.company,
              workEmail: v.email,
              phone: v.whatsapp,
              programsOfInterest: v.businessInterests,
              teamSize: v.teamSize,
              requirements: v.message,
            }
          : {
              inquiryType: "Individual",
              firstName: v.firstName,
              lastName: v.lastName,
              email: v.email,
              whatsapp: v.whatsapp,
              productInterest: v.interest,
              needs: v.message,
            },
      );
      openSyllabus();
      dispatch({ type: "success" });
    } catch (error) {
      dispatch({
        type: "failure",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't send your inquiry. Please try again.",
      });
    }
  }

  // Form entrance: the card rises, then the fields stagger in beneath it.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>(".lc-card");
      const fields = gsap.utils.toArray<HTMLElement>(".lc-field", el);
      if (!card) return;

      if (prefersReducedMotion()) {
        gsap.set([card, ...fields], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(card, { autoAlpha: 0, y: 40 });
      gsap.set(fields, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "nx-out" },
        scrollTrigger: { trigger: card, start: "top 82%", once: true },
      });
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.95 }).to(
        fields,
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 },
        "-=0.55",
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  // Success reveal.
  useGSAP(
    () => {
      if (state.status !== "success") return;
      const el = root.current?.querySelector<HTMLElement>(".lc-success");
      if (!el) return;
      successHeading.current?.focus({ preventScroll: true });

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      const icon = el.querySelector(".lc-check");
      const lines = gsap.utils.toArray<HTMLElement>(".lc-success-line", el);
      gsap.set(el, { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "nx-out" } });
      tl.from(icon, { scale: 0, autoAlpha: 0, duration: 0.6, ease: "back.out(2)" }).from(
        lines,
        { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 },
        "-=0.25",
      );
      return () => tl.kill();
    },
    { scope: root, dependencies: [state.status] },
  );

  return (
    <section
      ref={root}
      id={embedded ? "elevate-inquiry" : "lead"}
      className={
        embedded
          ? "not-prose my-12 scroll-mt-28"
          : "relative overflow-hidden bg-ink py-24 md:py-36"
      }
    >
      {!embedded ? (
        <>
          <div className="bloom right-[-8%] top-[8%] h-[440px] w-[560px] opacity-40" />
          <BlueprintBackdrop fade="top" className="opacity-40" />
        </>
      ) : null}

      <div
        className={
          embedded
            ? "relative z-10"
            : "shell relative z-10 grid items-start gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20"
        }
      >
        {/* LEFT — the invitation */}
        {!embedded ? (
          <div className="relative">
            <Reveal>
              <Kicker>{lead.eyebrow}</Kicker>
            </Reveal>
            <TextReveal
              lines={lead.headline}
              trigger
              as="h2"
              className="mt-6 font-display text-[clamp(2.4rem,5.2vw,4.2rem)] font-bold leading-[1.02] tracking-[-0.025em] text-bone"
            />
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-mute">{BODY_COPY}</p>
              <div className="mt-8 inline-flex items-center gap-3 text-faint">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-accent">
                  <Check size={14} />
                </span>
                <span className="text-sm tracking-wide">{TRUST_LINE}</span>
              </div>
            </Reveal>
          </div>
        ) : null}

        {/* RIGHT — the form card */}
        <div className="lc-card reveal-up relative rounded-3xl border border-line bg-ink-800 p-8 sm:p-10">
          {state.status === "success" ? (
            <div
              className="lc-success flex min-h-[480px] flex-col items-center justify-center text-center"
              role="status"
              aria-live="polite"
            >
              <span className="lc-check flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <Check size={30} />
              </span>
              <h3
                ref={successHeading}
                tabIndex={-1}
                className="lc-success-line mt-7 font-display text-2xl font-medium tracking-tight text-bone outline-none sm:text-3xl"
              >
                {leadName ? `You're all set, ${leadName}.` : "You're all set."}
              </h3>
              <p className="lc-success-line mt-3 max-w-[36ch] leading-relaxed text-mute">
                Your {leadMagnet.title} is opening in a new tab. A mentor will reach out on WhatsApp to
                pick up the conversation.
              </p>
              <a
                href={leadMagnet.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lc-success-line group mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 font-display text-[0.95rem] font-medium tracking-tight text-accent-ink transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-bright active:scale-[0.97]"
              >
                Open the syllabus again
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="lc-field">
                <p className="font-display text-lg font-medium text-bone">Tell us a little</p>
                <p className="mt-1 text-sm text-mute">{lead.formNote}</p>
              </div>

              <SelectField
                id="inquiryType"
                label="Type of inquiry"
                value={v.inquiryType}
                onChange={set("inquiryType")}
                error={state.errors.inquiryType}
                helper="Are you reaching out for yourself or a company?"
                placeholder="Select one"
                options={INQUIRY}
                disabled={submitting}
              />

              {isIndividual && (
                <div className="lc-field grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="firstName"
                    label="First name"
                    value={v.firstName}
                    onChange={set("firstName")}
                    error={state.errors.firstName}
                    autoComplete="given-name"
                    disabled={submitting}
                  />
                  <TextField
                    id="lastName"
                    label="Last name"
                    value={v.lastName}
                    onChange={set("lastName")}
                    error={state.errors.lastName}
                    autoComplete="family-name"
                    disabled={submitting}
                  />
                </div>
              )}

              {isBusiness && (
                <div className="lc-field grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="contactName"
                    label="Contact name"
                    value={v.contactName}
                    onChange={set("contactName")}
                    error={state.errors.contactName}
                    autoComplete="name"
                    disabled={submitting}
                  />
                  <TextField
                    id="company"
                    label="Company name"
                    value={v.company}
                    onChange={set("company")}
                    error={state.errors.company}
                    autoComplete="organization"
                    disabled={submitting}
                  />
                </div>
              )}

              <TextField
                id="email"
                label={isBusiness ? "Work email" : "Email address"}
                type="email"
                inputMode="email"
                value={v.email}
                onChange={set("email")}
                error={state.errors.email}
                autoComplete="email"
                disabled={submitting}
              />

              <TextField
                id="whatsapp"
                label={isBusiness ? "Phone / WhatsApp" : "WhatsApp number"}
                type="tel"
                inputMode="tel"
                value={v.whatsapp}
                onChange={set("whatsapp")}
                error={state.errors.whatsapp}
                helper="Include your country code."
                autoComplete="tel"
                disabled={submitting}
              />

              {isIndividual && (
                <SelectField
                  id="interest"
                  label="Product / service interest"
                  value={v.interest}
                  onChange={set("interest")}
                  error={state.errors.interest}
                  placeholder="What are you interested in?"
                  options={interestOptions}
                  disabled={submitting}
                />
              )}

              {isBusiness && (
                <>
                  <CheckboxGroup
                    label="Programs of interest"
                    options={businessInterestOptions}
                    selected={v.businessInterests}
                    onToggle={(value) => dispatch({ type: "toggleBusinessInterest", value })}
                    error={state.errors.businessInterests}
                    disabled={submitting}
                  />
                  <SelectField
                    id="teamSize"
                    label="Team size"
                    value={v.teamSize}
                    onChange={set("teamSize")}
                    error={state.errors.teamSize}
                    placeholder="Select your team size"
                    options={TEAM_SIZES}
                    disabled={submitting}
                  />
                </>
              )}

              <TextareaField
                id="message"
                label={isBusiness ? "Training requirements" : "Tell us more about your needs"}
                optional
                value={v.message}
                onChange={(val) => set("message")(val.slice(0, MESSAGE_MAX))}
                error={state.errors.message}
                max={MESSAGE_MAX}
                disabled={submitting}
              />

              <div className="lc-field mt-1">
                <Magnetic strength={0.25} className="w-full">
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 font-display text-[0.95rem] font-medium tracking-tight text-accent-ink transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-bright active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Spinner size={18} />
                        Preparing your syllabus&hellip;
                      </>
                    ) : (
                      <>
                        Get the course syllabus
                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </Magnetic>
                {state.submitError ? (
                  <p role="alert" className="mt-3 text-center text-sm text-orange-300">
                    {state.submitError}
                  </p>
                ) : null}
                <p className="mt-3 text-center text-xs text-faint">
                  We&rsquo;ll only use your details to send the syllabus and arrange a callback.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Field primitives (label above, helper/error below, gap-2) ─────────────────

function HelpText({ id, error, helper }: { id: string; error?: string; helper?: string }) {
  if (!error && !helper) return null;
  return (
    <p
      id={id}
      className={`text-xs leading-snug ${error ? "" : "text-faint"}`}
      style={error ? { color: "oklch(0.75 0.16 40)" } : undefined}
    >
      {error ?? helper}
    </p>
  );
}

const controlBase =
  "w-full rounded-xl border border-line bg-ink-700 px-4 py-3 transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:opacity-60";
const inputClass = `${controlBase} text-bone`;

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 font-display text-sm font-medium text-bone">
      <span>{children}</span>
      {optional && <span className="text-xs font-normal text-faint">Optional</span>}
    </label>
  );
}

function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  helper,
  placeholder,
  autoComplete,
  inputMode,
  disabled,
}: {
  id: TextFieldName;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
}) {
  const inputId = `lead-${id}`;
  const helpId = `${inputId}-help`;
  return (
    <div className="lc-field flex flex-col gap-2">
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <input
        id={inputId}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={helpId}
        className={inputClass}
      />
      <HelpText id={helpId} error={error} helper={helper} />
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  max,
  optional,
  disabled,
}: {
  id: TextFieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  max: number;
  optional?: boolean;
  disabled?: boolean;
}) {
  const inputId = `lead-${id}`;
  const helpId = `${inputId}-help`;
  const near = value.length > max * 0.92;
  return (
    <div className="lc-field flex flex-col gap-2">
      <FieldLabel htmlFor={inputId} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        id={inputId}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={max}
        rows={3}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={helpId}
        className={`${inputClass} resize-none`}
      />
      <div className="flex items-center justify-between gap-3">
        <HelpText id={helpId} error={error} />
        <span className={`ml-auto text-xs tabular-nums ${near ? "text-accent" : "text-faint"}`}>
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  helper,
  placeholder,
  options,
  disabled,
}: {
  id: TextFieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
}) {
  const inputId = `lead-${id}`;
  const helpId = `${inputId}-help`;
  return (
    <div className="lc-field flex flex-col gap-2">
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={inputId}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={helpId}
          className={`${controlBase} appearance-none pr-11 ${value ? "text-bone" : "text-faint"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-bone">
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      <HelpText id={helpId} error={error} helper={helper} />
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  error,
  disabled,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const helpId = "lead-businessInterests-help";

  return (
    <fieldset className="lc-field flex flex-col gap-2" aria-describedby={helpId}>
      <legend className="font-display text-sm font-medium text-bone">{label}</legend>
      <p className="text-xs text-faint">Choose every option that applies.</p>
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm leading-snug transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${
                checked
                  ? "border-accent/50 bg-accent/10 text-bone"
                  : "border-line bg-ink-700 text-mute hover:border-accent/30"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="checkbox"
                name="businessInterests"
                value={option}
                checked={checked}
                onChange={() => onToggle(option)}
                disabled={disabled}
                className="sr-only"
              />
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  checked ? "border-accent bg-accent text-accent-ink" : "border-line"
                }`}
              >
                {checked ? <Check size={12} /> : null}
              </span>
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      <HelpText id={helpId} error={error} />
    </fieldset>
  );
}
