import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { bodyFrame, cardText, titleElements } from "@/lib/layout/archetypes/common";

export function buildTwoColumn(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const { top, innerW, bodyH } = bodyFrame(ctx);
  const colW = (innerW - ctx.theme.layout.gap_section) / 2;
  const left = ctx.semantic.sections[0];
  const right = ctx.semantic.sections[1] ?? left;

  return [
    ...common,
    {
      id: "col-left-label",
      type: "text",
      contentRef: left?.heading ?? "Left",
      styleToken: "section_label",
      x: ctx.theme.layout.margin_outer,
      y: top,
      w: colW,
      h: 0.3,
      zIndex: 4,
      groupRole: "section_label",
      children: null,
      assetRef: null
    },
    {
      id: "col-left",
      type: "card",
      contentRef: cardText(left),
      styleToken: "card_neutral",
      x: ctx.theme.layout.margin_outer,
      y: top + 0.36,
      w: colW,
      h: bodyH - 0.36,
      zIndex: 5,
      groupRole: "column_left",
      children: null,
      assetRef: null
    },
    {
      id: "col-right-label",
      type: "text",
      contentRef: right?.heading ?? "Right",
      styleToken: "section_label",
      x: ctx.theme.layout.margin_outer + colW + ctx.theme.layout.gap_section,
      y: top,
      w: colW,
      h: 0.3,
      zIndex: 4,
      groupRole: "section_label",
      children: null,
      assetRef: null
    },
    {
      id: "col-right",
      type: "card",
      contentRef: cardText(right),
      styleToken: "card_solution",
      x: ctx.theme.layout.margin_outer + colW + ctx.theme.layout.gap_section,
      y: top + 0.36,
      w: colW,
      h: bodyH - 0.36,
      zIndex: 5,
      groupRole: "column_right",
      children: null,
      assetRef: null
    }
  ];
}
