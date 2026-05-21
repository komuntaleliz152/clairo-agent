"use client";

export type ResearchStepId = "searching" | "analyzing" | "generating";

const STEPS: { id: ResearchStepId; label: string; icon: string }[] = [
  { id: "searching", label: "Searching the web", icon: "🔍" },
  { id: "analyzing", label: "Analyzing sources", icon: "📚" },
  { id: "generating", label: "Writing report", icon: "✨" },
];

interface LoadingStateProps {
  currentStep: ResearchStepId;
  message?: string;
}

function stepStatus(
  stepId: ResearchStepId,
  currentStep: ResearchStepId
): "done" | "active" | "pending" {
  const order: ResearchStepId[] = ["searching", "analyzing", "generating"];
  const current = order.indexOf(currentStep);
  const step = order.indexOf(stepId);
  if (step < current) return "done";
  if (step === current) return "active";
  return "pending";
}

export default function LoadingState({ currentStep, message }: LoadingStateProps) {
  return (
    <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-slate-900">
            Agent at work
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">
            {message ?? "Running autonomous research pipeline"}
          </p>
        </div>
      </div>

      <ol className="space-y-0">
        {STEPS.map((step, index) => {
          const status = stepStatus(step.id, currentStep);
          return (
            <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {index < STEPS.length - 1 && (
                <span
                  className={`absolute left-[19px] top-10 bottom-0 w-px ${
                    status === "done" ? "bg-brand-400" : "bg-slate-200"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm transition ${
                  status === "done"
                    ? "bg-brand-600 text-white"
                    : status === "active"
                      ? "bg-white text-brand-700 ring-2 ring-brand-500 shadow-sm"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {status === "done" ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className={status === "active" ? "animate-pulse" : ""}>{step.icon}</span>
                )}
              </span>
              <div className="flex-1 pt-1.5">
                <p
                  className={`font-medium ${
                    status === "active"
                      ? "text-brand-700"
                      : status === "done"
                        ? "text-slate-900"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {status === "done" && "Complete"}
                  {status === "active" && "In progress…"}
                  {status === "pending" && "Waiting"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
