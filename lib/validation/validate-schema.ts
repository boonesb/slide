import { slideSchemaZod } from "@/lib/schema/slide-schema";
import type { SlideSchema } from "@/types/slide";

export function validateSchema(input: unknown): { success: boolean; data?: SlideSchema; errors?: unknown } {
  const parsed = slideSchemaZod.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  const semanticIds = new Set(parsed.data.content.semanticObjects.map((s) => s.id));
  const invalidRef = parsed.data.layout.elements.find((e) => e.contentRef && !semanticIds.has(e.contentRef) && !parsed.data.content.sections.find((s) => s.id === e.contentRef));
  if (invalidRef) {
    return { success: false, errors: { message: `Unknown contentRef: ${invalidRef.contentRef}` } };
  }

  return { success: true, data: parsed.data };
}
