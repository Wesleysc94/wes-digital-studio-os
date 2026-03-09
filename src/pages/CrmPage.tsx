import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Archive, CheckCircle2, UserPlus } from "lucide-react";
import { formatShortDate, getLeadStatusClasses } from "@/lib/os-helpers";
import { formatCurrency } from "@/lib/quote";
import { useArchiveLeadMutation, useCreateLeadMutation } from "@/hooks/use-os-sync";
import { useOsStore } from "@/store/os-store";
import { ARCHIVE_REASON_OPTIONS, LEAD_STATUS_OPTIONS, LEAD_TAG_OPTIONS, type ArchiveReason, type Lead } from "@/types/os";

const crmSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  company: z.string().min(2, "Informe a empresa."),
  segment: z.string().min(2, "Informe o segmento."),
  city: z.string().min(2, "Informe a cidade."),
  instagram: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().min(8, "Informe um telefone valido."),
  source: z.string().min(2, "Informe a origem do lead."),
  status: z.enum(LEAD_STATUS_OPTIONS),
  proposedValue: z.coerce.number().min(0, "Valor invalido."),
  notes: z.string().optional(),
  nextContact: z.string().min(1, "Defina o proximo contato."),
  tags: z.array(z.enum(LEAD_TAG_OPTIONS)).default([]),
});

type CrmFormValues = z.infer<typeof crmSchema>;

function getDateOffset(days: number) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toISOString().slice(0, 10);
}

const defaultValues: CrmFormValues = {
  name: "",
  company: "",
  segment: "",
  city: "",
  instagram: "",
  website: "",
  phone: "",
  source: "",
  status: "Novo lead",
  proposedValue: 0,
  notes: "",
  nextContact: getDateOffset(1),
  tags: [],
};

function getArchiveReasonForLead(lead: Lead): ArchiveReason {
  if (lead.tags.includes("Sem resposta")) {
    return "Sem resposta";
  }

  if (lead.proposedValue > 2500) {
    return "Preco fora do contexto";
  }

  return "Nao teve fit";
}

export function CrmPage() {
  const leads = useOsStore((state) => state.leads);
  const projects = useOsStore((state) => state.projects);
  const createLeadMutation = useCreateLeadMutation();
  const archiveLeadMutation = useArchiveLeadMutation();

  const form = useForm<CrmFormValues>({
    resolver: zodResolver(crmSchema),
    defaultValues,
  });

  const activeLeads = leads.filter((lead) => lead.status !== "Perdido");
  const lostLeads = leads.filter((lead) => lead.status === "Perdido");
  const wonLeads = activeLeads.filter((lead) => lead.status === "Fechado");
  const productionCompanies = new Set(projects.map((project) => project.company));

  const onSubmit = async (values: CrmFormValues) => {
    const result = await createLeadMutation.mutateAsync({
      name: values.name,
      company: values.company,
      segment: values.segment,
      city: values.city,
      instagram: values.instagram ?? "",
      website: values.website ?? "",
      phone: values.phone,
      source: values.source,
      status: values.status,
      proposedValue: values.proposedValue,
      notes: values.notes ?? "",
      nextContact: values.nextContact,
      tags: values.tags,
    });
    form.reset(defaultValues);
    toast.success(result.persisted ? "Lead enviado para a camada remota." : "Lead salvo localmente. Configure Google para persistencia remota.");
  };

  const handleArchiveLead = async (lead: Lead) => {
    const result = await archiveLeadMutation.mutateAsync({
      lead,
      reason: getArchiveReasonForLead(lead),
      notes: lead.notes || "Movido manualmente para a area de descartados.",
    });

    toast.success(result.persisted ? "Lead movido para descartados e retirado do radar principal." : "Lead movido localmente para descartados.");
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Fluxo comercial"
        title="Cadastre, acompanhe e descarte sem deixar o pipeline virar bagunca"
        description="O CRM agora serve para duas coisas: manter os leads vivos com proximo passo claro e tirar do radar o que nao faz mais sentido para a operacao."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Leads ativos</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{activeLeads.filter((lead) => !["Fechado"].includes(lead.status)).length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Oportunidades ainda em negociacao ou follow-up.</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Fechados</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{wonLeads.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Clientes que sairam do comercial e ja entraram no pos-venda.</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[1.75rem]">
          <CardContent className="p-5">
            <p className="eyebrow-label">Descartados</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{lostLeads.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Leads removidos da operacao principal para limpeza do radar.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Novo lead ou cliente</CardTitle>
            <CardDescription>Cadastre oportunidades, preencha o contexto minimo e deixe o follow-up preparado desde a entrada.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="crm-form" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...form.register("name")} />
                  <p className="text-xs text-rose-300">{form.formState.errors.name?.message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" {...form.register("company")} />
                  <p className="text-xs text-rose-300">{form.formState.errors.company?.message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <Input id="segment" {...form.register("segment")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...form.register("city")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" {...form.register("instagram")} placeholder="@perfil" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...form.register("website")} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...form.register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Origem do lead</Label>
                  <Input id="source" {...form.register("source")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedValue">Valor proposto</Label>
                  <Input id="proposedValue" type="number" {...form.register("proposedValue")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextContact">Proximo contato</Label>
                  <Input id="nextContact" type="date" {...form.register("nextContact")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Etiquetas</Label>
                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {LEAD_TAG_OPTIONS.map((tag) => {
                        const checked = field.value.includes(tag);

                        return (
                          <label key={tag} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(nextValue) => {
                                if (nextValue) {
                                  field.onChange([...field.value, tag]);
                                  return;
                                }

                                field.onChange(field.value.filter((currentTag) => currentTag !== tag));
                              }}
                            />
                            <span className="text-sm text-foreground">{tag}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observacoes</Label>
                <Textarea id="notes" rows={4} {...form.register("notes")} />
              </div>

              <Button type="submit" className="w-full rounded-full" disabled={createLeadMutation.isPending}>
                {createLeadMutation.isPending ? "Salvando..." : "Registrar no CRM"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Pipeline atual</CardTitle>
            <CardDescription>O radar principal fica limpo quando o que fechou vai para producao e o que perdeu tracao vai para descartados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeLeads.length ? (
              activeLeads.map((lead) => {
                const isInProduction = productionCompanies.has(lead.company);
                const isClosed = lead.status === "Fechado";

                return (
                  <div key={lead.id} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{lead.company}</p>
                          <Badge className={getLeadStatusClasses(lead.status)}>{lead.status}</Badge>
                          {isInProduction ? <Badge className="status-success">Na producao</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{lead.name} • proximo contato {formatShortDate(lead.nextContact)}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{formatCurrency(lead.proposedValue)}</p>
                        <p>{lead.city}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{lead.notes || "Sem observacao registrada."}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} className="border-border/60 bg-card/70 text-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {!isClosed ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-border bg-card/70 text-foreground hover:bg-secondary hover:text-foreground"
                          onClick={() => handleArchiveLead(lead)}
                          disabled={archiveLeadMutation.isPending}
                        >
                          <Archive className="h-4 w-4" />
                          Mover para descartados
                        </Button>
                      ) : null}
                      {isClosed && isInProduction ? (
                        <Button asChild className="rounded-full">
                          <a href="/producao">
                            <CheckCircle2 className="h-4 w-4" />
                            Acompanhar na producao
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyStateCard
                icon={UserPlus}
                title="Seu pipeline ainda esta vazio"
                description="Comece registrando o primeiro lead com nome, empresa, status e proximo contato. A partir dai o CRM passa a orientar seu dia."
                actionLabel="Cadastrar primeiro lead"
                actionHref="/crm#crm-form"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
