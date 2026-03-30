import { describe, expect, it } from "vitest";
import { makeMockSchema } from "@/lib/ai/mock-data";
import { slideJsonSchema } from "@/lib/schema/slide-schema";
import { validateSchema } from "@/lib/validation/validate-schema";

function expectAllObjectPropertiesRequired(node: unknown, path = "root") {
  if (!node || typeof node !== "object") return;
  const schemaNode = node as {
    type?: string | string[];
    properties?: Record<string, unknown>;
    required?: string[];
    items?: unknown;
  };

  if (schemaNode.properties) {
    expect(schemaNode.required, `${path} should declare required`).toEqual(Object.keys(schemaNode.properties));
    for (const [key, value] of Object.entries(schemaNode.properties)) {
      expectAllObjectPropertiesRequired(value, `${path}.properties.${key}`);
    }
  }

  if (schemaNode.items) {
    expectAllObjectPropertiesRequired(schemaNode.items, `${path}.items`);
  }
}

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

  it("keeps object required arrays in sync with object properties", () => {
    expectAllObjectPropertiesRequired(slideJsonSchema);
  });
});
