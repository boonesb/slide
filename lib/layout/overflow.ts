import type { SlideSchema } from "@/types/slide";
import type { NormalizedSemanticSlide } from "@/lib/layout/types";

function estimateCapacity(el: SlideSchema["layout"]["elements"][number]) {
  return Math.floor(el.w * el.h * 42);
}

function compressText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/,\s*/g, ", ")
    .split(" ")
    .slice(0, 36)
    .join(" ");
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

    warnings.push(`Compressed text for ${el.id} to fit bounds.`);
    let next = compressText(text);
    if (next.length > capacity) {
      next = next.slice(0, Math.max(0, capacity - 1)).trimEnd() + "…";
    }

    if (semantic.archetype === "three_card" && el.groupRole === "card" && next.length > Math.floor(capacity * 0.95)) {
      warnings.push(`Dropped lower-priority detail in ${el.id}.`);
      droppedContent.push(el.id);
      const firstSentence = next.split(/[.!?]/)[0] ?? next;
      next = `${firstSentence.trimEnd()}.`;
    }

    return { ...el, contentRef: next };
  });

  return { elements: adjusted, warnings, droppedContent };
}
