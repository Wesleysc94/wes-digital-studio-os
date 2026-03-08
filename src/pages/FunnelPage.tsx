import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { funnelTemplates } from "@/data/mock-operations";
import { getLeadStatusClasses } from "@/lib/os-helpers";
import { useOsStore } from "@/store/os-store";
import { LEAD_STATUS_OPTIONS } from "@/types/os";

export function FunnelPage() {
  const leads = useOsStore((state) => state.leads);

  const stageCounts = LEAD_STATUS_OPTIONS.map((status) => ({
    status,
    total: leads.filter((lead) => lead.status === status).length,
  }));

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success("Mensagem copiada para a area de transferencia.");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stageCounts.map((stage) => (
          <Card key={stage.status} className="glass-card rounded-[1.75rem]">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stage.status}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-foreground">{stage.total}</p>
                <Badge className={getLeadStatusClasses(stage.status)}>{stage.total} lead(s)</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {(["Cliente sem site", "Cliente com site ruim"] as const).map((audience) => (
          <Card key={audience} className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">{audience}</CardTitle>
              <CardDescription>Scripts prontos para abordagem, objecoes e fechamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {funnelTemplates
                .filter((template) => template.audience === audience)
                .map((template) => (
                  <div key={template.id} className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{template.title}</p>
                        <p className="text-sm text-muted-foreground">{template.audience}</p>
                      </div>
                      <Button type="button" variant="outline" className="rounded-2xl" onClick={() => copyToClipboard(template.message)}>
                        Copiar
                      </Button>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{template.message}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
