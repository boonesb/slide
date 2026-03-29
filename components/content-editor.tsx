"use client";

import type { SlideSchema } from "@/types/slide";

export function ContentEditor({ schema, onChange }: { schema: SlideSchema; onChange: (s: SlideSchema) => void }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold">Edit detected content</h3>
      <label className="mb-2 block text-xs text-slate-600">Title</label>
      <input
        className="mb-4 w-full rounded border p-2"
        value={schema.content.title}
        onChange={(e) => onChange({ ...schema, content: { ...schema.content, title: e.target.value } })}
      />
      {schema.content.sections.map((section, i) => (
        <div key={section.id} className="mb-3">
          <label className="mb-1 block text-xs text-slate-600">Section {i + 1}</label>
          <textarea
            className="w-full rounded border p-2"
            value={section.body}
            onChange={(e) => {
              const sections = [...schema.content.sections];
              sections[i] = { ...sections[i], body: e.target.value };
              onChange({ ...schema, content: { ...schema.content, sections } });
            }}
          />
        </div>
      ))}
    </div>
  );
}
