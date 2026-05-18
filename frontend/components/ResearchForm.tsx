"use client";

import { useState, FormEvent } from "react";

interface ResearchFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export default function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Research Topic
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic to research (e.g., 'Latest developments in quantum computing')"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            rows={4}
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? "Researching..." : "Start Research"}
        </button>
      </div>
    </form>
  );
}
