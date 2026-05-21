"use client";

import { useState, FormEvent } from "react";

const EXAMPLE_TOPICS = [
  "Machine learning in Uganda today",
  "EU AI Act impact on startups",
  "Latest developments in quantum computing",
];

interface ResearchFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export default function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic.trim()) onSubmit(topic.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="topic"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Research topic
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What should the agent research? Be specific for better results."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60"
            rows={4}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((example) => (
              <button
                key={example}
                type="button"
                disabled={isLoading}
                onClick={() => setTopic(example)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="group relative w-full overflow-hidden rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Research in progress…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                Start research
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
