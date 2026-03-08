import {
  LEADS_HEADERS,
  Lead,
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
    proposedValue: Number(row[10] ?? 0),
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
    projectType: row[3] ?? "",
    extras: safeJsonArray(row[4]),
    implementationTotal: Number(row[5] ?? 0),
    monthlyRecurring: Number(row[6] ?? 0),
    summary: row[7] ?? "",
    createdAt: row[8] ?? "",
    status: row[9] ?? "draft",
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

export async function readLeadsFromSheet() {
  await ensureSheet(SHEET_NAMES.leads, LEADS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAMES.leads}!A:O`,
  });

  const rows = response.data.values ?? [];
  return rows.slice(1).map(mapLeadRow);
}

export async function readProposalsFromSheet() {
  await ensureSheet(SHEET_NAMES.proposals, PROPOSALS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAMES.proposals}!A:J`,
  });

  const rows = response.data.values ?? [];
  return rows.slice(1).map(mapProposalRow);
}

export async function readTasksFromSheet() {
  await ensureSheet(SHEET_NAMES.tasks, TASKS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAMES.tasks}!A:H`,
  });

  const rows = response.data.values ?? [];
  return rows.slice(1).map(mapTaskRow);
}

export async function appendLeadToSheet(lead: Lead) {
  await ensureSheet(SHEET_NAMES.leads, LEADS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.leads}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [serializeLead(lead)],
    },
  });
}

export async function appendProposalToSheet(proposal: Proposal) {
  await ensureSheet(SHEET_NAMES.proposals, PROPOSALS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.proposals}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [serializeProposal(proposal)],
    },
  });
}

export async function appendTaskToSheet(task: Task) {
  await ensureSheet(SHEET_NAMES.tasks, TASKS_HEADERS);
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.tasks}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [serializeTask(task)],
    },
  });
}
