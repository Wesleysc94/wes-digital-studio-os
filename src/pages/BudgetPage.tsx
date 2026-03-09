import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Rocket, Send, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLeadMutation, useCreateProjectMutation, useCreateProposalMutation } from "@/hooks/use-os-sync";
import { getProposalStatusClasses, getProposalStatusLabel } from "@/lib/os-helpers";
import { calculateQuote, formatCurrency, PROPOSAL_EXTRAS, PROJECT_PLANS } from "@/lib/quote";
import { useOsStore } from "@/store/os-store";
import { PROJECT_PLAN_KEYS, PROPOSAL_EXTRA_KEYS, type Proposal } from "@/types/os";

const budgetSchema = z.object({
  clientName: z.string().min(2, "Informe o nome do cliente."),
  company: z.string().min(2, "Informe a empresa."),
  projectType: z.enum(PROJECT_PLAN_KEYS),
  extras: z.array(z.enum(PROPOSAL_EXTRA_KEYS)).default([]),
  customTitle: z.string().optional(),
  implementationOverride: z.union([z.coerce.number().min(0), z.nan()]).optional(),
  recurringOverride: z.union([z.coerce.number().min(0), z.nan()]).optional(),
  pricingNotes: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const defaultValues: BudgetFormValues = {
  clientName: "",
  company: "",
  projectType: "site-institucional",
  extras: ["manutencao-mensal"],
  customTitle: "",
  implementationOverride: undefined,
  recurringOverride: undefined,
  pricingNotes: "",
};

function normalizeOptionalNumber(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
}

function getDateOffset(days: number) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toISOString().slice(0, 10);
}

export function BudgetPage() {
  const proposals = useOsStore((state) => state.proposals);
  const leads = useOsStore((state) => state.leads);
  const projects = useOsStore((state) => state.projects);
  const createProposalMutation = useCreateProposalMutation();
  const createProjectMutation = useCreateProjectMutation();
  const createLeadMutation = useCreateLeadMutation();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  const watchedProjectType = useWatch({ control: form.control, name: "projectType" }) ?? defaultValues.projectType;
  const watchedExtras = useWatch({ control: form.control, name: "extras" }) ?? defaultValues.extras;
  const watchedCustomTitle = useWatch({ control: form.control, name: "customTitle" }) ?? "";
  const watchedImplementationOverride = normalizeOptionalNumber(useWatch({ control: form.control, name: "implementationOverride" }));
  const watchedRecurringOverride = normalizeOptionalNumber(useWatch({ control: form.control, name: "recurringOverride" }));
  const watchedPricingNotes = useWatch({ control: form.control, name: "pricingNotes" }) ?? "";

  const quotePreview = calculateQuote(watchedProjectType, watchedExtras, {
    customTitle: watchedCustomTitle,
    implementationOverride: watchedImplementationOverride,
    recurringOverride: watchedRecurringOverride,
    pricingNotes: watchedPricingNotes,
  });

  const onSubmit = async (values: BudgetFormValues) => {
    const implementationOverride = normalizeOptionalNumber(values.implementationOverride);
    const recurringOverride = normalizeOptionalNumber(values.recurringOverride);
    const calculatedQuote = calculateQuote(values.projectType, values.extras, {
      customTitle: values.customTitle,
      implementationOverride,
      recurringOverride,
      pricingNotes: values.pricingNotes,
    });

    const result = await createProposalMutation.mutateAsync({
      clientName: values.clientName,
      company: values.company,
      projectType: values.projectType,
      extras: values.extras,
      implementationTotal: calculatedQuote.implementationTotal,
      monthlyRecurring: calculatedQuote.monthlyRecurring,
      summary: values.pricingNotes?.trim()
        ? `${calculatedQuote.planLabel}. Ajuste comercial registrado: ${values.pricingNotes}.`
        : `${calculatedQuote.planLabel} com ${values.extras.length} extra(s).`,
      status: "draft",
      customTitle: values.customTitle?.trim() ?? "",
      implementationOverride,
      recurringOverride,
      pricingNotes: values.pricingNotes?.trim() ?? "",
    });

    form.reset(defaultValues);
    toast.success(result.persisted ? "Orcamento salvo na camada remota." : "Orcamento salvo localmente. Falta configurar Google.");
  };

  const handleMarkAsSent = async (proposal: Proposal) => {
    const result = await createProposalMutation.mutateAsync({
      ...proposal,
      status: "sent",
    });

    toast.success(result.persisted ? "Proposta marcada como enviada." : "Proposta atualizada localmente.");
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    const existingProject = projects.find((project) => project.proposalId === proposal.id && project.status !== "Concluido");

    await createProposalMutation.mutateAsync({
      ...proposal,
      status: "accepted",
    });

    const relatedLead = leads.find((lead) => lead.company === proposal.company || lead.name === proposal.clientName);

    if (relatedLead && relatedLead.status !== "Fechado") {
      await createLeadMutation.mutateAsync({
        ...relatedLead,
        status: "Fechado",
      });
    }

    if (!existingProject) {
      await createProjectMutation.mutateAsync({
        leadId: relatedLead?.id ?? "",
        proposalId: proposal.id,
        clientName: proposal.clientName,
        company: proposal.company,
        projectType: proposal.projectType,
        status: "Kickoff",
        implementationTotal: proposal.implementationTotal,
        monthlyRecurring: proposal.monthlyRecurring,
        dueDate: getDateOffset(10),
        nextMilestone: getDateOffset(3),
        maintenanceActive: proposal.extras.includes("manutencao-mensal"),
        notes: "Projeto criado automaticamente a partir de proposta aceita.",
        deliverySummary: proposal.summary,
      });
    }

    toast.success(existingProject ? "Proposta aceita. O projeto ja estava na producao." : "Proposta aceita e projeto enviado para a esteira de producao.");
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Fechamento comercial"
        title="Monte proposta, ajuste valor fora do padrao e envie direto para a producao quando o contrato fechar"
        description="O orcamento deixou de ser rigido. Agora ele cobre base padrao, ajuste comercial e a passagem direta da proposta aceita para a esteira de entrega."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Montar proposta</CardTitle>
            <CardDescription>Defina o escopo base, aplique extras e registre ajustes comerciais quando a negociacao fugir do padrao.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="budget-form" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do cliente</Label>
                  <Input id="clientName" {...form.register("clientName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" {...form.register("company")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de projeto</Label>
                <Controller
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_PLAN_KEYS.map((projectKey) => (
                          <SelectItem key={projectKey} value={projectKey}>
                            {PROJECT_PLANS[projectKey].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-sm leading-relaxed text-muted-foreground">{PROJECT_PLANS[watchedProjectType].description}</p>
              </div>

              <div className="space-y-3">
                <Label>Extras disponiveis</Label>
                <Controller
                  control={form.control}
                  name="extras"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      {PROPOSAL_EXTRA_KEYS.map((extraKey) => {
                        const extra = PROPOSAL_EXTRAS[extraKey];
                        const checked = field.value.includes(extraKey);

                        return (
                          <label key={extraKey} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(nextValue) => {
                                  if (nextValue) {
                                    field.onChange([...field.value, extraKey]);
                                    return;
                                  }

                                  field.onChange(field.value.filter((currentKey) => currentKey !== extraKey));
                                }}
                              />
                              <div>
                                <p className="text-sm font-medium text-foreground">{extra.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {extra.type === "recurring" ? "Recorrencia mensal" : "Valor unico de implantacao"}
                                </p>
                              </div>
                            </div>
                            <Badge className="border-border/60 bg-card/70 text-foreground">{formatCurrency(extra.amount)}</Badge>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div className="surface-soft rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-foreground">Personalizacao comercial</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use estes campos quando a negociacao pedir um valor mais alto, desconto pontual ou uma descricao mais precisa do escopo fechado.
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customTitle">Titulo comercial personalizado</Label>
                    <Input id="customTitle" {...form.register("customTitle")} placeholder="Ex.: Site institucional premium com onboarding reforcado" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="implementationOverride">Implantacao personalizada</Label>
                    <Input id="implementationOverride" type="number" {...form.register("implementationOverride")} placeholder="Deixe vazio para usar o calculo padrao" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurringOverride">Recorrencia personalizada</Label>
                    <Input id="recurringOverride" type="number" {...form.register("recurringOverride")} placeholder="Deixe vazio para usar o calculo padrao" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pricingNotes">Justificativa do ajuste</Label>
                    <Textarea id="pricingNotes" rows={3} {...form.register("pricingNotes")} placeholder="Ex.: cliente pediu prazo maior, mais revisoes ou desconto estrategico para entrada." />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full" disabled={createProposalMutation.isPending}>
                {createProposalMutation.isPending ? "Gerando..." : "Salvar proposta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Resumo executivo</CardTitle>
              <CardDescription>Vista pronta para apresentar ao cliente com clareza de escopo, valor e eventual ajuste comercial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-accent">Plano base</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">{quotePreview.planLabel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{PROJECT_PLANS[watchedProjectType].description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Itens incluidos</p>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                    {quotePreview.includedItems.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Extras adicionados</p>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                    {watchedExtras.length ? watchedExtras.map((extraKey) => <p key={extraKey}>{PROPOSAL_EXTRAS[extraKey].label}</p>) : <p>Nenhum extra selecionado.</p>}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-accent/30 bg-accent/10 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-accent">Implantacao final</p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{formatCurrency(quotePreview.implementationTotal)}</p>
                  {watchedImplementationOverride !== null ? (
                    <p className="mt-2 text-xs text-muted-foreground">Padrao calculado: {formatCurrency(quotePreview.calculatedImplementation)}</p>
                  ) : null}
                </div>
                <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Recorrencia final</p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{formatCurrency(quotePreview.monthlyRecurring)}/mes</p>
                  {watchedRecurringOverride !== null ? (
                    <p className="mt-2 text-xs text-muted-foreground">Padrao calculado: {formatCurrency(quotePreview.calculatedRecurring)}/mes</p>
                  ) : null}
                </div>
              </div>

              {watchedPricingNotes ? (
                <div className="surface-soft rounded-[1.75rem] p-5">
                  <p className="eyebrow-label">Ajuste registrado</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{watchedPricingNotes}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Historico de propostas</CardTitle>
              <CardDescription>Cada proposta pode ser atualizada, enviada e promovida para producao quando o cliente fechar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposals.length ? (
                proposals.map((proposal) => {
                  const alreadyInProduction = projects.some((project) => project.proposalId === proposal.id && project.status !== "Concluido");

                  return (
                    <div key={proposal.id} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-foreground">{proposal.company}</p>
                            <Badge className={getProposalStatusClasses(proposal.status)}>{getProposalStatusLabel(proposal.status)}</Badge>
                            {alreadyInProduction ? <Badge className="status-success">Na producao</Badge> : null}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{proposal.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(proposal.implementationTotal)}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(proposal.monthlyRecurring)}/mes</p>
                        </div>
                      </div>

                      <div className="surface-soft mt-4 rounded-[1.5rem] p-4">
                        <p className="text-sm leading-6 text-muted-foreground">{proposal.summary}</p>
                        {proposal.pricingNotes ? <p className="mt-3 text-xs text-muted-foreground">Ajuste: {proposal.pricingNotes}</p> : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {proposal.status !== "sent" ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-border bg-card/70 text-foreground hover:bg-secondary hover:text-foreground"
                            onClick={() => handleMarkAsSent(proposal)}
                            disabled={createProposalMutation.isPending}
                          >
                            <Send className="h-4 w-4" />
                            Marcar enviada
                          </Button>
                        ) : null}
                        {proposal.status !== "accepted" ? (
                          <Button type="button" className="rounded-full" onClick={() => handleAcceptProposal(proposal)} disabled={createProposalMutation.isPending || createProjectMutation.isPending}>
                            <Rocket className="h-4 w-4" />
                            Aceitar e levar para producao
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyStateCard
                  icon={FileText}
                  title="Nenhuma proposta gerada ainda"
                  description="Quando voce montar o primeiro orcamento, essa area passa a guardar historico, status e a entrada direta na producao apos o aceite."
                  actionLabel="Gerar primeira proposta"
                  actionHref="/orcamentos#budget-form"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
