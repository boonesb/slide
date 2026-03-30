import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { buildDeterministicLayout } from "@/lib/layout/build-layout";
import { BUILTIN_THEMES } from "@/lib/themes/themes";
import { decorativeThreePanelFixture } from "@/tests/fixtures/decorative-three-panel";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

describe("deterministic layout builder", () => {
  it.each(["title_hero", "two_column", "three_card", "quote_proof"] as const)("builds %s with in-bounds elements", (archetype) => {
    const result = buildDeterministicLayout(makeMockSchema(archetype), BUILTIN_THEMES["Enterprise Clean"]);
    expect(result.schema.layout.elements.length).toBeGreaterThanOrEqual(3);

    for (const el of result.schema.layout.elements) {
      expect(el.x).toBeGreaterThanOrEqual(0);
      expect(el.y).toBeGreaterThanOrEqual(0);
      expect(el.x + el.w).toBeLessThanOrEqual(SLIDE_W);
      expect(el.y + el.h).toBeLessThanOrEqual(SLIDE_H);
    }
  });

  it("avoids overlap in representative three-card layout", () => {
    const result = buildDeterministicLayout(makeMockSchema("three_card"), BUILTIN_THEMES["Enterprise Clean"]);
    const elements = result.schema.layout.elements.filter((e) => ["card", "shape"].includes(e.type));

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        expect(overlaps(elements[i], elements[j])).toBe(false);
      }
    }
  });

  it("translates decorative 3-panel fixture to enterprise three-card archetype", () => {
    const result = buildDeterministicLayout(decorativeThreePanelFixture, BUILTIN_THEMES["Enterprise Clean"]);
    expect(result.normalized.sourceClass).toBe("multi_panel_promo");
    expect(result.normalized.archetype).toBe("three_card");
    expect(result.schema.metadata.template).toContain("three_card");
    expect(result.schema.layout.elements.filter((e) => e.groupRole === "card")).toHaveLength(3);
    expect(result.diagnostics.notes.join(" ")).toContain("simplifying background effects");
  });
});
