import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";

export const SLIDE_W = 13.333;
export const SLIDE_H = 7.5;

export function titleElements(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const { margin_outer, gap_minor, safe_title_zone } = ctx.theme.layout;
  const titleH = Math.max(0.68, safe_title_zone * 0.48);

  const elements: SlideSchema["layout"]["elements"] = [
    {
      id: "title",
      type: "text",
      contentRef: ctx.semantic.title,
      styleToken: "title_primary",
      x: margin_outer,
      y: margin_outer,
      w: SLIDE_W - margin_outer * 2,
      h: titleH,
      zIndex: 10,
      groupRole: "title",
      children: null,
      assetRef: null
    }
  ];

  if (ctx.semantic.subtitle) {
    elements.push({
      id: "subtitle",
      type: "text",
      contentRef: ctx.semantic.subtitle,
      styleToken: "title_secondary",
      x: margin_outer,
      y: margin_outer + titleH + gap_minor,
      w: SLIDE_W - margin_outer * 2,
      h: Math.max(0.34, safe_title_zone * 0.28),
      zIndex: 11,
      groupRole: "subtitle",
      children: null,
      assetRef: null
    });
  }

  return elements;
}

export function bodyFrame(ctx: LayoutBuildContext) {
  const top = ctx.theme.layout.margin_outer + ctx.theme.layout.safe_title_zone;
  const innerW = SLIDE_W - ctx.theme.layout.margin_outer * 2;
  const bodyH = SLIDE_H - top - ctx.theme.layout.margin_outer;
  return { top, innerW, bodyH };
}

export function cardText(section?: { heading: string | null; body: string; bullets: string[] }) {
  return [section?.heading, section?.body, ...(section?.bullets ?? []).map((b) => `• ${b}`)].filter(Boolean).join("\n");
}
