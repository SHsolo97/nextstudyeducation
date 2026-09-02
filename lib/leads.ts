export type IndividualLead = {
  inquiryType: "Individual";
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  productInterest: string;
  needs: string;
};

export type BusinessLead = {
  inquiryType: "Business";
  contactName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  programsOfInterest: string[];
  teamSize: string;
  requirements: string;
};

export type LeadPayload = IndividualLead | BusinessLead;

export async function submitLead(payload: LeadPayload) {
  let response: Response;

  try {
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    // A browser can lose the response after the server has already stored the
    // lead. Treat that ambiguous network result as submitted so the visitor
    // does not retry and create a duplicate row.
    if (error instanceof TypeError) return;
    throw error;
  }

  if (!response.ok) {
    throw new Error("We couldn't send your inquiry. Please try again.");
  }
}
