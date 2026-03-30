import { slideSchemaZod } from "@/lib/schema/slide-schema";
import type { SlideSchema } from "@/types/slide";

function isReferenceLike(value: string) {
  return !value.includes(" ") && !value.includes("\n") && /^[a-zA-Z0-9_-]+$/.test(value) && value.length <= 32;
}

export function validateSchema(input: unknown): { success: boolean; data?: SlideSchema; errors?: unknown } {
  const parsed = slideSchemaZod.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  const semanticIds = new Set(parsed.data.content.semanticObjects.map((s) => s.id));
  const sectionIds = new Set(parsed.data.content.sections.map((s) => s.id));
  const invalidRef = parsed.data.layout.elements.find(
    (e) => e.contentRef && isReferenceLike(e.contentRef) && !semanticIds.has(e.contentRef) && !sectionIds.has(e.contentRef)
  );
  if (invalidRef) {
    return { success: false, errors: { message: `Unknown contentRef: ${invalidRef.contentRef}` } };
  }

  return { success: true, data: parsed.data };
}
