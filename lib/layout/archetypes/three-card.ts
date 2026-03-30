import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { bodyFrame, cardText, titleElements } from "@/lib/layout/archetypes/common";

export function buildThreeCard(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const { top, innerW, bodyH } = bodyFrame(ctx);
  const items = ctx.semantic.sections.slice(0, 4);
  const count = Math.max(2, Math.min(4, items.length || 3));
  const styles = ["card_problem", "card_solution", "card_feature", "card_neutral"];

  const rowCount = count <= 3 ? 1 : 2;
  const colCount = count <= 3 ? count : 2;
  const gapX = ctx.theme.layout.gap_card;
  const gapY = ctx.theme.layout.gap_section;
  const cardW = (innerW - gapX * (colCount - 1)) / colCount;
  const cardH = rowCount === 1 ? bodyH : (bodyH - gapY) / 2;

  const cards = Array.from({ length: count }).map((_, i) => {
    const row = rowCount === 1 ? 0 : Math.floor(i / colCount);
    const col = rowCount === 1 ? i : i % colCount;
    return {
      id: `card-${i + 1}`,
      type: "card" as const,
      contentRef: cardText(items[i]),
      styleToken: styles[i] ?? "card_neutral",
      x: ctx.theme.layout.margin_outer + col * (cardW + gapX),
      y: top + row * (cardH + gapY),
      w: cardW,
      h: cardH,
      zIndex: 6,
      groupRole: "card",
      children: null,
      assetRef: null
    };
  });

  return [...common, ...cards];
}
