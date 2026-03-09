import { ApiRequest, ApiResponse, BootstrapPayload } from "../_lib/contracts.js";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { mockArchive, mockCompletedProjects, mockLeads, mockProjects, mockProposals, mockTasks } from "../_lib/mock-data.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import {
  readArchiveFromSheet,
  readCompletedProjectsFromSheet,
  readLeadsFromSheet,
  readProjectsFromSheet,
  readProposalsFromSheet,
  readTasksFromSheet,
} from "../_lib/sheets.js";

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
      projects: mockProjects,
      archive: mockArchive,
      completedProjects: mockCompletedProjects,
      integration,
      syncedAt: new Date().toISOString(),
    };

    return response.status(200).json(payload);
  }

  try {
    const [leads, proposals, tasks, projects, archive, completedProjects] = await Promise.all([
      readLeadsFromSheet(),
      readProposalsFromSheet(),
      readTasksFromSheet(),
      readProjectsFromSheet(),
      readArchiveFromSheet(),
      readCompletedProjectsFromSheet(),
    ]);

    const payload: BootstrapPayload = {
      leads,
      proposals,
      tasks,
      projects,
      archive,
      completedProjects,
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
      projects: mockProjects,
      archive: mockArchive,
      completedProjects: mockCompletedProjects,
      integration: degradedIntegration,
      syncedAt: new Date().toISOString(),
    };

    return response.status(200).json(payload);
  }
}
