import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  Cog,
  LayoutDashboard,
  Orbit,
  ReceiptText,
  Sparkles,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useOsStore } from "@/store/os-store";
import { useOsBootstrap } from "@/hooks/use-os-sync";

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard operacional",
    description: "Visao executiva da micro-agencia com foco em pipeline, receita e follow-ups.",
  },
  "/crm": {
    title: "CRM de leads e clientes",
    description: "Cadastro, qualificacao e acompanhamento comercial em um unico fluxo.",
  },
  "/orcamentos": {
    title: "Gerador de orcamentos",
    description: "Monte propostas premium com implantacao e recorrencia calculadas no ato.",
  },
  "/funil": {
    title: "Funil de vendas",
    description: "Scripts prontos e mensagens de abordagem para acelerar sua prospeccao.",
  },
  "/manual": {
    title: "Manual da operacao",
    description: "Base interna com precos, processos, renovacoes e fluxo de entrega.",
  },
  "/tarefas": {
    title: "Tarefas e manutencoes",
    description: "Controle de execucao, prioridades e demandas recorrentes.",
  },
  "/configuracoes": {
    title: "Configuracoes do sistema",
    description: "Estado das integracoes, variaveis de ambiente e preferencias visuais.",
  },
};

export function AppShell() {
  const location = useLocation();
  useOsBootstrap();
  const leads = useOsStore((state) => state.leads);
  const proposals = useOsStore((state) => state.proposals);
  const tasks = useOsStore((state) => state.tasks);
  const integration = useOsStore((state) => state.integration);

  const pageMeta = ROUTE_META[location.pathname] ?? ROUTE_META["/dashboard"];
  const pendingTasks = tasks.filter((task) => task.status !== "Concluida").length;
  const openLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const sentProposals = proposals.filter((proposal) => proposal.status === "sent").length;

  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/crm", label: "CRM", icon: Users, badge: openLeads },
    { href: "/orcamentos", label: "Orcamentos", icon: ReceiptText, badge: proposals.length },
    { href: "/funil", label: "Funil", icon: Orbit, badge: sentProposals },
    { href: "/manual", label: "Manual", icon: BookOpen },
    { href: "/tarefas", label: "Tarefas", icon: CheckSquare, badge: pendingTasks },
    { href: "/configuracoes", label: "Configuracoes", icon: Cog },
  ] as const;

  return (
    <SidebarProvider defaultOpen>
      <div className="relative min-h-svh w-full overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 left-[-4rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="app-grid absolute inset-0 opacity-35" />
        </div>

        <Sidebar variant="inset" collapsible="offcanvas" className="border-r border-sidebar-border/70 bg-transparent">
          <SidebarHeader className="px-4 py-4">
            <div className="rounded-[1.75rem] border border-sidebar-border/70 bg-sidebar/80 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent via-accent/70 to-primary text-accent-foreground shadow-lg shadow-accent/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.28em] text-sidebar-foreground/60">Micro-agencia OS</p>
                  <p className="truncate text-lg font-semibold text-sidebar-foreground">Wes Digital Studio</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-sidebar-foreground/75">
                Operacao interna para vendas, propostas, tarefas e renovacoes sem depender de planilhas soltas.
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel>Navegacao</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.label}>
                        <NavLink to={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarSeparator />

          <SidebarFooter className="px-3 pb-4">
            <div className="rounded-[1.75rem] border border-sidebar-border/70 bg-sidebar/80 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">Painel ativo</p>
                  <p className="text-xs text-sidebar-foreground/65">Stack premium pronta para evoluir com APIs.</p>
                </div>
                <Badge className="border-accent/30 bg-accent/10 text-accent">v1 base</Badge>
              </div>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="relative bg-transparent">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/75 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-10 w-10 rounded-2xl border border-border/60 bg-card/70" />
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Wes Digital Studio OS</p>
                  <h1 className="text-xl font-semibold text-foreground">{pageMeta.title}</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <Badge className="border-border/60 bg-card/70 text-foreground">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</Badge>
                <Badge className="border-accent/30 bg-accent/10 text-accent">{openLeads} leads ativos</Badge>
                <Badge className="border-border/60 bg-card/70 text-foreground">
                  {integration.mode === "google" ? "Google online" : integration.mode === "mock" ? "Modo mock" : "Modo local"}
                </Badge>
                <Badge className="border-border/60 bg-card/70 text-foreground">{pendingTasks} tarefas pendentes</Badge>
              </div>
            </div>
          </header>

          <div className="relative z-10 px-4 py-6 md:px-6">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Operacao interna</p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{pageMeta.description}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
