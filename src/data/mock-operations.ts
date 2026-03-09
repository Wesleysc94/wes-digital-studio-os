import { calculateQuote } from "@/lib/quote";
import { ArchiveEntry, CompletedProject, Lead, ManualSection, Project, Proposal, SalesPlaybookStage, Task } from "@/types/os";

const premiumSiteQuote = calculateQuote("site-institucional", ["manutencao-mensal"]);
const landingQuote = calculateQuote("landing-essencial", ["tema-adicional"]);
const fullStackQuote = calculateQuote("site-institucional", ["tema-adicional", "entrega-codigo", "manutencao-mensal"], {
  customTitle: "Site Institucional Premium com entrega guiada",
});

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
    nextContact: "2026-03-11",
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
    notes: "Fechou o pacote institucional com manutencao e esta em fase final de revisao.",
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
    customTitle: "",
    implementationOverride: null,
    recurringOverride: null,
    pricingNotes: "",
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
    customTitle: "",
    implementationOverride: null,
    recurringOverride: null,
    pricingNotes: "",
  },
  {
    id: "proposal-3",
    clientName: "Julia Teles",
    company: "Teles Imoveis",
    projectType: "site-institucional",
    extras: ["tema-adicional", "entrega-codigo", "manutencao-mensal"],
    implementationTotal: fullStackQuote.implementationTotal,
    monthlyRecurring: fullStackQuote.monthlyRecurring,
    summary: "Site institucional com handoff do codigo, manutencao e linguagem visual premium.",
    createdAt: "2026-02-24",
    status: "accepted",
    customTitle: "Site institucional premium com refinamento comercial",
    implementationOverride: 2600,
    recurringOverride: 147,
    pricingNotes: "Ajuste comercial para escopo maior e onboarding dedicado.",
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
    title: "Aprovar hero final da Teles Imoveis",
    description: "Consolidar ajustes finais antes de subir para entrega e onboarding.",
    priority: "Alta",
    status: "Em andamento",
    relatedClient: "Teles Imoveis",
    dueDate: "2026-03-10",
    createdAt: "2026-03-08",
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

export const mockProjects: Project[] = [
  {
    id: "project-1",
    leadId: "lead-5",
    proposalId: "proposal-3",
    clientName: "Julia Teles",
    company: "Teles Imoveis",
    projectType: "site-institucional",
    status: "Revisao",
    implementationTotal: 2600,
    monthlyRecurring: 147,
    dueDate: "2026-03-14",
    nextMilestone: "2026-03-10",
    maintenanceActive: true,
    notes: "Aguardando validacao final das paginas internas e disparo do onboarding.",
    deliverySummary: "Site institucional premium com prova social, CTA para WhatsApp e base de manutencao.",
    createdAt: "2026-02-26",
  },
];

export const mockArchive: ArchiveEntry[] = [
  {
    id: "archive-1",
    leadId: "lead-archive-1",
    name: "Camila Prado",
    company: "Prado Clinica Integrada",
    statusAtArchive: "Perdido",
    reason: "Preco fora do contexto",
    notes: "Entrou no radar, mas o momento financeiro travou a decisao.",
    archivedAt: "2026-03-02",
  },
];

export const mockCompletedProjects: CompletedProject[] = [
  {
    id: "completed-1",
    projectId: "project-old-1",
    clientName: "Arthur Lima",
    company: "Lima Odontologia Estetica",
    projectType: "landing-essencial",
    implementationTotal: 1400,
    monthlyRecurring: 97,
    deliveredAt: "2026-02-12",
    notes: "Entrega feita com onboarding por WhatsApp e checklist final enviado.",
    deliverySummary: "Landing premium para implantes com CTA, prova social e campanha principal publicada.",
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
      "Sempre que a negociacao fugir do padrao, documente override e justificativa comercial.",
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
    summary: "Depois do sim, o cliente entra numa esteira visivel ate a conclusao do projeto.",
    bullets: [
      "Kickoff com briefing curto e assets essenciais.",
      "Wireframe rapido e aprovacao visual.",
      "Desenvolvimento, revisao final, publicacao e onboarding do cliente.",
      "Ao concluir, registrar entrega no historico de projetos finalizados.",
    ],
  },
];

export const salesPlaybook: SalesPlaybookStage[] = [
  {
    id: "abordagem-inicial",
    title: "Abordagem inicial",
    objective: "Abrir conversa sem parecer mensagem em massa e gerar curiosidade qualificada.",
    explanation:
      "Nesta etapa voce nao vende escopo. Voce mostra que entendeu um gargalo do negocio e convida o lead para olhar a oportunidade com outro nivel de clareza.",
    strategy: [
      "Comece por uma observacao especifica do negocio ou do site atual.",
      "Traga o impacto comercial da mudanca: autoridade, conversao ou velocidade de atendimento.",
      "Feche com convite leve para mostrar um conceito ou diagnostico rapido.",
    ],
    messages: [
      {
        id: "abordagem-inicial-sem-site",
        label: "Primeiro contato",
        audience: "Cliente sem site",
        message:
          "Oi, [nome]. Dei uma olhada na presenca digital da [empresa] e percebi que hoje voces dependem muito de rede social ou indicacao para converter novos contatos. Eu desenvolvo sites premium pensados para transformar visita em conversa real, com estrutura mais clara, velocidade e posicionamento melhor. Se fizer sentido, eu posso te mostrar em poucos minutos como isso ficaria aplicado ao seu negocio.",
      },
      {
        id: "abordagem-inicial-site-fraco",
        label: "Primeiro contato",
        audience: "Cliente com site ruim",
        message:
          "Oi, [nome]. Analisei rapidamente o site da [empresa] e vi um ponto que costuma pesar bastante na conversao: ele informa, mas ainda nao sustenta a autoridade do servico como poderia. Trabalho redesenhando essa camada digital com foco em imagem, clareza e resposta comercial. Se quiser, eu te mostro um diagnostico objetivo do que esta travando hoje.",
      },
    ],
  },
  {
    id: "descoberta-da-necessidade",
    title: "Descoberta da necessidade",
    objective: "Entender como o lead vende hoje, onde perde oportunidades e qual urgencia real existe.",
    explanation:
      "Aqui o foco e ouvir. Quanto melhor voce entende processo comercial, objecoes e gargalos, mais facil fica vender uma solucao que parece inevitavel.",
    strategy: [
      "Pergunte como chegam os contatos e onde a conversa esfria.",
      "Descubra qual servico mais rentavel precisa de mais visibilidade.",
      "Entenda prazo, decisor e nivel de urgencia antes de falar de proposta.",
    ],
    messages: [
      {
        id: "descoberta-diagnostico",
        label: "Perguntas de descoberta",
        audience: "Uso geral",
        message:
          "Antes de te sugerir formato ou investimento, quero entender seu contexto. Hoje os clientes chegam mais por indicacao, Instagram, Google ou WhatsApp? Em que momento voce sente que perde mais oportunidade: falta de autoridade, pouca clareza da oferta ou demora para transformar visita em conversa?",
      },
      {
        id: "descoberta-prioridade",
        label: "Mapear urgencia",
        audience: "Uso geral",
        message:
          "Se a gente melhorasse essa camada digital nas proximas semanas, o que faria mais diferenca para voce agora: gerar mais contatos qualificados, apresentar melhor seu servico premium ou organizar melhor o processo comercial para fechar mais facil?",
      },
    ],
  },
  {
    id: "diagnostico",
    title: "Diagnostico",
    objective: "Traduzir o problema em linguagem de negocio e dar direcao sem ainda entrar em defesa de preco.",
    explanation:
      "O diagnostico organiza a dor. Quando o lead enxerga com clareza o custo do problema atual, a proposta deixa de parecer gasto e passa a parecer ajuste estrategico.",
    strategy: [
      "Mostre o problema em tres camadas: percepcao, navegacao e conversao.",
      "Evite excesso tecnico; fale do impacto no atendimento e no fechamento.",
      "Conduza o lead para a ideia de reposicionamento e nao apenas de redesign.",
    ],
    messages: [
      {
        id: "diagnostico-sem-site",
        label: "Leitura consultiva",
        audience: "Cliente sem site",
        message:
          "Hoje o principal gargalo nao e falta de esforco comercial, e falta de uma base propria que sustente autoridade quando alguem pesquisa seu nome ou compara voce com outros prestadores. Sem essa camada, voce depende demais do contato manual e perde eficiencia no processo de convencimento.",
      },
      {
        id: "diagnostico-site-fraco",
        label: "Leitura consultiva",
        audience: "Cliente com site ruim",
        message:
          "O site atual ate apresenta informacoes, mas ele nao organiza a decisao do cliente. A leitura esta dispersa, a hierarquia nao sustenta valor e a experiencia nao conduz para uma acao clara. O resultado e um ativo digital que existe, mas ainda nao trabalha a favor do comercial.",
      },
    ],
  },
  {
    id: "apresentacao-da-solucao",
    title: "Apresentacao da solucao",
    objective: "Conectar o diagnostico a uma proposta enxuta, premium e orientada por resultado.",
    explanation:
      "Nesta etapa o lead precisa sentir que voce esta resolvendo exatamente o problema certo. A solucao precisa soar precisa, nao generica.",
    strategy: [
      "Apresente o formato ideal e diga por que ele faz sentido para aquele caso.",
      "Mostre o que entra no projeto e como isso melhora a conversao.",
      "Separe implantacao e recorrencia para reduzir atrito mental.",
    ],
    messages: [
      {
        id: "solucao-apresentacao",
        label: "Apresentar a proposta",
        audience: "Uso geral",
        message:
          "Pelo que voce me trouxe, eu seguiria por uma estrutura premium e objetiva: uma base visual forte, narrativa comercial mais clara, carregamento rapido e um caminho de conversao direto para WhatsApp ou formulario. Assim voce melhora percepcao de valor e nao depende de explicar tudo no manual toda vez.",
      },
      {
        id: "solucao-investimento",
        label: "Explicar investimento",
        audience: "Uso geral",
        message:
          "Hoje eu trabalho com dois formatos principais: Landing Page Essencial a partir de R$ 900 e Site Institucional Profissional a partir de R$ 1.200. Quando faz sentido, adicionamos tema extra, entrega de codigo, manutencao mensal ou um ajuste comercial personalizado. Eu separo implantacao e recorrencia justamente para a tomada de decisao ficar mais clara.",
      },
    ],
  },
  {
    id: "negociacao",
    title: "Negociacao",
    objective: "Remover travas sem desvalorizar o projeto e manter a conversa centrada em impacto.",
    explanation:
      "Negociacao boa nao e desconto automatico. E ajuste de escopo, timing ou prioridade sem desmanchar a percepcao de valor do trabalho.",
    strategy: [
      "Quando houver resistencia, investigue se a objecao e preco, momento ou confianca.",
      "Troque desconto por ajuste de escopo ou faseamento.",
      "Reforce o custo de manter o problema como esta.",
    ],
    messages: [
      {
        id: "negociacao-quanto-custa",
        label: "Resposta ao 'quanto custa?'",
        audience: "Uso geral",
        message:
          "Consigo te passar o valor com clareza, mas o mais importante e encaixar o formato certo para o momento do negocio. Se o objetivo e validar rapido, podemos comecar pela estrutura essencial. Se a prioridade e autoridade e posicionamento mais forte, o institucional premium faz mais sentido. Quando necessario, eu ajusto escopo e investimento de forma personalizada, sem perder a coerencia do projeto.",
      },
      {
        id: "negociacao-objecao-momento",
        label: "Quando o lead diz que nao e o momento",
        audience: "Uso geral",
        message:
          "Faz sentido avaliar timing. O que eu costumo fazer nesses casos e ajustar o ponto de entrada do projeto para voce nao perder o momento comercial. Em vez de travar tudo, a gente define um escopo inicial mais inteligente e deixa a proxima fase planejada quando o contexto abrir melhor.",
      },
    ],
  },
  {
    id: "fechamento",
    title: "Fechamento",
    objective: "Converter a conversa em decisao com proximo passo simples, claro e sem friccao.",
    explanation:
      "No fechamento, o cliente precisa sentir seguranca. Menos texto, mais direcao. Diga o que acontece depois do sim e torne o kickoff facil.",
    strategy: [
      "Resuma decisao, prazo e proximo passo em uma unica mensagem.",
      "Mostre seguranca no processo: briefing, aprovacao visual, entrega e publicacao.",
      "Crie urgencia real com disponibilidade ou janela de producao, sem manipular.",
    ],
    messages: [
      {
        id: "fechamento-followup",
        label: "Follow-up final",
        audience: "Uso geral",
        message:
          "Passando para fechar esse ponto com voce. Pelo que alinhamos, o projeto faz sentido e resolve exatamente a camada que hoje esta travando autoridade e conversao. Se estiver de acordo, eu reservo a proxima janela de producao, registro o prazo e te envio o kickoff para iniciarmos ainda hoje.",
      },
      {
        id: "fechamento-kickoff",
        label: "Mensagem de inicio",
        audience: "Uso geral",
        message:
          "Perfeito. O proximo passo agora e simples: eu te envio um briefing objetivo, organizo a proposta final com escopo fechado e, assim que receber os materiais essenciais, ja inicio a camada visual. A ideia e manter o processo leve para voce e rapido para a operacao.",
      },
    ],
  },
];
