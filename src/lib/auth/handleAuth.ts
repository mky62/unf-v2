"use client";

import { useCallback, useMemo, useState } from "react";
import { useSignIn } from "@clerk/nextjs";

import type { OAuthProvider } from "@/src/lib/types";

type OAuthLoading = OAuthProvider | null;

export function useHandleAuth() {
  const { signIn, isLoaded } = useSignIn();
  const [oauthLoading, setOauthLoading] = useState<OAuthLoading>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = useCallback(
    async (provider: OAuthProvider) => {
      setError(null);

      if (!isLoaded || !signIn) return;

      if (provider !== "github") {
        setError("Only GitHub sign-in is supported.");
        return;
      }

      try {
        setOauthLoading(provider);

        await signIn.authenticateWithRedirect({
          strategy: "oauth_github",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      } catch (e: unknown) {
        setOauthLoading(null);
        const msg =
          typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Sign-in failed.";
        setError(msg || "Sign-in failed.");
      }
    },
    [isLoaded, signIn]
  );

  return useMemo(
    () => ({ oauthLoading, error, handleOAuth }),
    [oauthLoading, error, handleOAuth]
  );
}

