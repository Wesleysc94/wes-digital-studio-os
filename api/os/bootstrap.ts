import { ApiRequest, ApiResponse, BootstrapPayload } from "../_lib/contracts.js";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { mockLeads, mockProposals, mockTasks } from "../_lib/mock-data.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import { readLeadsFromSheet, readProposalsFromSheet, readTasksFromSheet } from "../_lib/sheets.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "GET") {
    return methodNotAllowed(response, "GET");
  }

  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    const payload: BootstrapPayload = {
      leads: mockLeads,
      proposals: mockProposals,
      tasks: mockTasks,
      integration,
      syncedAt: new Date().toISOString(),
    };

    return response.status(200).json(payload);
  }

  try {
    const [leads, proposals, tasks] = await Promise.all([
      readLeadsFromSheet(),
      readProposalsFromSheet(),
      readTasksFromSheet(),
    ]);

    const payload: BootstrapPayload = {
      leads,
      proposals,
      tasks,
      integration,
      syncedAt: new Date().toISOString(),
    };

    return response.status(200).json(payload);
  } catch (error) {
    const degradedIntegration = withRuntimeError(
      integration,
      error instanceof Error ? `sheets_runtime_error:${error.message}` : "sheets_runtime_error",
    );

    const payload: BootstrapPayload = {
      leads: mockLeads,
      proposals: mockProposals,
      tasks: mockTasks,
      integration: degradedIntegration,
      syncedAt: new Date().toISOString(),
    };

    return response.status(200).json(payload);
  }
}
