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
    subtype: string | null;
    confidence: number;
    theme: ThemeName;
    template: string;
    transformationLevel: string;
    notes: string[] | null;
  };
  content: {
    title: string;
    subtitle: string | null;
    sections: Array<{
      id: string;
      heading: string | null;
      body: string;
      bullets: string[] | null;
    }>;
    supportingVisual: { type: "icon" | "chart" | "diagram" | "image"; description: string } | null;
    semanticObjects: Array<{
      id: string;
      kind: string;
      role: string;
      priority: number;
      mustPreserve: boolean;
      rewriteAllowed: (typeof REWRITE_ALLOWED)[number];
      visualWeight: (typeof VISUAL_WEIGHT)[number];
      headline: string | null;
      body: string | null;
      iconHint: string | null;
    }>;
  };
  layout: {
    slideSize: "LAYOUT_WIDE";
    background: { fillToken: string };
    elements: Array<{
      id: string;
      type: "text" | "shape" | "card" | "icon" | "line" | "image";
      contentRef: string | null;
      styleToken: string;
      x: number;
      y: number;
      w: number;
      h: number;
      zIndex: number;
      groupRole: string | null;
      children: string[] | null;
      assetRef: string | null;
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
