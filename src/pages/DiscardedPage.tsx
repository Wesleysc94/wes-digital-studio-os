import { ArchiveRestore, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/os/EmptyStateCard";
import { SectionHeading } from "@/components/os/SectionHeading";
import { formatLongDate, getArchiveReasonClasses } from "@/lib/os-helpers";
import { useOsStore } from "@/store/os-store";

export function DiscardedPage() {
  const archive = useOsStore((state) => state.archive);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Descartados"
        title="Separe o que saiu da operacao ativa sem apagar o historico"
        description="Esta area funciona como uma lixeira organizada. Tudo que nao vai fechar sai do radar principal, mas continua consultavel para limpeza manual depois."
      />

      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Leads e clientes descartados</CardTitle>
          <CardDescription>Use esta tela para revisar o que saiu do radar e por qual motivo isso aconteceu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {archive.length ? (
            archive.map((item) => (
              <div key={item.id} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{item.company}</p>
                      <Badge className={getArchiveReasonClasses(item.reason)}>{item.reason}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.name} • movido em {formatLongDate(item.archivedAt)}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent">
                    <Trash2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="surface-soft mt-4 rounded-[1.5rem] p-4">
                  <p className="eyebrow-label">Motivo registrado</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.notes || "Sem observacao adicional."}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyStateCard
              icon={ArchiveRestore}
              title="Nenhum item descartado ainda"
              description="Quando uma oportunidade sair da operacao, mova para esta area para limpar o dashboard sem perder o historico da decisao."
              actionLabel="Voltar ao CRM"
              actionHref="/crm"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
