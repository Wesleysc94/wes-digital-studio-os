import { motion, type Variants } from "framer-motion";
import { ArrowRight, Archive, BookOpen, BriefcaseBusiness, CheckSquare, CirclePlay, Compass, LayoutDashboard, Orbit, ReceiptText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { BrandEmblem } from "@/components/os/BrandEmblem";
import { SectionHeading } from "@/components/os/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const revealContainer: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const revealItem: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } } };

const moduleCards = [
  { title: "Dashboard", description: "Leitura do dia: comercial, producao, descarte e proxima melhor acao.", whenToUse: "Abra sempre que entrar no sistema ou quando perder contexto.", href: "/dashboard", icon: LayoutDashboard },
  { title: "CRM", description: "Cadastre leads, atualize status, agende retorno e descarte o que nao faz mais sentido.", whenToUse: "Use ao abrir conversa, atualizar pipeline ou limpar o radar.", href: "/crm", icon: Users },
  { title: "Orcamentos", description: "Monte proposta com plano, extras e ajuste comercial personalizado.", whenToUse: "Abra quando o lead estiver pronto para receber uma oferta objetiva.", href: "/orcamentos", icon: ReceiptText },
  { title: "Producao", description: "Clientes fechados entram aqui com prazo, marco, bloqueio e historico de entrega.", whenToUse: "Use assim que o contrato fechar e durante toda a esteira pos-venda.", href: "/producao", icon: BriefcaseBusiness },
  { title: "Descartados", description: "Area de lixeira organizada para tirar oportunidades do radar sem apagar memoria.", whenToUse: "Abra quando quiser revisar o que saiu da operacao ativa.", href: "/descartados", icon: Archive },
  { title: "Funil e apoio", description: "Playbook, manual e tarefas sustentam copy, processo e execucao diaria.", whenToUse: "Use para vender melhor, padronizar entrega e executar o que destrava a operacao.", href: "/funil", icon: Orbit },
] as const;

const flowSteps = [
  { title: "Leia o dashboard", description: "O sistema mostra o que pede atencao e o que tem maior impacto agora." },
  { title: "Cadastre ou atualize", description: "CRM e Orcamentos alimentam o pipeline, a negociacao e a passagem para producao." },
  { title: "Execute a producao", description: "Cliente fechado entra na esteira e passa a ser priorizado acima dos prospectos." },
  { title: "Conclua e documente", description: "Ao entregar, o projeto vai para historico e deixa um rastro vivo da operacao." },
] as const;

export function GuidePage() {
  return (
    <motion.div className="space-y-6 xl:space-y-8" initial="hidden" animate="show" variants={revealContainer}>
      <motion.section variants={revealItem} className="surface-panel relative overflow-hidden rounded-[30px] p-6 sm:p-8">
        <div className="brand-grid absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.18),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_40%)]" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-center">
          <div>
            <p className="eyebrow-label">Guia do sistema</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-[2.6rem]">Entenda o OS de ponta a ponta antes de operar.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">Esta pagina existe para reduzir qualquer duvida: ela explica como o dashboard pensa, quando usar cada modulo e como iniciar a demonstracao guiada.</p>
            <div className="mt-5 flex flex-wrap gap-2"><Badge className="status-info">Do lead a entrega</Badge><Badge className="status-neutral">Onboarding de uso diario</Badge><Badge className="status-neutral">Pronto para portfolio</Badge></div>
            <div className="mt-6 flex flex-wrap gap-3"><Button asChild className="h-11 rounded-full px-5"><NavLink to="/dashboard?tour=1"><CirclePlay className="h-4 w-4" />Iniciar demonstracao guiada</NavLink></Button><Button asChild variant="outline" className="h-11 rounded-full border-border bg-card/70 px-5 text-foreground hover:bg-secondary hover:text-foreground"><NavLink to="/dashboard"><Compass className="h-4 w-4" />Ir para o dashboard</NavLink></Button></div>
          </div>
          <div className="surface-soft rounded-[28px] p-6"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow-label">Identidade do produto</p><p className="mt-2 text-lg font-semibold text-foreground">WES Digital Studio OS</p><p className="mt-2 text-sm leading-6 text-muted-foreground">O mesmo DNA visual do portfolio agora aplicado a um sistema interno premium e operacional.</p></div><BrandEmblem size="md" /></div></div>
        </div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading eyebrow="Fluxo recomendado" title="Como o sistema deve ser usado no dia a dia" description="O objetivo e operar em ciclos curtos: ler, agir, revisar e seguir para o proximo ponto de impacto." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{flowSteps.map((step, index) => <Card key={step.title} className="glass-card rounded-[24px]"><CardContent className="p-5"><div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><span className="text-sm font-semibold">{index + 1}</span></div><p className="mt-5 text-lg font-semibold text-foreground">{step.title}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p></CardContent></Card>)}</div>
      </motion.section>

      <motion.section variants={revealItem} className="space-y-4">
        <SectionHeading eyebrow="Modulos do OS" title="O que cada area faz e quando entrar nela" description="Nada aqui deve parecer pagina perdida. Cada modulo tem um papel claro na operacao da agencia." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{moduleCards.map((item) => <NavLink key={item.title} to={item.href} className="group"><Card className="glass-card h-full rounded-[24px] transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent/20"><CardContent className="p-5"><div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-secondary text-accent"><item.icon className="h-4.5 w-4.5" /></div><p className="mt-5 text-lg font-semibold text-foreground">{item.title}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p><div className="surface-soft mt-4 rounded-[18px] p-4"><p className="eyebrow-label">Use quando</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.whenToUse}</p></div><p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">Abrir modulo<ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" /></p></CardContent></Card></NavLink>)}</div>
      </motion.section>

      <motion.section variants={revealItem} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="glass-card rounded-[28px]"><CardContent className="p-6 sm:p-7"><p className="eyebrow-label">Demonstracao guiada</p><h3 className="mt-3 text-2xl font-semibold text-foreground">Tour do dashboard em passos curtos</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">O tour destaca cada bloco do dashboard, explica o papel de cada area e move a tela automaticamente para o ponto certo.</p><div className="surface-soft mt-5 rounded-[22px] p-5"><p className="text-sm font-semibold text-foreground">O que a demonstracao cobre</p><div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><p>1. Header operacional e leitura do dia</p><p>2. Prioridades entre comercial e producao</p><p>3. Indicadores principais</p><p>4. Fila recomendada</p><p>5. Atividade recente e atalhos</p></div></div><Button asChild className="mt-5 h-11 rounded-full px-5"><NavLink to="/dashboard?tour=1"><CirclePlay className="h-4 w-4" />Rodar demonstracao agora</NavLink></Button></CardContent></Card>
        <Card className="glass-card rounded-[28px]"><CardContent className="p-6 sm:p-7"><p className="eyebrow-label">Suporte rapido</p><h3 className="mt-3 text-2xl font-semibold text-foreground">Tres regras para nao se perder</h3><div className="mt-5 space-y-4"><div className="surface-soft rounded-[18px] p-4"><p className="text-sm font-semibold text-foreground">Tema sempre no topo</p><p className="mt-2 text-sm leading-6 text-muted-foreground">O controle visual e global. Nao precisa abrir configuracao grande para trocar a leitura.</p></div><div className="surface-soft rounded-[18px] p-4"><p className="text-sm font-semibold text-foreground">Cliente fechado muda a prioridade</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Quando um projeto entra na producao, ele passa a disputar atencao acima de parte do comercial aberto.</p></div><div className="surface-soft rounded-[18px] p-4"><p className="text-sm font-semibold text-foreground">Descartado sai do radar</p><p className="mt-2 text-sm leading-6 text-muted-foreground">O que nao vai fechar nao deve ficar poluindo o dashboard. Mova para descartados e siga.</p></div></div></CardContent></Card>
      </motion.section>
    </motion.div>
  );
}
