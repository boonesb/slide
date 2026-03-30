import type { SlideSchema } from "@/types/slide";

export const decorativeThreePanelFixture: SlideSchema = {
  schemaVersion: "1.0.0",
  metadata: {
    requestId: "fixture-decorative-1",
    slideId: "slide-1",
    sourceType: "image_upload",
    mode: "rebuild_and_polish",
    qualityProfile: "enterprise_b2b_v1",
    slideArchetype: "diagram_light",
    subtype: null,
    confidence: 0.84,
    theme: "Enterprise Clean",
    template: "legacy",
    transformationLevel: "moderate",
    notes: ["poster-like marketing graphic", "decorative background", "three panels", "icon-led"]
  },
  content: {
    title: "Why customers choose our platform",
    subtitle: "Security outcomes at enterprise scale",
    sections: [
      { id: "s1", heading: "Leader in AppSec", body: "Over 1,600+ customers worldwide", bullets: ["#1 software security testing", "Global footprint"] },
      { id: "s2", heading: "Unified DevSecOps", body: "SAST, SCA and IaC security", bullets: ["Find and fix vulnerabilities early", "Developer-first workflows"] },
      { id: "s3", heading: "Trusted and Recognized", body: "Trusted by Fortune 500 companies", bullets: ["Magic Quadrant leader", "Awards and certifications"] }
    ],
    supportingVisual: { type: "image", description: "Decorative poster background" },
    semanticObjects: [
      {
        id: "so-1",
        kind: "panel",
        role: "value_pillar",
        priority: 2,
        mustPreserve: true,
        rewriteAllowed: "light",
        visualWeight: "high",
        headline: "Leader in AppSec",
        body: "Over 1,600+ customers worldwide",
        iconHint: "shield"
      }
    ]
  },
  layout: {
    slideSize: "LAYOUT_WIDE",
    background: { fillToken: "bg_subtle" },
    elements: []
  }
};
