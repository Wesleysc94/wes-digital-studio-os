import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  ChevronRight,
  Cog,
  LayoutDashboard,
  Menu,
  Orbit,
  ReceiptText,
  Sparkles,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { RouteSkeleton } from "@/components/os/RouteSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOsBootstrap } from "@/hooks/use-os-sync";
import { cn } from "@/lib/utils";
import { useOsStore } from "@/store/os-store";

type RouteMeta = {
  kicker: string;
  title: string;
  description: string;
};

export type AppShellOutletContext = {
  pageMeta: RouteMeta;
  isBootstrapping: boolean;
  isSyncing: boolean;
};

const ROUTE_META: Record<string, RouteMeta> = {
  "/dashboard": {
    kicker: "Central operacional",
    title: "Dashboard operacional",
    description: "Leia o momento do dia, veja a prioridade principal e entre em execucao sem perder contexto.",
  },
  "/crm": {
    kicker: "Pipeline comercial",
    title: "CRM de leads e clientes",
    description: "Cadastre, acompanhe e mova oportunidades com clareza de status e proximo contato.",
  },
  "/orcamentos": {
    kicker: "Fechamento comercial",
    title: "Gerador de orcamentos",
    description: "Monte propostas claras, recorrencia e extras sem improviso na conversa comercial.",
  },
  "/funil": {
    kicker: "Playbook de vendas",
    title: "Funil de vendas",
    description: "Use estrategia, copy e direcionamento por etapa para conduzir a negociacao com mais seguranca.",
  },
  "/manual": {
    kicker: "Base da operacao",
    title: "Manual da operacao",
    description: "Padrao de venda, entrega, manutencao e renovacao para reduzir atrito operacional.",
  },
  "/tarefas": {
    kicker: "Execucao diaria",
    title: "Tarefas e manutencoes",
    description: "Priorize follow-ups, entregas e manutencoes em uma fila objetiva de trabalho.",
  },
  "/configuracoes": {
    kicker: "Infraestrutura",
    title: "Configuracoes do sistema",
    description: "Confira integracoes, sincronizacao e preferencia visual do ambiente.",
  },
};

const NAV_GROUPS = [
  {
    label: "Hoje",
    items: [{ href: "/dashboard", label: "Dashboard", helper: "Leitura executiva", icon: LayoutDashboard }],
  },
  {
    label: "Comercial",
    items: [
      { href: "/crm", label: "CRM", helper: "Leads e clientes", icon: Users },
      { href: "/orcamentos", label: "Orcamentos", helper: "Propostas e planos", icon: ReceiptText },
      { href: "/funil", label: "Funil", helper: "Playbook comercial", icon: Orbit },
    ],
  },
  {
    label: "Operacao",
    items: [
      { href: "/manual", label: "Manual", helper: "Regras da agencia", icon: BookOpen },
      { href: "/tarefas", label: "Tarefas", helper: "Fila operacional", icon: CheckSquare },
      { href: "/configuracoes", label: "Configuracoes", helper: "Integracoes e tema", icon: Cog },
    ],
  },
] as const;

export function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bootstrapQuery = useOsBootstrap();

  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);
  const integration = useOsStore((state) => state.integration);
  const syncedAt = useOsStore((state) => state.syncedAt);

  const pageMeta = ROUTE_META[location.pathname] ?? ROUTE_META["/dashboard"];
  const isBootstrapping = bootstrapQuery.isLoading && !syncedAt;
  const openLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const sentProposals = proposals.filter((proposal) => proposal.status === "sent").length;
  const pendingTasks = tasks.filter((task) => task.status !== "Concluida").length;

  const integrationLabel =
    integration.mode === "google" ? "Google online" : integration.mode === "mock" ? "Modo mock" : "Modo local";

  const navigationCounts = useMemo(
    () => ({
      "/crm": openLeads,
      "/orcamentos": proposals.length,
      "/funil": sentProposals,
      "/tarefas": pendingTasks,
    }),
    [openLeads, pendingTasks, proposals.length, sentProposals],
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="surface-panel rounded-[24px] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="eyebrow-label">WES Digital Studio</p>
            <p className="truncate text-lg font-semibold text-foreground">OS operacional</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          CRM, propostas, tarefas e playbook em um fluxo unico de operacao.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="eyebrow-label mb-2 px-1">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-[18px] border px-3.5 py-3 transition-all duration-150 ease-out",
                      isActive
                        ? "border-accent/28 bg-accent/10 text-foreground shadow-[0_14px_28px_-26px_hsl(var(--accent))]"
                        : "border-border/80 bg-card/55 text-foreground hover:border-accent/16 hover:bg-secondary/45",
                    )
                  }
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-secondary text-accent">
                    <item.icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.helper}</p>
                  </div>

                  {item.href in navigationCounts ? (
                    <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                      {navigationCounts[item.href as keyof typeof navigationCounts]}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="surface-soft mt-6 rounded-[22px] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Ambiente ativo</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Sincronizacao e volume operacional da instancia.</p>
          </div>
          <Badge className={integration.mode === "google" ? "status-success" : integration.mode === "mock" ? "status-warning" : "status-neutral"}>
            {integrationLabel}
          </Badge>
        </div>

        <div className="mt-4 grid gap-2">
          <div className="surface-subtle rounded-[16px] px-3.5 py-3">
            <p className="eyebrow-label">Leads abertos</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{openLeads}</p>
          </div>
          <div className="surface-subtle rounded-[16px] px-3.5 py-3">
            <p className="eyebrow-label">Propostas no radar</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{sentProposals}</p>
          </div>
          <div className="surface-subtle rounded-[16px] px-3.5 py-3">
            <p className="eyebrow-label">Pendencias abertas</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{pendingTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.08),transparent_22%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.05),transparent_26%)]" />
        <div className="app-grid absolute inset-0 opacity-30" />
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-background/72 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[324px] border-r border-border/70 bg-sidebar-background/95 p-4 backdrop-blur-xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Menu operacional</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-border/80 bg-card/88 text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[284px] border-r border-sidebar-border/80 bg-sidebar-background/92 p-5 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      <div className="relative z-10 lg:pl-[284px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/86 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-border/80 bg-card/88 text-foreground hover:bg-secondary lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <p className="eyebrow-label">{pageMeta.kicker}</p>
                <h1 className="truncate text-lg font-semibold text-foreground sm:text-[1.55rem]">{pageMeta.title}</h1>
                <p className="mt-1 hidden text-sm text-muted-foreground md:block">{pageMeta.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle variant="header" />
              <div className="hidden items-center gap-2 xl:flex">
                <Badge className="status-neutral">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</Badge>
                <Badge className={integration.mode === "google" ? "status-success" : "status-neutral"}>
                  <Wifi className="mr-1.5 h-3 w-3" />
                  {bootstrapQuery.isFetching ? "Sincronizando" : integrationLabel}
                </Badge>
                {syncedAt ? <Badge className="status-neutral">Atualizado {format(new Date(syncedAt), "HH:mm")}</Badge> : null}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {isBootstrapping ? <RouteSkeleton /> : <Outlet context={{ pageMeta, isBootstrapping, isSyncing: bootstrapQuery.isFetching }} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
