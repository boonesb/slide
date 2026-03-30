import type { SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";
import { normalizeLayoutElements, normalizeSemanticSchema } from "@/lib/layout/normalize";
import { buildArchetypeElements } from "@/lib/layout/archetypes";
import { applyOverflowStrategy } from "@/lib/layout/overflow";
import type { LayoutBuildResult } from "@/lib/layout/types";

export function buildDeterministicLayout(schema: SlideSchema, theme: ThemeTokens): LayoutBuildResult {
  const normalized = normalizeSemanticSchema(schema);
  const builtElements = buildArchetypeElements({ semantic: normalized, theme, source: schema });

  const provisionalSchema: SlideSchema = {
    ...schema,
    metadata: {
      ...schema.metadata,
      slideArchetype: normalized.archetype,
      template: normalized.selectedTemplate,
      notes: [...(schema.metadata.notes ?? []), ...normalized.notes]
    },
    layout: {
      slideSize: "LAYOUT_WIDE",
      background: { fillToken: normalized.simplifyDecorativeTreatment ? "bg_primary" : schema.layout.background.fillToken },
      elements: builtElements
    }
  };

  const overflow = applyOverflowStrategy(normalized, provisionalSchema.layout.elements);
  provisionalSchema.layout.elements = overflow.elements;

  const normalizedLayout = normalizeLayoutElements(provisionalSchema.layout.elements, theme.layout.margin_outer);
  provisionalSchema.layout.elements = normalizedLayout.elements;

  return {
    schema: provisionalSchema,
    normalized,
    diagnostics: {
      warnings: normalizedLayout.warnings,
      overflowWarnings: overflow.warnings,
      droppedContent: overflow.droppedContent,
      notes: normalized.notes
    }
  };
}
