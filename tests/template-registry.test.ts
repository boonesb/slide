import { describe, expect, it } from "vitest";
import { templateRegistry } from "@/lib/templates/registry";
import { ARCHETYPES } from "@/types/slide";

describe("template registry", () => {
  it("contains all archetypes", () => {
    for (const a of ARCHETYPES) {
      expect(templateRegistry[a]).toBeDefined();
      expect(templateRegistry[a].archetype).toBe(a);
    }
  });
});
