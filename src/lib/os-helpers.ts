import {
  addDays,
  format,
  formatDistanceToNowStrict,
  isBefore,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { ArchiveReason, LeadStatus, ProjectStatus, ProposalStatus, TaskPriority, TaskStatus } from "@/types/os";

export function formatShortDate(date: string) {
  return format(parseISO(date), "dd MMM", { locale: ptBR });
}

export function formatLongDate(date: string) {
  return format(parseISO(date), "dd 'de' MMMM", { locale: ptBR });
}

export function formatRelativeLabel(date: string) {
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return "Hoje";
  }

  return formatDistanceToNowStrict(parsedDate, {
    addSuffix: true,
    locale: ptBR,
  });
}

export function isUpcomingFollowUp(date: string) {
  const parsedDate = parseISO(date);
  const today = startOfDay(new Date());
  return isBefore(parsedDate, addDays(today, 8));
}

export function isPastDue(date: string) {
  return isBefore(parseISO(date), startOfDay(new Date()));
}

export function isDueWithinDays(date: string, days: number) {
  const parsedDate = parseISO(date);
  const today = startOfDay(new Date());
  return !isBefore(parsedDate, today) && isBefore(parsedDate, addDays(today, days + 1));
}

export function isInCurrentMonth(date: string) {
  return isSameMonth(parseISO(date), new Date());
}

export function sortIsoAsc(firstDate: string, secondDate: string) {
  return parseISO(firstDate).getTime() - parseISO(secondDate).getTime();
}

export function sortIsoDesc(firstDate: string, secondDate: string) {
  return parseISO(secondDate).getTime() - parseISO(firstDate).getTime();
}

export function getLeadStatusClasses(status: LeadStatus) {
  switch (status) {
    case "Fechado":
      return "status-success";
    case "Perdido":
      return "status-danger";
    case "Proposta enviada":
      return "status-info";
    case "Aguardando resposta":
      return "status-warning";
    case "Em conversa":
      return "status-progress";
    default:
      return "status-neutral";
  }
}

export function getProposalStatusClasses(status: ProposalStatus) {
  switch (status) {
    case "accepted":
      return "status-success";
    case "sent":
      return "status-info";
    default:
      return "status-neutral";
  }
}

export function getProposalStatusLabel(status: ProposalStatus) {
  switch (status) {
    case "accepted":
      return "Aceita";
    case "sent":
      return "Enviada";
    default:
      return "Rascunho";
  }
}

export function getTaskPriorityClasses(priority: TaskPriority) {
  switch (priority) {
    case "Alta":
      return "status-danger";
    case "Media":
      return "status-warning";
    default:
      return "status-info";
  }
}

export function getTaskStatusClasses(status: TaskStatus) {
  switch (status) {
    case "Concluida":
      return "status-success";
    case "Em andamento":
      return "status-progress";
    default:
      return "status-neutral";
  }
}

export function getProjectStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "Concluido":
      return "status-success";
    case "Entregue":
      return "status-info";
    case "Pronto para entrega":
    case "Revisao":
      return "status-warning";
    case "Aguardando cliente":
      return "status-progress";
    default:
      return "status-neutral";
  }
}

export function getArchiveReasonClasses(reason: ArchiveReason) {
  switch (reason) {
    case "Perdido para concorrente":
    case "Preco fora do contexto":
      return "status-danger";
    case "Projeto pausado":
      return "status-warning";
    default:
      return "status-neutral";
  }
}
