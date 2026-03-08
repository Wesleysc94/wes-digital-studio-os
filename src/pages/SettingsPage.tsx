import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOsStore } from "@/store/os-store";

export function SettingsPage() {
  const integration = useOsStore((state) => state.integration);

  const integrationStatus = [
    {
      title: "Google Sheets API",
      status: integration.googleSheetsConfigured ? "Pronto" : "Pendente",
      description: integration.googleSheetsConfigured
        ? "Planilha configurada e pronta para leitura/escrita via service account."
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
      description: "CLI autenticado. Falta apenas publicar a preview apos configurar as variaveis Google.",
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
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
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                      : "border-amber-400/30 bg-amber-500/15 text-amber-300"
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
                  <Badge key={item} className="border-border/60 bg-card/70 text-foreground">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Personalizacao visual</CardTitle>
          <CardDescription>Escolha a atmosfera do painel para combinar com a sessao de trabalho ou a apresentacao.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
