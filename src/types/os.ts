export type ThemeMode = "dark" | "light" | "ruby" | "gold";
export type IntegrationMode = "local" | "mock" | "google";

export const LEAD_STATUS_OPTIONS = [
  "Novo lead",
  "Em conversa",
  "Proposta enviada",
  "Aguardando resposta",
  "Fechado",
  "Perdido",
] as const;

export const LEAD_TAG_OPTIONS = [
  "Quente",
  "Frio",
  "Sem resposta",
  "Orcamento enviado",
  "Aguardando retorno",
] as const;

export const PROJECT_PLAN_KEYS = ["landing-essencial", "site-institucional"] as const;

export const PROPOSAL_EXTRA_KEYS = [
  "tema-adicional",
  "manutencao-mensal",
  "entrega-codigo",
] as const;

export const PROPOSAL_STATUS_OPTIONS = ["draft", "sent", "accepted"] as const;

export const TASK_PRIORITY_OPTIONS = ["Baixa", "Media", "Alta"] as const;

export const TASK_STATUS_OPTIONS = ["Aberta", "Em andamento", "Concluida"] as const;

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number];
export type LeadTag = (typeof LEAD_TAG_OPTIONS)[number];
export type ProjectPlanKey = (typeof PROJECT_PLAN_KEYS)[number];
export type ProposalExtraKey = (typeof PROPOSAL_EXTRA_KEYS)[number];
export type ProposalStatus = (typeof PROPOSAL_STATUS_OPTIONS)[number];
export type TaskPriority = (typeof TASK_PRIORITY_OPTIONS)[number];
export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];

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
  status: LeadStatus;
  proposedValue: number;
  notes: string;
  nextContact: string;
  tags: LeadTag[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  clientName: string;
  company: string;
  projectType: ProjectPlanKey;
  extras: ProposalExtraKey[];
  implementationTotal: number;
  monthlyRecurring: number;
  summary: string;
  createdAt: string;
  status: ProposalStatus;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedClient: string;
  dueDate: string;
  createdAt: string;
}

export interface ManualSection {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
}

export interface FunnelTemplate {
  id: string;
  title: string;
  audience: "Cliente sem site" | "Cliente com site ruim";
  message: string;
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

export type LeadInput = Omit<Lead, "id" | "createdAt">;
export type ProposalInput = Omit<Proposal, "id" | "createdAt">;
export type TaskInput = Omit<Task, "id" | "createdAt">;
