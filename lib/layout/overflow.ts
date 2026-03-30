import type { SlideSchema } from "@/types/slide";
import type { NormalizedSemanticSlide } from "@/lib/layout/types";

function estimateCapacity(el: SlideSchema["layout"]["elements"][number]) {
  const density = el.groupRole === "title" ? 30 : el.groupRole === "subtitle" ? 34 : 44;
  return Math.floor(el.w * el.h * density);
}

function compressText(text: string, maxWords: number) {
  return text
    .replace(/\s+/g, " ")
    .replace(/,\s*/g, ", ")
    .split(" ")
    .slice(0, maxWords)
    .join(" ");
}

function sourceSectionForElement(semantic: NormalizedSemanticSlide, el: SlideSchema["layout"]["elements"][number]) {
  const fromId = semantic.sections.find((section) => section.id === el.contentRef);
  if (fromId) return fromId;
  if (el.groupRole === "card") {
    const idx = Number(el.id.split("-").at(-1) ?? "1") - 1;
    return semantic.sections[Math.max(0, idx)];
  }
  return semantic.sections[0];
}

export function applyOverflowStrategy(
  semantic: NormalizedSemanticSlide,
  elements: SlideSchema["layout"]["elements"]
): { elements: SlideSchema["layout"]["elements"]; warnings: string[]; droppedContent: string[] } {
  const warnings: string[] = [];
  const droppedContent: string[] = [];

  const adjusted = elements.map((el) => {
    if (el.type !== "text" && el.type !== "card") return el;
    const text = el.contentRef ?? "";
    const capacity = estimateCapacity(el);
    if (text.length <= capacity || !text.trim()) return el;

    const section = sourceSectionForElement(semantic, el);
    const rewriteMode = section?.rewriteAllowed ?? "light";
    const maxWords = rewriteMode === "none" ? 48 : rewriteMode === "light" ? 36 : 28;

    warnings.push(`Compressed text for ${el.id} to fit bounds.`);
    let next = compressText(text, maxWords);

    if (next.length > capacity) {
      const tightened = next.slice(0, Math.max(0, capacity - 1)).trimEnd();
      next = `${tightened}…`;
      warnings.push(`Applied aggressive truncation in ${el.id}.`);
    }

    const canDrop = rewriteMode !== "none" && !section?.mustPreserve;
    if (canDrop && (text.length > capacity * 2 || next.length > Math.floor(capacity * 0.94))) {
      const sentences = next.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
      if (sentences.length > 1) {
        next = `${sentences[0]}.`;
        droppedContent.push(el.id);
        warnings.push(`Dropped lower-priority detail in ${el.id}.`);
      }
    }

    return { ...el, contentRef: next };
  });

  return { elements: adjusted, warnings, droppedContent };
}
