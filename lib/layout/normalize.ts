import type { SlideArchetype, SlideSchema } from "@/types/slide";
import type { NormalizedSemanticItem, NormalizedSemanticSlide, SourceClass } from "@/lib/layout/types";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function sectionPriority(sectionId: string, schema: SlideSchema): number {
  const fromSemantic = schema.content.semanticObjects.find((obj) => obj.id === sectionId || obj.role === sectionId);
  return fromSemantic?.priority ?? 5;
}

function classifySource(schema: SlideSchema): SourceClass {
  const notes = (schema.metadata.notes ?? []).join(" ").toLowerCase();
  const semanticText = schema.content.semanticObjects
    .map((obj) => `${obj.kind} ${obj.role} ${obj.body ?? ""} ${obj.headline ?? ""}`)
    .join(" ")
    .toLowerCase();
  const hasQuote = schema.content.semanticObjects.some((obj) => obj.role.includes("quote") || obj.kind.includes("quote"));
  const hasProcess = schema.metadata.slideArchetype === "process_timeline" || semanticText.includes("step ");
  const sectionCount = schema.content.sections.length;
  const decorative = /graphic|poster|decorative|promo|marketing|infographic|icon|panel/.test(`${notes} ${semanticText}`);

  if (hasQuote || schema.metadata.slideArchetype === "quote_proof") return "quote_graphic";
  if (hasProcess) return "process_graphic";
  if (decorative && sectionCount >= 3) return "multi_panel_promo";
  if (decorative && sectionCount >= 2) return "poster_marketing_graphic";
  if (decorative) return "infographic";
  return "native_business_slide";
}

function chooseArchetype(schema: SlideSchema, sourceClass: SourceClass): SlideArchetype {
  const sectionCount = schema.content.sections.length;
  if (["multi_panel_promo", "poster_marketing_graphic", "infographic"].includes(sourceClass) && sectionCount >= 3) {
    return "three_card";
  }
  return schema.metadata.slideArchetype;
}

function chooseTemplate(archetype: SlideArchetype) {
  return `${archetype}-enterprise-v2`;
}

export function normalizeSemanticSchema(schema: SlideSchema): NormalizedSemanticSlide {
  const sourceClass = classifySource(schema);
  const archetype = chooseArchetype(schema, sourceClass);

  const sections: NormalizedSemanticItem[] = schema.content.sections
    .map((section) => {
      const semanticObj = schema.content.semanticObjects.find((obj) => obj.id === section.id || obj.body === section.body);
      return {
        id: section.id,
        role: semanticObj?.role ?? "section",
        priority: semanticObj?.priority ?? sectionPriority(section.id, schema),
        visualWeight: semanticObj?.visualWeight ?? "medium",
        heading: section.heading,
        body: section.body,
        bullets: section.bullets ?? [],
        rewriteAllowed: semanticObj?.rewriteAllowed ?? "light",
        mustPreserve: semanticObj?.mustPreserve ?? false,
        iconHint: semanticObj?.iconHint
      };
    })
    .sort((a, b) => a.priority - b.priority);

  const quote = schema.content.semanticObjects.find((obj) => obj.role.includes("quote") || obj.kind.includes("quote"))?.body ?? undefined;
  const proofItems = schema.content.semanticObjects
    .filter((obj) => obj.role.includes("proof") || obj.kind.includes("stat"))
    .map((obj) => obj.headline ?? obj.body)
    .filter((v): v is string => !!v);

  const simplifyDecorativeTreatment = ["poster_marketing_graphic", "multi_panel_promo", "infographic"].includes(sourceClass);
  const notes: string[] = [];
  if (simplifyDecorativeTreatment) {
    notes.push("Decorative source detected: simplifying background effects and translating to enterprise-native structure.");
  }

  return {
    archetype,
    selectedTemplate: chooseTemplate(archetype),
    sourceClass,
    simplifyDecorativeTreatment,
    title: schema.content.title,
    subtitle: schema.content.subtitle,
    sections,
    quote,
    proofItems: proofItems.length ? proofItems : undefined,
    notes
  };
}

export function normalizeLayoutElements(
  elements: SlideSchema["layout"]["elements"],
  margin: number,
  minGap = 0.06
): { elements: SlideSchema["layout"]["elements"]; warnings: string[] } {
  const warnings: string[] = [];
  const sorted = [...elements].sort((a, b) => a.y - b.y || a.x - b.x || a.zIndex - b.zIndex);

  const clamped = sorted.map((el) => {
    const w = Math.min(el.w, SLIDE_W - margin * 2);
    const h = Math.min(el.h, SLIDE_H - margin * 2);
    const x = Math.max(margin, Math.min(el.x, SLIDE_W - margin - w));
    const y = Math.max(margin, Math.min(el.y, SLIDE_H - margin - h));
    if (x !== el.x || y !== el.y || w !== el.w || h !== el.h) warnings.push(`Adjusted ${el.id} to stay in-bounds.`);
    return { ...el, x, y, w, h };
  });

  for (let i = 0; i < clamped.length; i++) {
    for (let j = i + 1; j < clamped.length; j++) {
      const a = clamped[i];
      const b = clamped[j];
      const overlapX = a.x < b.x + b.w && a.x + a.w > b.x;
      const overlapY = a.y < b.y + b.h && a.y + a.h > b.y;
      if (overlapX && overlapY) {
        b.y = Math.min(SLIDE_H - margin - b.h, a.y + a.h + minGap);
        warnings.push(`Resolved overlap between ${a.id} and ${b.id}.`);
      }
    }
  }

  return { elements: clamped, warnings };
}
