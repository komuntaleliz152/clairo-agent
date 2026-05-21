"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk";

export function ClerkShell({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return <>{children}</>;
  }
  return <ClerkProvider>{children}</ClerkProvider>;
}

export function useOptionalAuth() {
  if (!isClerkConfigured()) {
    return {
      isLoaded: true,
      getToken: async () => null as string | null,
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAuth();
}
