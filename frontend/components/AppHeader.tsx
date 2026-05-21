"use client";

import { UserButton } from "@clerk/nextjs";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-md shadow-brand-600/30">
            C
          </div>
          <div>
            <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold leading-tight text-slate-900">
              Clairo
            </p>
            <p className="text-xs text-slate-500">AI Research Agent</p>
          </div>
        </div>
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </div>
    </header>
  );
}
