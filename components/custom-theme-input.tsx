"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  example: string;
};

export function CustomThemeInput({ value, onChange, example }: Props) {
  return (
    <div className="space-y-2 rounded-xl border bg-white p-4">
      <h3 className="text-sm font-semibold">Custom style JSON</h3>
      <input
        type="file"
        accept="application/json"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onChange(await file.text());
        }}
        className="block w-full text-sm"
      />
      <textarea
        className="h-44 w-full rounded border p-2 font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <details>
        <summary className="cursor-pointer text-xs text-slate-600">Show starter JSON</summary>
        <pre className="mt-2 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100">{example}</pre>
      </details>
    </div>
  );
}
