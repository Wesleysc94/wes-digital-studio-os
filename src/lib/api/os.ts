import {
  ArchiveLeadInput,
  BootstrapPayload,
  CompleteProjectInput,
  IntegrationStatus,
  Lead,
  LeadMutationInput,
  Project,
  ProjectMutationInput,
  Proposal,
  ProposalMutationInput,
  Task,
  TaskMutationInput,
  ArchiveEntry,
  CompletedProject,
} from "@/types/os";

type EntityMutationResponse<T> = {
  item: T;
  integration: IntegrationStatus;
  syncedAt: string;
  persisted: boolean;
};

type ArchiveMutationResponse = {
  lead: Lead;
  archiveItem: ArchiveEntry;
  integration: IntegrationStatus;
  syncedAt: string;
  persisted: boolean;
};

type CompleteProjectResponse = {
  project: Project;
  completedProject: CompletedProject;
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

export async function createLeadRemote(lead: LeadMutationInput) {
  const response = await fetch("/api/os/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  return parseJson<EntityMutationResponse<Lead>>(response);
}

export async function createProposalRemote(proposal: ProposalMutationInput) {
  const response = await fetch("/api/os/proposals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return parseJson<EntityMutationResponse<Proposal>>(response);
}

export async function createTaskRemote(task: TaskMutationInput) {
  const response = await fetch("/api/os/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return parseJson<EntityMutationResponse<Task>>(response);
}

export async function createProjectRemote(project: ProjectMutationInput) {
  const response = await fetch("/api/os/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  return parseJson<EntityMutationResponse<Project>>(response);
}

export async function archiveLeadRemote(payload: ArchiveLeadInput) {
  const response = await fetch("/api/os/archive", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson<ArchiveMutationResponse>(response);
}

export async function completeProjectRemote(payload: CompleteProjectInput) {
  const response = await fetch("/api/os/projects-complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson<CompleteProjectResponse>(response);
}
