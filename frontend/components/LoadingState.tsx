"use client";

export type ResearchStepId = "searching" | "analyzing" | "generating";

const STEPS: { id: ResearchStepId; label: string }[] = [
  { id: "searching", label: "Searching the web for sources" },
  { id: "analyzing", label: "Analyzing sources" },
  { id: "generating", label: "Generating research report" },
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
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Research in progress
          </h3>
          <p className="text-gray-600 text-sm">
            {message ?? "The AI agent is working on your topic"}
          </p>
        </div>

        <ol className="w-full max-w-md space-y-0">
          {STEPS.map((step, index) => {
            const status = stepStatus(step.id, currentStep);
            return (
              <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                {index < STEPS.length - 1 && (
                  <span
                    className={`absolute left-[11px] top-6 h-full w-0.5 ${
                      status === "done" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    status === "done"
                      ? "bg-blue-600 text-white"
                      : status === "active"
                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-600 ring-offset-2"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {status === "done" ? (
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === "active" ? (
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-medium ${
                      status === "active"
                        ? "text-blue-700"
                        : status === "done"
                          ? "text-gray-900"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {status === "active" && (
                    <p className="text-xs text-gray-500 mt-0.5">In progress…</p>
                  )}
                  {status === "done" && (
                    <p className="text-xs text-green-600 mt-0.5">Complete</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
