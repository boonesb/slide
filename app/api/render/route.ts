import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validation/validate-schema";
import { BUILTIN_THEMES, themeSchema } from "@/lib/themes/themes";
import { renderPptxBuffer } from "@/lib/render/pptx-renderer";

export async function POST(req: Request) {
  const body = await req.json();
  const validation = validateSchema(body.schema);
  if (!validation.success || !validation.data) return new Response("Invalid schema", { status: 400 });

  const themeName = body.theme as string;
  const theme = themeName === "Custom" ? themeSchema.parse(JSON.parse(body.customThemeJson)) : BUILTIN_THEMES[themeName];
  if (!theme) return new Response("Unknown theme", { status: 400 });

  const buffer = await renderPptxBuffer(validation.data, theme);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": 'attachment; filename="slide-rebuilder-output.pptx"'
    }
  });
}
