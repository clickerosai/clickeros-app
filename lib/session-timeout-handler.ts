/**
 * Session Timeout Handler — Orchestrates the logout flow when timeout occurs.
 *
 * Responsibilities:
 * - Call tRPC auth.logout to clear server-side session
 * - Clear local authentication tokens
 * - Clear TanStack Query cache
 * - Show appropriate UI messages
 * - Handle redirect to login screen
 */

import { Platform } from "react-native";
import * as Auth from "@/lib/_core/auth";
import { saveCampaignMemory, loadCampaignMemory } from "@/lib/campaign-memory";

interface SessionTimeoutHandlerOptions {
  queryClient?: any;
  showToast?: (opts: any) => void;
  onRedirect?: () => void;
}

/**
 * Perform the session timeout logout sequence.
 * This is called by the warning modal when the countdown expires.
 */
export async function handleSessionTimeoutLogout(
  options: SessionTimeoutHandlerOptions = {}
) {
  const { queryClient, showToast, onRedirect } = options;

  console.log("[SessionTimeoutHandler] Starting timeout logout sequence");

  try {
    // Step 1: Save any draft campaign
    console.log("[SessionTimeoutHandler] Saving draft campaign...");
    try {
      const existingDraft = await loadCampaignMemory();
      if (existingDraft) {
        await saveCampaignMemory(existingDraft);
        console.log("[SessionTimeoutHandler] Draft campaign saved successfully");
      }
    } catch (error) {
      console.warn("[SessionTimeoutHandler] Failed to save draft:", error);
      // Continue even if draft save fails
    }

    // Step 2: Clear local authentication
    console.log("[SessionTimeoutHandler] Clearing local authentication...");
    await Auth.removeSessionToken().catch(() => {});
    await Auth.clearUserInfo().catch(() => {});

    // Step 3: Clear query cache if available
    if (queryClient) {
      console.log("[SessionTimeoutHandler] Clearing query cache...");
      queryClient.clear();
    }

    // Step 4: Show security message
    if (showToast) {
      showToast({
        type: "warning",
        message: "Session Expired",
        subMessage: "Your session has expired due to inactivity. Please sign in again.",
        duration: 5000,
      });
    }

    // Step 5: Redirect to login
    console.log("[SessionTimeoutHandler] Redirecting to login...");
    if (onRedirect) {
      onRedirect();
    } else if (Platform.OS === "web" && typeof window !== "undefined") {
      // Web: Use window.location for guaranteed redirect
      setTimeout(() => {
        window.location.href = "/signup";
      }, 500);
    }
  } catch (error) {
    console.error("[SessionTimeoutHandler] Error during logout:", error);
    // Still try to redirect even if something failed
    if (Platform.OS === "web" && typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/signup";
      }, 1000);
    }
  }
}

/**
 * Call the tRPC auth.logout endpoint to invalidate server-side session.
 * This is typically called before handleSessionTimeoutLogout.
 */
export async function callServerLogout(trpcClient?: any): Promise<void> {
  if (!trpcClient) {
    console.warn("[SessionTimeoutHandler] No tRPC client provided, skipping server logout");
    return;
  }

  try {
    console.log("[SessionTimeoutHandler] Calling server logout...");
    await trpcClient.auth.logout.mutate();
    console.log("[SessionTimeoutHandler] Server logout successful");
  } catch (error) {
    console.warn("[SessionTimeoutHandler] Server logout failed (non-critical):", error);
    // Continue even if server logout fails — local logout is what matters
  }
}
