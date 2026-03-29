import type { GenerationDiagnostics } from "@/types/slide";

const debugMap = new Map<string, GenerationDiagnostics>();

export function putDebug(id: string, payload: GenerationDiagnostics) {
  debugMap.set(id, payload);
  setTimeout(() => debugMap.delete(id), 1000 * 60 * 15);
}

export function getDebug(id: string) {
  return debugMap.get(id);
}
