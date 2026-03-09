import { ApiRequest, ApiResponse, CompleteProjectInput, CompletedProject, Project } from "../_lib/contracts.js";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import { appendCompletedProjectToSheet, appendProjectToSheet } from "../_lib/sheets.js";

function isCompleteBody(body: unknown): body is CompleteProjectInput {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return Boolean(candidate.project && typeof candidate.deliverySummary === "string" && typeof candidate.notes === "string");
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isCompleteBody(request.body)) {
    return response.status(400).json({ error: "Invalid completion payload." });
  }

  const deliveredAt = request.body.deliveredAt || new Date().toISOString().slice(0, 10);
  const project: Project = {
    ...request.body.project,
    status: "Concluido",
    notes: request.body.notes || request.body.project.notes,
    deliverySummary: request.body.deliverySummary || request.body.project.deliverySummary,
  };

  const completedProject: CompletedProject = {
    id: crypto.randomUUID(),
    projectId: project.id,
    clientName: project.clientName,
    company: project.company,
    projectType: project.projectType,
    implementationTotal: project.implementationTotal,
    monthlyRecurring: project.monthlyRecurring,
    deliveredAt,
    notes: request.body.notes,
    deliverySummary: request.body.deliverySummary,
  };

  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      project,
      completedProject,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendProjectToSheet(project);
    await appendCompletedProjectToSheet(completedProject);

    return response.status(200).json({
      project,
      completedProject,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      project,
      completedProject,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `project_complete_error:${error.message}` : "project_complete_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
