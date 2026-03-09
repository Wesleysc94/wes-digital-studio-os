import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, BriefcaseBusiness, CalendarClock, CheckCircle2, CircleDollarSign, CirclePlay, Compass, Inbox, Layers3, ListChecks, MessageSquareReply, ReceiptText, Rocket, ShieldAlert, TimerReset, Trash2, UserPlus, Users2, X } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NavLink, useOutletContext, useSearchParams } from "react-router-dom";

import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { MetricCard } from "@/components/os/MetricCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { AppShellOutletContext } from "@/components/os/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatLongDate, formatRelativeLabel, getArchiveReasonClasses, getLeadStatusClasses, getProjectStatusClasses, getProposalStatusClasses, getProposalStatusLabel, getTaskPriorityClasses, isDueWithinDays, isInCurrentMonth, isPastDue, sortIsoAsc, sortIsoDesc } from "@/lib/os-helpers";
import { formatCurrency } from "@/lib/quote";
import { cn } from "@/lib/utils";
import { useOsStore } from "@/store/os-store";

const revealContainer: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const revealItem: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } } };

type TourSectionId = "hero" | "attention" | "metrics" | "actions" | "activity" | "shortcuts";
type ActivityItem = { id: string; title: string; description: string; date: string; href: string; badge: string; badgeClassName: string };

const tourSteps: Array<{ id: TourSectionId; title: string; description: string }> = [
  { id: "hero", title: "Header operacional", description: "Aqui voce entende onde esta e qual frente pede prioridade agora." },
  { id: "attention", title: "Radar misto", description: "Esses cards misturam producao, comercial e descarte para guiar seu dia." },
  { id: "metrics", title: "Indicadores principais", description: "A leitura une pipeline, contratos ativos e entrega no mesmo painel." },
  { id: "actions", title: "Fila recomendada", description: "Cliente fechado com risco ou bloqueio sobe acima da negociacao aberta." },
  { id: "activity", title: "Atividade recente", description: "O sistema conta tudo o que entrou, mudou ou saiu do radar." },
  { id: "shortcuts", title: "Atalhos", description: "Depois de ler o radar, abra o modulo certo para agir." },
];

