import { calculateQuote } from "@/lib/quote";
import { FunnelTemplate, Lead, ManualSection, Proposal, Task } from "@/types/os";

const premiumSiteQuote = calculateQuote("site-institucional", ["manutencao-mensal"]);
const landingQuote = calculateQuote("landing-essencial", ["tema-adicional"]);
const fullStackQuote = calculateQuote("site-institucional", ["tema-adicional", "entrega-codigo", "manutencao-mensal"]);

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Marina Costa",
    company: "Costa Advogados",
    segment: "Advocacia",
    city: "Sao Paulo",
    instagram: "@costa.adv",
    website: "https://costaadv.com.br",
    phone: "+55 11 99222-1001",
    source: "Instagram",
    status: "Proposta enviada",
    proposedValue: 3200,
    notes: "Quer migrar do WordPress para uma stack moderna e premium.",
    nextContact: "2026-03-10",
    tags: ["Quente", "Orcamento enviado"],
    createdAt: "2026-03-05",
  },
  {
    id: "lead-2",
    name: "Felipe Rocha",
    company: "Rocha Odontologia",
    segment: "Odontologia",
    city: "Campinas",
    instagram: "@rochaodonto",
    website: "",
    phone: "+55 19 99111-4400",
    source: "Indicacao",
    status: "Em conversa",
    proposedValue: 1800,
    notes: "Precisa de agenda integrada e landing de conversao com visual premium.",
    nextContact: "2026-03-09",
    tags: ["Quente"],
    createdAt: "2026-03-06",
  },
  {
    id: "lead-3",
    name: "Laura Nunes",
    company: "Nunes Studio Pilates",
    segment: "Saude",
    city: "Santos",
    instagram: "@lauranunespilates",
    website: "https://nunespilates.com",
    phone: "+55 13 99812-7721",
    source: "Site",
    status: "Aguardando resposta",
    proposedValue: 1400,
    notes: "Gostou do tema ruby e quer revisar proposta ate sexta-feira.",
    nextContact: "2026-03-12",
    tags: ["Aguardando retorno"],
    createdAt: "2026-03-01",
  },
  {
    id: "lead-4",
    name: "Rafael Duarte",
    company: "Duarte Premium Cars",
    segment: "Automotivo",
    city: "Curitiba",
    instagram: "@duartepremiumcars",
    website: "",
    phone: "+55 41 99777-1122",
    source: "Cold outbound",
    status: "Novo lead",
    proposedValue: 2200,
    notes: "Sem site atual. Forte chance de conversao se a abordagem mostrar autoridade visual.",
    nextContact: "2026-03-08",
    tags: ["Sem resposta"],
    createdAt: "2026-03-07",
  },
  {
    id: "lead-5",
    name: "Julia Teles",
    company: "Teles Imoveis",
    segment: "Imobiliaria",
    city: "Goiania",
    instagram: "@telesimoveis",
    website: "https://telesimoveis.com.br",
    phone: "+55 62 98111-2190",
    source: "WhatsApp",
    status: "Fechado",
    proposedValue: 2900,
    notes: "Ja fechou o pacote institucional com manutencao.",
    nextContact: "2026-03-18",
    tags: ["Quente"],
    createdAt: "2026-02-25",
  },
];

export const mockProposals: Proposal[] = [
  {
    id: "proposal-1",
    clientName: "Marina Costa",
    company: "Costa Advogados",
    projectType: "site-institucional",
    extras: ["manutencao-mensal"],
    implementationTotal: premiumSiteQuote.implementationTotal,
    monthlyRecurring: premiumSiteQuote.monthlyRecurring,
    summary: "Site institucional premium com pages de servicos e captacao via WhatsApp.",
    createdAt: "2026-03-05",
    status: "sent",
  },
  {
    id: "proposal-2",
    clientName: "Felipe Rocha",
    company: "Rocha Odontologia",
    projectType: "landing-essencial",
    extras: ["tema-adicional"],
    implementationTotal: landingQuote.implementationTotal,
    monthlyRecurring: landingQuote.monthlyRecurring,
    summary: "Landing page focada em implantes com dois temas para campanha.",
    createdAt: "2026-03-06",
    status: "draft",
  },
  {
    id: "proposal-3",
    clientName: "Julia Teles",
    company: "Teles Imoveis",
    projectType: "site-institucional",
    extras: ["tema-adicional", "entrega-codigo", "manutencao-mensal"],
    implementationTotal: fullStackQuote.implementationTotal,
    monthlyRecurring: fullStackQuote.monthlyRecurring,
    summary: "Site institucional com handoff do codigo e contrato mensal de manutencao.",
    createdAt: "2026-02-24",
    status: "accepted",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Enviar follow-up da Costa Advogados",
    description: "Reforcar argumento de autoridade e prazo de entrega premium.",
    priority: "Alta",
    status: "Aberta",
    relatedClient: "Costa Advogados",
    dueDate: "2026-03-09",
    createdAt: "2026-03-07",
  },
  {
    id: "task-2",
    title: "Refinar mockup institucional para Rocha Odontologia",
    description: "Adaptar hero com antes/depois e CTA para WhatsApp.",
    priority: "Media",
    status: "Em andamento",
    relatedClient: "Rocha Odontologia",
    dueDate: "2026-03-10",
    createdAt: "2026-03-07",
  },
  {
    id: "task-3",
    title: "Revisar renovacao anual da hospedagem de Julia Teles",
    description: "Verificar dominio, contrato e reajuste de manutencao.",
    priority: "Baixa",
    status: "Concluida",
    relatedClient: "Teles Imoveis",
    dueDate: "2026-03-06",
    createdAt: "2026-03-04",
  },
];

