import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validation/validate-schema";
import { BUILTIN_THEMES, themeSchema } from "@/lib/themes/themes";
import { renderPptxBuffer } from "@/lib/render/pptx-renderer";
import { buildDeterministicLayout } from "@/lib/layout/build-layout";
import { patchDebug } from "@/lib/debug/store";

export async function POST(req: Request) {
  const body = await req.json();
  const validation = validateSchema(body.schema);
  if (!validation.success || !validation.data) return new Response("Invalid schema", { status: 400 });

  const themeName = body.theme as string;
  const theme = themeName === "Custom" ? themeSchema.parse(JSON.parse(body.customThemeJson)) : BUILTIN_THEMES[themeName];
  if (!theme) return new Response("Unknown theme", { status: 400 });

  const layoutBuild = buildDeterministicLayout(validation.data, theme);
  const buffer = await renderPptxBuffer(layoutBuild.schema, theme);

  if (typeof body.debugId === "string" && body.debugId.length > 0) {
    patchDebug(body.debugId, {
      normalizedSemantic: layoutBuild.normalized as unknown as Record<string, unknown>,
      finalComputedLayout: layoutBuild.schema.layout,
      rendering: {
        success: true,
        warnings: layoutBuild.diagnostics.warnings,
        overflowWarnings: layoutBuild.diagnostics.overflowWarnings,
        droppedContent: layoutBuild.diagnostics.droppedContent,
        errors: []
      }
    });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": 'attachment; filename="slide-rebuilder-output.pptx"'
    }
  });
}
