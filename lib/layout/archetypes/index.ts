import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function titleElements(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const { margin_outer, gap_minor, safe_title_zone } = ctx.theme.layout;
  const yBase = margin_outer;
  const elements: SlideSchema["layout"]["elements"] = [
    {
      id: "title",
      type: "text",
      contentRef: ctx.semantic.title,
      styleToken: "title_primary",
      x: margin_outer,
      y: yBase,
      w: SLIDE_W - margin_outer * 2,
      h: Math.max(0.72, safe_title_zone * 0.48),
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
      y: yBase + 0.72 + gap_minor,
      w: SLIDE_W - margin_outer * 2,
      h: Math.max(0.42, safe_title_zone * 0.28),
      zIndex: 11,
      groupRole: "subtitle",
      children: null,
      assetRef: null
    });
  }

  return elements;
}

function primaryArchetype(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const top = ctx.theme.layout.safe_title_zone + ctx.theme.layout.margin_outer;
  const innerW = SLIDE_W - ctx.theme.layout.margin_outer * 2;
  const bodyH = SLIDE_H - top - ctx.theme.layout.margin_outer;

  switch (ctx.semantic.archetype) {
    case "title_hero":
      return [
        ...common,
        {
          id: "hero-panel",
          type: "shape",
          contentRef: null,
          styleToken: "panel_subtle",
          x: ctx.theme.layout.margin_outer,
          y: top,
          w: innerW * 0.62,
          h: bodyH,
          zIndex: 1,
          groupRole: "hero_panel",
          children: null,
          assetRef: null
        },
        {
          id: "hero-body",
          type: "text",
          contentRef: ctx.semantic.sections[0]?.body ?? "",
          styleToken: "body_primary",
          x: ctx.theme.layout.margin_outer + ctx.theme.layout.padding_panel,
          y: top + ctx.theme.layout.padding_panel,
          w: innerW * 0.62 - ctx.theme.layout.padding_panel * 2,
          h: bodyH - ctx.theme.layout.padding_panel * 2,
          zIndex: 2,
          groupRole: "hero_copy",
          children: null,
          assetRef: null
        },
        {
          id: "support-panel",
          type: "card",
          contentRef: ctx.semantic.sections[1]?.body ?? "",
          styleToken: "card_feature",
          x: ctx.theme.layout.margin_outer + innerW * 0.66,
          y: top,
          w: innerW * 0.34,
          h: bodyH,
          zIndex: 3,
          groupRole: "support_panel",
          children: null,
          assetRef: null
        }
      ];
    case "two_column": {
      const colW = (innerW - ctx.theme.layout.gap_section) / 2;
      const left = ctx.semantic.sections[0];
      const right = ctx.semantic.sections[1] ?? ctx.semantic.sections[0];
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
          h: 0.34,
          zIndex: 4,
          groupRole: "section_label",
          children: null,
          assetRef: null
        },
        {
          id: "col-left",
          type: "card",
          contentRef: [left?.body, ...(left?.bullets ?? [])].filter(Boolean).join("\n• "),
          styleToken: "card_neutral",
          x: ctx.theme.layout.margin_outer,
          y: top + 0.4,
          w: colW,
          h: bodyH - 0.4,
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
          h: 0.34,
          zIndex: 4,
          groupRole: "section_label",
          children: null,
          assetRef: null
        },
        {
          id: "col-right",
          type: "card",
          contentRef: [right?.body, ...(right?.bullets ?? [])].filter(Boolean).join("\n• "),
          styleToken: "card_solution",
          x: ctx.theme.layout.margin_outer + colW + ctx.theme.layout.gap_section,
          y: top + 0.4,
          w: colW,
          h: bodyH - 0.4,
          zIndex: 5,
          groupRole: "column_right",
          children: null,
          assetRef: null
        }
      ];
    }
    case "three_card": {
      const items = ctx.semantic.sections.slice(0, 4);
      const count = Math.max(2, Math.min(4, items.length || 3));
      const gap = ctx.theme.layout.gap_card;
      const cardW = (innerW - gap * (count - 1)) / count;
      const styles = ["card_problem", "card_solution", "card_feature", "card_neutral"];
      return [
        ...common,
        ...Array.from({ length: count }).map((_, i) => ({
          id: `card-${i + 1}`,
          type: "card" as const,
          contentRef: [items[i]?.heading, items[i]?.body, ...(items[i]?.bullets ?? [])].filter(Boolean).join("\n"),
          styleToken: styles[i] ?? "card_neutral",
          x: ctx.theme.layout.margin_outer + i * (cardW + gap),
          y: top,
          w: cardW,
          h: bodyH,
          zIndex: 6,
          groupRole: "card",
          children: null,
          assetRef: null
        }))
      ];
    }
    case "quote_proof":
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
          contentRef: (ctx.semantic.proofItems ?? ctx.semantic.sections.slice(1).map((s) => s.body)).slice(0, 3).join("\n"),
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
    default:
      return [];
  }
}

function fallbackArchetype(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  const common = titleElements(ctx);
  const top = ctx.theme.layout.safe_title_zone + ctx.theme.layout.margin_outer;
  const innerW = SLIDE_W - ctx.theme.layout.margin_outer * 2;
  const bodyH = SLIDE_H - top - ctx.theme.layout.margin_outer;
  const rows = Math.max(1, Math.min(4, ctx.semantic.sections.length || 1));
  const gap = ctx.theme.layout.gap_minor;
  const rowH = (bodyH - gap * (rows - 1)) / rows;
  return [
    ...common,
    ...Array.from({ length: rows }).map((_, i) => ({
      id: `fallback-${i + 1}`,
      type: "card" as const,
      contentRef: [ctx.semantic.sections[i]?.heading, ctx.semantic.sections[i]?.body].filter(Boolean).join("\n"),
      styleToken: "card_neutral",
      x: ctx.theme.layout.margin_outer,
      y: top + i * (rowH + gap),
      w: innerW,
      h: rowH,
      zIndex: 3,
      groupRole: "fallback_section",
      children: null,
      assetRef: null
    }))
  ];
}

export function buildArchetypeElements(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  if (["title_hero", "two_column", "three_card", "quote_proof"].includes(ctx.semantic.archetype)) {
    return primaryArchetype(ctx);
  }
  return fallbackArchetype(ctx);
}
