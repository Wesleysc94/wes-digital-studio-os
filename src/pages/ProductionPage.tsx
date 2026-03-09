import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { BriefcaseBusiness, CalendarClock, CheckCircle2, CircleGauge, Rocket, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompleteProjectMutation, useCreateProjectMutation } from "@/hooks/use-os-sync";
import { formatLongDate, formatRelativeLabel, getProjectStatusClasses, isDueWithinDays, isPastDue } from "@/lib/os-helpers";
import { formatCurrency, PROJECT_PLANS } from "@/lib/quote";
import { useOsStore } from "@/store/os-store";
import { PROJECT_PLAN_KEYS, type Project, type ProjectStatus } from "@/types/os";

const projectSchema = z.object({
  clientName: z.string().min(2, "Informe o nome do cliente."),
  company: z.string().min(2, "Informe a empresa."),
  projectType: z.enum(PROJECT_PLAN_KEYS),
  dueDate: z.string().min(1, "Defina o prazo de entrega."),
  nextMilestone: z.string().min(1, "Defina o proximo marco."),
  implementationTotal: z.coerce.number().min(0, "Valor invalido."),
  monthlyRecurring: z.coerce.number().min(0, "Valor invalido."),
  maintenanceActive: z.boolean().default(false),
  notes: z.string().optional(),
  deliverySummary: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function getDateOffset(days: number) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toISOString().slice(0, 10);
}

const defaultValues: ProjectFormValues = {
  clientName: "",
  company: "",
  projectType: "site-institucional",
  dueDate: getDateOffset(7),
  nextMilestone: getDateOffset(2),
  implementationTotal: 1200,
  monthlyRecurring: 97,
  maintenanceActive: true,
  notes: "",
  deliverySummary: "",
};

const projectStatusOrder: ProjectStatus[] = [
  "Kickoff",
  "Briefing",
  "Em producao",
  "Aguardando cliente",
  "Revisao",
  "Pronto para entrega",
  "Entregue",
  "Concluido",
];

function getNextProjectStatus(status: ProjectStatus) {
  const currentIndex = projectStatusOrder.indexOf(status);
  return projectStatusOrder[Math.min(currentIndex + 1, projectStatusOrder.length - 1)];
}

export function ProductionPage() {
  const projects = useOsStore((state) => state.projects);
  const completedProjects = useOsStore((state) => state.completedProjects);
  const createProjectMutation = useCreateProjectMutation();
  const completeProjectMutation = useCompleteProjectMutation();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const activeProjects = projects.filter((project) => project.status !== "Concluido");
  const blockedProjects = activeProjects.filter((project) => project.status === "Aguardando cliente");
  const dueSoonProjects = activeProjects.filter((project) => isDueWithinDays(project.dueDate, 7));
  const overdueProjects = activeProjects.filter((project) => isPastDue(project.dueDate));

  const onSubmit = async (values: ProjectFormValues) => {
    const result = await createProjectMutation.mutateAsync({
      leadId: "",
      proposalId: "",
      clientName: values.clientName,
      company: values.company,
      projectType: values.projectType,
      status: "Kickoff",
      implementationTotal: values.implementationTotal,
      monthlyRecurring: values.monthlyRecurring,
      dueDate: values.dueDate,
      nextMilestone: values.nextMilestone,
      maintenanceActive: values.maintenanceActive,
      notes: values.notes ?? "",
      deliverySummary: values.deliverySummary ?? "",
    });

    form.reset(defaultValues);
    toast.success(result.persisted ? "Projeto de producao registrado no Google e no calendario." : "Projeto salvo localmente. Falta persistencia remota.");
  };

  const handleProjectStatus = async (project: Project, nextStatus: ProjectStatus) => {
    const result = await createProjectMutation.mutateAsync({
      ...project,
      status: nextStatus,
    });

    toast.success(result.persisted ? "Projeto atualizado com persistencia remota." : "Projeto atualizado localmente.");
  };

  const handleCompleteProject = async (project: Project) => {
    const result = await completeProjectMutation.mutateAsync({
      project,
      notes: project.notes || "Projeto finalizado e entregue ao cliente.",
      deliverySummary: project.deliverySummary || "Entrega concluida com onboarding e historico registrado.",
      deliveredAt: new Date().toISOString().slice(0, 10),
    });

    toast.success(result.persisted ? "Projeto concluido e historico registrado na planilha." : "Projeto concluido localmente.");
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Clientes ativos"
        title="Acompanhe o que ja fechou, o que esta em producao e o que precisa ser entregue"
        description="Esta e a esteira do pos-venda. Projeto aceito entra aqui, ganha prazo, prioridade e passa a disputar atencao acima da negociacao em aberto."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Projetos ativos</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{activeProjects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Clientes que ja fecharam e estao em execucao.</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Entrega nos proximos 7 dias</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{dueSoonProjects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Projetos com prazo proximo exigindo cadencia de producao.</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Bloqueados no cliente</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{blockedProjects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Itens aguardando retorno, assets ou aprovacao.</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Projetos concluidos</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{completedProjects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Historico vivo das entregas ja finalizadas.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Registrar projeto ativo</CardTitle>
            <CardDescription>Use esta entrada quando um contrato fechar e o cliente entrar na sua esteira de producao.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do cliente</Label>
                  <Input id="clientName" {...form.register("clientName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" {...form.register("company")} />
                </div>
                <div className="space-y-2">
                  <Label>Plano do projeto</Label>
                  <Controller
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_PLAN_KEYS.map((key) => (
                            <SelectItem key={key} value={key}>
                              {PROJECT_PLANS[key].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="implementationTotal">Valor da implantacao</Label>
                  <Input id="implementationTotal" type="number" {...form.register("implementationTotal")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRecurring">Recorrencia mensal</Label>
                  <Input id="monthlyRecurring" type="number" {...form.register("monthlyRecurring")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Prazo final</Label>
                  <Input id="dueDate" type="date" {...form.register("dueDate")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMilestone">Proximo marco</Label>
                  <Input id="nextMilestone" type="date" {...form.register("nextMilestone")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deliverySummary">Resumo da entrega</Label>
                  <Textarea id="deliverySummary" rows={3} {...form.register("deliverySummary")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notas operacionais</Label>
                  <Textarea id="notes" rows={4} {...form.register("notes")} />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-[1.5rem] border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground">
                <input type="checkbox" className="h-4 w-4" {...form.register("maintenanceActive")} />
                Cliente com manutencao ativa ou recorrencia prevista
              </label>

              <Button type="submit" className="w-full rounded-full" disabled={createProjectMutation.isPending}>
                {createProjectMutation.isPending ? "Registrando..." : "Enviar para producao"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Radar da esteira ativa</CardTitle>
              <CardDescription>Esses clientes devem aparecer no seu dia antes dos prospectos em aberto quando houver risco de prazo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.length ? (
                activeProjects.map((project) => (
                  <div key={project.id} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{project.company}</p>
                          <Badge className={getProjectStatusClasses(project.status)}>{project.status}</Badge>
                          {isPastDue(project.dueDate) ? <Badge className="status-danger">Prazo vencido</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{project.clientName} • entrega {formatLongDate(project.dueDate)}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Implantacao {formatCurrency(project.implementationTotal)}</p>
                        <p>Marco {formatRelativeLabel(project.nextMilestone)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="surface-soft rounded-[1.25rem] p-4">
                        <p className="eyebrow-label">Resumo de entrega</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.deliverySummary || "Sem resumo definido ainda."}</p>
                      </div>
                      <div className="surface-soft rounded-[1.25rem] p-4">
                        <p className="eyebrow-label">Notas vivas</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.notes || "Sem nota operacional registrada."}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-border bg-card/70 text-foreground hover:bg-secondary hover:text-foreground"
                        onClick={() => handleProjectStatus(project, getNextProjectStatus(project.status))}
                        disabled={project.status === "Concluido" || createProjectMutation.isPending}
                      >
                        <Rocket className="h-4 w-4" />
                        Avancar etapa
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-border bg-card/70 text-foreground hover:bg-secondary hover:text-foreground"
                        onClick={() => handleProjectStatus(project, "Aguardando cliente")}
                        disabled={createProjectMutation.isPending}
                      >
                        <TimerReset className="h-4 w-4" />
                        Aguardar cliente
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-border bg-card/70 text-foreground hover:bg-secondary hover:text-foreground"
                        onClick={() => handleProjectStatus(project, "Pronto para entrega")}
                        disabled={createProjectMutation.isPending}
                      >
                        <CircleGauge className="h-4 w-4" />
                        Pronto para entrega
                      </Button>
                      <Button type="button" className="rounded-full" onClick={() => handleCompleteProject(project)} disabled={completeProjectMutation.isPending}>
                        <CheckCircle2 className="h-4 w-4" />
                        Concluir
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyStateCard
                  icon={BriefcaseBusiness}
                  title="Nenhum projeto ativo na esteira"
                  description="Assim que um cliente fechar, registre o projeto aqui para acompanhar prazo, prioridade, entrega e historico final."
                  actionLabel="Registrar primeiro projeto"
                  actionHref="/producao"
                />
              )}
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Historico de entregas</CardTitle>
              <CardDescription>Projetos concluidos continuam visiveis para memoria, portfolio e acompanhamento de recorrencia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedProjects.length ? (
                completedProjects.map((project) => (
                  <div key={project.id} className="rounded-[1.5rem] border border-border/70 bg-card/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{project.company}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{project.clientName} • entregue {formatLongDate(project.deliveredAt)}</p>
                      </div>
                      <Badge className="status-success">Concluido</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.deliverySummary}</p>
                  </div>
                ))
              ) : (
                <EmptyStateCard
                  icon={CalendarClock}
                  title="Sem entregas concluidas ainda"
                  description="Quando voce concluir um projeto, ele entra automaticamente neste historico para consulta e memoria operacional."
                  actionLabel="Voltar para a esteira"
                  actionHref="/producao"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {overdueProjects.length ? (
        <Card className="glass-card rounded-[2rem] border border-rose-500/30">
          <CardContent className="flex items-start gap-3 p-5">
            <CalendarClock className="mt-1 h-5 w-5 text-rose-300" />
            <div>
              <p className="text-sm font-semibold text-foreground">Atencao: ha projeto com prazo vencido</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {overdueProjects.map((project) => project.company).join(", ")} esta com prazo estourado. O dashboard passa a priorizar esses clientes acima da negociacao em aberto.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
