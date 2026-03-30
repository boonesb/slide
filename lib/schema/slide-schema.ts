import { z } from "zod";
import { ARCHETYPES, MODES, REWRITE_ALLOWED, VISUAL_WEIGHT } from "@/types/slide";

const metadataProperties = {
  requestId: { type: "string" },
  slideId: { type: "string" },
  sourceType: { type: "string", enum: ["image_upload"] },
  mode: { type: "string", enum: MODES },
  qualityProfile: { type: "string", enum: ["enterprise_b2b_v1"] },
  slideArchetype: { type: "string", enum: ARCHETYPES },
  subtype: { type: ["string", "null"] },
  confidence: { type: "number", minimum: 0, maximum: 1 },
  theme: { type: "string", enum: ["Enterprise Clean", "Enterprise Dark", "Consulting Minimal", "Custom"] },
  template: { type: "string" },
  transformationLevel: { type: "string" },
  notes: {
    type: ["array", "null"],
    items: { type: "string" }
  }
} as const;

export const slideSchemaZod = z.object({
  schemaVersion: z.string().default("1.0.0"),
  metadata: z.object({
    requestId: z.string(),
    slideId: z.string(),
    sourceType: z.literal("image_upload"),
    mode: z.enum(MODES),
    qualityProfile: z.literal("enterprise_b2b_v1"),
    slideArchetype: z.enum(ARCHETYPES),
    subtype: z.string().nullable(),
    confidence: z.number().min(0).max(1),
    theme: z.enum(["Enterprise Clean", "Enterprise Dark", "Consulting Minimal", "Custom"]),
    template: z.string(),
    transformationLevel: z.string(),
    notes: z.array(z.string()).nullable()
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
    metadata: {
      type: "object",
      additionalProperties: false,
      properties: metadataProperties,
      required: Object.keys(metadataProperties)
    },
    content: {
      type: "object",
      additionalProperties: false,
      required: ["title", "sections", "semanticObjects"],
      properties: {
        title: { type: "string", minLength: 1 },
        subtitle: { type: "string" },
        sections: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "body"],
            properties: {
              id: { type: "string" },
              heading: { type: "string" },
              body: { type: "string" },
              bullets: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        },
        supportingVisual: {
          type: "object",
          additionalProperties: false,
          required: ["type", "description"],
          properties: {
            type: { type: "string", enum: ["icon", "chart", "diagram", "image"] },
            description: { type: "string" }
          }
        },
        semanticObjects: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "kind", "role", "priority", "mustPreserve", "rewriteAllowed", "visualWeight"],
            properties: {
              id: { type: "string" },
              kind: { type: "string" },
              role: { type: "string" },
              priority: { type: "integer", minimum: 1, maximum: 10 },
              mustPreserve: { type: "boolean" },
              rewriteAllowed: { type: "string", enum: REWRITE_ALLOWED },
              visualWeight: { type: "string", enum: VISUAL_WEIGHT },
              headline: { type: "string" },
              body: { type: "string" },
              iconHint: { type: "string" }
            }
          }
        }
      }
    },
    layout: {
      type: "object",
      additionalProperties: false,
      required: ["slideSize", "background", "elements"],
      properties: {
        slideSize: { type: "string", enum: ["LAYOUT_WIDE"] },
        background: {
          type: "object",
          additionalProperties: false,
          required: ["fillToken"],
          properties: {
            fillToken: { type: "string" }
          }
        },
        elements: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "type", "styleToken", "x", "y", "w", "h", "zIndex"],
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: ["text", "shape", "card", "icon", "line", "image"] },
              contentRef: { type: "string" },
              styleToken: { type: "string" },
              x: { type: "number", minimum: 0 },
              y: { type: "number", minimum: 0 },
              w: { type: "number", exclusiveMinimum: 0 },
              h: { type: "number", exclusiveMinimum: 0 },
              zIndex: { type: "integer" },
              groupRole: { type: "string" },
              children: {
                type: "array",
                items: { type: "string" }
              },
              assetRef: { type: "string" }
            }
          }
        }
      }
    }
  }
};
