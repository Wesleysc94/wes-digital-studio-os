import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveLeadRemote,
  completeProjectRemote,
  createLeadRemote,
  createProjectRemote,
  createProposalRemote,
  createTaskRemote,
  fetchBootstrap,
} from "@/lib/api/os";
import {
  ArchiveEntry,
  ArchiveLeadInput,
  BootstrapPayload,
  CompleteProjectInput,
  CompletedProject,
  IntegrationStatus,
  Lead,
  LeadMutationInput,
  Project,
  ProjectMutationInput,
  Proposal,
  ProposalMutationInput,
  Task,
  TaskMutationInput,
} from "@/types/os";
import { useOsStore } from "@/store/os-store";

const BOOTSTRAP_QUERY_KEY = ["os", "bootstrap"];

function getLocalBootstrap(): BootstrapPayload {
  const state = useOsStore.getState();

  return {
    leads: state.leads,
    proposals: state.proposals,
    tasks: state.tasks,
    projects: state.projects,
    archive: state.archive,
    completedProjects: state.completedProjects,
    integration: state.integration,
    syncedAt: state.syncedAt ?? new Date().toISOString(),
  };
}

function updateLocalSync(integration: IntegrationStatus, syncedAt: string) {
  useOsStore.getState().setIntegrationState(integration, syncedAt);
}

function buildLocalIntegration(base: IntegrationStatus): IntegrationStatus {
  return {
    ...base,
    mode: "local",
    canWrite: false,
  };
}

function buildLocalLead(lead: LeadMutationInput): Lead {
  return {
    ...lead,
    id: lead.id ?? crypto.randomUUID(),
    createdAt: lead.createdAt ?? new Date().toISOString(),
  };
}

function buildLocalProposal(proposal: ProposalMutationInput): Proposal {
  return {
    ...proposal,
    id: proposal.id ?? crypto.randomUUID(),
    createdAt: proposal.createdAt ?? new Date().toISOString(),
  };
}

function buildLocalTask(task: TaskMutationInput): Task {
  return {
    ...task,
    id: task.id ?? crypto.randomUUID(),
    createdAt: task.createdAt ?? new Date().toISOString(),
  };
}

function buildLocalProject(project: ProjectMutationInput): Project {
  return {
    ...project,
    id: project.id ?? crypto.randomUUID(),
    createdAt: project.createdAt ?? new Date().toISOString(),
  };
}

function buildArchiveEntry(input: ArchiveLeadInput): { lead: Lead; archiveItem: ArchiveEntry } {
  const archivedLead: Lead = {
    ...input.lead,
    status: "Perdido",
  };

  return {
    lead: archivedLead,
    archiveItem: {
      id: crypto.randomUUID(),
      leadId: input.lead.id,
      name: input.lead.name,
      company: input.lead.company,
      statusAtArchive: archivedLead.status,
      reason: input.reason,
      notes: input.notes,
      archivedAt: new Date().toISOString(),
    },
  };
}

function buildCompletedProject(input: CompleteProjectInput): { project: Project; completedProject: CompletedProject } {
  const completedAt = input.deliveredAt || new Date().toISOString().slice(0, 10);
  const completedProject: CompletedProject = {
    id: crypto.randomUUID(),
    projectId: input.project.id,
    clientName: input.project.clientName,
    company: input.project.company,
    projectType: input.project.projectType,
    implementationTotal: input.project.implementationTotal,
    monthlyRecurring: input.project.monthlyRecurring,
    deliveredAt: completedAt,
    notes: input.notes,
    deliverySummary: input.deliverySummary,
  };

  return {
    project: {
      ...input.project,
      status: "Concluido",
      notes: input.notes || input.project.notes,
      deliverySummary: input.deliverySummary || input.project.deliverySummary,
    },
    completedProject,
  };
}

