import { z } from "zod";
import { ARCHETYPES, MODES, REWRITE_ALLOWED, VISUAL_WEIGHT } from "@/types/slide";

export const slideSchemaZod = z.object({
  schemaVersion: z.string().default("1.0.0"),
  metadata: z.object({
    requestId: z.string(),
    slideId: z.string(),
    sourceType: z.literal("image_upload"),
    mode: z.enum(MODES),
    qualityProfile: z.literal("enterprise_b2b_v1"),
    slideArchetype: z.enum(ARCHETYPES),
    subtype: z.string().optional(),
    confidence: z.number().min(0).max(1),
    theme: z.enum(["Enterprise Clean", "Enterprise Dark", "Consulting Minimal", "Custom"]),
    template: z.string(),
    transformationLevel: z.string(),
    notes: z.array(z.string()).optional()
  }),
  content: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    sections: z.array(
      z.object({
        id: z.string(),
        heading: z.string().optional(),
        body: z.string(),
        bullets: z.array(z.string()).optional()
      })
    ),
    supportingVisual: z
      .object({
        type: z.enum(["icon", "chart", "diagram", "image"]),
        description: z.string()
      })
      .optional(),
    semanticObjects: z.array(
      z.object({
        id: z.string(),
        kind: z.string(),
        role: z.string(),
        priority: z.number().int().min(1).max(10),
        mustPreserve: z.boolean(),
        rewriteAllowed: z.enum(REWRITE_ALLOWED),
        visualWeight: z.enum(VISUAL_WEIGHT),
        headline: z.string().optional(),
        body: z.string().optional(),
        iconHint: z.string().optional()
      })
    )
  }),
  layout: z.object({
    slideSize: z.literal("LAYOUT_WIDE"),
    background: z.object({ fillToken: z.string() }),
    elements: z.array(
      z.object({
        id: z.string(),
        type: z.enum(["text", "shape", "card", "icon", "line", "image"]),
        contentRef: z.string().optional(),
        styleToken: z.string(),
        x: z.number().min(0),
        y: z.number().min(0),
        w: z.number().positive(),
        h: z.number().positive(),
        zIndex: z.number().int(),
        groupRole: z.string().optional(),
        children: z.array(z.string()).optional(),
        assetRef: z.string().optional()
      })
    )
  })
});

export const slideJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "metadata", "content", "layout"],
  properties: {
    schemaVersion: { type: "string" },
    metadata: { type: "object" },
    content: { type: "object" },
    layout: { type: "object" }
  }
};
