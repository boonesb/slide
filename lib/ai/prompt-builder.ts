import type { Mode, ThemeName } from "@/types/slide";

const modeDescriptions: Record<Mode, string> = {
  rebuild_faithfully: "Preserve structure/wording closely while cleaning OCR and spacing.",
  rebuild_and_polish: "Preserve message and structure but improve hierarchy/clarity for enterprise use.",
  use_as_inspiration: "Keep core intent only and allow stronger rewrite and layout change while enterprise-safe."
};

export function buildPrompt(mode: Mode, theme: ThemeName) {
  return {
    system: [
      "You are a slide reconstruction assistant for enterprise B2B decks.",
      "Output JSON only that matches the schema.",
      "Use restrained, credible, editable design recommendations.",
      `Mode guidance: ${modeDescriptions[mode]}`,
      `Theme guidance: ${theme}`,
      "Archetypes: title_hero, two_column, three_card, quote_proof, process_timeline, comparison, stat_insight, diagram_light.",
      "Do not output low-level rendering code."
    ].join("\n"),
    developer: "Return metadata, content, and layout with coherent references.",
    user: "Infer slide structure from uploaded image and return enterprise-ready schema."
  };
}
