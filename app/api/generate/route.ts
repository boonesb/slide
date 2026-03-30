import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { analyzeSlide, repairSchema, toErrorDetails } from "@/lib/ai/service";
import { validateSchema } from "@/lib/validation/validate-schema";
import { putDebug } from "@/lib/debug/store";
import { estimateRequestCostUsd } from "@/lib/ai/cost";
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
    ai: {
      requestedAt: new Date().toISOString(),
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      mock: process.env.OPENAI_USE_MOCK === "true"
    },
    requestSummary: { fileName: file.name, mode, theme, fileType: file.type, fileSize: file.size },
    rawAiRequest: {},
    rawAiResponse: {},
    validation: { success: false },
    repair: { attempted: false, success: false },
    rendering: { success: false, warnings: [], errors: [] }
  };

  try {
    const { schema, rawRequest, rawResponse, usage, model, mock } = await analyzeSlide({
      imageBase64,
      imageMimeType: file.type,
      mode,
      theme
    });
    diagnostics.rawAiRequest = rawRequest;
    diagnostics.rawAiResponse = rawResponse;
    diagnostics.ai.model = model;
    diagnostics.ai.mock = mock;
    if (usage) {
      const estimatedCostUsd = estimateRequestCostUsd(model, usage) ?? undefined;
      diagnostics.ai.usage = usage;
      diagnostics.ai.estimatedCostUsd = estimatedCostUsd;
    }

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
    const errorDetails = toErrorDetails(error);
    putDebug(debugId, {
      ...diagnostics,
      ai: { ...diagnostics.ai, error: errorDetails },
      validation: { success: false, errors: errorDetails }
    });
    return new Response(`Generation failed: ${errorDetails.message} (status: ${errorDetails.status ?? "n/a"})`, {
      status: errorDetails.status ?? 500
    });
  }
}
