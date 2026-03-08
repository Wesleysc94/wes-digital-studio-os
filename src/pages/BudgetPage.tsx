import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProposalStatusClasses } from "@/lib/os-helpers";
import { formatCurrency, PROPOSAL_EXTRAS, PROJECT_PLANS, calculateQuote } from "@/lib/quote";
import { useCreateProposalMutation } from "@/hooks/use-os-sync";
import { useOsStore } from "@/store/os-store";
import { PROJECT_PLAN_KEYS, PROPOSAL_EXTRA_KEYS } from "@/types/os";

const budgetSchema = z.object({
  clientName: z.string().min(2, "Informe o nome do cliente."),
  company: z.string().min(2, "Informe a empresa."),
  projectType: z.enum(PROJECT_PLAN_KEYS),
  extras: z.array(z.enum(PROPOSAL_EXTRA_KEYS)).default([]),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const defaultValues: BudgetFormValues = {
  clientName: "",
  company: "",
  projectType: "site-institucional",
  extras: ["manutencao-mensal"],
};

export function BudgetPage() {
  const proposals = useOsStore((state) => state.proposals);
  const createProposalMutation = useCreateProposalMutation();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  const watchedProjectType = useWatch({ control: form.control, name: "projectType" }) ?? defaultValues.projectType;
  const watchedExtras = useWatch({ control: form.control, name: "extras" }) ?? defaultValues.extras;
  const quotePreview = calculateQuote(watchedProjectType, watchedExtras);

  const onSubmit = async (values: BudgetFormValues) => {
    const calculatedQuote = calculateQuote(values.projectType, values.extras);

    const result = await createProposalMutation.mutateAsync({
      clientName: values.clientName,
      company: values.company,
      projectType: values.projectType,
      extras: values.extras,
      implementationTotal: calculatedQuote.implementationTotal,
      monthlyRecurring: calculatedQuote.monthlyRecurring,
      summary: `${PROJECT_PLANS[values.projectType].label} com ${values.extras.length} extra(s).`,
      status: "draft",
    });

    form.reset(defaultValues);
    toast.success(result.persisted ? "Orcamento salvo na camada remota." : "Orcamento salvo localmente. Falta configurar Google.");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Montar proposta</CardTitle>
          <CardDescription>Defina o escopo base, selecione extras e gere um resumo comercial claro.</CardDescription>
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
                        <label
                          key={extraKey}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-4"
                        >
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

            <Button type="submit" className="w-full rounded-2xl" disabled={createProposalMutation.isPending}>
              {createProposalMutation.isPending ? "Gerando..." : "Gerar orcamento"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Resumo executivo</CardTitle>
            <CardDescription>Vista pronta para apresentar ao cliente no WhatsApp, chamada ou proposta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-accent">Plano base</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{PROJECT_PLANS[watchedProjectType].label}</h3>
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
                  {watchedExtras.length ? (
                    watchedExtras.map((extraKey) => <p key={extraKey}>{PROPOSAL_EXTRAS[extraKey].label}</p>)
                  ) : (
                    <p>Nenhum extra selecionado.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-accent/30 bg-accent/10 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-accent">Implantacao</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{formatCurrency(quotePreview.implementationTotal)}</p>
              </div>
              <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Recorrencia</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{formatCurrency(quotePreview.monthlyRecurring)}/mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Historico de propostas</CardTitle>
            <CardDescription>Registro das propostas geradas nesta instancia inicial do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Implantacao</TableHead>
                  <TableHead>Recorrencia</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{proposal.clientName}</p>
                        <p className="text-sm text-muted-foreground">{proposal.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>{PROJECT_PLANS[proposal.projectType].label}</TableCell>
                    <TableCell>{formatCurrency(proposal.implementationTotal)}</TableCell>
                    <TableCell>{formatCurrency(proposal.monthlyRecurring)}</TableCell>
                    <TableCell>
                      <Badge className={getProposalStatusClasses(proposal.status)}>
                        {proposal.status === "accepted" ? "Aceita" : proposal.status === "sent" ? "Enviada" : "Rascunho"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