export const manualSections: ManualSection[] = [
  {
    id: "pricing",
    title: "Precos e pacotes",
    summary: "Organize a conversa comercial em torno de valor, nao de quantidade de telas.",
    bullets: [
      "Landing Page Essencial: R$ 900 com foco em captacao rapida.",
      "Site Institucional Profissional: R$ 1.200 como base da autoridade digital.",
      "Tema adicional: R$ 200 quando o cliente quer mais de uma atmosfera visual.",
      "Entrega do codigo: R$ 500 para handoff completo e documentado.",
    ],
  },
  {
    id: "maintenance",
    title: "Manutencao mensal",
    summary: "Recorrencia sustenta previsibilidade e relacionamento com o cliente.",
    bullets: [
      "Plano mensal padrao: R$ 97 por mes.",
      "Inclui pequenos ajustes, suporte e monitoramento do site.",
      "Nao inclui novas paginas completas sem reorcar.",
    ],
  },
  {
    id: "hosting",
    title: "Hospedagem e renovacao",
    summary: "A hospedagem de 12 meses entra como fator de fechamento e nao como custo isolado.",
    bullets: [
      "Hospedagem esta incluida no valor inicial por 12 meses.",
      "A renovacao anual deve ser lembrada com antecedencia de 30 dias.",
      "Sempre registrar dominio, provedor e data de vencimento na ficha do cliente.",
    ],
  },
  {
    id: "sales",
    title: "Fluxo de vendas",
    summary: "Toda proposta precisa fechar com proximo passo claro e prazo definido.",
    bullets: [
      "Diagnostico rapido do site atual e do gargalo comercial.",
      "Apresentacao visual premium alinhada ao nicho do cliente.",
      "Proposta com valor de implantacao e recorrencia separadas.",
      "Follow-up em ate 48 horas apos o envio da proposta.",
    ],
  },
  {
    id: "delivery",
    title: "Fluxo de entrega",
    summary: "Mantenha o processo enxuto para nao travar a operacao da micro-agencia.",
    bullets: [
      "Kickoff com briefing curto e assets essenciais.",
      "Wireframe rapido e aprovacao visual.",
      "Desenvolvimento, revisao final, publicacao e onboarding do cliente.",
    ],
  },
];

export const funnelTemplates: FunnelTemplate[] = [
  {
    id: "cold-no-site-1",
    title: "Primeira abordagem",
    audience: "Cliente sem site",
    message:
      "Oi, tudo bem? Analisei sua presenca digital e percebi que voces ainda nao tem um site que transmita o nivel do servico prestado. Eu desenvolvo interfaces premium e rapidas, pensadas para converter mais visitas em atendimento real. Se fizer sentido, posso te mostrar um conceito visual em cima do seu nicho.",
  },
  {
    id: "cold-no-site-2",
    title: "Resposta ao quanto custa",
    audience: "Cliente sem site",
    message:
      "Hoje trabalho com dois formatos principais: Landing Page Essencial a partir de R$ 900 e Site Institucional Profissional a partir de R$ 1.200. A ideia e montar algo com padrao premium, hospedagem inclusa por 12 meses e foco em conversao, nao apenas presenca online.",
  },
  {
    id: "cold-bad-site-1",
    title: "Diagnostico de site ruim",
    audience: "Cliente com site ruim",
    message:
      "Seu site atual passa informacao, mas ainda nao transmite a autoridade que o negocio tem. Normalmente eu resolvo isso com uma nova arquitetura visual, carregamento muito mais rapido e uma narrativa de conversao mais clara para WhatsApp e formulario.",
  },
  {
    id: "cold-bad-site-2",
    title: "Objeção sobre tempo",
    audience: "Cliente com site ruim",
    message:
      "Eu estruturo a entrega para ser leve para o cliente. O processo e enxuto: briefing objetivo, aprovacao visual rapida e publicacao sem depender de plataformas pesadas. O ganho costuma ser velocidade comercial e posicionamento de marca.",
  },
  {
    id: "follow-up-1",
    title: "Follow-up 1",
    audience: "Cliente sem site",
    message:
      "Passando para ver se conseguiu avaliar a proposta. Se fizer sentido, eu posso ajustar o escopo para entrar exatamente no momento do seu negocio e manter a mesma linha premium do projeto.",
  },
  {
    id: "follow-up-2",
    title: "Mensagem de fechamento",
    audience: "Cliente com site ruim",
    message:
      "Se quiser, eu consigo reservar a proxima janela de producao e te entregar uma versao muito mais forte em imagem, velocidade e conversao. Se topar, ja te envio o proximo passo para kickoff ainda hoje.",
  },
];
