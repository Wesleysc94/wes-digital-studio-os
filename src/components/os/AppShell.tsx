import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, BookOpen, BriefcaseBusiness, CheckSquare, ChevronRight, CirclePlay, Cog, Compass, LayoutDashboard, Menu, Orbit, ReceiptText, Users, Wifi, X } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandEmblem } from "@/components/os/BrandEmblem";
import { RouteSkeleton } from "@/components/os/RouteSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOsBootstrap } from "@/hooks/use-os-sync";
import { cn } from "@/lib/utils";
import { useOsStore } from "@/store/os-store";

type RouteMeta = { kicker: string; title: string; description: string };
export type AppShellOutletContext = { pageMeta: RouteMeta; isBootstrapping: boolean; isSyncing: boolean };

const ROUTE_META: Record<string, RouteMeta> = {
  "/dashboard": { kicker: "Central operacional", title: "Dashboard operacional", description: "Leia prioridades, comercial, producao e descarte sem perder contexto." },
  "/guia": { kicker: "Onboarding guiado", title: "Guia do sistema", description: "Entenda como o OS opera do primeiro lead ate a entrega concluida." },
  "/crm": { kicker: "Pipeline comercial", title: "CRM de leads e clientes", description: "Cadastre, acompanhe e descarte oportunidades sem poluir a operacao principal." },
  "/orcamentos": { kicker: "Fechamento comercial", title: "Gerador de orcamentos", description: "Monte propostas padrao ou personalizadas e mande para producao quando o contrato fechar." },
  "/producao": { kicker: "Pos-venda", title: "Esteira de producao", description: "Acompanhe clientes fechados, prazos, bloqueios e entregas em uma fila viva." },
  "/descartados": { kicker: "Limpeza operacional", title: "Descartados", description: "Separe leads que sairam da operacao ativa sem apagar o historico." },
  "/funil": { kicker: "Playbook de vendas", title: "Funil de vendas", description: "Use estrategia, copy e direcionamento por etapa para conduzir a negociacao com mais seguranca." },
  "/manual": { kicker: "Base da operacao", title: "Manual da operacao", description: "Padrao de venda, entrega, manutencao e renovacao para reduzir atrito operacional." },
  "/tarefas": { kicker: "Execucao diaria", title: "Tarefas e manutencoes", description: "Priorize follow-ups, entregas e manutencoes em uma fila objetiva de trabalho." },
  "/configuracoes": { kicker: "Infraestrutura", title: "Configuracoes do sistema", description: "Confira integracoes, ambiente e pontos de apoio sem duplicar controles globais do app." },
};

const NAV_GROUPS = [
  { label: "Hoje", items: [{ href: "/dashboard", label: "Dashboard", helper: "Leitura executiva", icon: LayoutDashboard }, { href: "/guia", label: "Guia", helper: "Tour e demonstracao", icon: CirclePlay }] },
  { label: "Comercial", items: [{ href: "/crm", label: "CRM", helper: "Leads e follow-up", icon: Users }, { href: "/orcamentos", label: "Orcamentos", helper: "Propostas e planos", icon: ReceiptText }, { href: "/funil", label: "Funil", helper: "Playbook comercial", icon: Orbit }] },
  { label: "Operacao", items: [{ href: "/producao", label: "Producao", helper: "Clientes ativos", icon: BriefcaseBusiness }, { href: "/tarefas", label: "Tarefas", helper: "Fila operacional", icon: CheckSquare }, { href: "/descartados", label: "Descartados", helper: "Limpeza do radar", icon: Archive }, { href: "/manual", label: "Manual", helper: "Regras da agencia", icon: BookOpen }, { href: "/configuracoes", label: "Configuracoes", helper: "Ambiente e suporte", icon: Cog }] },
] as const;

