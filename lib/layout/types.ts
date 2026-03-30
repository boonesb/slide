import type { SlideArchetype, SlideSchema } from "@/types/slide";
import type { ThemeTokens } from "@/lib/themes/themes";

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
}

export interface NormalizedSemanticSlide {
  archetype: SlideArchetype;
  title: string;
  subtitle: string | null;
  sections: NormalizedSemanticItem[];
  quote?: string;
  proofItems?: string[];
}

export interface LayoutBuildDiagnostics {
  warnings: string[];
  overflowWarnings: string[];
  droppedContent: string[];
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
