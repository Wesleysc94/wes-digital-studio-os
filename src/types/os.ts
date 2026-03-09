export type ThemeMode = "dark" | "light" | "ruby" | "aura";
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
export const PROJECT_STATUS_OPTIONS = [
  "Kickoff",
  "Briefing",
  "Em producao",
  "Aguardando cliente",
  "Revisao",
  "Pronto para entrega",
  "Entregue",
  "Concluido",
] as const;
export const ARCHIVE_REASON_OPTIONS = [
  "Sem resposta",
  "Nao teve fit",
  "Preco fora do contexto",
  "Projeto pausado",
  "Perdido para concorrente",
] as const;

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number];
export type LeadTag = (typeof LEAD_TAG_OPTIONS)[number];
export type ProjectPlanKey = (typeof PROJECT_PLAN_KEYS)[number];
export type ProposalExtraKey = (typeof PROPOSAL_EXTRA_KEYS)[number];
export type ProposalStatus = (typeof PROPOSAL_STATUS_OPTIONS)[number];
export type TaskPriority = (typeof TASK_PRIORITY_OPTIONS)[number];
export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];
export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number];
export type ArchiveReason = (typeof ARCHIVE_REASON_OPTIONS)[number];

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
  customTitle: string;
  implementationOverride: number | null;
  recurringOverride: number | null;
  pricingNotes: string;
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

export interface Project {
  id: string;
  leadId: string;
  proposalId: string;
  clientName: string;
  company: string;
  projectType: ProjectPlanKey;
  status: ProjectStatus;
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
  statusAtArchive: LeadStatus;
  reason: ArchiveReason;
  notes: string;
  archivedAt: string;
}

export interface CompletedProject {
  id: string;
  projectId: string;
  clientName: string;
  company: string;
  projectType: ProjectPlanKey;
  implementationTotal: number;
  monthlyRecurring: number;
  deliveredAt: string;
  notes: string;
  deliverySummary: string;
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

export interface SalesPlaybookMessage {
  id: string;
  label: string;
  audience: string;
  message: string;
}

export interface SalesPlaybookStage {
  id: string;
  title: string;
  objective: string;
  explanation: string;
  strategy: string[];
  messages: SalesPlaybookMessage[];
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
  projects: Project[];
  archive: ArchiveEntry[];
  completedProjects: CompletedProject[];
  integration: IntegrationStatus;
  syncedAt: string;
}

export type LeadMutationInput = Omit<Lead, "id" | "createdAt"> & Partial<Pick<Lead, "id" | "createdAt">>;
export type ProposalMutationInput = Omit<Proposal, "id" | "createdAt"> & Partial<Pick<Proposal, "id" | "createdAt">>;
export type TaskMutationInput = Omit<Task, "id" | "createdAt"> & Partial<Pick<Task, "id" | "createdAt">>;
export type ProjectMutationInput = Omit<Project, "id" | "createdAt"> & Partial<Pick<Project, "id" | "createdAt">>;

export interface ArchiveLeadInput {
  lead: Lead;
  reason: ArchiveReason;
  notes: string;
}

export interface CompleteProjectInput {
  project: Project;
  notes: string;
  deliverySummary: string;
  deliveredAt: string;
}
