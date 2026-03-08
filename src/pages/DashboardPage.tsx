import { parseISO } from "date-fns";
import { Activity, CalendarClock, CircleDollarSign, FileSignature, HandCoins, Layers3, Target, Users2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { MetricCard } from "@/components/os/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate, getLeadStatusClasses, getProposalStatusClasses, getTaskPriorityClasses, isUpcomingFollowUp } from "@/lib/os-helpers";
import { formatCurrency } from "@/lib/quote";
import { useOsStore } from "@/store/os-store";
import { LEAD_STATUS_OPTIONS } from "@/types/os";

export function DashboardPage() {
  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);

  const activeLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const clientsClosed = leads.filter((lead) => lead.status === "Fechado").length;
  const proposalsSent = proposals.filter((proposal) => proposal.status === "sent").length;
  const maintenanceActive = proposals.filter(
    (proposal) => proposal.status === "accepted" && proposal.extras.includes("manutencao-mensal"),
  ).length;
  const potentialRevenue = leads.reduce((total, lead) => total + lead.proposedValue, 0);
  const closedRevenue = proposals
    .filter((proposal) => proposal.status === "accepted")
    .reduce((total, proposal) => total + proposal.implementationTotal, 0);
  const pendingFollowUps = leads.filter(
    (lead) => !["Fechado", "Perdido"].includes(lead.status) && isUpcomingFollowUp(lead.nextContact),
  ).length;

  const pipelineData = LEAD_STATUS_OPTIONS.map((status) => ({
    status: status.replace("Aguardando ", "Ag. "),
    total: leads.filter((lead) => lead.status === status).length,
  }));

  const upcomingFollowUps = leads
    .filter((lead) => !["Fechado", "Perdido"].includes(lead.status))
    .sort((first, second) => parseISO(first.nextContact).getTime() - parseISO(second.nextContact).getTime())
    .slice(0, 4);

  const nextTaskDeadline = tasks
    .filter((task) => task.status !== "Concluida")
    .sort((first, second) => parseISO(first.dueDate).getTime() - parseISO(second.dueDate).getTime())[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Leads ativos" value={String(activeLeads)} helper="Conversas em aberto no pipeline comercial." icon={Users2} />
        <MetricCard title="Propostas enviadas" value={String(proposalsSent)} helper="Negociacoes em fase de decisao." icon={FileSignature} />
        <MetricCard title="Clientes fechados" value={String(clientsClosed)} helper="Projetos confirmados e em carteira." icon={Target} />
        <MetricCard title="Manutencoes ativas" value={String(maintenanceActive)} helper="Receita recorrente atualmente contratada." icon={Activity} />
        <MetricCard title="Receita potencial" value={formatCurrency(potentialRevenue)} helper="Soma de oportunidades em aberto." icon={CircleDollarSign} />
        <MetricCard title="Receita fechada" value={formatCurrency(closedRevenue)} helper="Volume de implantacao ja convertido." icon={HandCoins} />
        <MetricCard title="Follow-ups pendentes" value={String(pendingFollowUps)} helper="Contatos que pedem acao nos proximos dias." icon={CalendarClock} />
        <MetricCard
          title="Sprint comercial"
          value={nextTaskDeadline ? formatShortDate(nextTaskDeadline.dueDate) : "--"}
          helper="Proxima entrega operacional relevante para destravar o pipeline."
          icon={Layers3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Distribuicao do funil</CardTitle>
            <CardDescription>Panorama atual por status comercial para enxergar gargalos de conversao.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.08)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderRadius: 20,
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Proximos follow-ups</CardTitle>
              <CardDescription>Leads que exigem contato rapido para nao esfriar a negociacao.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingFollowUps.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <Badge className={getLeadStatusClasses(lead.status)}>{lead.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatShortDate(lead.nextContact)}</span>
                    <span>{formatCurrency(lead.proposedValue)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Execucao imediata</CardTitle>
              <CardDescription>O item abaixo tende a destravar faturamento mais rapido.</CardDescription>
            </CardHeader>
            <CardContent>
              {nextTaskDeadline ? (
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{nextTaskDeadline.title}</p>
                      <p className="text-sm text-muted-foreground">{nextTaskDeadline.relatedClient}</p>
                    </div>
                    <Badge className={getTaskPriorityClasses(nextTaskDeadline.priority)}>{nextTaskDeadline.priority}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{nextTaskDeadline.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Entrega ate {formatShortDate(nextTaskDeadline.dueDate)}</span>
                    <Badge className={getProposalStatusClasses("sent")}>Em foco</Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
