import { ApiRequest, ApiResponse, ArchiveEntry, ArchiveLeadInput, Lead } from "../_lib/contracts.js";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import { appendArchiveToSheet, appendLeadToSheet } from "../_lib/sheets.js";

function isArchiveBody(body: unknown): body is ArchiveLeadInput {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return Boolean(candidate.lead && typeof candidate.reason === "string" && typeof candidate.notes === "string");
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isArchiveBody(request.body)) {
    return response.status(400).json({ error: "Invalid archive payload." });
  }

  const archivedLead: Lead = {
    ...request.body.lead,
    status: "Perdido",
  };

  const archiveItem: ArchiveEntry = {
    id: crypto.randomUUID(),
    leadId: request.body.lead.id,
    name: request.body.lead.name,
    company: request.body.lead.company,
    statusAtArchive: archivedLead.status,
    reason: request.body.reason,
    notes: request.body.notes,
    archivedAt: new Date().toISOString(),
  };

  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      lead: archivedLead,
      archiveItem,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendLeadToSheet(archivedLead);
    await appendArchiveToSheet(archiveItem);

    return response.status(200).json({
      lead: archivedLead,
      archiveItem,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      lead: archivedLead,
      archiveItem,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `archive_write_error:${error.message}` : "archive_write_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
