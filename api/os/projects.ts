import { ApiRequest, ApiResponse, Project } from "../_lib/contracts.js";
import { createProjectDeadlineEvent, getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google.js";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses.js";
import { appendProjectToSheet } from "../_lib/sheets.js";

type ProjectMutationBody = Omit<Project, "id" | "createdAt"> & Partial<Pick<Project, "id" | "createdAt">>;

function isProjectBody(body: unknown): body is ProjectMutationBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return typeof candidate.clientName === "string" && typeof candidate.company === "string" && typeof candidate.dueDate === "string";
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isProjectBody(request.body)) {
    return response.status(400).json({ error: "Invalid project payload." });
  }

  const project: Project = {
    ...request.body,
    id: request.body.id ?? crypto.randomUUID(),
    createdAt: request.body.createdAt ?? new Date().toISOString(),
  };

  const integration = getIntegrationStatus();
  const isNewProject = !request.body.id;

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      item: project,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendProjectToSheet(project);

    if (isNewProject) {
      await createProjectDeadlineEvent(project);
    }

    return response.status(200).json({
      item: project,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      item: project,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `project_write_error:${error.message}` : "project_write_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
