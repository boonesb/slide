"use client";

import { useMemo, useState } from "react";
import { FileImage, Wand2 } from "lucide-react";
import { StatusPanel } from "@/components/status-panel";
import { CustomThemeInput } from "@/components/custom-theme-input";
import { ContentEditor } from "@/components/content-editor";
import { CUSTOM_THEME_EXAMPLE } from "@/lib/themes/themes";
import type { Mode, SlideSchema, ThemeName } from "@/types/slide";

const modeOptions: { value: Mode; label: string; description: string }[] = [
  { value: "rebuild_faithfully", label: "Rebuild faithfully", description: "Preserve wording/structure closely with cleanups." },
  { value: "rebuild_and_polish", label: "Rebuild and polish", description: "Improve hierarchy and clarity while preserving message." },
  { value: "use_as_inspiration", label: "Use as inspiration", description: "Use intent only, allow stronger rewrite and layout changes." }
];

const themeOptions: ThemeName[] = ["Enterprise Clean", "Enterprise Dark", "Consulting Minimal", "Custom"];

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("rebuild_and_polish");
  const [theme, setTheme] = useState<ThemeName>("Enterprise Clean");
  const [customThemeJson, setCustomThemeJson] = useState(CUSTOM_THEME_EXAMPLE);
  const [status, setStatus] = useState("Uploading image");
  const [schema, setSchema] = useState<SlideSchema | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [debugId, setDebugId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = !!file;
  const modeHelp = useMemo(() => modeOptions.find((m) => m.value === mode)?.description, [mode]);

  async function generate() {
    if (!file) return;
    setError(null);
    setStatus("Uploading image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("theme", theme);
    formData.append("customThemeJson", customThemeJson);

    setStatus("Analyzing slide");
    const res = await fetch("/api/generate", { method: "POST", body: formData });
    if (!res.ok) {
      try {
        const payload = await res.json();
        if (typeof payload?.debugId === "string") setDebugId(payload.debugId);
        setError(typeof payload?.error === "string" ? payload.error : "Generation failed");
      } catch {
        setError(await res.text());
      }
      return;
    }

    setStatus("Building schema");
    const payload = await res.json();
    setSchema(payload.schema);
    setDebugId(payload.debugId);
    setStatus("Validating and repairing");

    setStatus("Generating PPTX");
    const renderResp = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema: payload.schema, theme, customThemeJson })
    });

    if (!renderResp.ok) {
      setError(await renderResp.text());
      return;
    }

    const blob = await renderResp.blob();
    setDownloadUrl(URL.createObjectURL(blob));
    setStatus("Ready to download");
  }

  async function regenerateFromEdits() {
    if (!schema) return;
    setStatus("Generating PPTX");
    const renderResp = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema, theme, customThemeJson })
    });
    const blob = await renderResp.blob();
    setDownloadUrl(URL.createObjectURL(blob));
    setStatus("Ready to download");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">slide-rebuilder</h1>
        <p className="text-sm text-slate-600">Image-to-editable-slide generation for enterprise-quality PPTX output.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="rounded-xl border bg-white p-4">
            <label className="mb-2 block text-sm font-medium">Upload one slide image (PNG/JPG/JPEG/WebP, max 10MB)</label>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="mt-2 text-xs text-slate-500">No persistence: files are handled ephemerally per request.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-4">
              <label className="mb-2 block text-sm font-semibold">Mode</label>
              <select className="w-full rounded border p-2" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                {modeOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">{modeHelp}</p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <label className="mb-2 block text-sm font-semibold">Theme</label>
              <select className="w-full rounded border p-2" value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
                {themeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {theme === "Custom" && <CustomThemeInput value={customThemeJson} onChange={setCustomThemeJson} example={CUSTOM_THEME_EXAMPLE} />}

          <div className="flex gap-3">
            <button disabled={!canGenerate} onClick={generate} className="inline-flex items-center gap-2 rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">
              <Wand2 size={16} /> Generate
            </button>
            {schema && (
              <button onClick={regenerateFromEdits} className="rounded border px-4 py-2">Regenerate from edits</button>
            )}
            {downloadUrl && (
              <a download="slide-rebuilder-output.pptx" href={downloadUrl} className="inline-flex items-center gap-2 rounded bg-emerald-700 px-4 py-2 text-white">
                <FileImage size={16} /> Download PPTX
              </a>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {debugId && (
            <div className="flex flex-col gap-1 text-sm">
              <a className="text-blue-700 underline" href={`/debug/${debugId}`}>Open debug diagnostics</a>
              <a className="text-blue-700 underline" href={`/cost/${debugId}`}>Open cost diagnostics</a>
            </div>
          )}
        </div>

        <StatusPanel current={status} />
      </section>

      {schema && <ContentEditor schema={schema} onChange={setSchema} />}
    </div>
  );
}