export function useOsBootstrap() {
  const hydrateFromBootstrap = useOsStore((state) => state.hydrateFromBootstrap);

  const query = useQuery({
    queryKey: BOOTSTRAP_QUERY_KEY,
    queryFn: async () => {
      try {
        return await fetchBootstrap();
      } catch {
        return getLocalBootstrap();
      }
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      hydrateFromBootstrap(query.data);
    }
  }, [query.data, hydrateFromBootstrap]);

  return query;
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();
  const upsertLeadEntity = useOsStore((state) => state.upsertLeadEntity);

  return useMutation({
    mutationFn: async (lead: LeadMutationInput) => {
      try {
        return await createLeadRemote(lead);
      } catch {
        const item = buildLocalLead(lead);
        const bootstrap = getLocalBootstrap();

        return {
          item,
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      upsertLeadEntity(result.item);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          leads: [result.item, ...base.leads.filter((lead) => lead.id !== result.item.id)],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}

export function useCreateProposalMutation() {
  const queryClient = useQueryClient();
  const upsertProposalEntity = useOsStore((state) => state.upsertProposalEntity);

  return useMutation({
    mutationFn: async (proposal: ProposalMutationInput) => {
      try {
        return await createProposalRemote(proposal);
      } catch {
        const item = buildLocalProposal(proposal);
        const bootstrap = getLocalBootstrap();

        return {
          item,
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      upsertProposalEntity(result.item);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          proposals: [result.item, ...base.proposals.filter((proposal) => proposal.id !== result.item.id)],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  const upsertTaskEntity = useOsStore((state) => state.upsertTaskEntity);

  return useMutation({
    mutationFn: async (task: TaskMutationInput) => {
      try {
        return await createTaskRemote(task);
      } catch {
        const item = buildLocalTask(task);
        const bootstrap = getLocalBootstrap();

        return {
          item,
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      upsertTaskEntity(result.item);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          tasks: [result.item, ...base.tasks.filter((task) => task.id !== result.item.id)],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  const upsertProjectEntity = useOsStore((state) => state.upsertProjectEntity);

  return useMutation({
    mutationFn: async (project: ProjectMutationInput) => {
      try {
        return await createProjectRemote(project);
      } catch {
        const item = buildLocalProject(project);
        const bootstrap = getLocalBootstrap();

        return {
          item,
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      upsertProjectEntity(result.item);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          projects: [result.item, ...base.projects.filter((project) => project.id !== result.item.id)],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}

export function useArchiveLeadMutation() {
  const queryClient = useQueryClient();
  const archiveLeadEntity = useOsStore((state) => state.archiveLeadEntity);

  return useMutation({
    mutationFn: async (payload: ArchiveLeadInput) => {
      try {
        return await archiveLeadRemote(payload);
      } catch {
        const bootstrap = getLocalBootstrap();
        return {
          ...buildArchiveEntry(payload),
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      archiveLeadEntity(result.lead, result.archiveItem);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          leads: [result.lead, ...base.leads.filter((lead) => lead.id !== result.lead.id)],
          archive: [result.archiveItem, ...base.archive.filter((item) => item.id !== result.archiveItem.id)],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}

export function useCompleteProjectMutation() {
  const queryClient = useQueryClient();
  const completeProjectEntity = useOsStore((state) => state.completeProjectEntity);

  return useMutation({
    mutationFn: async (payload: CompleteProjectInput) => {
      try {
        return await completeProjectRemote(payload);
      } catch {
        const bootstrap = getLocalBootstrap();
        return {
          ...buildCompletedProject(payload),
          integration: buildLocalIntegration(bootstrap.integration),
          syncedAt: new Date().toISOString(),
          persisted: false,
        };
      }
    },
    onSuccess: (result) => {
      completeProjectEntity(result.project, result.completedProject);
      updateLocalSync(result.integration, result.syncedAt);
      queryClient.setQueryData<BootstrapPayload>(BOOTSTRAP_QUERY_KEY, (current) => {
        const base = current ?? getLocalBootstrap();

        return {
          ...base,
          projects: [result.project, ...base.projects.filter((project) => project.id !== result.project.id)],
          completedProjects: [
            result.completedProject,
            ...base.completedProjects.filter((project) => project.id !== result.completedProject.id),
          ],
          integration: result.integration,
          syncedAt: result.syncedAt,
        };
      });
    },
  });
}
