"use client";

export default function LoadingState() {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Researching your topic...
          </h3>
          <p className="text-gray-600">
            The AI agent is searching the web and analyzing sources
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-md mt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Searching for relevant information...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
            <span className="text-sm text-gray-600">Analyzing sources...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
            <span className="text-sm text-gray-600">Generating report...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
