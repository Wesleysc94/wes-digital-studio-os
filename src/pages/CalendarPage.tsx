import { Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOsStore } from "@/store/os-store";

export function CalendarPage() {
    const { theme } = useTheme();
    const integration = useOsStore((state) => state.integration);
    const calendarId = integration.calendarId;

    const isDarkTheme = theme !== "light";

    const googleCalendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
        calendarId || ""
    )}&ctz=America%2FSao_Paulo`;

    const externalCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
        calendarId || ""
    )}`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SectionHeading
                    eyebrow="Agenda integrada"
                    title="Compromissos e prazos"
                    description="Acompanhe sua agenda do Google Calendar diretamente no dashboard operacional."
                />
                {calendarId && (
                    <Button asChild variant="outline" className="h-10 rounded-full border-border bg-card/70 px-4 text-foreground hover:bg-secondary hover:text-foreground">
                        <a href={externalCalendarUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir no Google Calendar
                        </a>
                    </Button>
                )}
            </div>

            {!calendarId ? (
                <Card className="glass-card rounded-[2rem] border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-secondary text-accent">
                            <CalendarIcon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-foreground">Calendário não configurado</h3>
                        <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                            O Calendar ID não foi encontrado nas variáveis de ambiente. Configure o ID do seu Google Calendar para visualizar sua agenda aqui.
                        </p>
                        <Button asChild className="mt-8 h-11 rounded-full px-6">
                            <a href="/configuracoes">Ver configurações</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="relative aspect-auto h-[calc(100vh-280px)] min-h-[500px] w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/40 shadow-xl backdrop-blur-md">
                    <iframe
                        src={googleCalendarUrl}
                        style={{ border: 0 }}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        title="Google Calendar"
                        className={cn(
                            "transition-opacity duration-300 hover:opacity-100",
                            isDarkTheme
                                ? "opacity-90 grayscale-[0.2] invert-[0.88] hue-rotate-180 brightness-95"
                                : "opacity-90 grayscale-[0.2] invert-[0.02]"
                        )}
                    />
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card rounded-[1.5rem] p-5">
                    <p className="eyebrow-label">Dica de Produtividade</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        O Google Calendar exibe automaticamente seus follow-ups agendados pelo CRM se você estiver usando a mesma conta da Service Account.
                    </p>
                </Card>
                <Card className="glass-card rounded-[1.5rem] p-5">
                    <p className="eyebrow-label">Sincronização</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Alterações feitas no Google Calendar podem levar alguns minutos para refletir aqui devido ao cache do iframe do Google.
                    </p>
                </Card>
                <Card className="glass-card rounded-[1.5rem] p-5">
                    <p className="eyebrow-label">Visualização</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Use o botão no topo direito para abrir a visualização completa e gerenciar permissões ou configurações avançadas de cor.
                    </p>
                </Card>
            </div>
        </div>
    );
}
