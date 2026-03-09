import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLeadRemote, createProposalRemote, createTaskRemote, fetchBootstrap } from "@/lib/api/os";
import { BootstrapPayload, IntegrationStatus, Lead, LeadInput, Proposal, ProposalInput, Task, TaskInput } from "@/types/os";
import { useOsStore } from "@/store/os-store";

const BOOTSTRAP_QUERY_KEY = ["os", "bootstrap"];

function getLocalBootstrap(): BootstrapPayload {
  const state = useOsStore.getState();

  return {
    leads: state.leads,
    proposals: state.proposals,
    tasks: state.tasks,
    integration: state.integration,
    syncedAt: state.syncedAt ?? new Date().toISOString(),
  };
}

function updateLocalSync(integration: IntegrationStatus, syncedAt: string) {
  useOsStore.setState({
    integration,
    syncedAt,
  });
}

function buildLocalIntegration(base: IntegrationStatus): IntegrationStatus {
  return {
    ...base,
    mode: "local",
    canWrite: false,
  };
}

function buildLocalLead(lead: LeadInput): Lead {
  return {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

function buildLocalProposal(proposal: ProposalInput): Proposal {
  return {
    ...proposal,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

function buildLocalTask(task: TaskInput): Task {
  return {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
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
  const addLeadEntity = useOsStore((state) => state.addLeadEntity);

  return useMutation({
    mutationFn: async (lead: LeadInput) => {
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
      addLeadEntity(result.item);
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
  const addProposalEntity = useOsStore((state) => state.addProposalEntity);

  return useMutation({
    mutationFn: async (proposal: ProposalInput) => {
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
      addProposalEntity(result.item);
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
  const addTaskEntity = useOsStore((state) => state.addTaskEntity);

  return useMutation({
    mutationFn: async (task: TaskInput) => {
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
      addTaskEntity(result.item);
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
