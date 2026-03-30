import { ARCHETYPES, type SlideArchetype, type SlideSchema } from "@/types/slide";

export function makeMockSchema(archetype: SlideArchetype): SlideSchema {
  return {
    schemaVersion: "1.0.0",
    metadata: {
      requestId: `mock-${archetype}`,
      slideId: "slide-1",
      sourceType: "image_upload",
      mode: "rebuild_and_polish",
      qualityProfile: "enterprise_b2b_v1",
      slideArchetype: archetype,
      subtype: null,
      confidence: 0.92,
      theme: "Enterprise Clean",
      template: `${archetype}-v1`,
      transformationLevel: "moderate",
      notes: ["mock output"]
    },
    content: {
      title: "Q3 growth priorities",
      subtitle: "Three levers to improve retention and expansion",
      sections: [
        { id: "s1", heading: "Prioritize activation", body: "Shorten time-to-value in onboarding.", bullets: ["Guided setup", "Role-based checklist"] },
        { id: "s2", heading: "Strengthen success motion", body: "Operationalize account health reviews.", bullets: ["Weekly risk triage", "Executive sponsor map"] }
      ],
      supportingVisual: null,
      semanticObjects: [
        {
          id: "o1",
          kind: "heading",
          role: "title",
          priority: 1,
          mustPreserve: true,
          rewriteAllowed: "light",
          visualWeight: "high",
          headline: "Q3 growth priorities",
          body: null,
          iconHint: null
        },
        {
          id: "o2",
          kind: "section",
          role: "body",
          priority: 3,
          mustPreserve: false,
          rewriteAllowed: "moderate",
          visualWeight: "medium",
          headline: null,
          body: "Operationalize account health reviews.",
          iconHint: null
        }
      ]
    },
    layout: {
      slideSize: "LAYOUT_WIDE",
      background: { fillToken: "bg_primary" },
      elements: [
        {
          id: "e-title",
          type: "text",
          contentRef: "o1",
          styleToken: "title_primary",
          x: 0.6,
          y: 0.5,
          w: 8,
          h: 0.9,
          zIndex: 1,
          groupRole: null,
          children: null,
          assetRef: null
        },
        {
          id: "e-card-1",
          type: "card",
          contentRef: "s1",
          styleToken: "card_feature",
          x: 0.6,
          y: 1.7,
          w: 5.9,
          h: 2.1,
          zIndex: 2,
          groupRole: null,
          children: null,
          assetRef: null
        },
        {
          id: "e-card-2",
          type: "card",
          contentRef: "s2",
          styleToken: "card_neutral",
          x: 6.7,
          y: 1.7,
          w: 5.9,
          h: 2.1,
          zIndex: 2,
          groupRole: null,
          children: null,
          assetRef: null
        }
      ]
    }
  };
}

export const mockByArchetype = Object.fromEntries(ARCHETYPES.map((a) => [a, makeMockSchema(a)]));
