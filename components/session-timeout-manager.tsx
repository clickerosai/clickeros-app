/**
 * SessionTimeoutManager — Orchestrates the session timeout system.
 *
 * Responsibilities:
 * - Initialize useSessionTimeout hook
 * - Show warning modal when timeout approaches
 * - Handle logout when countdown expires
 * - Send notifications
 * - Redirect to login screen
 *
 * Must be placed inside ToastProvider and QueryClientProvider.
 */

import React, { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

import { useSessionTimeout } from "@/hooks/use-session-timeout";
import { useToast } from "@/components/toast";
import { SessionTimeoutWarningModal } from "@/components/session-timeout-warning-modal";
import { handleSessionTimeoutLogout, callServerLogout } from "@/lib/session-timeout-handler";
import { sendSessionTimeoutWarnings } from "@/lib/session-timeout-notifications";
import { trpc } from "@/lib/trpc";
import * as Auth from "@/lib/_core/auth";

interface SessionTimeoutManagerProps {
  enabled?: boolean;
}

export function SessionTimeoutManager({ enabled = true }: SessionTimeoutManagerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const trpcClient = trpc.useUtils().client;

  // Track if we've already triggered logout to prevent double-execution
  const logoutInProgressRef = useRef(false);

  /**
   * Called when warning modal is shown (9 minutes of inactivity).
   */
  const handleWarningShown = useCallback(async () => {
    console.log("[SessionTimeoutManager] Warning shown — sending notifications");

    // Send push and in-app notifications
    await sendSessionTimeoutWarnings().catch((error) => {
      console.warn("[SessionTimeoutManager] Failed to send warnings:", error);
    });

    // Show a toast on web (since push notifications don't work on web)
    if (Platform.OS === "web") {
      showToast({
        type: "warning",
        message: "Session Expiring Soon",
        subMessage: "Your session will expire in 60 seconds due to inactivity.",
        duration: 5000,
      });
    }
  }, [showToast]);

  /**
   * Called when the countdown expires (60 seconds of warning).
   */
  const handleLogout = useCallback(async () => {
    if (logoutInProgressRef.current) {
      console.log("[SessionTimeoutManager] Logout already in progress, skipping");
      return;
    }

    logoutInProgressRef.current = true;
    console.log("[SessionTimeoutManager] Performing session timeout logout");

    try {
      // Call server logout first (non-blocking)
      await callServerLogout(trpcClient).catch(() => {});

      // Perform local logout
      await handleSessionTimeoutLogout({
        queryClient,
        showToast,
        onRedirect: () => {
          console.log("[SessionTimeoutManager] Redirecting to signup...");
          if (Platform.OS === "web" && typeof window !== "undefined") {
            // Web: Use window.location for guaranteed redirect
            setTimeout(() => {
              window.location.href = "/signup";
            }, 500);
          } else {
            // Mobile: Use router
            router.replace("/signup");
          }
        },
      });
    } catch (error) {
      console.error("[SessionTimeoutManager] Error during logout:", error);
      // Still redirect even if something failed
      if (Platform.OS === "web" && typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/signup";
        }, 1000);
      } else {
        router.replace("/signup");
      }
    } finally {
      logoutInProgressRef.current = false;
    }
  }, [queryClient, showToast, router, trpcClient]);

  /**
   * Called when user becomes active during warning period.
   */
  const handleActivityDuringWarning = useCallback(() => {
    console.log("[SessionTimeoutManager] User activity detected during warning — canceling logout");
    showToast({
      type: "success",
      message: "Session Restored",
      subMessage: "You're still logged in. Keep working!",
      duration: 3000,
    });
  }, [showToast]);

  // Initialize session timeout hook
  const {
    isWarningVisible,
    secondsRemaining,
    isLoggingOut,
    cancelWarning,
    performLogout,
  } = useSessionTimeout({
    enabled,
    onWarning: handleWarningShown,
    onLogout: handleLogout,
    onActivityDetected: handleActivityDuringWarning,
  });

  return (
    <SessionTimeoutWarningModal
      visible={isWarningVisible}
      secondsRemaining={secondsRemaining}
      isLoggingOut={isLoggingOut}
      onStayLoggedIn={cancelWarning}
      onLogOutNow={performLogout}
    />
  );
}
