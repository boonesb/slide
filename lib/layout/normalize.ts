import type { SlideSchema } from "@/types/slide";
import type { NormalizedSemanticItem, NormalizedSemanticSlide } from "@/lib/layout/types";

function sectionPriority(sectionId: string, schema: SlideSchema): number {
  const fromSemantic = schema.content.semanticObjects.find((obj) => obj.id === sectionId || obj.role === sectionId);
  return fromSemantic?.priority ?? 5;
}

export function normalizeSemanticSchema(schema: SlideSchema): NormalizedSemanticSlide {
  const sections: NormalizedSemanticItem[] = schema.content.sections
    .map((section) => {
      const semanticObj = schema.content.semanticObjects.find((obj) => obj.id === section.id || obj.body === section.body);
      return {
        id: section.id,
        role: semanticObj?.role ?? "section",
        priority: semanticObj?.priority ?? sectionPriority(section.id, schema),
        visualWeight: semanticObj?.visualWeight ?? "medium",
        heading: section.heading,
        body: section.body,
        bullets: section.bullets ?? [],
        rewriteAllowed: semanticObj?.rewriteAllowed ?? "light",
        mustPreserve: semanticObj?.mustPreserve ?? false
      };
    })
    .sort((a, b) => a.priority - b.priority);

  const quote = schema.content.semanticObjects.find((obj) => obj.role.includes("quote") || obj.kind.includes("quote"))?.body ?? undefined;
  const proofItems = schema.content.semanticObjects
    .filter((obj) => obj.role.includes("proof") || obj.kind.includes("stat"))
    .map((obj) => obj.headline ?? obj.body)
    .filter((v): v is string => !!v);

  return {
    archetype: schema.metadata.slideArchetype,
    title: schema.content.title,
    subtitle: schema.content.subtitle,
    sections,
    quote,
    proofItems: proofItems.length ? proofItems : undefined
  };
}
