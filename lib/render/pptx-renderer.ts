import PptxGenJS from "pptxgenjs";
import type { SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";

export async function renderPptxBuffer(schema: SlideSchema, theme: ThemeTokens): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  const slide = pptx.addSlide();
  slide.background = { color: theme.colors.bg_primary };

  for (const el of [...schema.layout.elements].sort((a, b) => a.zIndex - b.zIndex)) {
    if (el.type === "text" || el.type === "card") {
      const text = resolveText(schema, el.contentRef);
      slide.addText(text, {
        x: el.x,
        y: el.y,
        w: el.w,
        h: el.h,
        fontFace: theme.typography.body_primary.fontFace,
        fontSize: theme.typography.body_primary.fontSize,
        color: theme.colors.text_primary,
        bold: el.styleToken.includes("title"),
        margin: 2,
        valign: "top",
        fill: { color: el.type === "card" ? theme.containers.card_neutral.fill : theme.colors.bg_primary },
        line: { color: theme.colors.divider_subtle, pt: 0.5 }
      });
    }

    if (el.type === "shape" || el.type === "line") {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: el.x,
        y: el.y,
        w: el.w,
        h: el.h,
        fill: { color: theme.colors.bg_subtle },
        line: { color: theme.colors.divider_subtle, pt: 1 }
      });
    }
  }

  slide.addNotes(`mode: ${schema.metadata.mode}\narchetype: ${schema.metadata.slideArchetype}\ngenerated_at: ${new Date().toISOString()}\nsource_summary: image_upload\nspeaking_points: [add key points here]`);

  const arr = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return Buffer.from(arr);
}

function resolveText(schema: SlideSchema, ref?: string): string {
  if (!ref) return "";
  const semantic = schema.content.semanticObjects.find((s) => s.id === ref);
  if (semantic) return semantic.headline ?? semantic.body ?? "";
  const section = schema.content.sections.find((s) => s.id === ref);
  if (section) return [section.heading, section.body, ...(section.bullets ?? [])].filter(Boolean).join("\n");
  return ref;
}
