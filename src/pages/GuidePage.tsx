import { motion, type Variants } from "framer-motion";
import { ArrowRight, Archive, BookOpen, BriefcaseBusiness, CheckSquare, CirclePlay, Compass, LayoutDashboard, Orbit, ReceiptText, Rocket, ShieldAlert, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { BrandEmblem } from "@/components/os/BrandEmblem";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createDashboardTourHref } from "@/lib/tour";

const revealContainer: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const revealItem: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } } };

const moduleCards = [
  { title: "Dashboard", description: "Leitura do dia: comercial, producao, descarte e proxima melhor acao.", whenToUse: "Abra sempre que entrar no sistema ou quando perder contexto.", href: "/dashboard", icon: LayoutDashboard },
  { title: "CRM", description: "Cadastre leads, atualize status, agende retorno e descarte o que nao faz mais sentido.", whenToUse: "Use ao abrir conversa, atualizar pipeline ou limpar o radar.", href: "/crm", icon: Users },
  { title: "Orcamentos", description: "Monte proposta com plano, extras, copy pronta e ajuste comercial personalizado.", whenToUse: "Abra quando o lead estiver pronto para receber uma oferta objetiva.", href: "/orcamentos", icon: ReceiptText },
  { title: "Producao", description: "Clientes fechados entram aqui com prazo, marco, bloqueio e historico de entrega.", whenToUse: "Use assim que o contrato fechar e durante toda a esteira pos-venda.", href: "/producao", icon: BriefcaseBusiness },
  { title: "Descartados", description: "Area de lixeira organizada para tirar oportunidades do radar sem apagar memoria.", whenToUse: "Abra quando quiser revisar o que saiu da operacao ativa.", href: "/descartados", icon: Archive },
  { title: "Funil e apoio", description: "Playbook, manual e tarefas sustentam copy, processo e execucao diaria.", whenToUse: "Use para vender melhor, padronizar entrega e executar o que destrava a operacao.", href: "/funil", icon: Orbit },
] as const;

const flowSteps = [
  { title: "Leia o dashboard", description: "Em segundos voce entende o que e comercial, o que e producao e o que saiu do radar." },
  { title: "Cadastre ou atualize", description: "CRM e Orcamentos alimentam pipeline, proposta, aceitacao e passagem para producao." },
  { title: "Proteja a entrega", description: "Cliente fechado sobe de prioridade. Prazo, bloqueio e marcos passam a dirigir sua agenda." },
  { title: "Conclua e documente", description: "Ao entregar, o projeto vira historico vivo em planilha e libera o radar principal." },
] as const;

const dashboardMap = [
  { title: "Header operacional", question: "O que ele responde primeiro?", answer: "Onde voce esta, qual frente pesa mais agora e qual acao deve acontecer em seguida.", icon: Compass },
  { title: "Radar do dia", question: "O que merece atencao?", answer: "Mistura comercial e producao, mas aplica peso maior para cliente fechado com prazo ou bloqueio.", icon: ShieldAlert },
  { title: "Indicadores principais", question: "O negocio esta saudavel?", answer: "Mostra pipeline, contratos ativos, receita potencial, receita confirmada e entregas concluidas.", icon: Rocket },
  { title: "Fila recomendada", question: "O que fazer primeiro?", answer: "Organiza uma ordem pratica de execucao: entrega critica, bloqueio, follow-up, proposta e tarefa.", icon: CheckSquare },
  { title: "Atividade recente", question: "O que mudou?", answer: "Conta tudo o que entrou, foi aceito, foi descartado ou ja foi concluido para voce nao perder contexto.", icon: BookOpen },
  { title: "Atalhos", question: "Para onde ir depois?", answer: "Leva direto ao modulo certo depois que o dashboard ja definiu a frente de trabalho.", icon: ArrowRight },
] as const;

const operationalRules = [
  { title: "Cliente fechado passa na frente", description: "Projeto em risco de atraso, bloqueio ou entrega sempre pesa mais do que lead ainda indeciso." },
  { title: "Descartado sai do radar", description: "Oportunidade que nao vai andar deve sair da area nobre para manter clareza operacional." },
  { title: "O orcamento precisa sustentar valor", description: "Nao envie tabela seca. Use copy consultiva para explicar contexto, investimento e proximo passo." },
] as const;

