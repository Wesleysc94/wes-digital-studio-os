import { BootstrapPayload, IntegrationStatus, Lead, LeadInput, Proposal, ProposalInput, Task, TaskInput } from "@/types/os";

type EntityMutationResponse<T> = {
  item: T;
  integration: IntegrationStatus;
  syncedAt: string;
  persisted: boolean;
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchBootstrap(): Promise<BootstrapPayload> {
  const response = await fetch("/api/os/bootstrap");
  return parseJson<BootstrapPayload>(response);
}

export async function createLeadRemote(lead: LeadInput) {
  const response = await fetch("/api/os/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  return parseJson<EntityMutationResponse<Lead>>(response);
}

export async function createProposalRemote(proposal: ProposalInput) {
  const response = await fetch("/api/os/proposals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return parseJson<EntityMutationResponse<Proposal>>(response);
}

export async function createTaskRemote(task: TaskInput) {
  const response = await fetch("/api/os/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return parseJson<EntityMutationResponse<Task>>(response);
}
