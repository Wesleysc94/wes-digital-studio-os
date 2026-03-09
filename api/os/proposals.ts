import { ApiRequest, ApiResponse, Proposal } from "../_lib/contracts.js";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import { appendProposalToSheet } from "../_lib/sheets.js";

type ProposalMutationBody = Omit<Proposal, "id" | "createdAt"> & Partial<Pick<Proposal, "id" | "createdAt">>;

function isProposalBody(body: unknown): body is ProposalMutationBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return typeof candidate.clientName === "string" && typeof candidate.company === "string";
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isProposalBody(request.body)) {
    return response.status(400).json({ error: "Invalid proposal payload." });
  }

  const proposalBody = request.body;
  const proposal: Proposal = {
    ...proposalBody,
    customTitle: proposalBody.customTitle ?? "",
    implementationOverride: proposalBody.implementationOverride ?? null,
    recurringOverride: proposalBody.recurringOverride ?? null,
    pricingNotes: proposalBody.pricingNotes ?? "",
    id: proposalBody.id ?? crypto.randomUUID(),
    createdAt: proposalBody.createdAt ?? new Date().toISOString(),
  };

  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      item: proposal,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendProposalToSheet(proposal);

    return response.status(200).json({
      item: proposal,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      item: proposal,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `proposal_write_error:${error.message}` : "proposal_write_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
