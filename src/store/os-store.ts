import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  ArchiveEntry,
  BootstrapPayload,
  CompletedProject,
  IntegrationStatus,
  Lead,
  Project,
  Proposal,
  Task,
} from "@/types/os";

const defaultIntegration: IntegrationStatus = {
  mode: "local",
  googleSheetsConfigured: false,
  googleCalendarConfigured: false,
  canWrite: false,
  missing: ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_CALENDAR_ID"],
};

type UpsertableEntity = { id: string };

function upsertById<T extends UpsertableEntity>(collection: T[], item: T) {
  return [item, ...collection.filter((currentItem) => currentItem.id !== item.id)];
}

function mergeManyById<T extends UpsertableEntity>(collection: T[], items: T[]) {
  return items.reduce((result, item) => upsertById(result, item), collection);
}

interface OsState {
  leads: Lead[];
  proposals: Proposal[];
  tasks: Task[];
  projects: Project[];
  archive: ArchiveEntry[];
  completedProjects: CompletedProject[];
  integration: IntegrationStatus;
  syncedAt: string | null;
  hydrateFromBootstrap: (payload: BootstrapPayload) => void;
  upsertLeadEntity: (lead: Lead) => void;
  upsertProposalEntity: (proposal: Proposal) => void;
  upsertTaskEntity: (task: Task) => void;
  upsertProjectEntity: (project: Project) => void;
  archiveLeadEntity: (lead: Lead, archiveItem: ArchiveEntry) => void;
  completeProjectEntity: (project: Project, completedProject: CompletedProject) => void;
  setIntegrationState: (integration: IntegrationStatus, syncedAt: string) => void;
  toggleTaskStatus: (taskId: string) => void;
}

export const useOsStore = create<OsState>()(
  persist(
    (set) => ({
      leads: [],
      proposals: [],
      tasks: [],
      projects: [],
      archive: [],
      completedProjects: [],
      integration: defaultIntegration,
      syncedAt: null,
      hydrateFromBootstrap: (payload) =>
        set(() => ({
          leads: payload.leads,
          proposals: payload.proposals,
          tasks: payload.tasks,
          projects: payload.projects,
          archive: payload.archive,
          completedProjects: payload.completedProjects,
          integration: payload.integration,
          syncedAt: payload.syncedAt,
        })),
      upsertLeadEntity: (lead) =>
        set((state) => ({
          leads: upsertById(state.leads, lead),
        })),
      upsertProposalEntity: (proposal) =>
        set((state) => ({
          proposals: upsertById(state.proposals, proposal),
        })),
      upsertTaskEntity: (task) =>
        set((state) => ({
          tasks: upsertById(state.tasks, task),
        })),
      upsertProjectEntity: (project) =>
        set((state) => ({
          projects: upsertById(state.projects, project),
        })),
      archiveLeadEntity: (lead, archiveItem) =>
        set((state) => ({
          leads: upsertById(state.leads, lead),
          archive: upsertById(state.archive, archiveItem),
        })),
      completeProjectEntity: (project, completedProject) =>
        set((state) => ({
          projects: upsertById(state.projects, project),
          completedProjects: upsertById(state.completedProjects, completedProject),
        })),
      setIntegrationState: (integration, syncedAt) =>
        set(() => ({
          integration,
          syncedAt,
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
      partialize: (state) => ({
        leads: state.leads,
        proposals: state.proposals,
        tasks: state.tasks,
        projects: state.projects,
        archive: state.archive,
        completedProjects: state.completedProjects,
        integration: state.integration,
        syncedAt: state.syncedAt,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<OsState>),
        leads: mergeManyById(currentState.leads, (persistedState as Partial<OsState>)?.leads ?? []),
        proposals: mergeManyById(currentState.proposals, (persistedState as Partial<OsState>)?.proposals ?? []),
        tasks: mergeManyById(currentState.tasks, (persistedState as Partial<OsState>)?.tasks ?? []),
        projects: mergeManyById(currentState.projects, (persistedState as Partial<OsState>)?.projects ?? []),
        archive: mergeManyById(currentState.archive, (persistedState as Partial<OsState>)?.archive ?? []),
        completedProjects: mergeManyById(currentState.completedProjects, (persistedState as Partial<OsState>)?.completedProjects ?? []),
      }),
    },
  ),
);
