import { ApiRequest, ApiResponse, Lead } from "../_lib/contracts";
import { createFollowUpEvent, getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses";
import { appendLeadToSheet } from "../_lib/sheets";

function isLeadBody(body: unknown): body is Omit<Lead, "id" | "createdAt"> {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return typeof candidate.name === "string" && typeof candidate.company === "string" && typeof candidate.phone === "string";
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isLeadBody(request.body)) {
    return response.status(400).json({ error: "Invalid lead payload." });
  }

  const lead: Lead = {
    ...request.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

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
        error instanceof Error ? `lead_write_error:${error.message}` : "lead_write_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
