import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { formatShortDate, getLeadStatusClasses } from "@/lib/os-helpers";
import { formatCurrency } from "@/lib/quote";
import { useCreateLeadMutation } from "@/hooks/use-os-sync";
import { useOsStore } from "@/store/os-store";
import { LEAD_STATUS_OPTIONS, LEAD_TAG_OPTIONS } from "@/types/os";

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
  nextContact: "2026-03-10",
  tags: [],
};

export function CrmPage() {
  const leads = useOsStore((state) => state.leads);
  const createLeadMutation = useCreateLeadMutation();

  const form = useForm<CrmFormValues>({
    resolver: zodResolver(crmSchema),
    defaultValues,
  });

  const onSubmit = async (values: CrmFormValues) => {
    const result = await createLeadMutation.mutateAsync(values);
    form.reset(defaultValues);
    toast.success(result.persisted ? "Lead enviado para a camada remota." : "Lead salvo localmente. Configure Google para persistencia remota.");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Novo lead ou cliente</CardTitle>
          <CardDescription>Cadastre oportunidades, preencha os dados minimos e deixe o follow-up agendado.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <label
                          key={tag}
                          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3"
                        >
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

            <Button type="submit" className="w-full rounded-2xl" disabled={createLeadMutation.isPending}>
              {createLeadMutation.isPending ? "Salvando..." : "Registrar no CRM"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Pipeline atual</CardTitle>
          <CardDescription>Visao consolidada dos leads e clientes salvos localmente nesta primeira fase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proximo contato</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Etiquetas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLeadStatusClasses(lead.status)}>{lead.status}</Badge>
                  </TableCell>
                  <TableCell>{formatShortDate(lead.nextContact)}</TableCell>
                  <TableCell>{formatCurrency(lead.proposedValue)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} className="border-border/60 bg-card/70 text-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
