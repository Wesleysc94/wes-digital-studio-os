import { ProjectPlanKey, ProposalExtraKey } from "@/types/os";

type QuoteLine = {
  label: string;
  value: number;
  type: "implementation" | "recurring";
  note?: string;
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

export function calculateQuote(projectType: ProjectPlanKey, extras: ProposalExtraKey[]) {
  const plan = PROJECT_PLANS[projectType];

  const lineItems: QuoteLine[] = [
    {
      label: plan.label,
      value: plan.implementation,
      type: "implementation",
    },
    ...extras.map((extra) => ({
      label: PROPOSAL_EXTRAS[extra].label,
      value: PROPOSAL_EXTRAS[extra].amount,
      type: PROPOSAL_EXTRAS[extra].type,
      note: PROPOSAL_EXTRAS[extra].note,
    })),
  ];

  const implementationTotal = lineItems
    .filter((item) => item.type === "implementation")
    .reduce((total, item) => total + item.value, 0);

  const monthlyRecurring = lineItems
    .filter((item) => item.type === "recurring")
    .reduce((total, item) => total + item.value, 0);

  return {
    plan,
    lineItems,
    implementationTotal,
    monthlyRecurring,
    includedItems: plan.includes,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
