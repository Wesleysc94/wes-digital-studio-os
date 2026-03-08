import { ApiResponse } from "./contracts.js";

export function setJsonHeaders(response: ApiResponse) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
}

export function methodNotAllowed(response: ApiResponse, allowedMethod: string) {
  response.setHeader("Allow", allowedMethod);
  return response.status(405).json({ error: `Method not allowed. Use ${allowedMethod}.` });
}
