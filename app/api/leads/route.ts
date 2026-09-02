import type { LeadPayload } from "@/lib/leads";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 750;

function isRequiredText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isOptionalText(value: unknown) {
  return typeof value === "string" && value.length <= MAX_MESSAGE_LENGTH;
}

function isEmail(value: unknown) {
  return isRequiredText(value, 180) && EMAIL_RE.test(value.trim());
}

function isPhone(value: unknown) {
  return typeof value === "string" && /^\+?[\d\s().-]{7,24}$/.test(value.trim());
}

function isLeadPayload(value: unknown): value is LeadPayload {
  if (!value || typeof value !== "object") return false;
  const lead = value as Record<string, unknown>;

  if (lead.inquiryType === "Individual") {
    return isRequiredText(lead.firstName, 80) && isRequiredText(lead.lastName, 80) &&
      isEmail(lead.email) && isPhone(lead.whatsapp) &&
      isRequiredText(lead.productInterest, 180) && isOptionalText(lead.needs);
  }

  if (lead.inquiryType === "Business") {
    return isRequiredText(lead.contactName, 120) && isRequiredText(lead.companyName, 180) &&
      isEmail(lead.workEmail) && isPhone(lead.phone) &&
      Array.isArray(lead.programsOfInterest) && lead.programsOfInterest.length > 0 &&
      lead.programsOfInterest.length <= 12 &&
      lead.programsOfInterest.every((item) => isRequiredText(item, 180)) &&
      isRequiredText(lead.teamSize, 80) && isOptionalText(lead.requirements);
  }

  return false;
}

function normaliseLead(lead: LeadPayload): LeadPayload {
  if (lead.inquiryType === "Individual") {
    return {
      inquiryType: "Individual",
      firstName: lead.firstName.trim(),
      lastName: lead.lastName.trim(),
      email: lead.email.trim().toLowerCase(),
      whatsapp: lead.whatsapp.trim(),
      productInterest: lead.productInterest.trim(),
      needs: lead.needs.trim(),
    };
  }

  return {
    inquiryType: "Business",
    contactName: lead.contactName.trim(),
    companyName: lead.companyName.trim(),
    workEmail: lead.workEmail.trim().toLowerCase(),
    phone: lead.phone.trim(),
    programsOfInterest: lead.programsOfInterest.map((item) => item.trim()),
    teamSize: lead.teamSize.trim(),
    requirements: lead.requirements.trim(),
  };
}

export async function POST(request: Request) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_LEADS_URL;
  const apiSecret = process.env.GOOGLE_APPS_SCRIPT_LEADS_SECRET;

  if (!endpoint || !apiSecret) {
    console.error("Google Apps Script lead endpoint is not configured.");
    return Response.json({ error: "Lead service is not configured." }, { status: 503 });
  }

  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 20_000) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }

    const value: unknown = await request.json();
    if (!isLeadPayload(value)) {
      return Response.json({ error: "Invalid lead details." }, { status: 400 });
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...normaliseLead(value), apiSecret }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) throw new Error(`Apps Script responded with ${upstream.status}.`);

    const result: unknown = await upstream.json();
    if (
      !result ||
      typeof result !== "object" ||
      (result as Record<string, unknown>).status !== "success"
    ) {
      throw new Error("Apps Script rejected the lead.");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lead submission failed:", error);
    return Response.json({ error: "Unable to store the lead." }, { status: 502 });
  }
}
