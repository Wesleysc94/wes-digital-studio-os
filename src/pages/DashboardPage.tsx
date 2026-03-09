import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  CirclePlay,
  Compass,
  FileSignature,
  Layers3,
  ListChecks,
  MessageSquareReply,
  Radar,
  ReceiptText,
  Target,
  UserPlus,
  Users2,
  X,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NavLink, useOutletContext, useSearchParams } from "react-router-dom";

import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { MetricCard } from "@/components/os/MetricCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { AppShellOutletContext } from "@/components/os/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  formatLongDate,
  formatRelativeLabel,
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

type TourSectionId = "hero" | "attention" | "metrics" | "actions" | "activity" | "shortcuts";

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

const tourSteps: Array<{
  id: TourSectionId;
  title: string;
  description: string;
}> = [
  {
    id: "hero",
    title: "Header operacional",
    description: "Aqui voce entende onde esta, o que o sistema faz e qual e a primeira acao recomendada para este momento.",
  },
  {
    id: "attention",
    title: "O que pede atencao hoje",
    description: "Esses cards trazem follow-up vencido, proposta em espera, lead parado e tarefa critica. Sao sua primeira triagem.",
  },
  {
    id: "metrics",
    title: "Indicadores principais",
    description: "Esta leitura mostra pipeline, receita potencial, receita confirmada e base recorrente sem abrir outras telas.",
  },
  {
    id: "actions",
    title: "Fila recomendada",
    description: "A ordem aqui existe para reduzir atrito mental. Execute do topo para baixo quando quiser velocidade com criterio.",
  },
  {
    id: "activity",
    title: "Atividade recente",
    description: "O sistema fica vivo quando conta o que entrou, mudou ou foi concluido. Esse bloco preserva contexto sem procura manual.",
  },
  {
    id: "shortcuts",
    title: "Atalhos e modulos",
    description: "Quando a triagem estiver clara, entre no modulo certo para agir. O dashboard te devolve a direcao.",
  },
];

