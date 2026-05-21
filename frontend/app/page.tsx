"use client";

import { useState } from "react";
import ResearchForm from "@/components/ResearchForm";
import ResearchReport from "@/components/ResearchReport";
import LoadingState, { type ResearchStepId } from "@/components/LoadingState";
import { runResearchStream, type Source } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<ResearchStepId>("searching");
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [report, setReport] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (topic: string) => {
    setIsLoading(true);
    setLoadingStep("searching");
    setLoadingMessage("Starting research...");
    setError(null);
    setReport(null);
    setSources([]);

    try {
      const data = await runResearchStream(topic, (progress) => {
        if (progress.message) setLoadingMessage(progress.message);
        if (
          progress.step === "searching" ||
          progress.step === "analyzing" ||
          progress.step === "generating"
        ) {
          setLoadingStep(progress.step);
        }
      });
      setReport(data.report);
      setSources(data.sources ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Research Agent
          </h1>
          <p className="text-xl text-gray-600">
            Autonomous research powered by AI. Enter a topic and get a comprehensive report.
          </p>
        </div>

        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {isLoading && (
          <LoadingState currentStep={loadingStep} message={loadingMessage} />
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {report && !isLoading && (
          <ResearchReport report={report} sources={sources} />
        )}
      </div>
    </main>
  );
}
