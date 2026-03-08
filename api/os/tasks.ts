import { ApiRequest, ApiResponse, Task } from "../_lib/contracts";
import { getIntegrationStatus, isGoogleSheetsConfigured, withRuntimeError } from "../_lib/google";
import { methodNotAllowed, setJsonHeaders } from "../_lib/responses";
import { appendTaskToSheet } from "../_lib/sheets";

function isTaskBody(body: unknown): body is Omit<Task, "id" | "createdAt"> {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return typeof candidate.title === "string" && typeof candidate.description === "string";
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setJsonHeaders(response);

  if (request.method !== "POST") {
    return methodNotAllowed(response, "POST");
  }

  if (!isTaskBody(request.body)) {
    return response.status(400).json({ error: "Invalid task payload." });
  }

  const task: Task = {
    ...request.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const integration = getIntegrationStatus();

  if (!isGoogleSheetsConfigured()) {
    return response.status(200).json({
      item: task,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }

  try {
    await appendTaskToSheet(task);

    return response.status(200).json({
      item: task,
      integration,
      syncedAt: new Date().toISOString(),
      persisted: true,
    });
  } catch (error) {
    return response.status(200).json({
      item: task,
      integration: withRuntimeError(
        integration,
        error instanceof Error ? `task_write_error:${error.message}` : "task_write_error",
      ),
      syncedAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
