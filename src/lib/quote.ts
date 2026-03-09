import { ProjectPlanKey, ProposalExtraKey } from "@/types/os";

type QuoteLine = {
  label: string;
  value: number;
  type: "implementation" | "recurring";
  note?: string;
};

type QuoteOverrides = {
  customTitle?: string;
  implementationOverride?: number | null;
  recurringOverride?: number | null;
  pricingNotes?: string;
};

export type ProposalScript = {
  id: string;
  title: string;
  description: string;
  message: string;
};

export const PROJECT_PLANS: Record<
  ProjectPlanKey,
  {
    label: string;
    implementation: number;
    includes: string[];
    description: string;
  }
> = {
  "landing-essencial": {
    label: "Landing Page Essencial",
    implementation: 900,
    includes: [
      "Copy de conversao orientada para WhatsApp",
      "1 pagina premium responsiva",
      "Hospedagem incluida por 12 meses",
    ],
    description: "Pacote enxuto para captacao rapida e validacao comercial.",
  },
  "site-institucional": {
    label: "Site Institucional Profissional",
    implementation: 1200,
    includes: [
      "Estrutura institucional com multiplas secoes",
      "Arquitetura visual premium",
      "Hospedagem incluida por 12 meses",
    ],
    description: "Projeto mais robusto para autoridade, servicos e social proof.",
  },
};

export const PROPOSAL_EXTRAS: Record<
  ProposalExtraKey,
  {
    label: string;
    amount: number;
    type: "implementation" | "recurring";
    note?: string;
  }
> = {
  "tema-adicional": {
    label: "Tema adicional (dark/light/ruby/aura)",
    amount: 200,
    type: "implementation",
  },
  "manutencao-mensal": {
    label: "Manutencao mensal",
    amount: 97,
    type: "recurring",
  },
  "entrega-codigo": {
    label: "Entrega completa do codigo",
    amount: 500,
    type: "implementation",
  },
};

export function calculateQuote(projectType: ProjectPlanKey, extras: ProposalExtraKey[], overrides: QuoteOverrides = {}) {
  const plan = PROJECT_PLANS[projectType];

  const lineItems: QuoteLine[] = [
    {
      label: overrides.customTitle?.trim() || plan.label,
      value: plan.implementation,
      type: "implementation",
      note: overrides.pricingNotes?.trim() || undefined,
    },
    ...extras.map((extra) => ({
      label: PROPOSAL_EXTRAS[extra].label,
      value: PROPOSAL_EXTRAS[extra].amount,
      type: PROPOSAL_EXTRAS[extra].type,
      note: PROPOSAL_EXTRAS[extra].note,
    })),
  ];

  const calculatedImplementation = lineItems
    .filter((item) => item.type === "implementation")
    .reduce((total, item) => total + item.value, 0);

  const calculatedRecurring = lineItems
    .filter((item) => item.type === "recurring")
    .reduce((total, item) => total + item.value, 0);

  const implementationTotal = overrides.implementationOverride ?? calculatedImplementation;
  const monthlyRecurring = overrides.recurringOverride ?? calculatedRecurring;

  return {
    plan,
    planLabel: overrides.customTitle?.trim() || plan.label,
    lineItems,
    implementationTotal,
    monthlyRecurring,
    calculatedImplementation,
    calculatedRecurring,
    includedItems: plan.includes,
    pricingNotes: overrides.pricingNotes?.trim() || "",
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function joinLabels(values: string[]) {
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} e ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} e ${values.at(-1)}`;
}

export function buildProposalScripts(params: {
  clientName?: string;
  company?: string;
  planLabel: string;
  implementationTotal: number;
  monthlyRecurring: number;
  includedItems: string[];
  extras: ProposalExtraKey[];
  pricingNotes?: string;
}): ProposalScript[] {
  const clientName = params.clientName?.trim() || "[nome]";
  const company = params.company?.trim() || "[empresa]";
  const includedHighlights = joinLabels(params.includedItems.slice(0, 2));
  const extrasLabels = params.extras.map((extraKey) => PROPOSAL_EXTRAS[extraKey].label);
  const extrasLine = extrasLabels.length ? ` Alem disso, considerei ${joinLabels(extrasLabels)} para deixar a operacao mais redonda desde o inicio.` : "";
  const recurringLine = params.monthlyRecurring > 0
    ? ` A manutencao mensal fica em ${formatCurrency(params.monthlyRecurring)}/mes para sustentar ajustes, suporte e continuidade.`
    : " Nao existe recorrencia obrigatoria nesta configuracao.";
  const pricingNoteLine = params.pricingNotes?.trim()
    ? ` Tambem registrei um ajuste comercial coerente com o contexto: ${params.pricingNotes.trim()}.`
    : "";

  return [
    {
      id: "envio-consultivo",
      title: "Envio consultivo da proposta",
      description: "Mensagem principal para apresentar a proposta sem parecer tabela seca.",
      message:
        `Oi, ${clientName}. Organizei a proposta da ${company} pensando no ponto central que apareceu na nossa conversa: transformar a presenca digital em um ativo que passe mais autoridade e encurte o caminho ate o contato.\n\n` +
        `O formato que faz mais sentido neste momento e ${params.planLabel}, com foco em ${includedHighlights}. O investimento de implantacao fica em ${formatCurrency(params.implementationTotal)}.${recurringLine}${extrasLine}${pricingNoteLine}\n\n` +
        "Se fizer sentido para voce, eu te explico em poucos minutos o racional da estrutura e ja deixo claro como ficam kickoff, prazo e entrega para a decisao ficar simples.",
    },
    {
      id: "ancoragem-de-valor",
      title: "Ancoragem de valor",
      description: "Para usar quando o cliente precisar entender por que esse valor faz sentido.",
      message:
        `Mais do que um site novo, essa proposta foi pensada para corrigir uma camada comercial da ${company}: percepcao de valor, clareza da oferta e facilidade para transformar interesse em conversa real.\n\n` +
        `Por isso o investimento nao esta ligado so a layout. Ele cobre estrutura comercial, narrativa visual, responsividade, velocidade e um fluxo de conversao mais direto. Quando isso entra no lugar certo, o ativo deixa de ser apenas bonito e passa a trabalhar a favor do fechamento.`,
    },
    {
      id: "follow-up-decisao",
      title: "Follow-up para decisao",
      description: "Mensagem curta para puxar resposta sem soar insistente ou ansioso.",
      message:
        `Oi, ${clientName}. Passando para te deixar a decisao facil. A proposta que te enviei foi desenhada para resolver exatamente o ponto que hoje mais pesa na ${company}: autoridade, clareza comercial e resposta mais rapida do lead.\n\n` +
        `Se o formato estiver alinhado, eu reservo a proxima janela e ja inicio o kickoff. Se houver algum ponto para ajustar em escopo, prazo ou investimento, me fala que eu organizo isso de forma objetiva para chegarmos numa decisao.`,
    },
    {
      id: "objecao-de-valor",
      title: "Resposta a objecao de valor",
      description: "Para quando o cliente travar no preco e voce precisar defender valor sem quebrar posicionamento.",
      message:
        `Entendo o cuidado com investimento. O ponto aqui e que a proposta nao foi montada como pacote generico: ela foi estruturada para corrigir um gargalo real da ${company}.\n\n` +
        `Se a decisao hoje estiver travada por caixa ou momento, eu prefiro ajustar a entrada do projeto de forma inteligente do que desmanchar a solucao com desconto aleatorio. Assim a gente preserva coerencia, mantem o que realmente move resultado e encaixa o projeto no contexto atual com mais seguranca.`,
    },
  ];
}
