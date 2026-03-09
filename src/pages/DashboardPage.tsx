import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileSignature,
  Layers3,
  ListChecks,
  MessageSquareReply,
  Radar,
  ReceiptText,
  Target,
  UserPlus,
  Users2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { NavLink, useOutletContext } from "react-router-dom";

import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { MetricCard } from "@/components/os/MetricCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { AppShellOutletContext } from "@/components/os/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  formatLongDate,
  formatRelativeLabel,
  formatShortDate,
  getLeadStatusClasses,
  getProposalStatusClasses,
  getProposalStatusLabel,
  getTaskPriorityClasses,
  getTaskStatusClasses,
  isInCurrentMonth,
  isPastDue,
  sortIsoAsc,
  sortIsoDesc,
} from "@/lib/os-helpers";
import { formatCurrency } from "@/lib/quote";
import { cn } from "@/lib/utils";
import { useOsStore } from "@/store/os-store";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  href: string;
  badge: string;
  badgeClassName: string;
};

const revealContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
};

export function DashboardPage() {
  const { isSyncing } = useOutletContext<AppShellOutletContext>();

  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);

  const activeLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status));
  const awaitingResponseLeads = leads.filter((lead) => lead.status === "Aguardando resposta");
  const overdueFollowUps = activeLeads.filter((lead) => isPastDue(lead.nextContact));
  const proposalsAwaitingReturn = proposals.filter((proposal) => proposal.status === "sent");
  const priorityTasks = tasks.filter((task) => task.status !== "Concluida" && task.priority === "Alta");

  const leadsActiveCount = activeLeads.length;
  const proposalsSentCount = proposalsAwaitingReturn.length;
  const clientsClosedThisMonth = leads.filter((lead) => lead.status === "Fechado" && isInCurrentMonth(lead.createdAt)).length;
  const potentialRevenue = activeLeads.reduce((total, lead) => total + lead.proposedValue, 0);
  const confirmedRevenue = proposals
    .filter((proposal) => proposal.status === "accepted")
    .reduce((total, proposal) => total + proposal.implementationTotal, 0);
  const maintenanceActive = proposals.filter(
    (proposal) => proposal.status === "accepted" && proposal.extras.includes("manutencao-mensal"),
  ).length;

  const attentionCards = [
    {
      title: "Leads aguardando resposta",
      value: awaitingResponseLeads.length,
      description: awaitingResponseLeads.length
        ? "Tem lead que ja recebeu proposta ou explicacao e esta esperando seu proximo toque."
        : "Nenhum lead parado nessa etapa. Seu retorno comercial esta em dia.",
      href: "/crm",
      tone: "warning",
      icon: MessageSquareReply,
      cta: "Abrir CRM",
    },
    {
      title: "Follow-ups vencidos",
      value: overdueFollowUps.length,
      description: overdueFollowUps.length
        ? "Existe oportunidade esfriando. Priorize esses contatos antes de abrir novas frentes."
        : "Nao ha follow-up vencido hoje. Voce esta conseguindo manter o ritmo comercial.",
      href: "/crm",
      tone: "danger",
      icon: CalendarClock,
      cta: "Revisar agenda",
    },
    {
      title: "Propostas aguardando retorno",
      value: proposalsAwaitingReturn.length,
      description: proposalsAwaitingReturn.length
        ? "Essas propostas ja estao na mao do cliente e precisam de contexto, nao de insistencia."
        : "Nenhuma proposta em suspenso. Bom momento para gerar novas oportunidades.",
      href: "/orcamentos",
      tone: "info",
      icon: FileSignature,
      cta: "Ir para orcamentos",
    },
    {
      title: "Tarefas prioritarias",
      value: priorityTasks.length,
      description: priorityTasks.length
        ? "Ha itens de alta prioridade que impactam entrega, follow-up ou fechamento."
        : "Sua fila critica esta limpa. Voce pode operar com mais folga hoje.",
      href: "/tarefas",
      tone: "neutral",
      icon: ListChecks,
      cta: "Abrir tarefas",
    },
  ] as const;

  const metricCards = [
    {
      title: "Leads ativos",
      value: String(leadsActiveCount),
      helper: "Contatos em aberto no pipeline atual.",
      insight: leadsActiveCount ? "Pipeline com tracao comercial ativa." : "Comece cadastrando um novo lead agora.",
      icon: Users2,
    },
    {
      title: "Propostas enviadas",
      value: String(proposalsSentCount),
      helper: "Negociacoes aguardando decisao do cliente.",
      insight: proposalsSentCount ? "Hora de contextualizar valor e avancar follow-up." : "Nenhuma proposta em espera no momento.",
      icon: ReceiptText,
    },
    {
      title: "Clientes fechados no mes",
      value: String(clientsClosedThisMonth),
      helper: "Fechamentos registrados dentro do mes atual.",
      insight: clientsClosedThisMonth ? "O mes ja tem conversao confirmada." : "Voce ainda nao registrou fechamento neste mes.",
      icon: Target,
    },
    {
      title: "Receita potencial",
      value: formatCurrency(potentialRevenue),
      helper: "Volume em aberto somando oportunidades ativas.",
      insight: potentialRevenue ? "Seu pipeline tem potencial real para empurrar faturamento." : "Sem pipeline ativo, nao ha previsibilidade de receita.",
      icon: CircleDollarSign,
    },
    {
      title: "Receita confirmada",
      value: formatCurrency(confirmedRevenue),
      helper: "Total de implantacao ja convertido em proposta aceita.",
      insight: confirmedRevenue ? "Existe receita confirmada no sistema." : "Ainda nao ha proposta aceita para consolidar receita.",
      icon: CheckCircle2,
    },
    {
      title: "Clientes com manutencao ativa",
      value: String(maintenanceActive),
      helper: "Base recorrente contratada neste momento.",
      insight: maintenanceActive ? "Sua recorrencia ajuda a suavizar o caixa." : "Sem manutencao ativa, a receita fica mais volatil.",
      icon: Briefcase,
    },
  ] as const;

  const nextActions = [
    ...overdueFollowUps.sort((first, second) => sortIsoAsc(first.nextContact, second.nextContact)).map((lead) => ({
      id: `followup-${lead.id}`,
      title: `Retomar contato com ${lead.company}`,
      description: `Follow-up vencido ${formatRelativeLabel(lead.nextContact)}. Volte com contexto e proposta de proximo passo.`,
      href: "/crm",
      meta: formatLongDate(lead.nextContact),
      badge: "Follow-up",
      badgeClassName: "border-amber-400/30 bg-amber-500/15 text-amber-300",
    })),
    ...proposalsAwaitingReturn.sort((first, second) => sortIsoAsc(first.createdAt, second.createdAt)).map((proposal) => ({
      id: `proposal-${proposal.id}`,
      title: `Revisar retorno da proposta de ${proposal.company}`,
      description: "Mensagem recomendada: confirme timing, objecoes e o que precisa ser decidido para avancar.",
      href: "/orcamentos",
      meta: formatLongDate(proposal.createdAt),
      badge: "Proposta enviada",
      badgeClassName: getProposalStatusClasses(proposal.status),
    })),
    ...priorityTasks.sort((first, second) => sortIsoAsc(first.dueDate, second.dueDate)).map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: task.description,
      href: "/tarefas",
      meta: `Prazo ${formatLongDate(task.dueDate)}`,
      badge: task.priority,
      badgeClassName: getTaskPriorityClasses(task.priority),
    })),
  ].slice(0, 6);

  const recentActivity: ActivityItem[] = [
    ...leads.map((lead) => ({
      id: `lead-${lead.id}`,
      title: `Lead cadastrado: ${lead.company}`,
      description: `${lead.name} entrou no pipeline com status ${lead.status.toLowerCase()}.`,
      date: lead.createdAt,
      href: "/crm",
      badge: lead.status,
      badgeClassName: getLeadStatusClasses(lead.status),
    })),
    ...proposals.map((proposal) => ({
      id: `proposal-${proposal.id}`,
      title: `Proposta criada para ${proposal.company}`,
      description: `${getProposalStatusLabel(proposal.status)} com implantacao de ${formatCurrency(proposal.implementationTotal)}.`,
      date: proposal.createdAt,
      href: "/orcamentos",
      badge: getProposalStatusLabel(proposal.status),
      badgeClassName: getProposalStatusClasses(proposal.status),
    })),
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `Tarefa registrada: ${task.title}`,
      description: `${task.relatedClient || "Sem cliente vinculado"} • ${task.status.toLowerCase()}.`,
      date: task.createdAt,
      href: "/tarefas",
      badge: task.status,
      badgeClassName: getTaskStatusClasses(task.status),
    })),
  ]
    .sort((first, second) => sortIsoDesc(first.date, second.date))
    .slice(0, 6);

  const recommendedAction = overdueFollowUps.length
    ? {
        title: `Retomar ${overdueFollowUps[0].company}`,
        description: "Existe follow-up vencido. Reabra a conversa com contexto e proponha o proximo passo ainda hoje.",
        href: "/crm",
        actionLabel: "Abrir CRM agora",
        icon: CalendarClock,
      }
    : proposalsAwaitingReturn.length
      ? {
          title: `Contextualizar proposta de ${proposalsAwaitingReturn[0].company}`,
          description: "A proposta ja foi enviada. Agora a prioridade e reduzir objecao e puxar decisao, nao mandar lembrete vazio.",
          href: "/orcamentos",
          actionLabel: "Revisar proposta",
          icon: ReceiptText,
        }
      : priorityTasks.length
        ? {
            title: `Executar ${priorityTasks[0].title}`,
            description: "Ha tarefa critica aberta. Resolver esse item evita atraso em entrega, follow-up ou manutencao.",
            href: "/tarefas",
            actionLabel: "Abrir tarefas",
            icon: ListChecks,
          }
        : {
            title: "Cadastrar o primeiro lead do dia",
            description: "Sem pendencia critica no radar, o melhor uso do seu tempo agora e alimentar o pipeline com nova oportunidade.",
            href: "/crm",
            actionLabel: "Novo lead",
            icon: UserPlus,
          };

  const shortcuts = [
    {
      title: "CRM",
      description: "Cadastrar lead, revisar status e agendar proximo contato.",
      href: "/crm",
      icon: Users2,
    },
    {
      title: "Orcamentos",
      description: "Montar proposta com escopo, extras e recorrencia.",
      href: "/orcamentos",
      icon: ReceiptText,
    },
    {
      title: "Funil de vendas",
      description: "Usar mensagens consultivas por etapa e momento comercial.",
      href: "/funil",
      icon: Radar,
    },
    {
      title: "Manual da operacao",
      description: "Checar processo, precos, renovacoes e regra de entrega.",
      href: "/manual",
      icon: Layers3,
    },
    {
      title: "Tarefas",
      description: "Executar o que destrava follow-up, entrega e faturamento.",
      href: "/tarefas",
      icon: CheckCircle2,
    },
  ] as const;

  return (
    <motion.div className="space-y-6 xl:space-y-8" initial="hidden" animate="show" variants={revealContainer}>
      <motion.section variants={revealItem} className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_28px_90px_-50px_rgba(0,0,0,0.78)] sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/38">Header operacional</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">WES Digital Studio OS</h2>
            <p className="mt-4 text-base leading-8 text-white/62">
              Voce esta no centro de controle da agencia. Comece pelas prioridades do dia, execute a proxima acao e deixe o
              sistema guiar o restante.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="border-white/10 bg-white/[0.04] text-white/78">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</Badge>
              <Badge className={cn("border-white/10 bg-white/[0.04] text-white/72", isSyncing && "border-accent/25 bg-accent/10 text-accent")}>
                {isSyncing ? "Sincronizando dados" : "Painel pronto para operar"}
              </Badge>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-5">
                <NavLink to="/crm">
                  <UserPlus className="h-4 w-4" />
                  Novo lead
                </NavLink>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] px-5 text-white hover:bg-white/[0.08] hover:text-white">
                <NavLink to="/orcamentos">
                  <ReceiptText className="h-4 w-4" />
                  Gerar orcamento
                </NavLink>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] px-5 text-white hover:bg-white/[0.08] hover:text-white">
                <NavLink to="/tarefas">
                  <ListChecks className="h-4 w-4" />
                  Nova tarefa
                </NavLink>
              </Button>
            </div>

            <div className="mt-6 hidden gap-3 sm:grid sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/8 bg-slate-950/28 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Pipeline aberto</p>
                <p className="mt-2 text-2xl font-semibold text-white">{leadsActiveCount}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-slate-950/28 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Retornos pendentes</p>
                <p className="mt-2 text-2xl font-semibold text-white">{awaitingResponseLeads.length + proposalsAwaitingReturn.length}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-slate-950/28 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Pendencias criticas</p>
                <p className="mt-2 text-2xl font-semibold text-white">{overdueFollowUps.length + priorityTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-accent/20 bg-accent/10 p-5 shadow-[0_24px_70px_-45px_hsl(var(--accent))]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-slate-950/35 text-accent">
              <recommendedAction.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-accent/80">Proxima melhor acao</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{recommendedAction.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">{recommendedAction.description}</p>

            <div className="mt-5 rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/38">Por que isso vem primeiro</p>
              <p className="mt-2 text-sm leading-6 text-white/64">
                O sistema leu follow-ups, propostas e tarefas abertas para indicar o proximo movimento com maior impacto.
              </p>
            </div>

            <Button asChild className="mt-5 w-full rounded-full">
              <NavLink to={recommendedAction.href}>
                {recommendedAction.actionLabel}
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading
          eyebrow="O que precisa da sua atencao hoje"
          title="Prioridades operacionais"
          description="Esses pontos devem ser tratados primeiro porque destravam fechamento, follow-up ou entrega."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {attentionCards.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <NavLink to={item.href} className="group">
                  <Card className="glass-card h-full rounded-[28px] border-white/10 transition-all duration-200 hover:-translate-y-1 hover:border-accent/25 hover:bg-white/[0.055]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 text-accent">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/28 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                      <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-white/38">{item.title}</p>
                      <p className="mt-3 text-4xl font-semibold text-white">{item.value}</p>
                      <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
                      <p className="mt-5 text-sm font-medium text-accent">{item.cta}</p>
                    </CardContent>
                  </Card>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent className="max-w-[18rem] border-white/10 bg-slate-950/90 text-white">
                Clique para ir direto para a area responsavel por esse bloco.
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading
          eyebrow="Indicadores principais"
          title="Saude comercial da operacao"
          description="Numeros para ler o momento do pipeline, receita e recorrencia sem abrir outras telas."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section variants={revealItem} className="space-y-4">
          <SectionHeading
            eyebrow="Proximas acoes"
            title="Fila recomendada do dia"
            description="Use essa lista como ordem de execucao para reduzir atrito mental e ganhar velocidade."
          />

          {nextActions.length ? (
            <div className="space-y-3">
              {nextActions.map((action, index) => (
                <NavLink key={action.id} to={action.href} className="group block">
                  <Card className="glass-card rounded-[26px] border-white/10 transition-all duration-200 hover:-translate-y-1 hover:border-accent/20">
                    <CardContent className="flex gap-4 p-5">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 text-white">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        {index !== nextActions.length - 1 ? <div className="mt-2 h-full w-px bg-white/10" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={action.badgeClassName}>{action.badge}</Badge>
                          <span className="text-xs uppercase tracking-[0.22em] text-white/32">{action.meta}</span>
                        </div>
                        <p className="mt-3 text-lg font-medium text-white">{action.title}</p>
                        <p className="mt-2 text-sm leading-6 text-white/58">{action.description}</p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/28 transition-transform duration-200 group-hover:translate-x-1" />
                    </CardContent>
                  </Card>
                </NavLink>
              ))}
            </div>
          ) : (
            <EmptyStateCard
              icon={CheckCircle2}
              title="Sua fila imediata esta limpa"
              description="Nao ha follow-up vencido, proposta aguardando retorno ou tarefa critica. Bom momento para abastecer o pipeline com um novo lead."
              actionLabel="Cadastrar novo lead"
              actionHref="/crm"
            />
          )}
        </motion.section>

        <motion.section variants={revealItem} className="space-y-4">
          <SectionHeading
            eyebrow="Atividade recente"
            title="Sistema vivo"
            description="Tudo que entrou ou mudou no sistema aparece aqui para manter contexto sem procurar."
          />

          {recentActivity.length ? (
            <Card className="glass-card rounded-[28px] border-white/10">
              <CardContent className="space-y-4 p-5">
                {recentActivity.map((item) => (
                  <NavLink key={item.id} to={item.href} className="group block rounded-[22px] border border-white/8 bg-white/[0.03] p-4 transition-all duration-200 hover:border-accent/20 hover:bg-white/[0.05]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={item.badgeClassName}>{item.badge}</Badge>
                      <span className="text-xs uppercase tracking-[0.22em] text-white/32">{formatRelativeLabel(item.date)}</span>
                    </div>
                    <p className="mt-3 text-base font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
                  </NavLink>
                ))}
              </CardContent>
            </Card>
          ) : (
            <EmptyStateCard
              icon={Layers3}
              title="Ainda nao houve movimento recente"
              description="Assim que voce cadastrar lead, gerar proposta ou criar tarefa, a atividade recente passa a contar a historia da operacao."
              actionLabel="Gerar a primeira atividade"
              actionHref="/crm"
            />
          )}
        </motion.section>
      </div>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading
          eyebrow="Atalhos rapidos"
          title="Ir direto para o modulo certo"
          description="Acesse a area de trabalho ideal conforme o momento da operacao."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {shortcuts.map((shortcut) => (
            <NavLink key={shortcut.title} to={shortcut.href} className="group">
              <Card className="glass-card h-full rounded-[26px] border-white/10 transition-all duration-200 hover:-translate-y-1 hover:border-accent/20">
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 text-accent">
                    <shortcut.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-lg font-medium text-white">{shortcut.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">{shortcut.description}</p>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    Abrir modulo
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
