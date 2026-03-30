import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { bodyFrame, cardText, titleElements } from "@/lib/layout/archetypes/common";

export function buildFallback(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const { top, innerW, bodyH } = bodyFrame(ctx);
  const rows = Math.max(1, Math.min(4, ctx.semantic.sections.length || 1));
  const gap = ctx.theme.layout.gap_minor;
  const rowH = (bodyH - gap * (rows - 1)) / rows;

  const sections = Array.from({ length: rows }).map((_, i) => ({
    id: `fallback-${i + 1}`,
    type: "card" as const,
    contentRef: cardText(ctx.semantic.sections[i]),
    styleToken: "card_neutral",
    x: ctx.theme.layout.margin_outer,
    y: top + i * (rowH + gap),
    w: innerW,
    h: rowH,
    zIndex: 3,
    groupRole: "fallback_section",
    children: null,
    assetRef: null
  }));

  return [...common, ...sections];
}
