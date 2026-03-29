import { describe, expect, it } from "vitest";
import { ARCHETYPES } from "@/types/slide";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { validateSchema } from "@/lib/validation/validate-schema";

describe("mock outputs", () => {
  it("produce valid schema for each archetype", () => {
    for (const archetype of ARCHETYPES) {
      const result = validateSchema(makeMockSchema(archetype));
      expect(result.success).toBe(true);
    }
  });
});
