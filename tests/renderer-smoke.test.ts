import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { BUILTIN_THEMES } from "@/lib/themes/themes";
import { renderPptxBuffer } from "@/lib/render/pptx-renderer";
import { buildDeterministicLayout } from "@/lib/layout/build-layout";

describe("renderer smoke", () => {
  it.each(["title_hero", "two_column", "three_card", "quote_proof"] as const)("produces styled pptx for %s", async (archetype) => {
    const built = buildDeterministicLayout(makeMockSchema(archetype), BUILTIN_THEMES["Enterprise Dark"]);
    const buffer = await renderPptxBuffer(built.schema, BUILTIN_THEMES["Enterprise Dark"]);
    expect(buffer.byteLength).toBeGreaterThan(300);
    expect(buffer.subarray(0, 2).toString()).toBe("PK");
  });
});