export function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bootstrapQuery = useOsBootstrap();

  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);
  const projects = useOsStore((state) => state.projects);
  const archive = useOsStore((state) => state.archive);
  const integration = useOsStore((state) => state.integration);
  const syncedAt = useOsStore((state) => state.syncedAt);

  const pageMeta = ROUTE_META[location.pathname] ?? ROUTE_META["/dashboard"];
  const isBootstrapping = bootstrapQuery.isLoading && !syncedAt;
  const openLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const pendingTasks = tasks.filter((task) => task.status !== "Concluida").length;
  const activeProjects = projects.filter((project) => project.status !== "Concluido").length;
  const sentProposals = proposals.filter((proposal) => proposal.status === "sent").length;

  const integrationLabel = integration.mode === "google" ? "Google online" : integration.mode === "mock" ? "Modo mock" : "Modo local";
  const navigationCounts = useMemo(() => ({ "/crm": openLeads, "/orcamentos": sentProposals, "/producao": activeProjects, "/tarefas": pendingTasks, "/descartados": archive.length }), [openLeads, sentProposals, activeProjects, pendingTasks, archive.length]);

  const sidebarContent = (
    <div className="flex min-h-full flex-col">
      <div className="surface-panel relative min-h-[186px] overflow-visible rounded-[30px] p-5">
        <div className="brand-grid absolute inset-0 rounded-[30px] opacity-70" />
        <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.18),transparent_34%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.1),transparent_40%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 max-w-[12rem]">
              <p className="eyebrow-label">WES DIGITAL STUDIO</p>
              <p className="mt-2 text-[1.72rem] font-semibold leading-none text-foreground">OS operacional</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Comercial, propostas, producao e descarte em uma leitura unica de operacao.</p>
            </div>
            <BrandEmblem size="sm" className="shrink-0" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["CRM", "Producao", "Entregas", "Historico"].map((item) => <span key={item} className="rounded-full border border-border/80 bg-background/58 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/88 backdrop-blur-sm">{item}</span>)}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Button asChild className="h-10 rounded-full px-4"><NavLink to="/dashboard?tour=1"><CirclePlay className="h-4 w-4" />Iniciar tour</NavLink></Button>
            <Button asChild variant="outline" className="h-10 rounded-full border-border bg-background/62 px-4 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/guia"><Compass className="h-4 w-4" />Ver guia</NavLink></Button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="eyebrow-label mb-2 px-1">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <NavLink key={item.href} to={item.href} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => cn("group flex items-center gap-3 rounded-[18px] border px-3.5 py-3 transition-all duration-150 ease-out", isActive ? "border-accent/28 bg-accent/10 text-foreground shadow-[0_14px_28px_-26px_hsl(var(--accent))]" : "border-border/80 bg-card/55 text-foreground hover:border-accent/16 hover:bg-secondary/45")}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-secondary text-accent"><item.icon className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.helper}</p></div>
                  {item.href in navigationCounts ? <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">{navigationCounts[item.href as keyof typeof navigationCounts]}</span> : <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="surface-soft mt-6 rounded-[24px] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Ambiente ativo</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Sincronizacao, contexto e volume atual da operacao.</p>
          </div>
          <Badge className={integration.mode === "google" ? "status-success" : integration.mode === "mock" ? "status-warning" : "status-neutral"}>{integrationLabel}</Badge>
        </div>
        <div className="mt-4 grid gap-2">
          <div className="surface-subtle rounded-[16px] px-3.5 py-3"><p className="eyebrow-label">Leads abertos</p><p className="mt-2 text-2xl font-semibold text-foreground">{openLeads}</p></div>
          <div className="surface-subtle rounded-[16px] px-3.5 py-3"><p className="eyebrow-label">Projetos ativos</p><p className="mt-2 text-2xl font-semibold text-foreground">{activeProjects}</p></div>
          <div className="surface-subtle rounded-[16px] px-3.5 py-3"><p className="eyebrow-label">Itens descartados</p><p className="mt-2 text-2xl font-semibold text-foreground">{archive.length}</p></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.16),transparent_22%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.08),transparent_32%)]" /><div className="app-grid absolute inset-0 opacity-[0.52]" /></div>
      <AnimatePresence>
        {mobileMenuOpen ? <><motion.button type="button" aria-label="Fechar menu" className="fixed inset-0 z-40 bg-background/72 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} /><motion.aside initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[324px] overflow-y-auto overscroll-contain border-r border-border/70 bg-sidebar-background/96 p-4 pb-6 pr-3 backdrop-blur-xl lg:hidden"><div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-foreground">Menu operacional</p><Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/80 bg-card/88 text-foreground hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}><X className="h-4 w-4" /></Button></div>{sidebarContent}</motion.aside></> : null}
      </AnimatePresence>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] overflow-y-auto overscroll-contain border-r border-sidebar-border/80 bg-sidebar-background/92 p-5 pb-6 pr-3 backdrop-blur-xl lg:block">{sidebarContent}</aside>
      <div className="relative z-10 lg:pl-[300px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/84 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/80 bg-card/88 text-foreground hover:bg-secondary lg:hidden" onClick={() => setMobileMenuOpen(true)}><Menu className="h-4 w-4" /></Button>
              <div className="min-w-0"><p className="eyebrow-label">{pageMeta.kicker}</p><h1 className="truncate text-lg font-semibold text-foreground sm:text-[1.55rem]">{pageMeta.title}</h1><p className="mt-1 hidden text-sm text-muted-foreground md:block">{pageMeta.description}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle variant="header" />
              <div className="hidden items-center gap-2 xl:flex">
                <Badge className="status-neutral">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</Badge>
                <Badge className={integration.mode === "google" ? "status-success" : "status-neutral"}><Wifi className="mr-1.5 h-3 w-3" />{bootstrapQuery.isFetching ? "Sincronizando" : integrationLabel}</Badge>
                {syncedAt ? <Badge className="status-neutral">Atualizado {format(new Date(syncedAt), "HH:mm")}</Badge> : null}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <AnimatePresence mode="wait"><motion.div key={location.pathname + location.search} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}>{isBootstrapping ? <RouteSkeleton /> : <Outlet context={{ pageMeta, isBootstrapping, isSyncing: bootstrapQuery.isFetching }} />}</motion.div></AnimatePresence>
        </main>
      </div>
    </div>
  );
}
