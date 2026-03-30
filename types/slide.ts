export const MODES = ["rebuild_faithfully", "rebuild_and_polish", "use_as_inspiration"] as const;
export type Mode = (typeof MODES)[number];

export const ARCHETYPES = [
  "title_hero",
  "two_column",
  "three_card",
  "quote_proof",
  "process_timeline",
  "comparison",
  "stat_insight",
  "diagram_light"
] as const;
export type SlideArchetype = (typeof ARCHETYPES)[number];

export const REWRITE_ALLOWED = ["none", "light", "moderate", "full", "replace_if_needed"] as const;
export const VISUAL_WEIGHT = ["low", "medium", "high"] as const;
export type ThemeName = "Enterprise Clean" | "Enterprise Dark" | "Consulting Minimal" | "Custom";

export interface SlideSchema {
  schemaVersion: string;
  metadata: {
    requestId: string;
    slideId: string;
    sourceType: "image_upload";
    mode: Mode;
    qualityProfile: "enterprise_b2b_v1";
    slideArchetype: SlideArchetype;
    subtype?: string;
    confidence: number;
    theme: ThemeName;
    template: string;
    transformationLevel: string;
    notes?: string[];
  };
  content: {
    title: string;
    subtitle?: string;
    sections: Array<{
      id: string;
      heading?: string;
      body: string;
      bullets?: string[];
    }>;
    supportingVisual?: { type: "icon" | "chart" | "diagram" | "image"; description: string };
    semanticObjects: Array<{
      id: string;
      kind: string;
      role: string;
      priority: number;
      mustPreserve: boolean;
      rewriteAllowed: (typeof REWRITE_ALLOWED)[number];
      visualWeight: (typeof VISUAL_WEIGHT)[number];
      headline?: string;
      body?: string;
      iconHint?: string;
    }>;
  };
  layout: {
    slideSize: "LAYOUT_WIDE";
    background: { fillToken: string };
    elements: Array<{
      id: string;
      type: "text" | "shape" | "card" | "icon" | "line" | "image";
      contentRef?: string;
      styleToken: string;
      x: number;
      y: number;
      w: number;
      h: number;
      zIndex: number;
      groupRole?: string;
      children?: string[];
      assetRef?: string;
    }>;
  };
}

export interface GenerationDiagnostics {
  ai?: {
    requestedAt: string;
    model: string;
    mock: boolean;
    usage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    estimatedCostUsd?: number;
    sessionEstimatedCostTotalUsd?: number;
    error?: {
      message: string;
      status?: number;
      type?: string;
      code?: string;
      param?: string;
    };
  };
  requestSummary: Record<string, unknown>;
  rawAiRequest: Record<string, unknown>;
  rawAiResponse: Record<string, unknown>;
  cleanedSchema?: SlideSchema;
  validation: { success: boolean; errors?: unknown };
  repair: { attempted: boolean; success: boolean; errors?: unknown };
  rendering: { success: boolean; warnings: string[]; errors: string[] };
}
