"use client";

import type { ReactNode } from "react";

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export default function ReportMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc pl-5 space-y-1">
        {listItems.map((item, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{ __html: formatInline(item) }}
          />
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-slate-800 mt-6 mb-2">
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-200">
          {trimmed.slice(3).replace(/\*\*/g, "")}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-slate-900 mt-4 mb-3">
          {trimmed.slice(2).replace(/\*\*/g, "")}
        </h1>
      );
      continue;
    }

    elements.push(
      <p
        key={key++}
        className="text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  }

  flushList();

  return <div className="report-content">{elements}</div>;
}
