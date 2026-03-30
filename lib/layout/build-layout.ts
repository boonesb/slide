import type { SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";
import { normalizeSemanticSchema } from "@/lib/layout/normalize";
import { buildArchetypeElements } from "@/lib/layout/archetypes";
import { applyOverflowStrategy } from "@/lib/layout/overflow";
import type { LayoutBuildResult } from "@/lib/layout/types";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function clampElements(schema: SlideSchema, margin: number): { elements: SlideSchema["layout"]["elements"]; warnings: string[] } {
  const warnings: string[] = [];
  const minGap = 0.04;
  const sorted = [...schema.layout.elements].sort((a, b) => a.zIndex - b.zIndex);

  const clamped = sorted.map((el) => {
    const w = Math.min(el.w, SLIDE_W - margin * 2);
    const h = Math.min(el.h, SLIDE_H - margin * 2);
    const x = Math.max(margin, Math.min(el.x, SLIDE_W - margin - w));
    const y = Math.max(margin, Math.min(el.y, SLIDE_H - margin - h));
    if (x !== el.x || y !== el.y || w !== el.w || h !== el.h) warnings.push(`Adjusted ${el.id} to stay in-bounds.`);
    return { ...el, x, y, w, h };
  });

  for (let i = 1; i < clamped.length; i++) {
    const prev = clamped[i - 1];
    const curr = clamped[i];
    const overlapX = prev.x < curr.x + curr.w && prev.x + prev.w > curr.x;
    const overlapY = prev.y < curr.y + curr.h && prev.y + prev.h > curr.y;
    if (overlapX && overlapY) {
      curr.y = Math.min(SLIDE_H - margin - curr.h, prev.y + prev.h + minGap);
      warnings.push(`Resolved overlap between ${prev.id} and ${curr.id}.`);
    }
  }

  return { elements: clamped, warnings };
}

export function buildDeterministicLayout(schema: SlideSchema, theme: ThemeTokens): LayoutBuildResult {
  const normalized = normalizeSemanticSchema(schema);
  const builtElements = buildArchetypeElements({ semantic: normalized, theme, source: schema });

  const provisionalSchema: SlideSchema = {
    ...schema,
    layout: {
      slideSize: "LAYOUT_WIDE",
      background: { fillToken: "bg_primary" },
      elements: builtElements
    }
  };

  const overflow = applyOverflowStrategy(normalized, provisionalSchema.layout.elements);
  provisionalSchema.layout.elements = overflow.elements;

  const clamped = clampElements(provisionalSchema, theme.layout.margin_outer);
  provisionalSchema.layout.elements = clamped.elements;

  return {
    schema: provisionalSchema,
    normalized,
    diagnostics: {
      warnings: clamped.warnings,
      overflowWarnings: overflow.warnings,
      droppedContent: overflow.droppedContent
    }
  };
}
