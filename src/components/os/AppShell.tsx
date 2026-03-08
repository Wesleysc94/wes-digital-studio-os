import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckSquare,
  ChevronRight,
  CircleDot,
  Cog,
  LayoutDashboard,
  Menu,
  Orbit,
  ReceiptText,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOsBootstrap } from "@/hooks/use-os-sync";
import { useOsStore } from "@/store/os-store";

type RouteMeta = {
  kicker: string;
  title: string;
  description: string;
};

const ROUTE_META: Record<string, RouteMeta> = {
  "/dashboard": {
    kicker: "Central operacional",
    title: "Dashboard operacional",
    description: "Leitura executiva da operacao comercial, follow-ups e receita da micro-agencia.",
  },
  "/crm": {
    kicker: "Pipeline comercial",
    title: "CRM de leads e clientes",
    description: "Cadastre oportunidades, acompanhe status e transforme contato em proposta com menos atrito.",
  },
  "/orcamentos": {
    kicker: "Fechamento comercial",
    title: "Gerador de orcamentos",
    description: "Monte propostas com escopo, extras, implantacao e recorrencia em uma unica tela.",
  },
  "/funil": {
    kicker: "Cadencia comercial",
    title: "Funil de vendas",
    description: "Scripts, respostas e mensagens para destravar prospeccao e follow-up sem improviso.",
  },
  "/manual": {
    kicker: "Base interna",
    title: "Manual da operacao",
    description: "Precos, fluxo de venda, entrega, manutencao e renovacoes documentados no mesmo sistema.",
  },
  "/tarefas": {
    kicker: "Execucao diaria",
    title: "Tarefas e manutencoes",
    description: "Controle o que precisa ser entregue, reaberto ou concluido sem depender de memoria.",
  },
  "/configuracoes": {
    kicker: "Infraestrutura",
    title: "Configuracoes do sistema",
    description: "Monitore integracoes, variaveis e modo operacional do ambiente em tempo real.",
  },
};

const NAVIGATION = [
  { href: "/dashboard", label: "Dashboard", helper: "Visao executiva", icon: LayoutDashboard },
  { href: "/crm", label: "CRM", helper: "Leads e clientes", icon: Users },
  { href: "/orcamentos", label: "Orcamentos", helper: "Propostas e planos", icon: ReceiptText },
  { href: "/funil", label: "Funil", helper: "Scripts de venda", icon: Orbit },
  { href: "/manual", label: "Manual", helper: "Base de conhecimento", icon: BookOpen },
  { href: "/tarefas", label: "Tarefas", helper: "Execucao diaria", icon: CheckSquare },
  { href: "/configuracoes", label: "Configuracoes", helper: "Integracoes e ambiente", icon: Cog },
] as const;

export function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useOsBootstrap();

  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);
  const integration = useOsStore((state) => state.integration);

  const pageMeta = ROUTE_META[location.pathname] ?? ROUTE_META["/dashboard"];

  const openLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const sentProposals = proposals.filter((proposal) => proposal.status === "sent").length;
  const pendingTasks = tasks.filter((task) => task.status !== "Concluida").length;
  const followUps = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status) && lead.nextContact).length;

  const quickActions = useMemo(
    () => [
      { href: "/crm", label: "Cadastrar lead", caption: "Abrir pipeline", tone: "primary" as const },
      { href: "/orcamentos", label: "Gerar proposta", caption: "Montar oferta", tone: "secondary" as const },
      { href: "/tarefas", label: "Organizar sprint", caption: "Executar agora", tone: "secondary" as const },
    ],
    [],
  );

  const integrationLabel =
    integration.mode === "google" ? "Google online" : integration.mode === "mock" ? "Modo mock" : "Modo local";

  const sideSummary = [
    { label: "Leads abertos", value: openLeads },
    { label: "Propostas em curso", value: sentProposals },
    { label: "Tarefas pendentes", value: pendingTasks },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent)),rgba(255,255,255,0.75))] text-slate-950 shadow-[0_18px_50px_-22px_hsl(var(--accent))]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Micro-agencia OS</p>
            <p className="truncate text-lg font-semibold text-white">Wes Digital Studio</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/68">
          Sistema interno para leads, propostas, tarefas e follow-ups com base operacional unica.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {NAVIGATION.map((item) => {
          const count =
            item.href === "/crm"
              ? openLeads
              : item.href === "/orcamentos"
                ? proposals.length
                : item.href === "/funil"
                  ? sentProposals
                  : item.href === "/tarefas"
                    ? pendingTasks
                    : undefined;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-[24px] border px-4 py-3 transition-all duration-200",
                  isActive
                    ? "border-accent/50 bg-accent/12 text-white shadow-[0_20px_70px_-38px_hsl(var(--accent))]"
                    : "border-white/6 bg-white/[0.025] text-white/72 hover:border-white/15 hover:bg-white/[0.045]",
                )
              }
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 text-accent">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-white/45">{item.helper}</p>
              </div>
              {count !== undefined ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/72">
                  {count}
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Ambiente ativo</p>
            <p className="mt-1 text-xs leading-5 text-white/45">Integracoes e cadencia operacional desta instancia.</p>
          </div>
          <Badge className="border-accent/30 bg-accent/10 text-accent">{integrationLabel}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {sideSummary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(44,195,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(23,37,84,0.28),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.28),rgba(2,6,23,0.04))]" />
        <div className="app-grid absolute inset-0 opacity-40" />
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] border-r border-white/10 bg-[#07111f]/96 p-4 backdrop-blur-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Navegacao</p>
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
        <header className="sticky top-0 z-20 border-b border-white/8 bg-background/72 backdrop-blur-xl">
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
              </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <Badge className="border-white/10 bg-white/[0.04] text-white/78">
                {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
              </Badge>
              <Badge className="border-accent/20 bg-accent/10 text-accent">{followUps} follow-ups</Badge>
              <Badge className="border-white/10 bg-white/[0.04] text-white/78">{integrationLabel}</Badge>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <section className="mb-8 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_360px]">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(5,10,20,0.88),rgba(8,28,44,0.72)_55%,rgba(37,99,235,0.18))] p-6 shadow-[0_32px_120px_-54px_rgba(0,0,0,0.75)] sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-accent/30 bg-accent/10 text-accent">Operacao interna</Badge>
                <Badge className="border-white/10 bg-white/[0.04] text-white/70">{openLeads} leads em aberto</Badge>
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">{pageMeta.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">{pageMeta.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <NavLink
                    key={action.href}
                    to={action.href}
                    className={cn(
                      "group inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      action.tone === "primary"
                        ? "border-accent/35 bg-accent/12 text-white hover:bg-accent/18"
                        : "border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.08]",
                    )}
                  >
                    <span>{action.label}</span>
                    <span className="text-white/45">{action.caption}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "Leads quentes", value: openLeads, helper: "Oportunidades que ainda precisam de acao." },
                { label: "Propostas ativas", value: sentProposals, helper: "Negociacoes em analise comercial." },
                { label: "Execucao da semana", value: pendingTasks, helper: "Itens pendentes para destravar faturamento." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">{item.label}</p>
                    <CircleDot className="h-4 w-4 text-accent" />
                  </div>
                  <p className="mt-4 text-4xl font-semibold text-white">{item.value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/58">{item.helper}</p>
                </div>
              ))}
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
