import { addDays, format, isBefore, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import { LeadStatus, ProposalStatus, TaskPriority, TaskStatus } from "@/types/os";

export function formatShortDate(date: string) {
  return format(parseISO(date), "dd MMM", { locale: ptBR });
}

export function isUpcomingFollowUp(date: string) {
  const parsedDate = parseISO(date);
  const today = startOfDay(new Date());
  return isBefore(parsedDate, addDays(today, 8));
}

export function getLeadStatusClasses(status: LeadStatus) {
  switch (status) {
    case "Fechado":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    case "Perdido":
      return "bg-rose-500/15 text-rose-300 border-rose-400/30";
    case "Proposta enviada":
      return "bg-sky-500/15 text-sky-300 border-sky-400/30";
    case "Aguardando resposta":
      return "bg-amber-500/15 text-amber-300 border-amber-400/30";
    case "Em conversa":
      return "bg-violet-500/15 text-violet-300 border-violet-400/30";
    default:
      return "bg-border/60 text-foreground border-border";
  }
}

export function getProposalStatusClasses(status: ProposalStatus) {
  switch (status) {
    case "accepted":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    case "sent":
      return "bg-sky-500/15 text-sky-300 border-sky-400/30";
    default:
      return "bg-border/60 text-foreground border-border";
  }
}

export function getTaskPriorityClasses(priority: TaskPriority) {
  switch (priority) {
    case "Alta":
      return "bg-rose-500/15 text-rose-300 border-rose-400/30";
    case "Media":
      return "bg-amber-500/15 text-amber-300 border-amber-400/30";
    default:
      return "bg-sky-500/15 text-sky-300 border-sky-400/30";
  }
}

export function getTaskStatusClasses(status: TaskStatus) {
  switch (status) {
    case "Concluida":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    case "Em andamento":
      return "bg-violet-500/15 text-violet-300 border-violet-400/30";
    default:
      return "bg-border/60 text-foreground border-border";
  }
}
