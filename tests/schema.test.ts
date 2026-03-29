import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { validateSchema } from "@/lib/validation/validate-schema";

describe("schema validation", () => {
  it("accepts mock schema", () => {
    const result = validateSchema(makeMockSchema("two_column"));
    expect(result.success).toBe(true);
  });

  it("rejects broken content refs", () => {
    const schema = makeMockSchema("two_column");
    schema.layout.elements[0].contentRef = "missing";
    const result = validateSchema(schema);
    expect(result.success).toBe(false);
  });
});
