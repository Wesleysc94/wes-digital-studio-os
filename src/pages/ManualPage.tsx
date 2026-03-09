import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { manualSections } from "@/data/mock-operations";

export function ManualPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Base da operacao"
        title="Tudo que precisa ser padrao para a agencia operar com leveza"
        description="Consulte esta area quando precisar alinhar precificacao, manutencao, hospedagem, vendas ou entrega."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Direcao da operacao</CardTitle>
          <CardDescription>O sistema precisa deixar a agencia leve, previsivel e com resposta rapida ao lead.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>1. Vender primeiro a transformacao, nao a lista de paginas.</p>
          <p>2. Fechar com proposta enxuta e proximo passo claro.</p>
          <p>3. Manter follow-up curto e disciplinado para nao esfriar a oportunidade.</p>
          <p>4. Documentar renovacoes, manutencoes e escopo para evitar retrabalho.</p>
        </CardContent>
        </Card>

        <Card className="glass-card rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Base de conhecimento</CardTitle>
            <CardDescription>Secoes essenciais para precificacao, entrega e relacionamento com clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-3">
              {manualSections.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="rounded-[1.5rem] border border-border/60 bg-card/60 px-5"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{section.summary}</p>
                    <div className="space-y-2 text-sm leading-relaxed text-foreground/85">
                      {section.bullets.map((bullet) => (
                        <p key={bullet}>{bullet}</p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
