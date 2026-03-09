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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteSkeleton } from "@/components/os/RouteSkeleton";
import { cn } from "@/lib/utils";
import { useOsBootstrap } from "@/hooks/use-os-sync";
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
    description: "Entenda o contexto do dia, o que exige acao e qual e o proximo movimento recomendado.",
  },
  "/crm": {
    kicker: "Pipeline comercial",
    title: "CRM de leads e clientes",
    description: "Cadastre oportunidades, acompanhe respostas e mantenha a negociacao organizada.",
  },
  "/orcamentos": {
    kicker: "Fechamento comercial",
    title: "Gerador de orcamentos",
    description: "Construa propostas claras, com escopo, extras e recorrencia bem separados.",
  },
  "/funil": {
    kicker: "Playbook de vendas",
    title: "Funil de vendas",
    description: "Use mensagens consultivas, estrategia de etapa e roteiro de fechamento sem improviso.",
  },
  "/manual": {
    kicker: "Operacao interna",
    title: "Manual da operacao",
    description: "Regras comerciais, entrega, manutencao e renovacao para padronizar a agencia.",
  },
  "/tarefas": {
    kicker: "Execucao diaria",
    title: "Tarefas e manutencoes",
    description: "Priorize entregas, follow-ups e itens recorrentes sem perder contexto.",
  },
  "/configuracoes": {
    kicker: "Infraestrutura",
    title: "Configuracoes do sistema",
    description: "Acompanhe integracoes, sincronizacao e preferencias do ambiente em tempo real.",
  },
};

const NAV_GROUPS = [
  {
    label: "Hoje",
    items: [{ href: "/dashboard", label: "Dashboard", helper: "Visao executiva", icon: LayoutDashboard }],
  },
  {
    label: "Comercial",
    items: [
      { href: "/crm", label: "CRM", helper: "Leads e clientes", icon: Users },
      { href: "/orcamentos", label: "Orcamentos", helper: "Propostas e planos", icon: ReceiptText },
      { href: "/funil", label: "Funil", helper: "Playbook de vendas", icon: Orbit },
    ],
  },
  {
    label: "Operacao",
    items: [
      { href: "/manual", label: "Manual", helper: "Base da agencia", icon: BookOpen },
      { href: "/tarefas", label: "Tarefas", helper: "Execucao e manutencao", icon: CheckSquare },
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
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_80px_-50px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent)),rgba(255,255,255,0.78))] text-slate-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">WES Digital Studio</p>
            <p className="truncate text-lg font-semibold text-white">OS operacional</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/60">
          CRM, funil, orcamentos, tarefas e manual em uma unica camada de operacao.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.28em] text-white/32">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-[22px] border px-4 py-3 transition-all duration-200",
                      isActive
                        ? "border-accent/50 bg-accent/12 text-white shadow-[0_18px_50px_-34px_hsl(var(--accent))]"
                        : "border-white/8 bg-white/[0.025] text-white/72 hover:border-white/16 hover:bg-white/[0.05]",
                    )
                  }
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 text-accent">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-white/42">{item.helper}</p>
                  </div>
                  {item.href in navigationCounts ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70">
                      {navigationCounts[item.href as keyof typeof navigationCounts]}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-white/28 transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Saude do sistema</p>
            <p className="mt-1 text-xs leading-5 text-white/42">Status da camada remota e da sincronizacao.</p>
          </div>
          <Badge className="border-accent/30 bg-accent/10 text-accent">{integrationLabel}</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/32">Leads abertos</p>
            <p className="mt-2 text-2xl font-semibold text-white">{openLeads}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/32">Propostas no radar</p>
            <p className="mt-2 text-2xl font-semibold text-white">{sentProposals}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/32">Pendencias abertas</p>
            <p className="mt-2 text-2xl font-semibold text-white">{pendingTasks}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ThemeToggle variant="compact" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(44,195,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(21,38,86,0.26),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.28),rgba(2,6,23,0.08))]" />
        <div className="app-grid absolute inset-0 opacity-35" />
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-slate-950/74 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[324px] border-r border-white/10 bg-[#07111f]/96 p-4 backdrop-blur-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Menu operacional</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
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

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[296px] border-r border-white/8 bg-[#07111f]/88 p-5 backdrop-blur-2xl lg:block">
        {sidebarContent}
      </aside>

      <div className="relative z-10 lg:pl-[296px]">
        <header className="sticky top-0 z-20 border-b border-white/8 bg-background/78 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/38">{pageMeta.kicker}</p>
                <h1 className="truncate text-lg font-semibold text-white sm:text-2xl">{pageMeta.title}</h1>
                <p className="mt-1 hidden text-sm text-white/48 md:block">{pageMeta.description}</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 xl:flex">
              <Badge className="border-white/10 bg-white/[0.04] text-white/78">
                {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
              </Badge>
              <Badge className="border-white/10 bg-white/[0.04] text-white/72">
                <Wifi className="mr-1.5 h-3.5 w-3.5" />
                {bootstrapQuery.isFetching ? "Sincronizando" : integrationLabel}
              </Badge>
              {syncedAt ? (
                <Badge className="border-white/10 bg-white/[0.04] text-white/72">
                  Atualizado {format(new Date(syncedAt), "HH:mm")}
                </Badge>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {isBootstrapping ? <RouteSkeleton /> : <Outlet context={{ pageMeta, isBootstrapping, isSyncing: bootstrapQuery.isFetching }} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
