import {
  ARCHIVE_HEADERS,
  ArchiveEntry,
  COMPLETED_PROJECTS_HEADERS,
  CompletedProject,
  LEADS_HEADERS,
  Lead,
  PROJECTS_HEADERS,
  Project,
  PROPOSALS_HEADERS,
  Proposal,
  TASKS_HEADERS,
  Task,
} from "./contracts.js";
import { getSheetsClient, getSpreadsheetId } from "./google.js";

const SHEET_NAMES = {
  leads: "Leads",
  proposals: "Propostas",
  tasks: "Tarefas",
  projects: "Producao",
  archive: "Descartados",
  completedProjects: "Projetos_Concluidos",
} as const;

type SheetKey = keyof typeof SHEET_NAMES;

async function ensureSheet(sheetTitle: string, headers: readonly string[]) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheet = metadata.data.sheets?.find((sheet) => sheet.properties?.title === sheetTitle);

  if (!existingSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
              },
            },
          },
        ],
      },
    });
  }

  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!1:1`,
  });

  const currentHeader = headerResponse.data.values?.[0] ?? [];
  if (!currentHeader.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [Array.from(headers)],
      },
    });
  }
}

async function ensureSheetByKey(key: SheetKey) {
  const headers = {
    leads: LEADS_HEADERS,
    proposals: PROPOSALS_HEADERS,
    tasks: TASKS_HEADERS,
    projects: PROJECTS_HEADERS,
    archive: ARCHIVE_HEADERS,
    completedProjects: COMPLETED_PROJECTS_HEADERS,
  }[key];

  await ensureSheet(SHEET_NAMES[key], headers);
}

function safeJsonArray(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeNumber(value: string | undefined) {
  return Number(value ?? 0);
}

function safeNullableNumber(value: string | undefined) {
  if (value === undefined || value === "") {
    return null;
  }

  return Number(value);
}

function safeBoolean(value: string | undefined) {
  return value === "true";
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of [...items].reverse()) {
    if (!item.id || seen.has(item.id)) {
      continue;
    }

    seen.add(item.id);
    result.push(item);
  }

  return result;
}

function mapLeadRow(row: string[]): Lead {
  return {
    id: row[0] ?? "",
    name: row[1] ?? "",
    company: row[2] ?? "",
    segment: row[3] ?? "",
    city: row[4] ?? "",
    instagram: row[5] ?? "",
    website: row[6] ?? "",
    phone: row[7] ?? "",
    source: row[8] ?? "",
    status: row[9] ?? "Novo lead",
    proposedValue: safeNumber(row[10]),
    notes: row[11] ?? "",
    nextContact: row[12] ?? "",
    tags: safeJsonArray(row[13]),
    createdAt: row[14] ?? "",
  };
}

function mapProposalRow(row: string[]): Proposal {
  return {
    id: row[0] ?? "",
    clientName: row[1] ?? "",
    company: row[2] ?? "",
    projectType: row[3] ?? "landing-essencial",
    extras: safeJsonArray(row[4]),
    implementationTotal: safeNumber(row[5]),
    monthlyRecurring: safeNumber(row[6]),
    summary: row[7] ?? "",
    createdAt: row[8] ?? "",
    status: row[9] ?? "draft",
    customTitle: row[10] ?? "",
    implementationOverride: safeNullableNumber(row[11]),
    recurringOverride: safeNullableNumber(row[12]),
    pricingNotes: row[13] ?? "",
  };
}

function mapTaskRow(row: string[]): Task {
  return {
    id: row[0] ?? "",
    title: row[1] ?? "",
    description: row[2] ?? "",
    priority: row[3] ?? "Media",
    status: row[4] ?? "Aberta",
    relatedClient: row[5] ?? "",
    dueDate: row[6] ?? "",
    createdAt: row[7] ?? "",
  };
}

function mapProjectRow(row: string[]): Project {
  return {
    id: row[0] ?? "",
    leadId: row[1] ?? "",
    proposalId: row[2] ?? "",
    clientName: row[3] ?? "",
    company: row[4] ?? "",
    projectType: row[5] ?? "landing-essencial",
    status: row[6] ?? "Kickoff",
    implementationTotal: safeNumber(row[7]),
    monthlyRecurring: safeNumber(row[8]),
    dueDate: row[9] ?? "",
    nextMilestone: row[10] ?? "",
    maintenanceActive: safeBoolean(row[11]),
    notes: row[12] ?? "",
    deliverySummary: row[13] ?? "",
    createdAt: row[14] ?? "",
  };
}

function mapArchiveRow(row: string[]): ArchiveEntry {
  return {
    id: row[0] ?? "",
    leadId: row[1] ?? "",
    name: row[2] ?? "",
    company: row[3] ?? "",
    statusAtArchive: row[4] ?? "Perdido",
    reason: row[5] ?? "Sem resposta",
    notes: row[6] ?? "",
    archivedAt: row[7] ?? "",
  };
}

function mapCompletedProjectRow(row: string[]): CompletedProject {
  return {
    id: row[0] ?? "",
    projectId: row[1] ?? "",
    clientName: row[2] ?? "",
    company: row[3] ?? "",
    projectType: row[4] ?? "landing-essencial",
    implementationTotal: safeNumber(row[5]),
    monthlyRecurring: safeNumber(row[6]),
    deliveredAt: row[7] ?? "",
    notes: row[8] ?? "",
    deliverySummary: row[9] ?? "",
  };
}

function serializeLead(lead: Lead) {
  return [
    lead.id,
    lead.name,
    lead.company,
    lead.segment,
    lead.city,
    lead.instagram,
    lead.website,
    lead.phone,
    lead.source,
    lead.status,
    String(lead.proposedValue),
    lead.notes,
    lead.nextContact,
    JSON.stringify(lead.tags),
    lead.createdAt,
  ];
}

function serializeProposal(proposal: Proposal) {
  return [
    proposal.id,
    proposal.clientName,
    proposal.company,
    proposal.projectType,
    JSON.stringify(proposal.extras),
    String(proposal.implementationTotal),
    String(proposal.monthlyRecurring),
    proposal.summary,
    proposal.createdAt,
    proposal.status,
    proposal.customTitle,
    proposal.implementationOverride === null ? "" : String(proposal.implementationOverride),
    proposal.recurringOverride === null ? "" : String(proposal.recurringOverride),
    proposal.pricingNotes,
  ];
}

function serializeTask(task: Task) {
  return [
    task.id,
    task.title,
    task.description,
    task.priority,
    task.status,
    task.relatedClient,
    task.dueDate,
    task.createdAt,
  ];
}

function serializeProject(project: Project) {
  return [
    project.id,
    project.leadId,
    project.proposalId,
    project.clientName,
    project.company,
    project.projectType,
    project.status,
    String(project.implementationTotal),
    String(project.monthlyRecurring),
    project.dueDate,
    project.nextMilestone,
    String(project.maintenanceActive),
    project.notes,
    project.deliverySummary,
    project.createdAt,
  ];
}

function serializeArchiveEntry(entry: ArchiveEntry) {
  return [
    entry.id,
    entry.leadId,
    entry.name,
    entry.company,
    entry.statusAtArchive,
    entry.reason,
    entry.notes,
    entry.archivedAt,
  ];
}

function serializeCompletedProject(project: CompletedProject) {
  return [
    project.id,
    project.projectId,
    project.clientName,
    project.company,
    project.projectType,
    String(project.implementationTotal),
    String(project.monthlyRecurring),
    project.deliveredAt,
    project.notes,
    project.deliverySummary,
  ];
}

async function readSheetValues(range: string) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values ?? [];
}

async function appendValues(sheetKey: SheetKey, values: string[]) {
  await ensureSheetByKey(sheetKey);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES[sheetKey]}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

export async function readLeadsFromSheet() {
  await ensureSheetByKey("leads");
  const rows = await readSheetValues(`${SHEET_NAMES.leads}!A:O`);
  return dedupeById(rows.slice(1).map(mapLeadRow));
}

export async function readProposalsFromSheet() {
  await ensureSheetByKey("proposals");
  const rows = await readSheetValues(`${SHEET_NAMES.proposals}!A:N`);
  return dedupeById(rows.slice(1).map(mapProposalRow));
}

export async function readTasksFromSheet() {
  await ensureSheetByKey("tasks");
  const rows = await readSheetValues(`${SHEET_NAMES.tasks}!A:H`);
  return dedupeById(rows.slice(1).map(mapTaskRow));
}

export async function readProjectsFromSheet() {
  await ensureSheetByKey("projects");
  const rows = await readSheetValues(`${SHEET_NAMES.projects}!A:O`);
  return dedupeById(rows.slice(1).map(mapProjectRow));
}

export async function readArchiveFromSheet() {
  await ensureSheetByKey("archive");
  const rows = await readSheetValues(`${SHEET_NAMES.archive}!A:H`);
  return dedupeById(rows.slice(1).map(mapArchiveRow));
}

export async function readCompletedProjectsFromSheet() {
  await ensureSheetByKey("completedProjects");
  const rows = await readSheetValues(`${SHEET_NAMES.completedProjects}!A:J`);
  return dedupeById(rows.slice(1).map(mapCompletedProjectRow));
}

export async function appendLeadToSheet(lead: Lead) {
  await appendValues("leads", serializeLead(lead));
}

export async function appendProposalToSheet(proposal: Proposal) {
  await appendValues("proposals", serializeProposal(proposal));
}

export async function appendTaskToSheet(task: Task) {
  await appendValues("tasks", serializeTask(task));
}

export async function appendProjectToSheet(project: Project) {
  await appendValues("projects", serializeProject(project));
}

export async function appendArchiveToSheet(entry: ArchiveEntry) {
  await appendValues("archive", serializeArchiveEntry(entry));
}

export async function appendCompletedProjectToSheet(project: CompletedProject) {
  await appendValues("completedProjects", serializeCompletedProject(project));
}
