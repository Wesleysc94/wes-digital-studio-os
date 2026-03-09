export type IntegrationMode = "local" | "mock" | "google";

export interface Lead {
  id: string;
  name: string;
  company: string;
  segment: string;
  city: string;
  instagram: string;
  website: string;
  phone: string;
  source: string;
  status: string;
  proposedValue: number;
  notes: string;
  nextContact: string;
  tags: string[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  clientName: string;
  company: string;
  projectType: string;
  extras: string[];
  implementationTotal: number;
  monthlyRecurring: number;
  summary: string;
  createdAt: string;
  status: string;
  customTitle: string;
  implementationOverride: number | null;
  recurringOverride: number | null;
  pricingNotes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  relatedClient: string;
  dueDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  leadId: string;
  proposalId: string;
  clientName: string;
  company: string;
  projectType: string;
  status: string;
  implementationTotal: number;
  monthlyRecurring: number;
  dueDate: string;
  nextMilestone: string;
  maintenanceActive: boolean;
  notes: string;
  deliverySummary: string;
  createdAt: string;
}

export interface ArchiveEntry {
  id: string;
  leadId: string;
  name: string;
  company: string;
  statusAtArchive: string;
  reason: string;
  notes: string;
  archivedAt: string;
}

export interface CompletedProject {
  id: string;
  projectId: string;
  clientName: string;
  company: string;
  projectType: string;
  implementationTotal: number;
  monthlyRecurring: number;
  deliveredAt: string;
  notes: string;
  deliverySummary: string;
}

export interface IntegrationStatus {
  mode: IntegrationMode;
  googleSheetsConfigured: boolean;
  googleCalendarConfigured: boolean;
  canWrite: boolean;
  missing: string[];
  spreadsheetId?: string;
  calendarId?: string;
}

export interface BootstrapPayload {
  leads: Lead[];
  proposals: Proposal[];
  tasks: Task[];
  projects: Project[];
  archive: ArchiveEntry[];
  completedProjects: CompletedProject[];
  integration: IntegrationStatus;
  syncedAt: string;
}

export interface ArchiveLeadInput {
  lead: Lead;
  reason: string;
  notes: string;
}

export interface CompleteProjectInput {
  project: Project;
  notes: string;
  deliverySummary: string;
  deliveredAt: string;
}

export type ApiRequest = {
  method?: string;
  body?: unknown;
};

export type ApiResponse = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export const LEADS_HEADERS = [
  "id",
  "name",
  "company",
  "segment",
  "city",
  "instagram",
  "website",
  "phone",
  "source",
  "status",
  "proposedValue",
  "notes",
  "nextContact",
  "tags",
  "createdAt",
] as const;

export const PROPOSALS_HEADERS = [
  "id",
  "clientName",
  "company",
  "projectType",
  "extras",
  "implementationTotal",
  "monthlyRecurring",
  "summary",
  "createdAt",
  "status",
  "customTitle",
  "implementationOverride",
  "recurringOverride",
  "pricingNotes",
] as const;

export const TASKS_HEADERS = [
  "id",
  "title",
  "description",
  "priority",
  "status",
  "relatedClient",
  "dueDate",
  "createdAt",
] as const;

export const PROJECTS_HEADERS = [
  "id",
  "leadId",
  "proposalId",
  "clientName",
  "company",
  "projectType",
  "status",
  "implementationTotal",
  "monthlyRecurring",
  "dueDate",
  "nextMilestone",
  "maintenanceActive",
  "notes",
  "deliverySummary",
  "createdAt",
] as const;

export const ARCHIVE_HEADERS = [
  "id",
  "leadId",
  "name",
  "company",
  "statusAtArchive",
  "reason",
  "notes",
  "archivedAt",
] as const;

export const COMPLETED_PROJECTS_HEADERS = [
  "id",
  "projectId",
  "clientName",
  "company",
  "projectType",
  "implementationTotal",
  "monthlyRecurring",
  "deliveredAt",
  "notes",
  "deliverySummary",
] as const;
