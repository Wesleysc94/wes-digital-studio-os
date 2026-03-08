import { ApiRequest, ApiResponse, Proposal } from "../_lib/contracts";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses";
import { appendProposalToSheet } from "../_lib/sheets";

function isProposalBody(body: unknown): body is Omit<Proposal, "id" | "createdAt"> {
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

  const proposal: Proposal = {
    ...request.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
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
