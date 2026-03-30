import type { SlideArchetype, SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";

export type SourceClass = "native_business_slide" | "poster_marketing_graphic" | "infographic" | "multi_panel_promo" | "quote_graphic" | "process_graphic";

export interface NormalizedSemanticItem {
  id: string;
  role: string;
  priority: number;
  visualWeight: "low" | "medium" | "high";
  heading: string | null;
  body: string;
  bullets: string[];
  rewriteAllowed: SlideSchema["content"]["semanticObjects"][number]["rewriteAllowed"];
  mustPreserve: boolean;
  iconHint?: string | null;
}

export interface NormalizedSemanticSlide {
  archetype: SlideArchetype;
  selectedTemplate: string;
  sourceClass: SourceClass;
  simplifyDecorativeTreatment: boolean;
  title: string;
  subtitle: string | null;
  sections: NormalizedSemanticItem[];
  quote?: string;
  proofItems?: string[];
  notes: string[];
}

export interface LayoutBuildDiagnostics {
  warnings: string[];
  overflowWarnings: string[];
  droppedContent: string[];
  notes: string[];
}

export interface LayoutBuildResult {
  schema: SlideSchema;
  normalized: NormalizedSemanticSlide;
  diagnostics: LayoutBuildDiagnostics;
}

export interface LayoutBuildContext {
  semantic: NormalizedSemanticSlide;
  theme: ThemeTokens;
  source: SlideSchema;
}
