import PptxGenJS from "pptxgenjs";
import type { SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";

export async function renderPptxBuffer(schema: SlideSchema, theme: ThemeTokens): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  const slide = pptx.addSlide();
  slide.background = { color: theme.colors[schema.layout.background.fillToken] ?? theme.colors.bg_primary };

  for (const el of [...schema.layout.elements].sort((a, b) => a.zIndex - b.zIndex)) {
    if (el.type === "shape" || el.type === "line") {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: el.x,
        y: el.y,
        w: el.w,
        h: el.h,
        fill: { color: theme.containers.panel_subtle?.fill ?? theme.colors.bg_subtle },
        line: { color: theme.visual.divider_standard?.stroke ?? theme.colors.divider_subtle, pt: el.type === "line" ? 1.2 : 0.8 }
      });
      continue;
    }

    if (el.type === "icon") {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: el.x,
        y: el.y,
        w: el.w,
        h: el.h,
        fill: { color: theme.colors.bg_subtle },
        line: { color: theme.visual.icon_emphasis?.stroke ?? theme.colors.accent_primary, pt: 1 }
      });
      continue;
    }

    const text = resolveText(schema, el.contentRef);
    const textStyle = textStyleByToken(el.styleToken, el.groupRole, theme);

    if (el.type === "card") {
      const container = containerByStyleToken(el.styleToken, theme);
      slide.addShape(pptx.ShapeType.roundRect, {
        x: el.x,
        y: el.y,
        w: el.w,
        h: el.h,
        fill: { color: container.fill },
        line: { color: container.line, pt: 0.8 }
      });
    }

    slide.addText(text, {
      x: el.type === "card" ? el.x + theme.layout.padding_card * 0.7 : el.x,
      y: el.type === "card" ? el.y + theme.layout.padding_card * 0.6 : el.y,
      w: el.type === "card" ? el.w - theme.layout.padding_card * 1.4 : el.w,
      h: el.type === "card" ? el.h - theme.layout.padding_card * 1.2 : el.h,
      fontFace: textStyle.fontFace,
      fontSize: textStyle.fontSize,
      color: textStyle.color,
      bold: textStyle.bold,
      italic: textStyle.italic,
      margin: textStyle.margin,
      valign: textStyle.valign as never,
      breakLine: true,
      isTextBox: true
    });
  }

  slide.addNotes(`mode: ${schema.metadata.mode}\narchetype: ${schema.metadata.slideArchetype}\ngenerated_at: ${new Date().toISOString()}\nsource_summary: image_upload\nspeaking_points: [add key points here]`);

  const arr = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return Buffer.from(arr);
}

function textStyleByToken(styleToken: string, groupRole: string | null, theme: ThemeTokens) {
  const map: Record<string, { fontFace: string; fontSize: number; bold?: boolean; italic?: boolean; color: string; margin: number; valign: "top" | "mid" | "bot" }> = {
    title_primary: {
      ...theme.typography.title_primary,
      color: theme.colors.text_primary,
      margin: 1,
      valign: "top"
    },
    title_secondary: {
      ...theme.typography.title_secondary,
      color: theme.colors.text_secondary,
      margin: 1,
      valign: "top"
    },
    section_label: {
      ...theme.typography.section_label,
      color: theme.colors.accent_primary,
      margin: 0,
      valign: "top"
    },
    quote_primary: {
      ...theme.typography.quote_primary,
      italic: true,
      color: theme.colors.text_primary,
      margin: 1,
      valign: "mid"
    },
    stat_callout: {
      ...theme.typography.stat_large,
      color: theme.colors.accent_primary,
      margin: 1,
      valign: "mid"
    },
    body_primary: {
      ...theme.typography.body_primary,
      color: theme.colors.text_primary,
      margin: 1,
      valign: "top"
    }
  };

  if (groupRole === "quote_block") return map.quote_primary;
  if (groupRole === "proof_panel") return { ...map.body_primary, ...theme.typography.body_secondary, color: theme.colors.text_secondary, valign: "top" as const };
  return map[styleToken] ?? map.body_primary;
}

function containerByStyleToken(styleToken: string, theme: ThemeTokens) {
  const fallback = theme.containers.card_neutral;
  if (styleToken.includes("problem")) return withDefaults(theme.containers.card_problem, fallback);
  if (styleToken.includes("solution")) return withDefaults(theme.containers.card_solution, fallback);
  if (styleToken.includes("feature")) return withDefaults(theme.containers.card_feature, fallback);
  if (styleToken.includes("stat")) return withDefaults(theme.containers.stat_callout, fallback);
  if (styleToken.includes("quote")) return withDefaults(theme.containers.panel_subtle, fallback);
  return withDefaults(theme.containers.card_neutral, fallback);
}

function withDefaults(token: { fill: string; line?: string; radius?: number }, fallback: { fill: string; line?: string; radius?: number }) {
  return {
    fill: token.fill ?? fallback.fill,
    line: token.line ?? fallback.line ?? "CBD5E1",
    radius: token.radius ?? fallback.radius ?? 4
  };
}

function resolveText(schema: SlideSchema, ref?: string | null): string {
  if (!ref) return "";
  const semantic = schema.content.semanticObjects.find((s) => s.id === ref);
  if (semantic) return semantic.headline ?? semantic.body ?? "";
  const section = schema.content.sections.find((s) => s.id === ref);
  if (section) return [section.heading, section.body, ...(section.bullets ?? [])].filter(Boolean).join("\n");
  return ref;
}
