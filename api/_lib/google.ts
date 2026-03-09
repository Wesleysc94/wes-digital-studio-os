import { google } from "googleapis";

import { IntegrationStatus, Lead, Project } from "./contracts.js";

function getEnv() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  return {
    projectId: process.env.GOOGLE_PROJECT_ID ?? "",
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
    privateKey: privateKey ?? "",
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "",
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? "",
  };
}

export function getIntegrationStatus(): IntegrationStatus {
  const env = getEnv();
  const missing = [
    !env.clientEmail && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    !env.privateKey && "GOOGLE_PRIVATE_KEY",
    !env.spreadsheetId && "GOOGLE_SHEETS_SPREADSHEET_ID",
    !env.calendarId && "GOOGLE_CALENDAR_ID",
  ].filter(Boolean) as string[];

  const googleSheetsConfigured = Boolean(env.clientEmail && env.privateKey && env.spreadsheetId);
  const googleCalendarConfigured = Boolean(googleSheetsConfigured && env.calendarId);

  return {
    mode: googleSheetsConfigured ? "google" : "mock",
    googleSheetsConfigured,
    googleCalendarConfigured,
    canWrite: googleSheetsConfigured,
    missing,
    spreadsheetId: googleSheetsConfigured ? env.spreadsheetId : undefined,
    calendarId: googleCalendarConfigured ? env.calendarId : undefined,
  };
}

export function withRuntimeError(status: IntegrationStatus, reason: string): IntegrationStatus {
  return {
    ...status,
    mode: "mock",
    canWrite: false,
    missing: [...status.missing, reason],
  };
}

function getGoogleAuth(scopes: string[]) {
  const env = getEnv();

  return new google.auth.GoogleAuth({
    credentials: {
      project_id: env.projectId || undefined,
      client_email: env.clientEmail,
      private_key: env.privateKey,
    },
    scopes,
  });
}

function formatCalendarDate(date: string) {
  return new Date(`${date}T12:00:00-03:00`).toISOString();
}

function nextDay(date: string) {
  const baseDate = new Date(`${date}T12:00:00-03:00`);
  baseDate.setDate(baseDate.getDate() + 1);
  return baseDate.toISOString().slice(0, 10);
}

export function getSpreadsheetId() {
  return getEnv().spreadsheetId;
}

export function isGoogleSheetsConfigured() {
  return getIntegrationStatus().googleSheetsConfigured;
}

export function isGoogleCalendarConfigured() {
  return getIntegrationStatus().googleCalendarConfigured;
}

export function getSheetsClient() {
  return google.sheets({
    version: "v4",
    auth: getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]),
  });
}

export function getCalendarClient() {
  return google.calendar({
    version: "v3",
    auth: getGoogleAuth(["https://www.googleapis.com/auth/calendar"]),
  });
}

export async function createFollowUpEvent(lead: Lead) {
  if (!isGoogleCalendarConfigured()) {
    return;
  }

  const calendar = getCalendarClient();
  const calendarId = getEnv().calendarId;
  const startDateTime = formatCalendarDate(lead.nextContact);
  const endDateTime = formatCalendarDate(nextDay(lead.nextContact));

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `Follow-up | ${lead.company}`,
      description: [
        `Lead: ${lead.name}`,
        `Empresa: ${lead.company}`,
        `Telefone: ${lead.phone}`,
        `Origem: ${lead.source}`,
        `Status: ${lead.status}`,
        `Observacoes: ${lead.notes || "Sem observacoes"}`,
      ].join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Sao_Paulo",
      },
    },
  });
}

export async function createProjectDeadlineEvent(project: Project) {
  if (!isGoogleCalendarConfigured()) {
    return;
  }

  const calendar = getCalendarClient();
  const calendarId = getEnv().calendarId;

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `Entrega | ${project.company}`,
      description: [
        `Cliente: ${project.clientName}`,
        `Empresa: ${project.company}`,
        `Status inicial: ${project.status}`,
        `Proximo marco: ${project.nextMilestone}`,
        `Resumo: ${project.deliverySummary || project.notes || "Sem resumo"}`,
      ].join("\n"),
      start: {
        date: project.dueDate,
        timeZone: "America/Sao_Paulo",
      },
      end: {
        date: nextDay(project.dueDate),
        timeZone: "America/Sao_Paulo",
      },
    },
  });
}
