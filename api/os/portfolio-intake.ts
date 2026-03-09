import { ApiRequest, ApiResponse, Lead } from "../_lib/contracts.js";
import { createFollowUpEvent, getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { setJsonHeaders } from "../_lib/responses.js";
import { appendLeadToSheet } from "../_lib/sheets.js";

type PortfolioIntakeBody = {
  name?: string;
  email?: string;
  phone?: string;
  budget?: string;
  details?: string;
  company?: string;
};

function isPortfolioIntake(body: unknown): body is PortfolioIntakeBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return typeof candidate.name === "string" && typeof candidate.email === "string" && typeof candidate.details === "string";
}

function extractBudgetValue(budget: string | undefined) {
  if (!budget) {
    return 0;
  }

  const normalized = budget.replace(/\./g, "").replace(",", ".");
  const match = normalized.match(/R\$\s*([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function buildPortfolioLead(payload: PortfolioIntakeBody): Lead {
  const company = payload.company?.trim() || payload.name?.trim() || "Lead do portfolio";
  const nextContact = new Date();
  nextContact.setDate(nextContact.getDate() + 1);

  return {
    id: crypto.randomUUID(),
    name: payload.name?.trim() || "Lead do portfolio",
    company,
    segment: "Site / Portfolio",
    city: "",
    instagram: "",
    website: "https://wesdigitalstudio.vercel.app",
    phone: payload.phone?.trim() || "Nao informado",
    source: "Portfolio",
    status: "Novo lead",
    proposedValue: extractBudgetValue(payload.budget),
    notes: [
      "Origem: portfolio",
      `Email: ${payload.email?.trim() || "Nao informado"}`,
      `Budget informado: ${payload.budget?.trim() || "Nao informado"}`,
      "Briefing:",
      payload.details?.trim() || "Sem detalhes",
    ].join("\n"),
    nextContact: nextContact.toISOString().slice(0, 10),
    tags: ["Quente", "Aguardando retorno"],
    createdAt: new Date().toISOString(),
  };
}

function setCorsHeaders(response: ApiResponse) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setCorsHeaders(response);
  setJsonHeaders(response);

  if (request.method === "OPTIONS") {
    return response.status(200).json({ ok: true });
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (!isPortfolioIntake(request.body)) {
    return response.status(400).json({ error: "Invalid portfolio intake payload." });
  }

  const lead = buildPortfolioLead(request.body);
  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      item: lead,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendLeadToSheet(lead);
    await createFollowUpEvent(lead);

    return response.status(200).json({
      item: lead,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      item: lead,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `portfolio_intake_error:${error.message}` : "portfolio_intake_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
