export interface AiUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

interface Pricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

const PRICING_BY_MODEL: Record<string, Pricing> = {
  "gpt-5-mini": {
    inputPerMillion: 0.25,
    outputPerMillion: 2.0
  }
};

function normalizeModel(model: string) {
  return model.trim().toLowerCase();
}

export function estimateRequestCostUsd(model: string, usage: AiUsage): number | null {
  const pricing = PRICING_BY_MODEL[normalizeModel(model)];
  if (!pricing) return null;

  const inputCost = (usage.inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (usage.outputTokens / 1_000_000) * pricing.outputPerMillion;
  return inputCost + outputCost;
}
