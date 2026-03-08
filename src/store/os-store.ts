import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mockLeads, mockProposals, mockTasks } from "@/data/mock-operations";
import { BootstrapPayload, IntegrationStatus, Lead, LeadInput, LeadStatus, Proposal, ProposalInput, Task, TaskInput } from "@/types/os";

const defaultIntegration: IntegrationStatus = {
  mode: "local",
  googleSheetsConfigured: false,
  googleCalendarConfigured: false,
  canWrite: false,
  missing: ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_CALENDAR_ID"],
};

interface OsState {
  leads: Lead[];
  proposals: Proposal[];
  tasks: Task[];
  integration: IntegrationStatus;
  syncedAt: string | null;
  hydrateFromBootstrap: (payload: BootstrapPayload) => void;
  addLeadEntity: (lead: Lead) => void;
  addProposalEntity: (proposal: Proposal) => void;
  addTaskEntity: (task: Task) => void;
  addLead: (lead: LeadInput) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addProposal: (proposal: ProposalInput) => void;
  addTask: (task: TaskInput) => void;
  toggleTaskStatus: (taskId: string) => void;
}

export const useOsStore = create<OsState>()(
  persist(
    (set) => ({
      leads: mockLeads,
      proposals: mockProposals,
      tasks: mockTasks,
      integration: defaultIntegration,
      syncedAt: null,
      hydrateFromBootstrap: (payload) =>
        set(() => ({
          leads: payload.leads,
          proposals: payload.proposals,
          tasks: payload.tasks,
          integration: payload.integration,
          syncedAt: payload.syncedAt,
        })),
      addLeadEntity: (lead) =>
        set((state) => ({
          leads: [lead, ...state.leads.filter((currentLead) => currentLead.id !== lead.id)],
        })),
      addProposalEntity: (proposal) =>
        set((state) => ({
          proposals: [proposal, ...state.proposals.filter((currentProposal) => currentProposal.id !== proposal.id)],
        })),
      addTaskEntity: (task) =>
        set((state) => ({
          tasks: [task, ...state.tasks.filter((currentTask) => currentTask.id !== task.id)],
        })),
      addLead: (lead) =>
        set((state) => ({
          leads: [
            {
              ...lead,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.leads,
          ],
        })),
      updateLeadStatus: (leadId, status) =>
        set((state) => ({
          leads: state.leads.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
        })),
      addProposal: (proposal) =>
        set((state) => ({
          proposals: [
            {
              ...proposal,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.proposals,
          ],
        })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),
      toggleTaskStatus: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: task.status === "Concluida" ? "Aberta" : "Concluida",
                }
              : task,
          ),
        })),
    }),
    {
      name: "wes-digital-studio-os-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
