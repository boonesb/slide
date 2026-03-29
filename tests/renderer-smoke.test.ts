import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { BUILTIN_THEMES } from "@/lib/themes/themes";
import { renderPptxBuffer } from "@/lib/render/pptx-renderer";

describe("renderer smoke", () => {
  it("produces pptx buffer", async () => {
    const buffer = await renderPptxBuffer(makeMockSchema("title_hero"), BUILTIN_THEMES["Enterprise Clean"]);
    expect(buffer.byteLength).toBeGreaterThan(200);
    expect(buffer.subarray(0, 2).toString()).toBe("PK");
  });
});
