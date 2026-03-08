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

export interface IntegrationStatus {
  mode: IntegrationMode;
  googleSheetsConfigured: boolean;
  googleCalendarConfigured: boolean;
  canWrite: boolean;
  missing: string[];
}

export interface BootstrapPayload {
  leads: Lead[];
  proposals: Proposal[];
  tasks: Task[];
  integration: IntegrationStatus;
  syncedAt: string;
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
