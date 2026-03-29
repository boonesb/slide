import type { SlideArchetype } from "@/types/slide";

export interface TemplateSpec {
  id: string;
  archetype: SlideArchetype;
  title: string;
  description: string;
  slots: string[];
}

export const templateRegistry: Record<SlideArchetype, TemplateSpec> = {
  title_hero: { id: "title-hero-v1", archetype: "title_hero", title: "Title Hero", description: "Title, subtitle, one support panel", slots: ["title", "subtitle", "support"] },
  two_column: { id: "two-column-v1", archetype: "two_column", title: "Two Column", description: "Two balanced columns", slots: ["title", "left", "right"] },
  three_card: { id: "three-card-v1", archetype: "three_card", title: "Three Card", description: "Three card row", slots: ["title", "card1", "card2", "card3"] },
  quote_proof: { id: "quote-proof-v1", archetype: "quote_proof", title: "Quote + Proof", description: "Quote with proof points", slots: ["title", "quote", "proof1", "proof2"] },
  process_timeline: { id: "process-timeline-v1", archetype: "process_timeline", title: "Process Timeline", description: "Simple linear process", slots: ["title", "step1", "step2", "step3"] },
  comparison: { id: "comparison-v1", archetype: "comparison", title: "Comparison", description: "A/B comparison", slots: ["title", "left", "right"] },
  stat_insight: { id: "stat-insight-v1", archetype: "stat_insight", title: "Stat + Insight", description: "Large metric plus explanation", slots: ["title", "stat", "insight"] },
  diagram_light: { id: "diagram-light-v1", archetype: "diagram_light", title: "Diagram Light", description: "Simple boxes and connectors", slots: ["title", "node1", "node2", "node3"] }
};