export function GuidePage() {
  const navigate = useNavigate();
  const startTour = () => navigate(createDashboardTourHref());

  return (
    <motion.div className="space-y-6 xl:space-y-8" initial="hidden" animate="show" variants={revealContainer}>
      <motion.section variants={revealItem} className="surface-panel relative overflow-hidden rounded-[30px] p-6 sm:p-8">
        <div className="brand-grid absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.18),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_40%)]" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-center">
          <div>
            <p className="eyebrow-label">Guia do sistema</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-[2.6rem]">Entenda o dashboard inteiro antes de operar.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              Esta pagina existe para tirar duvida real. Ela explica como o dashboard prioriza, quando entrar em cada modulo e como reiniciar a demonstracao quantas vezes for necessario.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="hero-chip hero-chip-accent">Do lead a entrega</span>
              <span className="hero-chip hero-chip-muted">Onboarding de uso diario</span>
              <span className="hero-chip hero-chip-muted">Tour reiniciavel</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" className="h-11 rounded-full px-5" onClick={startTour}><CirclePlay className="h-4 w-4" />Iniciar demonstracao guiada</Button>
              <Button asChild variant="outline" className="h-11 rounded-full border-border bg-card/70 px-5 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/dashboard"><Compass className="h-4 w-4" />Ir para o dashboard</NavLink></Button>
            </div>
          </div>
          <div className="surface-soft rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow-label">Identidade do produto</p>
                <p className="mt-2 text-lg font-semibold text-foreground">WES Digital Studio OS</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Mesmo DNA visual do portfolio, agora aplicado a uma operacao comercial e de entrega que se explica sozinha.</p>
              </div>
              <BrandEmblem size="md" />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading eyebrow="Fluxo recomendado" title="Como o sistema deve ser usado no dia a dia" description="O objetivo e operar em ciclos curtos: ler, agir, revisar e concluir sem voltar para o caos." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {flowSteps.map((step, index) => (
            <Card key={step.title} className="glass-card rounded-[24px]">
              <CardContent className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><span className="text-sm font-semibold">{index + 1}</span></div>
                <p className="mt-5 text-lg font-semibold text-foreground">{step.title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading eyebrow="Mapa do dashboard" title="O que cada bloco responde na tela principal" description="Se voce entender estes seis blocos, entende o painel inteiro e nunca entra sem saber o que fazer." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardMap.map((item) => (
            <Card key={item.title} className="glass-card rounded-[24px]">
              <CardContent className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><item.icon className="h-4.5 w-4.5" /></div>
                <p className="mt-5 text-lg font-semibold text-foreground">{item.title}</p>
                <div className="surface-soft mt-4 rounded-[18px] p-4">
                  <p className="eyebrow-label">Pergunta que ele responde</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{item.question}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading eyebrow="Modulos do OS" title="O que cada area faz e quando entrar nela" description="Nada aqui deve parecer pagina perdida. Cada modulo tem um papel claro na operacao da agencia." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moduleCards.map((item) => (
            <NavLink key={item.title} to={item.href} className="group">
              <Card className="glass-card h-full rounded-[24px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/20">
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><item.icon className="h-4.5 w-4.5" /></div>
                  <p className="mt-5 text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <div className="surface-soft mt-4 rounded-[18px] p-4">
                    <p className="eyebrow-label">Use quando</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.whenToUse}</p>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">Abrir modulo<ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" /></p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="glass-card rounded-[28px]">
          <CardContent className="p-6 sm:p-7">
            <p className="eyebrow-label">Demonstracao guiada</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Tour do dashboard em passos curtos</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">O tour agora pode ser reiniciado sempre. Ele destaca cada bloco do dashboard, explica o papel de cada area e move a tela automaticamente para o ponto certo.</p>
            <div className="surface-soft mt-5 rounded-[22px] p-5">
              <p className="text-sm font-semibold text-foreground">O que a demonstracao cobre</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>1. Header operacional e leitura do dia</p>
                <p>2. Radar misto entre comercial, producao e descarte</p>
                <p>3. Indicadores principais de pipeline e entrega</p>
                <p>4. Fila recomendada para agir na ordem certa</p>
                <p>5. Atividade recente e contexto vivo</p>
                <p>6. Atalhos para ir direto ao modulo certo</p>
              </div>
            </div>
            <Button type="button" className="mt-5 h-11 rounded-full px-5" onClick={startTour}><CirclePlay className="h-4 w-4" />Rodar demonstracao agora</Button>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-[28px]">
          <CardContent className="p-6 sm:p-7">
            <p className="eyebrow-label">Regras operacionais</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Tres principios para nao se perder</h3>
            <div className="mt-5 space-y-4">
              {operationalRules.map((rule) => (
                <div key={rule.title} className="surface-soft rounded-[18px] p-4">
                  <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{rule.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}