export function DashboardPage() {
  const { isSyncing } = useOutletContext<AppShellOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const sectionRefs = useRef<Record<TourSectionId, HTMLElement | null>>({
    hero: null,
    attention: null,
    metrics: null,
    actions: null,
    activity: null,
    shortcuts: null,
  });

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

  const isTourActive = searchParams.get("tour") === "1";
  const activeTourStep = tourSteps[tourStepIndex];

  useEffect(() => {
    if (isTourActive) {
      setTourStepIndex(0);
    }
  }, [isTourActive]);

  useEffect(() => {
    if (!isTourActive) {
      return;
    }

    if (activeTourStep.id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetSection = sectionRefs.current[activeTourStep.id];

    if (!targetSection) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      targetSection.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTourStep.id, isTourActive]);

  const startTour = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tour", "1");
    setSearchParams(nextParams, { replace: false });
  };

  const closeTour = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("tour");
    setSearchParams(nextParams, { replace: false });
  };

  const goToPreviousStep = () => {
    setTourStepIndex((current) => Math.max(current - 1, 0));
  };

  const goToNextStep = () => {
    if (tourStepIndex === tourSteps.length - 1) {
      closeTour();
      return;
    }

    setTourStepIndex((current) => Math.min(current + 1, tourSteps.length - 1));
  };

  const getSectionRef = (id: TourSectionId) => (element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  };

  const getSectionClassName = (id: TourSectionId, baseClassName: string) =>
    cn(baseClassName, isTourActive && activeTourStep.id === id && "tour-focus");

  const getTourAction = (id: TourSectionId) =>
    isTourActive && activeTourStep.id === id ? <Badge className="status-info">Etapa atual do tour</Badge> : null;

  const attentionCards = [
    {
      title: "Leads aguardando resposta",
      value: awaitingResponseLeads.length,
      description: awaitingResponseLeads.length
        ? "Tem lead que ja recebeu proposta ou explicacao e esta esperando seu proximo toque."
        : "Nenhum lead parado nessa etapa. Seu retorno comercial esta em dia.",
      href: "/crm",
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
      badgeClassName: "status-warning",
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
    <>
      <motion.div className="space-y-6 xl:space-y-8" initial="hidden" animate="show" variants={revealContainer}>
        <motion.section
          ref={getSectionRef("hero")}
          variants={revealItem}
          className={getSectionClassName("hero", "surface-panel relative overflow-hidden rounded-[30px] p-6 sm:p-7")}
        >
          <div className="brand-grid absolute inset-0 opacity-55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.14),transparent_26%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_34%)]" />
          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_360px]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="status-info">Centro de controle da agencia</Badge>
                <Badge className={cn("status-neutral", isSyncing && "status-info")}>
                  {isSyncing ? "Sincronizando dados" : "Painel pronto para operar"}
                </Badge>
                <Badge className="status-neutral">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</Badge>
              </div>

              <h2 className="mt-5 text-3xl font-semibold text-foreground sm:text-[2.55rem]">Entenda o dia em segundos e aja sem perder contexto.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                O dashboard existe para dizer onde esta o gargalo, qual e a proxima melhor acao e para qual modulo voce deve ir. Nada aqui deveria parecer solto ou decorativo.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="h-10 rounded-full px-4">
                  <NavLink to="/crm">
                    <UserPlus className="h-4 w-4" />
                    Novo lead
                  </NavLink>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground">
                  <NavLink to="/orcamentos">
                    <ReceiptText className="h-4 w-4" />
                    Gerar orcamento
                  </NavLink>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground">
                  <NavLink to="/tarefas">
                    <ListChecks className="h-4 w-4" />
                    Nova tarefa
                  </NavLink>
                </Button>
                <Button type="button" variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground" onClick={startTour}>
                  <CirclePlay className="h-4 w-4" />
                  Ver demonstracao
                </Button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "1. Leia o radar", value: "Prioridades" },
                  { label: "2. Escolha a acao", value: "Proximo passo" },
                  { label: "3. Abra o modulo", value: "Execucao" },
                  { label: "4. Volte e revise", value: "Contexto vivo" },
                ].map((item) => (
                  <div key={item.label} className="surface-soft rounded-[18px] px-4 py-3">
                    <p className="eyebrow-label">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-accent/22 bg-accent/10 p-5 shadow-[0_18px_44px_-30px_hsl(var(--accent))]">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-accent/22 bg-background/55 text-accent">
                  <recommendedAction.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Proxima melhor acao</p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">{recommendedAction.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/78">{recommendedAction.description}</p>

                <div className="surface-subtle mt-5 rounded-[18px] p-4">
                  <p className="eyebrow-label">Por que isso vem primeiro</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    O sistema leu follow-ups, propostas e tarefas abertas para indicar o proximo movimento com maior impacto.
                  </p>
                </div>

                <Button asChild className="mt-5 h-10 w-full rounded-full">
                  <NavLink to={recommendedAction.href}>
                    {recommendedAction.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </NavLink>
                </Button>
              </div>

              <div className="surface-soft rounded-[24px] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow-label">Se ficou em duvida</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">Use o guia do sistema</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      O guia explica o papel de cada modulo e a demonstracao mostra o dashboard passo a passo.
                    </p>
                  </div>
                  <Compass className="mt-1 h-5 w-5 text-accent" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground">
                    <NavLink to="/guia">
                      Abrir guia
                      <ArrowRight className="h-4 w-4" />
                    </NavLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section ref={getSectionRef("attention")} variants={revealItem} className={getSectionClassName("attention", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading
            eyebrow="O que precisa da sua atencao hoje"
            title="Prioridades operacionais"
            description="Esses pontos devem ser tratados primeiro porque destravam fechamento, follow-up ou entrega."
            action={getTourAction("attention")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {attentionCards.map((item) => (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <NavLink to={item.href} className="group">
                    <Card className="glass-card h-full rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/24 hover:shadow-[0_18px_38px_-30px_hsl(var(--accent)/0.35)]">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent">
                            <item.icon className="h-4.5 w-4.5" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" />
                        </div>
                        <p className="eyebrow-label mt-5">{item.title}</p>
                        <p className="mt-3 text-4xl font-semibold text-foreground">{item.value}</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                        <p className="mt-5 text-sm font-medium text-accent">{item.cta}</p>
                      </CardContent>
                    </Card>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent className="max-w-[18rem] border-border bg-popover text-popover-foreground">
                  Clique para ir direto para a area responsavel por esse bloco.
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </motion.section>

        <motion.section ref={getSectionRef("metrics")} variants={revealItem} className={getSectionClassName("metrics", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading
            eyebrow="Indicadores principais"
            title="Saude comercial da operacao"
            description="Numeros para ler o momento do pipeline, receita e recorrencia sem abrir outras telas."
            action={getTourAction("metrics")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section ref={getSectionRef("actions")} variants={revealItem} className={getSectionClassName("actions", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
            <SectionHeading
              eyebrow="Proximas acoes"
              title="Fila recomendada do dia"
              description="Use essa lista como ordem de execucao para reduzir atrito mental e ganhar velocidade."
              action={getTourAction("actions")}
            />

            {nextActions.length ? (
              <div className="space-y-3">
                {nextActions.map((action, index) => (
                  <NavLink key={action.id} to={action.href} className="group block">
                    <Card className="glass-card rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/22">
                      <CardContent className="flex gap-4 p-5">
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-secondary text-foreground">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          {index !== nextActions.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={action.badgeClassName}>{action.badge}</Badge>
                            <span className="eyebrow-label">{action.meta}</span>
                          </div>
                          <p className="mt-3 text-lg font-semibold text-foreground">{action.title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" />
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

          <motion.section ref={getSectionRef("activity")} variants={revealItem} className={getSectionClassName("activity", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
            <SectionHeading
              eyebrow="Atividade recente"
              title="Sistema vivo"
              description="Tudo que entrou ou mudou no sistema aparece aqui para manter contexto sem procurar."
              action={getTourAction("activity")}
            />

            {recentActivity.length ? (
              <Card className="glass-card rounded-[22px]">
                <CardContent className="space-y-4 p-5">
                  {recentActivity.map((item) => (
                    <NavLink key={item.id} to={item.href} className="group block rounded-[18px] border border-border/80 bg-secondary/35 p-4 transition-all duration-150 ease-out hover:border-accent/18 hover:bg-secondary/55">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={item.badgeClassName}>{item.badge}</Badge>
                        <span className="eyebrow-label">{formatRelativeLabel(item.date)}</span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
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

        <motion.section ref={getSectionRef("shortcuts")} variants={revealItem} className={getSectionClassName("shortcuts", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading
            eyebrow="Atalhos rapidos"
            title="Ir direto para o modulo certo"
            description="Acesse a area de trabalho ideal conforme o momento da operacao."
            action={getTourAction("shortcuts")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {shortcuts.map((shortcut) => (
              <NavLink key={shortcut.title} to={shortcut.href} className="group">
                <Card className="glass-card h-full rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/20">
                  <CardContent className="p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent">
                      <shortcut.icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-5 text-lg font-semibold text-foreground">{shortcut.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{shortcut.description}</p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                      Abrir modulo
                      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                    </p>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>
        </motion.section>
      </motion.div>

      {isTourActive ? (
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-[380px]"
        >
          <div className="surface-panel rounded-[26px] p-5 shadow-[0_30px_90px_-50px_hsl(var(--accent)/0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow-label">Demonstracao guiada</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{activeTourStep.title}</p>
              </div>
              <button
                type="button"
                aria-label="Fechar demonstracao guiada"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={closeTour}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeTourStep.description}</p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all duration-200"
                style={{ width: `${((tourStepIndex + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Badge className="status-neutral">
                {tourStepIndex + 1} de {tourSteps.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground"
                  onClick={goToPreviousStep}
                  disabled={tourStepIndex === 0}
                >
                  Voltar
                </Button>
                <Button type="button" className="h-10 rounded-full px-4" onClick={goToNextStep}>
                  {tourStepIndex === tourSteps.length - 1 ? "Concluir" : "Proximo"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </>
  );
}
