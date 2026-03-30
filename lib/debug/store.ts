import type { GenerationDiagnostics } from "@/types/slide";

const debugMap = new Map<string, GenerationDiagnostics>();
let sessionEstimatedCostTotalUsd = 0;

export function putDebug(id: string, payload: GenerationDiagnostics) {
  if (typeof payload.ai?.estimatedCostUsd === "number") {
    sessionEstimatedCostTotalUsd += payload.ai.estimatedCostUsd;
  }
  if (payload.ai) {
    payload.ai.sessionEstimatedCostTotalUsd = sessionEstimatedCostTotalUsd;
  }
  debugMap.set(id, payload);
  setTimeout(() => debugMap.delete(id), 1000 * 60 * 15);
}

export function patchDebug(id: string, patch: Partial<GenerationDiagnostics>) {
  const current = debugMap.get(id);
  if (!current) return;
  debugMap.set(id, {
    ...current,
    ...patch,
    rendering: {
      ...current.rendering,
      ...patch.rendering
    }
  });
}

export function getDebug(id: string) {
  return debugMap.get(id);
}
