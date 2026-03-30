import type { Mode, ThemeName } from "@/types/slide";

const modeDescriptions: Record<Mode, string> = {
  rebuild_faithfully: "Preserve structure/wording closely while cleaning OCR and spacing.",
  rebuild_and_polish: "Preserve message and grouping; translate decorative visuals into enterprise-native slide structure.",
  use_as_inspiration: "Keep core intent only and allow stronger rewrite and layout change while enterprise-safe."
};

export function buildPrompt(mode: Mode, theme: ThemeName) {
  return {
    system: [
      "You are a slide reconstruction assistant for enterprise B2B decks.",
      "Output JSON only that matches the schema.",
      "Focus on semantic extraction, not geometry.",
      "Infer source class implicitly: native slide, poster-like marketing graphic, infographic, multi-panel promo, quote graphic, or process graphic.",
      "For decorative/promo inputs, preserve message and hierarchy but simplify decoration and translate into clean PowerPoint-native structure.",
      "Prefer archetype three_card for multi-panel promotional value-proposition graphics.",
      "Provide archetype, title/subtitle, sections, semantic roles, priority, visual weight, and rewriteAllowed guidance.",
      "layout.elements are compatibility hints only; do not attempt precise x/y/w/h placement.",
      "Use concise headings and bullets when a panel has long poster copy.",
      `Mode guidance: ${modeDescriptions[mode]}`,
      `Theme guidance: ${theme}`,
      "Archetypes: title_hero, two_column, three_card, quote_proof, process_timeline, comparison, stat_insight, diagram_light."
    ].join("\n"),
    developer:
      "Return metadata/content as high quality semantic structure. Include minimal layout hints only. Do not do literal visual recreation of decorative backgrounds.",
    user: "Infer slide structure from uploaded image and return enterprise-ready schema."
  };
}
