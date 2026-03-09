import { CirclePlay, Compass, PanelTop, Router, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

import { themeOptions, useTheme } from "@/components/ThemeProvider";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createDashboardTourHref } from "@/lib/tour";
import { useOsStore } from "@/store/os-store";

export function SettingsPage() {
  const integration = useOsStore((state) => state.integration);
  const { theme } = useTheme();
  const currentTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];

  const integrationStatus = [
    {
      title: "Google Sheets API",
      status: integration.googleSheetsConfigured ? "Pronto" : "Pendente",
      description: integration.googleSheetsConfigured
        ? "Planilha configurada e pronta para leitura e escrita via service account."
        : "Configure credenciais server-side e o ID da planilha para ativar a persistencia remota.",
    },
    {
      title: "Google Calendar API",
      status: integration.googleCalendarConfigured ? "Pronto" : "Pendente",
      description: integration.googleCalendarConfigured
        ? "Eventos de follow-up podem ser criados automaticamente."
        : "Defina o Calendar ID e as credenciais da service account para agendar follow-ups.",
    },
    {
      title: "Deploy Vercel",
      status: "Pronto",
      description: "Projeto publicado e pronto para operar com variaveis configuradas em desenvolvimento, preview e producao.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Infraestrutura e apoio"
        title="Configuracoes que servem a operacao"
        description="Esta tela deixou de duplicar o tema do topo. Agora ela existe para mostrar ambiente, suporte e caminhos de uso do sistema."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Estado das integracoes</CardTitle>
            <CardDescription>
              Modo atual: <span className="font-medium text-foreground">{integration.mode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrationStatus.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge
                    className={
                      item.status === "Pronto"
                        ? "status-success"
                        : "status-warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}

            {integration.missing.length ? (
              <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-5">
                <p className="font-medium text-foreground">Variaveis faltando</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {integration.missing.map((item) => (
                    <Badge key={item} className="status-neutral">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card rounded-[2rem] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Como personalizar sem se perder</CardTitle>
              <CardDescription>Os controles globais foram condensados para o topo da interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="surface-soft rounded-[1.5rem] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-secondary text-accent">
                    <PanelTop className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tema global no topo</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      O seletor fica sempre no header para voce trocar a leitura de qualquer pagina sem abrir uma tela separada.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="status-info">Tema atual: {currentTheme.label}</Badge>
                      <Badge className="status-neutral">Persistencia automatica</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-soft rounded-[1.5rem] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-secondary text-accent">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Leitura rapida do ambiente</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Use esta pagina para confirmar se a instancia esta sincronizando com Google e se falta alguma variavel de ambiente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Ajuda operacional</CardTitle>
              <CardDescription>Se o sistema precisar se explicar melhor, comece por aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="h-11 w-full justify-between rounded-full px-4">
                <NavLink to="/guia">
                  <span className="inline-flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    Abrir guia completo
                  </span>
                  <Router className="h-4 w-4" />
                </NavLink>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-between rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground">
                <NavLink to={createDashboardTourHref()}>
                  <span className="inline-flex items-center gap-2">
                    <CirclePlay className="h-4 w-4" />
                    Rodar demonstracao guiada
                  </span>
                  <Router className="h-4 w-4" />
                </NavLink>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
