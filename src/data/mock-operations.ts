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
    objective: "Abrir conversa com relevancia, sem parecer disparo em massa e sem queimar a autoridade logo no primeiro contato.",
    explanation:
      "Nesta etapa voce nao vende escopo nem joga tabela. Voce mostra leitura de contexto, desperta curiosidade e faz o lead sentir que existe um ganho claro em continuar a conversa.",
    psychology: [
      "O lead precisa sentir que a mensagem foi escrita para o negocio dele, nao para uma lista fria.",
      "Ele precisa perceber valor na sua observacao antes mesmo de ouvir preco.",
      "A conversa tem que parecer leve e segura, nao invasiva nem desesperada.",
    ],
    watchouts: [
      "Nao comece falando de voce por tres linhas seguidas.",
      "Nao use elogio vazio ou diagnostico exagerado demais.",
      "Nao feche pedindo reuniao longa; convide para um passo pequeno e facil.",
    ],
    strategy: [
      "Comece por um ponto observavel do negocio ou da presenca digital atual.",
      "Traduza esse ponto para impacto comercial: autoridade, conversao, clareza ou velocidade de atendimento.",
      "Feche com convite leve para mostrar um diagnostico ou uma ideia aplicada.",
    ],
    messages: [
      {
        id: "abordagem-inicial-sem-site",
        label: "Primeiro contato",
        audience: "Cliente sem site",
        message:
          "Oi, [nome]. Tudo bem?\n\nMe chamo Wesley, sou da Wes Digital Studio. Cheguei ate a [empresa] enquanto pesquisava negocios do seu segmento e notei que voces ainda concentram boa parte da presenca digital no Instagram, indicacao ou contato manual, sem um site proprio estruturado para sustentar autoridade e facilitar a conversao.\n\nNao estou te chamando para empurrar nada. Meu trabalho e criar sites premium pensados para ajudar empresas a se posicionarem melhor, transmitirem mais confianca e encurtarem o caminho entre interesse e contato.\n\nNo caso da [empresa], isso poderia ajudar principalmente em clareza comercial, percepcao de valor e resposta mais rapida do lead. Se fizer sentido, eu posso te mostrar um diagnostico rapido de como isso poderia funcionar para voces, sem compromisso.",
      },
      {
        id: "abordagem-inicial-site-fraco",
        label: "Primeiro contato",
        audience: "Cliente com site ruim",
        message:
          "Oi, [nome]. Tudo bem?\n\nMe chamo Wesley, sou da Wes Digital Studio. Cheguei ate a [empresa] enquanto analisava negocios do seu segmento e acabei entrando no site de voces. Vi um ponto que costuma pesar bastante na conversa comercial: hoje o site ate informa, mas ainda nao sustenta a autoridade do servico no nivel que o negocio parece entregar.\n\nMeu trabalho e justamente redesenhar essa camada digital para que a empresa transmita mais valor, organize melhor a leitura e conduza o visitante para um proximo passo mais claro.\n\nSe fizer sentido para voce, eu posso te mostrar um diagnostico rapido do que hoje esta travando essa percepcao e como isso poderia ser ajustado de forma mais premium.",
      },
      {
        id: "abordagem-inicial-sem-resposta",
        label: "Reativacao curta",
        audience: "Lead sem retorno inicial",
        message:
          "Oi, [nome]. Voltando de forma objetiva porque achei que valia insistir nesse ponto: a [empresa] tem espaco real para ganhar mais autoridade digital com uma estrutura mais estrategica.\n\nSe nao for prioridade agora, sem problema. Mas se fizer sentido olhar isso com calma, eu te mostro um diagnostico rapido para voce decidir com mais clareza.",
      },
    ],
  },
  {
    id: "descoberta-da-necessidade",
    title: "Descoberta da necessidade",
    objective: "Entender como o lead vende hoje, onde perde oportunidade, quem decide e qual urgencia real existe.",
    explanation:
      "Aqui o foco e ouvir e organizar contexto. Quanto melhor voce entende processo comercial, objecoes, decisor e custo da inercia, mais facil fica vender uma solucao que parece inevitavel.",
    psychology: [
      "O lead precisa perceber que voce nao esta empurrando um formato pronto.",
      "Ele precisa sentir que foi ouvido e que a proposta, se vier, sera precisa.",
      "Pergunta boa aumenta autoridade porque mostra criterio, nao curiosidade vazia.",
    ],
    watchouts: [
      "Nao transforme descoberta em interrogatorio mecanico.",
      "Nao avance para preco antes de entender urgencia e decisor.",
      "Nao deixe a conversa vaga; sempre resuma o que esta ficando claro.",
    ],
    strategy: [
      "Pergunte como chegam os contatos e em que ponto a conversa costuma esfriar.",
      "Descubra qual servico ou oferta mais rentavel precisa de mais visibilidade.",
      "Entenda decisor, prazo e urgencia antes de falar de proposta.",
    ],
    messages: [
      {
        id: "descoberta-diagnostico",
        label: "Perguntas de descoberta",
        audience: "Uso geral",
        message:
          "Antes de te sugerir formato ou investimento, quero entender seu contexto com mais precisao.\n\nHoje os clientes chegam mais por indicacao, Instagram, Google ou WhatsApp? Em que ponto voce sente que perde mais oportunidade: falta de autoridade, pouca clareza da oferta ou demora para transformar interesse em conversa real?",
      },
      {
        id: "descoberta-prioridade",
        label: "Mapear urgencia",
        audience: "Uso geral",
        message:
          "Se a gente melhorasse essa camada digital nas proximas semanas, o que faria mais diferenca para voce agora: gerar mais contatos qualificados, apresentar melhor seu servico premium ou facilitar o fechamento de quem ja chega com interesse?",
      },
      {
        id: "descoberta-fechamento-da-conversa",
        label: "Resumo consultivo",
        audience: "Uso geral",
        message:
          "Pelo que voce me trouxe, o problema nao parece ser falta de esforco comercial, e sim falta de uma estrutura digital que ajude a sustentar valor, conduzir melhor a leitura e reduzir atrito ate o contato. Se entendi certo, faz sentido eu te devolver isso em formato de diagnostico e proposta objetiva.",
      },
    ],
  },
  {
    id: "diagnostico",
    title: "Diagnostico",
    objective: "Traduzir o problema em linguagem de negocio e mostrar custo da inercia antes de entrar em defesa de preco.",
    explanation:
      "O diagnostico organiza a dor e cria clareza. Quando o lead enxerga o custo do problema atual, a proposta deixa de parecer gasto e passa a parecer ajuste estrategico.",
    psychology: [
      "O lead precisa sair dessa etapa pensando 'faz sentido resolver isso agora'.",
      "A clareza do problema vem antes da defesa de escopo.",
      "Diagnostico bom reposiciona voce como consultor, nao como tirador de pedido.",
    ],
    watchouts: [
      "Nao tecnicize demais a conversa.",
      "Nao use critica agressiva ao site atual ou ao negocio.",
      "Nao entregue solucao completa antes de o lead perceber o tamanho do problema.",
    ],
    strategy: [
      "Mostre o problema em tres camadas: percepcao, leitura e conversao.",
      "Evite excesso tecnico; fale do impacto no atendimento, na confianca e no fechamento.",
      "Conduza o lead para a ideia de reposicionamento, nao apenas redesign.",
    ],
    messages: [
      {
        id: "diagnostico-sem-site",
        label: "Leitura consultiva",
        audience: "Cliente sem site",
        message:
          "Hoje o principal gargalo nao e falta de esforco comercial. O gargalo e nao existir uma base propria que sustente autoridade quando alguem pesquisa seu nome, compara voce com concorrentes ou precisa decidir com mais seguranca.\n\nSem essa camada, a [empresa] depende demais do contato manual e perde eficiencia no processo de convencimento.",
      },
      {
        id: "diagnostico-site-fraco",
        label: "Leitura consultiva",
        audience: "Cliente com site ruim",
        message:
          "O site atual ate apresenta informacoes, mas ele nao organiza a decisao do cliente. A leitura esta dispersa, a hierarquia nao sustenta valor e a experiencia nao conduz para uma acao clara.\n\nNa pratica, a [empresa] tem um ativo digital que existe, mas ainda nao trabalha a favor do comercial.",
      },
      {
        id: "diagnostico-transicao",
        label: "Ponte para a proposta",
        audience: "Uso geral",
        message:
          "O ponto central nao e apenas deixar a interface mais bonita. E criar uma estrutura que comunique melhor o nivel do servico, conduza a leitura com mais inteligencia e facilite a conversao. Com isso claro, eu consigo te sugerir uma proposta muito mais coerente com o momento do negocio.",
      },
    ],
  },
  {
    id: "apresentacao-da-solucao",
    title: "Apresentacao da solucao",
    objective: "Conectar o diagnostico a uma proposta enxuta, premium e claramente orientada por resultado.",
    explanation:
      "Nesta etapa o lead precisa sentir que voce esta resolvendo exatamente o problema certo. A solucao precisa soar precisa, justificada e proporcional ao momento do negocio.",
    psychology: [
      "O lead precisa enxergar coerencia entre problema, formato e investimento.",
      "A proposta deve dar seguranca, nao excesso de opcao.",
      "Quando a solucao parece desenhada sob medida, a defesa de valor fica mais facil.",
    ],
    watchouts: [
      "Nao despeje lista gigante de entregas.",
      "Nao apresente duas ou tres opcoes sem criterio claro.",
      "Nao trate manutencao ou extras como apendice confuso.",
    ],
    strategy: [
      "Apresente o formato ideal e diga por que ele faz sentido especificamente para aquele caso.",
      "Mostre o que entra no projeto e como isso melhora percepcao, leitura e conversao.",
      "Separe implantacao e recorrencia para reduzir atrito mental na decisao.",
    ],
    messages: [
      {
        id: "solucao-apresentacao",
        label: "Apresentar a proposta",
        audience: "Uso geral",
        message:
          "Pelo que voce me trouxe, eu seguiria por uma estrutura premium e objetiva: uma base visual forte, narrativa comercial mais clara, carregamento rapido e um caminho de conversao direto para WhatsApp ou formulario.\n\nAssim voce melhora percepcao de valor e reduz a necessidade de convencer no manual aquilo que a interface deveria resolver sozinha.",
      },
      {
        id: "solucao-investimento",
        label: "Explicar investimento",
        audience: "Uso geral",
        message:
          "Hoje eu trabalho com formatos que respeitam o momento do negocio. A entrada mais enxuta comeca em Landing Page Essencial a partir de R$ 900. Quando a necessidade pede mais autoridade, narrativa e estrutura, o Site Institucional Profissional parte de R$ 1.200.\n\nQuando faz sentido, adicionamos tema extra, entrega de codigo, manutencao mensal ou ajuste comercial personalizado. Eu separo implantacao e recorrencia justamente para a decisao ficar mais clara.",
      },
      {
        id: "solucao-envio-proposta",
        label: "Mensagem de envio",
        audience: "Uso geral",
        message:
          "Organizei a proposta para a [empresa] com foco em resolver exatamente o gargalo que apareceu na conversa: melhorar autoridade, clareza comercial e a passagem do interesse para o contato. O racional esta direto, sem excesso de camada. Se fizer sentido, te explico em dois minutos a logica da estrutura e o proximo passo para kickoff.",
      },
    ],
  },
  {
    id: "negociacao",
    title: "Negociacao",
    objective: "Remover travas sem desvalorizar o projeto e manter a conversa centrada em impacto, prioridade e ajuste inteligente.",
    explanation:
      "Negociacao boa nao e desconto automatico. E leitura correta da objecao: preco, timing, confianca ou prioridade. A resposta muda conforme a trava real.",
    psychology: [
      "O lead precisa sentir flexibilidade com criterio, nao desespero para fechar.",
      "Defesa de valor funciona melhor quando voce mostra custo de manter o problema.",
      "Ajuste inteligente protege posicionamento e ainda abre caminho para o sim.",
    ],
    watchouts: [
      "Nao responda objecao de preco oferecendo desconto imediato.",
      "Nao discuta o valor sem antes identificar se a trava e realmente financeira.",
      "Nao deixe o cliente sair com promessa vaga de 'depois eu vejo'.",
    ],
    strategy: [
      "Descubra se a objecao e preco, momento, prioridade ou confianca.",
      "Troque desconto aleatorio por ajuste de escopo, faseamento ou entrada mais inteligente.",
      "Reforce o custo de manter o problema como esta e puxe decisao com clareza.",
    ],
    messages: [
      {
        id: "negociacao-quanto-custa",
        label: "Resposta ao 'quanto custa?'",
        audience: "Uso geral",
        message:
          "Consigo te passar o valor com clareza, mas o mais importante aqui e encaixar o formato certo para o momento do negocio. Se o objetivo e validar rapido, podemos começar por uma estrutura mais essencial. Se a prioridade e sustentar mais autoridade e posicionamento, a configuracao premium faz mais sentido.\n\nQuando necessario, eu ajusto escopo e investimento de forma personalizada, mas sem perder coerencia no projeto.",
      },
      {
        id: "negociacao-objecao-momento",
        label: "Quando o lead diz que nao e o momento",
        audience: "Uso geral",
        message:
          "Faz sentido avaliar timing. O que eu costumo fazer nesses casos e ajustar o ponto de entrada do projeto para voce nao perder o momento comercial.\n\nEm vez de travar tudo, a gente define um escopo inicial mais inteligente e deixa a fase seguinte planejada para quando o contexto abrir melhor.",
      },
      {
        id: "negociacao-objecao-preco",
        label: "Quando o lead diz que ficou caro",
        audience: "Uso geral",
        message:
          "Entendo o cuidado com investimento. O ponto aqui e que a proposta nao foi montada como pacote generico, e sim para corrigir um gargalo especifico da [empresa].\n\nSe a trava hoje estiver no caixa ou no momento, eu prefiro reorganizar a entrada do projeto de forma inteligente do que cortar elementos que sustentam resultado e posicionamento.",
      },
      {
        id: "negociacao-followup-sem-resposta",
        label: "Follow-up apos proposta enviada",
        audience: "Uso geral",
        message:
          "Oi, [nome]. Passando para te deixar a decisao facil. A proposta que te enviei foi desenhada exatamente para resolver o ponto que hoje mais pesa na [empresa]: autoridade, clareza comercial e resposta mais rapida do lead.\n\nSe estiver alinhada, eu reservo a janela de producao. Se houver algum ponto para ajustar em escopo, prazo ou investimento, me fala que eu organizo isso de forma objetiva.",
      },
    ],
  },
  {
    id: "fechamento",
    title: "Fechamento",
    objective: "Converter a conversa em decisao com proximo passo simples, claro e sem friccao.",
    explanation:
      "No fechamento, o cliente precisa sentir seguranca, direcao e controle. Menos texto, mais proximo passo. Diga o que acontece depois do sim e torne o kickoff facil.",
    psychology: [
      "O cliente precisa sentir que o processo esta sob controle.",
      "Quanto mais claro for o proximo passo, menor a chance de ele esfriar.",
      "Encerramento elegante tambem protege sua autoridade quando nao houver resposta.",
    ],
    watchouts: [
      "Nao finalize com texto longo demais.",
      "Nao feche sem dizer o que acontece imediatamente apos o sim.",
      "Nao deixe conversa morrendo em aberto por semanas; encerre com classe quando necessario.",
    ],
    strategy: [
      "Resuma decisao, prazo e proximo passo em uma unica mensagem.",
      "Mostre seguranca no processo: briefing, aprovacao visual, entrega e publicacao.",
      "Crie urgencia real com disponibilidade ou janela de producao, sem manipular.",
    ],
    messages: [
      {
        id: "fechamento-followup",
        label: "Convite para decidir",
        audience: "Uso geral",
        message:
          "Passando para fechar esse ponto com voce. Pelo que alinhamos, o projeto faz sentido e resolve exatamente a camada que hoje esta travando autoridade e conversao na [empresa].\n\nSe estiver de acordo, eu reservo a proxima janela de producao, registro o prazo e te envio o kickoff para iniciarmos de forma objetiva.",
      },
      {
        id: "fechamento-kickoff",
        label: "Mensagem de inicio",
        audience: "Uso geral",
        message:
          "Perfeito. O proximo passo agora e simples: eu te envio um briefing objetivo, organizo o escopo final e, assim que receber os materiais essenciais, ja inicio a camada visual.\n\nA ideia e manter o processo leve para voce e rapido para a operacao, com visibilidade de prazo e entrega desde o inicio.",
      },
      {
        id: "fechamento-encerramento-elegante",
        label: "Encerramento elegante",
        audience: "Lead sem retorno prolongado",
        message:
          "Oi, [nome]. Vou encerrar esse ponto por aqui para nao ficar te pressionando sem necessidade.\n\nComo a proposta foi desenhada para um contexto especifico da [empresa], prefiro deixar a conversa limpa. Se isso voltar a ser prioridade mais adiante, me chama que eu retomo de forma objetiva e com o mesmo contexto organizado.",
      },
    ],
  },
];
