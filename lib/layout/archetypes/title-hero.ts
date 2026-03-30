import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { bodyFrame, cardText, titleElements } from "@/lib/layout/archetypes/common";

export function buildTitleHero(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const { top, innerW, bodyH } = bodyFrame(ctx);
  const panelW = innerW * 0.62;

  return [
    ...common,
    {
      id: "hero-panel",
      type: "shape",
      contentRef: null,
      styleToken: "panel_subtle",
      x: ctx.theme.layout.margin_outer,
      y: top,
      w: panelW,
      h: bodyH,
      zIndex: 1,
      groupRole: "hero_panel",
      children: null,
      assetRef: null
    },
    {
      id: "hero-body",
      type: "text",
      contentRef: cardText(ctx.semantic.sections[0]),
      styleToken: "body_primary",
      x: ctx.theme.layout.margin_outer + ctx.theme.layout.padding_panel,
      y: top + ctx.theme.layout.padding_panel,
      w: panelW - ctx.theme.layout.padding_panel * 2,
      h: bodyH - ctx.theme.layout.padding_panel * 2,
      zIndex: 2,
      groupRole: "hero_copy",
      children: null,
      assetRef: null
    },
    {
      id: "support-panel",
      type: "card",
      contentRef: cardText(ctx.semantic.sections[1] ?? ctx.semantic.sections[0]),
      styleToken: "card_feature",
      x: ctx.theme.layout.margin_outer + panelW + ctx.theme.layout.gap_section,
      y: top,
      w: innerW - panelW - ctx.theme.layout.gap_section,
      h: bodyH,
      zIndex: 3,
      groupRole: "support_panel",
      children: null,
      assetRef: null
    }
  ];
}
