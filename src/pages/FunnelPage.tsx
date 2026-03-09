import { Copy, MessagesSquare, Radar, Sparkles, Target, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/os/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { salesPlaybook } from "@/data/mock-operations";
import { getLeadStatusClasses } from "@/lib/os-helpers";
import { useOsStore } from "@/store/os-store";
import { LEAD_STATUS_OPTIONS, type SalesPlaybookStage } from "@/types/os";

function getRecommendedStage(activeLeads: number, proposalsSent: number, awaitingResponse: number) {
  if (awaitingResponse > 0 || proposalsSent > 0) {
    return {
      title: "Negociacao e fechamento",
      description: "Seu foco do dia esta em recuperar contexto, responder objecao certa e empurrar a conversa para decisao.",
    };
  }

  if (activeLeads > 0) {
    return {
      title: "Descoberta e diagnostico",
      description: "Existe conversa aberta. Vale aprofundar dor, urgencia, decisor e custo de manter tudo como esta.",
    };
  }

  return {
    title: "Abordagem inicial",
    description: "Sem pipeline ativo, a prioridade e abrir conversa qualificada com observacao real e convite leve.",
  };
}

function buildStageBundle(stage: SalesPlaybookStage) {
  return `${stage.title}\n\nObjetivo\n${stage.objective}\n\nPsicologia da etapa\n- ${stage.psychology.join("\n- ")}\n\nEstrategia\n- ${stage.strategy.join("\n- ")}\n\nEvite\n- ${stage.watchouts.join("\n- ")}\n\nMensagens prontas\n${stage.messages.map((message) => `${message.label} | ${message.audience}\n${message.message}`).join("\n\n")}`;
}

export function FunnelPage() {
  const leads = useOsStore((state) => state.leads);

  const stageCounts = LEAD_STATUS_OPTIONS.map((status) => ({
    status,
    total: leads.filter((lead) => lead.status === status).length,
  }));

  const activeLeads = leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status)).length;
  const proposalsSent = leads.filter((lead) => lead.status === "Proposta enviada").length;
  const awaitingResponse = leads.filter((lead) => lead.status === "Aguardando resposta").length;
  const recommendedStage = getRecommendedStage(activeLeads, proposalsSent, awaitingResponse);

  const copyToClipboard = async (content: string, successMessage: string) => {
    await navigator.clipboard.writeText(content);
    toast.success(successMessage);
  };

  return (
    <div className="space-y-6 xl:space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass-card rounded-[24px]">
          <CardHeader>
            <SectionHeading
              eyebrow="Playbook comercial"
              title="Funil de vendas escrito para conversa real"
              description="Este modulo nao existe para inspirar. Ele existe para reduzir improviso, sustentar valor e te dar mensagem pronta para usar."
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-[20px] border border-accent/20 bg-accent/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-background/60 text-accent">
                  <Radar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Foco sugerido hoje</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">{recommendedStage.title}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground/78">{recommendedStage.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Radar do pipeline</CardTitle>
            <CardDescription>Leitura rapida do momento comercial para saber qual etapa precisa de mais energia agora.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {stageCounts.map((stage) => (
              <div key={stage.status} className="surface-soft rounded-[18px] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{stage.status}</p>
                  <Badge className={getLeadStatusClasses(stage.status)}>{stage.total}</Badge>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {stage.total ? "Existe movimento real nessa etapa." : "Sem item ativo nessa fase agora."}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Etapas da venda"
          title="Como conduzir a conversa sem soar generico"
          description="Cada etapa abaixo foi escrita para orientar comportamento, leitura psicologica e resposta comercial."
        />

        <div className="space-y-5">
          {salesPlaybook.map((stage, index) => (
            <Card key={stage.id} className="glass-card rounded-[24px]">
              <CardContent className="p-6 sm:p-7">
                <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-secondary text-accent">
                        <span className="text-base font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="eyebrow-label">Etapa {index + 1}</p>
                        <h3 className="mt-1 text-2xl font-semibold text-foreground">{stage.title}</h3>
                      </div>
                    </div>

                    <div className="surface-soft rounded-[18px] p-4">
                      <div className="flex items-start gap-3">
                        <Target className="mt-0.5 h-4 w-4 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Objetivo da etapa</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.objective}</p>
                        </div>
                      </div>
                    </div>

                    <div className="surface-soft rounded-[18px] p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Como pensar essa fase</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.explanation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="surface-soft rounded-[18px] p-4">
                      <p className="text-sm font-semibold text-foreground">O lead precisa sentir</p>
                      <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                        {stage.psychology.map((item) => (
                          <p key={item}>- {item}</p>
                        ))}
                      </div>
                    </div>

                    <div className="surface-soft rounded-[18px] p-4">
                      <div className="flex items-start gap-3">
                        <TriangleAlert className="mt-0.5 h-4 w-4 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Evite nesta fase</p>
                          <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                            {stage.watchouts.map((item) => (
                              <p key={item}>- {item}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="surface-soft rounded-[18px] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <MessagesSquare className="h-4 w-4 text-accent" />
                          <p className="text-sm font-semibold text-foreground">Estrategia de abordagem</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-full border-border bg-card/70 px-3 text-foreground hover:bg-secondary hover:text-foreground"
                          onClick={() => copyToClipboard(buildStageBundle(stage), "Playbook da etapa copiado.")}
                        >
                          <Copy className="h-4 w-4" />
                          Copiar etapa
                        </Button>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {stage.strategy.map((item) => (
                          <div key={item} className="surface-subtle rounded-[16px] p-4 text-sm leading-6 text-muted-foreground">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      {stage.messages.map((message) => (
                        <div key={message.id} className="surface-soft rounded-[18px] p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{message.label}</p>
                              <p className="eyebrow-label mt-1">{message.audience}</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 rounded-full border-border bg-card/70 px-3 text-foreground hover:bg-secondary hover:text-foreground"
                              onClick={() => copyToClipboard(message.message, "Mensagem copiada para a area de transferencia.")}
                            >
                              <Copy className="h-4 w-4" />
                              Copiar
                            </Button>
                          </div>
                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/82">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
