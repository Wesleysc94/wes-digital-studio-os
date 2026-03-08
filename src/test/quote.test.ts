import { describe, expect, it } from "vitest";

import { calculateQuote } from "@/lib/quote";

describe("calculateQuote", () => {
  it("separates implementation and recurring values", () => {
    const quote = calculateQuote("site-institucional", ["tema-adicional", "manutencao-mensal"]);

    expect(quote.implementationTotal).toBe(1400);
    expect(quote.monthlyRecurring).toBe(97);
  });

  it("keeps recurring empty when no recurring extras are selected", () => {
    const quote = calculateQuote("landing-essencial", ["entrega-codigo"]);

    expect(quote.implementationTotal).toBe(1400);
    expect(quote.monthlyRecurring).toBe(0);
  });
});
