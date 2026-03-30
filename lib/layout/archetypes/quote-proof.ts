import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { bodyFrame, titleElements } from "@/lib/layout/archetypes/common";

export function buildQuoteProof(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const { top, innerW, bodyH } = bodyFrame(ctx);

  return [
    ...common,
    {
      id: "quote-panel",
      type: "card",
      contentRef: ctx.semantic.quote ?? ctx.semantic.sections[0]?.body ?? "",
      styleToken: "quote_primary",
      x: ctx.theme.layout.margin_outer,
      y: top,
      w: innerW * 0.67,
      h: bodyH,
      zIndex: 4,
      groupRole: "quote_block",
      children: null,
      assetRef: null
    },
    {
      id: "proof-panel",
      type: "card",
      contentRef: (ctx.semantic.proofItems ?? ctx.semantic.sections.slice(1).map((s) => s.body)).slice(0, 4).join("\n• "),
      styleToken: "stat_callout",
      x: ctx.theme.layout.margin_outer + innerW * 0.7,
      y: top,
      w: innerW * 0.3,
      h: bodyH,
      zIndex: 5,
      groupRole: "proof_panel",
      children: null,
      assetRef: null
    }
  ];
}
