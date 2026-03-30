import { describe, expect, it } from "vitest";
import { estimateRequestCostUsd } from "@/lib/ai/cost";

describe("cost estimation", () => {
  it("calculates gpt-5-mini estimated cost from input and output tokens", () => {
    const estimated = estimateRequestCostUsd("gpt-5-mini", {
      inputTokens: 200_000,
      outputTokens: 50_000,
      totalTokens: 250_000
    });

    expect(estimated).toBeCloseTo(0.15, 6);
  });

  it("returns null for unknown models", () => {
    const estimated = estimateRequestCostUsd("unknown-model", {
      inputTokens: 1_000,
      outputTokens: 1_000,
      totalTokens: 2_000
    });

    expect(estimated).toBeNull();
  });
});
