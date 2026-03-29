import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { analyzeSlide, repairSchema } from "@/lib/ai/service";
import { validateSchema } from "@/lib/validation/validate-schema";
import { putDebug } from "@/lib/debug/store";
import type { Mode, ThemeName } from "@/types/slide";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = new Set(["image/png", "image/jpg", "image/jpeg", "image/webp"]);

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return new Response("File is required", { status: 400 });
  if (file.size > MAX_SIZE) return new Response("File exceeds 10MB", { status: 400 });
  if (!ACCEPTED.has(file.type)) return new Response("Unsupported file type", { status: 400 });

  const mode = (form.get("mode") as Mode) ?? "rebuild_and_polish";
  const theme = (form.get("theme") as ThemeName) ?? "Enterprise Clean";

  const bytes = Buffer.from(await file.arrayBuffer());
  const imageBase64 = bytes.toString("base64");

  const debugId = randomUUID();
  const diagnostics = {
    requestSummary: { fileName: file.name, mode, theme, fileType: file.type, fileSize: file.size },
    rawAiRequest: {},
    rawAiResponse: {},
    validation: { success: false },
    repair: { attempted: false, success: false },
    rendering: { success: false, warnings: [], errors: [] }
  };

  try {
    const { schema, rawRequest, rawResponse } = await analyzeSlide({ imageBase64, mode, theme });
    diagnostics.rawAiRequest = rawRequest;
    diagnostics.rawAiResponse = rawResponse;

    let validation = validateSchema(schema);
    diagnostics.validation = { success: validation.success, errors: validation.errors };

    let finalSchema = schema;
    if (!validation.success) {
      diagnostics.repair.attempted = true;
      try {
        finalSchema = await repairSchema(schema, mode, theme);
        validation = validateSchema(finalSchema);
        diagnostics.repair.success = validation.success;
        diagnostics.repair.errors = validation.errors;
      } catch (repairError) {
        diagnostics.repair.success = false;
        diagnostics.repair.errors = String(repairError);
      }
    }

    if (!validation.success) {
      putDebug(debugId, { ...diagnostics, cleanedSchema: finalSchema });
      return new Response("Schema validation failed after repair attempt", { status: 422 });
    }

    putDebug(debugId, { ...diagnostics, cleanedSchema: finalSchema, validation: { success: true } });
    return NextResponse.json({ schema: finalSchema, debugId });
  } catch (error) {
    putDebug(debugId, { ...diagnostics, validation: { success: false, errors: String(error) } });
    return new Response(`Generation failed: ${String(error)}`, { status: 500 });
  }
}
