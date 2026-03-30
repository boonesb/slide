import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { buildDeterministicLayout } from "@/lib/layout/build-layout";
import { BUILTIN_THEMES } from "@/lib/themes/themes";

describe("overflow handling", () => {
  it("compresses and warns on excessive content", () => {
    const schema = makeMockSchema("three_card");
    schema.content.sections = schema.content.sections.map((s) => ({
      ...s,
      body: `${s.body} `.repeat(80)
    }));

    const result = buildDeterministicLayout(schema, BUILTIN_THEMES["Enterprise Clean"]);
    expect(result.diagnostics.overflowWarnings.length).toBeGreaterThan(0);
    const card = result.schema.layout.elements.find((e) => e.id === "card-1");
    expect((card?.contentRef ?? "").length).toBeLessThan(schema.content.sections[0].body.length);
  });

  it("drops lower-priority detail only when rewrite is allowed", () => {
    const schema = makeMockSchema("three_card");
    schema.content.sections[0].body = "First proof sentence. Second lower-priority detail sentence. Third detail sentence. ".repeat(40);
    schema.content.semanticObjects.push({
      id: "s1",
      kind: "section",
      role: "body",
      priority: 8,
      mustPreserve: false,
      rewriteAllowed: "moderate",
      visualWeight: "low",
      headline: null,
      body: schema.content.sections[0].body,
      iconHint: null
    });

    const result = buildDeterministicLayout(schema, BUILTIN_THEMES["Enterprise Clean"]);
    expect(result.diagnostics.droppedContent.length).toBeGreaterThan(0);
  });
});
