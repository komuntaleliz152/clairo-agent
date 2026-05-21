"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useOptionalAuth } from "@/components/ClerkShell";
import ResearchForm from "@/components/ResearchForm";
import ResearchReport from "@/components/ResearchReport";
import LoadingState, { type ResearchStepId } from "@/components/LoadingState";
import { isClerkConfigured } from "@/lib/clerk";
import { runResearchStream, type Source } from "@/lib/api";

export default function Home() {
  const { getToken, isLoaded } = useOptionalAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<ResearchStepId>("searching");
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [report, setReport] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (topic: string) => {
    if (!isLoaded) return;

    const token = await getToken();

    setIsLoading(true);
    setLoadingStep("searching");
    setLoadingMessage("Starting research...");
    setError(null);
    setReport(null);
    setSources([]);

    try {
      const data = await runResearchStream(
        topic,
        (progress) => {
          if (progress.message) setLoadingMessage(progress.message);
          if (
            progress.step === "searching" ||
            progress.step === "analyzing" ||
            progress.step === "generating"
          ) {
            setLoadingStep(progress.step);
          }
        },
        token
      );
      setReport(data.report);
      setSources(data.sources ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <AppHeader />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {!isClerkConfigured() && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Auth is optional in dev: add Clerk keys to <code>.env.local</code> or set{" "}
            <code>DISABLE_AUTH=true</code> on the backend. See AUTH.md.
          </div>
        )}

        <section className="mb-10 text-center">
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Research any topic in minutes
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-600">
            Clairo searches the web, analyzes sources, and delivers a structured report — autonomously.
          </p>
        </section>

        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {isLoading && (
          <LoadingState currentStep={loadingStep} message={loadingMessage} />
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
          >
            <span className="text-xl" aria-hidden>
              ⚠️
            </span>
            <div>
              <h3 className="font-semibold">Something went wrong</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {report && !isLoading && (
          <ResearchReport report={report} sources={sources} />
        )}
      </main>

      <footer className="border-t border-slate-200/60 py-8 text-center text-xs text-slate-500">
        Clairo · Autonomous research with cited sources
      </footer>
    </div>
  );
}