export function DashboardPage() {
  const { isSyncing } = useOutletContext<AppShellOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const sectionRefs = useRef<Record<TourSectionId, HTMLElement | null>>({ hero: null, attention: null, metrics: null, actions: null, activity: null, shortcuts: null });

  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);
  const projects = useOsStore((state) => state.projects);
  const archive = useOsStore((state) => state.archive);
  const completedProjects = useOsStore((state) => state.completedProjects);

  const activeLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status));
  const overdueFollowUps = activeLeads.filter((lead) => isPastDue(lead.nextContact));
  const proposalsAwaitingReturn = proposals.filter((proposal) => proposal.status === "sent");
  const priorityTasks = tasks.filter((task) => task.status !== "Concluida" && task.priority === "Alta");
  const activeProjects = projects.filter((project) => project.status !== "Concluido");
  const dueSoonProjects = activeProjects.filter((project) => isDueWithinDays(project.dueDate, 7));
  const blockedProjects = activeProjects.filter((project) => project.status === "Aguardando cliente");

  const queueItems = [
    ...activeProjects.filter((project) => isPastDue(project.dueDate) || isDueWithinDays(project.nextMilestone, 2) || ["Pronto para entrega", "Entregue"].includes(project.status)).sort((a, b) => sortIsoAsc(a.dueDate, b.dueDate)).map((project) => ({ id: `project-${project.id}`, title: `Destravar ${project.company}`, description: `Projeto em ${project.status.toLowerCase()} com prazo ${formatRelativeLabel(project.dueDate)}. Cliente fechado vem antes de lead parado.`, href: "/producao", meta: `Entrega ${formatLongDate(project.dueDate)}`, badge: project.status, badgeClassName: getProjectStatusClasses(project.status) })),
    ...overdueFollowUps.sort((a, b) => sortIsoAsc(a.nextContact, b.nextContact)).map((lead) => ({ id: `followup-${lead.id}`, title: `Retomar contato com ${lead.company}`, description: `Follow-up vencido ${formatRelativeLabel(lead.nextContact)}. Reabra a conversa com proximo passo claro.`, href: "/crm", meta: formatLongDate(lead.nextContact), badge: "Follow-up", badgeClassName: "status-warning" })),
    ...proposalsAwaitingReturn.sort((a, b) => sortIsoAsc(a.createdAt, b.createdAt)).map((proposal) => ({ id: `proposal-${proposal.id}`, title: `Puxar decisao da proposta de ${proposal.company}`, description: "A proposta ja foi enviada. Agora a conversa precisa reduzir objecao e puxar resposta.", href: "/orcamentos", meta: formatLongDate(proposal.createdAt), badge: "Proposta enviada", badgeClassName: getProposalStatusClasses(proposal.status) })),
    ...priorityTasks.sort((a, b) => sortIsoAsc(a.dueDate, b.dueDate)).map((task) => ({ id: `task-${task.id}`, title: task.title, description: task.description, href: "/tarefas", meta: `Prazo ${formatLongDate(task.dueDate)}`, badge: task.priority, badgeClassName: getTaskPriorityClasses(task.priority) })),
  ].slice(0, 7);

  const potentialRevenue = activeLeads.reduce((total, lead) => total + lead.proposedValue, 0);
  const confirmedRevenue = activeProjects.reduce((total, project) => total + project.implementationTotal, 0);
  const maintenanceActive = activeProjects.filter((project) => project.maintenanceActive).length;
  const newProjectsThisMonth = activeProjects.filter((project) => isInCurrentMonth(project.createdAt)).length;

  const projectsWithLeadAssigned = activeProjects.filter((project) => project.leadId);
  const totalDaysToConvert = projectsWithLeadAssigned.reduce((total, project) => {
    const leadOrigin = leads.find((lead) => lead.id === project.leadId);
    if (!leadOrigin) return total;
    return total + differenceInDays(new Date(project.createdAt), new Date(leadOrigin.createdAt));
  }, 0);

  const timeToConvertMedia = projectsWithLeadAssigned.length > 0 ? Math.round(totalDaysToConvert / projectsWithLeadAssigned.length) : 0;
  const t2cLabel = timeToConvertMedia === 0 ? "N/D" : `${timeToConvertMedia} ${timeToConvertMedia === 1 ? "dia" : "dias"}`;

  const recentActivity: ActivityItem[] = [
    ...leads.map((lead) => ({ id: `lead-${lead.id}`, title: `Lead atualizado: ${lead.company}`, description: `${lead.name} esta em ${lead.status.toLowerCase()}.`, date: lead.createdAt, href: "/crm", badge: lead.status, badgeClassName: getLeadStatusClasses(lead.status) })),
    ...proposals.map((proposal) => ({ id: `proposal-${proposal.id}`, title: `Proposta ativa para ${proposal.company}`, description: `${getProposalStatusLabel(proposal.status)} com implantacao de ${formatCurrency(proposal.implementationTotal)}.`, date: proposal.createdAt, href: "/orcamentos", badge: getProposalStatusLabel(proposal.status), badgeClassName: getProposalStatusClasses(proposal.status) })),
    ...activeProjects.map((project) => ({ id: `project-${project.id}`, title: `Projeto em producao: ${project.company}`, description: `${project.status} com prazo ${formatRelativeLabel(project.dueDate)}.`, date: project.createdAt, href: "/producao", badge: project.status, badgeClassName: getProjectStatusClasses(project.status) })),
    ...archive.map((item) => ({ id: `archive-${item.id}`, title: `Movido para descartados: ${item.company}`, description: `${item.name} saiu do radar principal. Motivo: ${item.reason.toLowerCase()}.`, date: item.archivedAt, href: "/descartados", badge: item.reason, badgeClassName: getArchiveReasonClasses(item.reason) })),
    ...completedProjects.map((project) => ({ id: `completed-${project.id}`, title: `Projeto concluido: ${project.company}`, description: project.deliverySummary, date: project.deliveredAt, href: "/producao", badge: "Concluido", badgeClassName: "status-success" })),
  ].sort((a, b) => sortIsoDesc(a.date, b.date)).slice(0, 8);

  const attentionCards = [
    { title: "Projetos com prazo curto", value: dueSoonProjects.length, description: dueSoonProjects.length ? "Cliente fechado em fase de entrega. Essa e a prioridade mais alta do dashboard." : "Nenhum prazo critico em producao nos proximos sete dias.", href: "/producao", icon: Rocket, cta: "Abrir producao" },
    { title: "Projetos bloqueados no cliente", value: blockedProjects.length, description: blockedProjects.length ? "Ha cliente travando aprovacao, briefing ou envio de material." : "Nenhum projeto aguardando retorno do cliente agora.", href: "/producao", icon: ShieldAlert, cta: "Revisar bloqueios" },
    { title: "Follow-ups vencidos", value: overdueFollowUps.length, description: overdueFollowUps.length ? "Existe lead esfriando. Resolva isso depois de destravar producao critica." : "Nao ha follow-up vencido hoje.", href: "/crm", icon: MessageSquareReply, cta: "Abrir CRM" },
    { title: "Propostas aguardando retorno", value: proposalsAwaitingReturn.length, description: proposalsAwaitingReturn.length ? "Propostas no ar pedindo contexto e chamada para decisao." : "Nenhuma proposta em suspenso agora.", href: "/orcamentos", icon: ReceiptText, cta: "Ir para orcamentos" },
    { title: "Tarefas prioritarias", value: priorityTasks.length, description: priorityTasks.length ? "Itens de alta prioridade que impactam fechamento ou entrega." : "Sua fila critica esta limpa neste momento.", href: "/tarefas", icon: ListChecks, cta: "Abrir tarefas" },
  ] as const;

  const metricCards = [
    { title: "Leads ativos", value: String(activeLeads.length), helper: "Oportunidades ainda em negociacao ou follow-up.", insight: activeLeads.length ? "Pipeline comercial continua em movimento." : "Sem novos leads, a previsibilidade de venda cai.", icon: Users2 },
    { title: "Propostas aguardando decisao", value: String(proposalsAwaitingReturn.length), helper: "Negociacoes que ja receberam proposta e precisam de conducao.", insight: proposalsAwaitingReturn.length ? "Hora de puxar clareza e decisao, nao mensagem vazia." : "Nenhuma proposta parada agora.", icon: ReceiptText },
    { title: "Projetos ativos", value: String(activeProjects.length), helper: "Clientes fechados que estao na sua esteira de entrega.", insight: activeProjects.length ? "O dashboard agora opera o pos-venda com prioridade." : "Sem projetos ativos, o funil ainda nao virou entrega.", icon: BriefcaseBusiness },
    { title: "Receita potencial", value: formatCurrency(potentialRevenue), helper: "Volume em aberto somando leads ainda nao convertidos.", insight: potentialRevenue ? "Existe pipeline suficiente para perseguir crescimento." : "Sem pipeline ativo, fica dificil projetar receita.", icon: CircleDollarSign },
    { title: "Receita confirmada", value: formatCurrency(confirmedRevenue), helper: "Valor de implantacao ja transformado em projetos ativos.", insight: confirmedRevenue ? "Os contratos aceitos ja estao dentro do sistema operacional." : "Ainda nao ha faturamento confirmado em producao.", icon: Layers3 },
    { title: "Time-to-Convert (Media)", value: t2cLabel, helper: "Velocidade media do Lead ate efetivar e virar de fato Projeto Mapeado.", insight: timeToConvertMedia ? "Sua janela de tracao e convencimento em dias de contato." : "Indicador dependente de conclusao de Leads a partir de hoje.", icon: TimerReset },
  ] as const;

  const recommendedAction = dueSoonProjects.length ? { title: `Proteger a entrega de ${dueSoonProjects[0].company}`, description: "Cliente fechado, prazo proximo e valor confirmado. Esse tipo de item sempre passa na frente das novas conversas.", href: "/producao", actionLabel: "Abrir producao", icon: Rocket } : blockedProjects.length ? { title: `Cobrar retorno de ${blockedProjects[0].company}`, description: "A esteira travou no cliente. Tirar esse bloqueio recupera ritmo sem comprometer o prazo final.", href: "/producao", actionLabel: "Rever bloqueio", icon: ShieldAlert } : overdueFollowUps.length ? { title: `Retomar ${overdueFollowUps[0].company}`, description: "Sem urgencia de producao acima disso agora, o melhor passo e reaquecer um lead parado.", href: "/crm", actionLabel: "Abrir CRM", icon: CalendarClock } : { title: "Cadastrar o primeiro lead do dia", description: "Sem pendencia critica no radar, o melhor uso do seu tempo agora e alimentar o pipeline com nova oportunidade.", href: "/crm", actionLabel: "Novo lead", icon: UserPlus };

  const shortcuts = [
    { title: "CRM", description: "Cadastrar lead, revisar status e agendar proximo contato.", href: "/crm", icon: Users2 },
    { title: "Orcamentos", description: "Montar proposta, ajustar valor e empurrar para producao.", href: "/orcamentos", icon: ReceiptText },
    { title: "Producao", description: "Acompanhar clientes fechados, prazo, bloqueio e entrega.", href: "/producao", icon: BriefcaseBusiness },
    { title: "Descartados", description: "Limpar do radar o que nao deve mais poluir a operacao.", href: "/descartados", icon: Trash2 },
    { title: "Funil", description: "Usar mensagens consultivas por etapa e momento comercial.", href: "/funil", icon: Compass },
  ] as const;

  const isTourActive = searchParams.get("tour") === "1";
  const tourRunToken = searchParams.get("run") ?? "";
  const activeTourStep = tourSteps[tourStepIndex];

  useEffect(() => {
    if (isTourActive) setTourStepIndex(0);
  }, [isTourActive, tourRunToken]);

  useEffect(() => {
    if (!isTourActive) return;
    if (activeTourStep.id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const targetSection = sectionRefs.current[activeTourStep.id];
    if (!targetSection) return;
    const frame = window.requestAnimationFrame(() => targetSection.scrollIntoView({ behavior: "smooth", block: "center" }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeTourStep.id, isTourActive]);

  const getSectionRef = (id: TourSectionId) => (element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  };
  const getSectionClassName = (id: TourSectionId, baseClassName: string) => cn(baseClassName, isTourActive && activeTourStep.id === id && "tour-focus");
  const startTour = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tour", "1");
    nextParams.set("run", Date.now().toString());
    setSearchParams(nextParams, { replace: false });
  };
  const closeTour = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("tour");
    nextParams.delete("run");
    setSearchParams(nextParams, { replace: false });
  };

  return (
    <>
      <motion.div className="space-y-6 xl:space-y-8" initial="hidden" animate="show" variants={revealContainer}>
        <motion.section ref={getSectionRef("hero")} variants={revealItem} className={getSectionClassName("hero", "surface-panel relative overflow-hidden rounded-[30px] p-6 sm:p-7")}>
          <div className="brand-grid absolute inset-0 opacity-65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.18),transparent_24%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_36%)]" />
          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_360px]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hero-chip hero-chip-accent">Centro de controle da agencia</span>
                <span className={cn("hero-chip", isSyncing ? "hero-chip-live" : "hero-chip-muted")}>{isSyncing ? "Sincronizando dados" : "Fluxo completo online"}</span>
                <span className="hero-chip hero-chip-muted">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-foreground sm:text-[2.55rem]">Leia comercial e producao no mesmo radar, mas com pesos diferentes.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">O dashboard agora considera cliente fechado, prazo de entrega e bloqueio de producao acima de negociacoes abertas. Ele tambem diz quando limpar o pipeline movendo oportunidades para descartados.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="h-10 rounded-full px-4"><NavLink to="/crm"><UserPlus className="h-4 w-4" />Novo lead</NavLink></Button>
                <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/orcamentos"><ReceiptText className="h-4 w-4" />Gerar orcamento</NavLink></Button>
                <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/producao"><Rocket className="h-4 w-4" />Abrir producao</NavLink></Button>
                <Button type="button" variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground" onClick={startTour}><CirclePlay className="h-4 w-4" />Ver demonstracao</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[24px] border border-accent/22 bg-accent/10 p-5 shadow-[0_18px_44px_-30px_hsl(var(--accent))]">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-accent/22 bg-background/55 text-accent"><recommendedAction.icon className="h-5 w-5" /></div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Proxima melhor acao</p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">{recommendedAction.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/78">{recommendedAction.description}</p>
                <Button asChild className="mt-5 h-10 w-full rounded-full"><NavLink to={recommendedAction.href}>{recommendedAction.actionLabel}<ArrowRight className="h-4 w-4" /></NavLink></Button>
              </div>
              <div className="surface-soft rounded-[24px] p-5">
                <p className="eyebrow-label">Se ficou em duvida</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Use o guia do sistema</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">O guia explica o fluxo completo, do primeiro lead ao projeto concluido, e a demonstracao mostra o dashboard passo a passo.</p>
                <Button asChild variant="outline" className="mt-4 h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/guia">Abrir guia<ArrowRight className="h-4 w-4" /></NavLink></Button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section ref={getSectionRef("attention")} variants={revealItem} className={getSectionClassName("attention", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading eyebrow="O que precisa da sua atencao hoje" title="Prioridades operacionais" description="Esses pontos combinam comercial e producao para dizer o que realmente vem primeiro no seu dia." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {attentionCards.map((item) => (
              <NavLink key={item.title} to={item.href} className="group">
                <Card className="glass-card h-full rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/24"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><item.icon className="h-4.5 w-4.5" /></div><ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" /></div><p className="eyebrow-label mt-5">{item.title}</p><p className="mt-3 text-4xl font-semibold text-foreground">{item.value}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p><p className="mt-5 text-sm font-medium text-accent">{item.cta}</p></CardContent></Card>
              </NavLink>
            ))}
          </div>
        </motion.section>

        <motion.section ref={getSectionRef("metrics")} variants={revealItem} className={getSectionClassName("metrics", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading eyebrow="Indicadores principais" title="Saude comercial e de entrega" description="Esses numeros explicam o tamanho do pipeline, o volume contratado e a pressao de producao no mesmo painel." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{metricCards.map((card) => <MetricCard key={card.title} {...card} />)}</div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="glass-card rounded-[24px]"><CardContent className="p-5"><p className="eyebrow-label">Base com manutencao ativa</p><p className="mt-3 text-3xl font-semibold text-foreground">{maintenanceActive}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Clientes ativos que seguem gerando recorrencia alem da implantacao.</p></CardContent></Card>
            <Card className="glass-card rounded-[24px]"><CardContent className="p-5"><p className="eyebrow-label">Descartados no periodo</p><p className="mt-3 text-3xl font-semibold text-foreground">{archive.length}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Quantidade de oportunidades tiradas do radar para manter clareza operacional.</p></CardContent></Card>
            <Card className="glass-card rounded-[24px]"><CardContent className="p-5"><p className="eyebrow-label">Historico concluido</p><p className="mt-3 text-3xl font-semibold text-foreground">{completedProjects.length}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Projetos ja entregues e documentados em planilha de historico.</p></CardContent></Card>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.section ref={getSectionRef("actions")} variants={revealItem} className={getSectionClassName("actions", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
            <SectionHeading eyebrow="Proximas acoes" title="Fila recomendada do dia" description="A ordem abaixo parte da regra central do sistema: prazo e entrega vencendo passam na frente do resto." />
            {queueItems.length ? <div className="space-y-3">{queueItems.map((action, index) => (<NavLink key={action.id} to={action.href} className="group block"><Card className="glass-card rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/22"><CardContent className="flex gap-4 p-5"><div className="flex flex-col items-center"><div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-secondary text-foreground"><span className="text-sm font-semibold">{index + 1}</span></div>{index !== queueItems.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", action.badgeClassName)}>{action.badge}</span><span className="eyebrow-label">{action.meta}</span></div><p className="mt-3 text-lg font-semibold text-foreground">{action.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p></div><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" /></CardContent></Card></NavLink>))}</div> : <EmptyStateCard icon={Inbox} title="Sua fila imediata esta limpa" description="Nao ha prazo critico, follow-up vencido ou tarefa prioritaria. Bom momento para abastecer o pipeline com um novo lead ou revisar o funil." actionLabel="Cadastrar novo lead" actionHref="/crm" />}
          </motion.section>
          <motion.section ref={getSectionRef("activity")} variants={revealItem} className={getSectionClassName("activity", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
            <SectionHeading eyebrow="Atividade recente" title="Sistema vivo" description="Leads, projetos, descartes e entregas concluidas aparecem aqui para preservar contexto sem procura manual." />
            {recentActivity.length ? <Card className="glass-card rounded-[22px]"><CardContent className="space-y-4 p-5">{recentActivity.map((item) => (<NavLink key={item.id} to={item.href} className="group block rounded-[18px] border border-border/80 bg-secondary/35 p-4 transition-all duration-150 ease-out hover:border-accent/18 hover:bg-secondary/55"><div className="flex flex-wrap items-center gap-2"><span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", item.badgeClassName)}>{item.badge}</span><span className="eyebrow-label">{formatRelativeLabel(item.date)}</span></div><p className="mt-3 text-base font-semibold text-foreground">{item.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></NavLink>))}</CardContent></Card> : <EmptyStateCard icon={Layers3} title="Ainda nao houve movimento recente" description="Assim que voce cadastrar lead, gerar proposta, mover para producao ou concluir uma entrega, o sistema passa a contar a historia da operacao." actionLabel="Gerar a primeira atividade" actionHref="/crm" />}
          </motion.section>
        </div>

        <motion.section ref={getSectionRef("shortcuts")} variants={revealItem} className={getSectionClassName("shortcuts", "space-y-4 rounded-[28px] p-2 sm:p-3")}>
          <SectionHeading eyebrow="Atalhos rapidos" title="Ir direto para o modulo certo" description="Use esses atalhos quando o dashboard ja tiver mostrado onde esta o proximo movimento." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{shortcuts.map((shortcut) => (<NavLink key={shortcut.title} to={shortcut.href} className="group"><Card className="glass-card h-full rounded-[22px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/20"><CardContent className="p-5"><div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><shortcut.icon className="h-4.5 w-4.5" /></div><p className="mt-5 text-lg font-semibold text-foreground">{shortcut.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{shortcut.description}</p><p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">Abrir modulo<ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" /></p></CardContent></Card></NavLink>))}</div>
        </motion.section>
      </motion.div>

      {isTourActive ? <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-[420px]"><div className="surface-panel rounded-[26px] p-5 shadow-[0_30px_90px_-50px_hsl(var(--accent)/0.45)]"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow-label">Demonstracao guiada</p><p className="mt-2 text-xl font-semibold text-foreground">{activeTourStep.title}</p></div><button type="button" aria-label="Fechar demonstracao guiada" className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" onClick={closeTour}><X className="h-4 w-4" /></button></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{activeTourStep.description}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${((tourStepIndex + 1) / tourSteps.length) * 100}%` }} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="hero-chip hero-chip-muted">{tourStepIndex + 1} de {tourSteps.length}</span><div className="flex items-center gap-2"><Button type="button" variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground" onClick={startTour}>Reiniciar</Button><Button type="button" variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground" onClick={() => setTourStepIndex((current) => Math.max(current - 1, 0))} disabled={tourStepIndex === 0}>Voltar</Button><Button type="button" className="h-10 rounded-full px-4" onClick={() => { if (tourStepIndex === tourSteps.length - 1) { closeTour(); return; } setTourStepIndex((current) => Math.min(current + 1, tourSteps.length - 1)); }}>{tourStepIndex === tourSteps.length - 1 ? "Concluir" : "Proximo"}<ArrowRight className="h-4 w-4" /></Button></div></div></div></motion.aside> : null}
    </>
  );
}
