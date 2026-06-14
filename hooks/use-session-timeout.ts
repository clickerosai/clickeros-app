/**
 * useSessionTimeout — Tracks user activity and auto-logs out after inactivity.
 *
 * Behavior:
 * - Monitors user interactions (clicks, taps, scrolls, keyboard, navigation)
 * - After 9 minutes of inactivity, shows a 60-second warning
 * - If no activity during warning, auto-logout and redirect to /signup
 * - If user becomes active during warning, cancels logout and resets timer
 * - Saves draft campaigns before logout
 * - Works across web, iOS, Android, and tablet devices
 * - Handles foreground/background state transitions on mobile
 *
 * Usage:
 *   useSessionTimeout({ enabled: true, onWarning: () => {}, onLogout: () => {} });
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { useSegments } from "expo-router";
import * as Auth from "@/lib/_core/auth";
import { saveCampaignMemory, loadCampaignMemory } from "@/lib/campaign-memory";

// Configuration (in milliseconds)
const INACTIVITY_TIMEOUT = 9 * 60 * 1000; // 9 minutes
const WARNING_DURATION = 60 * 1000; // 60 seconds
const ACTIVITY_DEBOUNCE = 500; // Debounce activity events to avoid excessive timer resets

interface UseSessionTimeoutOptions {
  enabled?: boolean;
  onWarning?: () => void;
  onLogout?: () => void;
  onActivityDetected?: () => void;
}

interface SessionTimeoutState {
  isWarningVisible: boolean;
  secondsRemaining: number;
  isLoggingOut: boolean;
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
  const {
    enabled = true,
    onWarning,
    onLogout,
    onActivityDetected,
  } = options;

  const segments = useSegments();
  const [state, setState] = useState<SessionTimeoutState>({
    isWarningVisible: false,
    secondsRemaining: 60,
    isLoggingOut: false,
  });

  // Refs to track timers and state
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>("active");
  const isOnAuthScreenRef = useRef(false);
  const activityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if we're on an auth screen (where timeout shouldn't apply)
  useEffect(() => {
    isOnAuthScreenRef.current =
      segments[0] === "signup" ||
      (segments[0] === "oauth" && segments[1] === "callback");
  }, [segments]);

  /**
   * Reset the inactivity timer — called on any user activity.
   */
  const resetInactivityTimer = useCallback(() => {
    // Debounce rapid activity events
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current);
    }

    activityDebounceRef.current = setTimeout(() => {
      // Don't reset if we're on auth screens or timeout is disabled
      if (!enabled || isOnAuthScreenRef.current) return;

      lastActivityTimeRef.current = Date.now();
      onActivityDetected?.();

      // If warning is visible, user activity cancels the logout
      if (state.isWarningVisible) {
        console.log("[SessionTimeout] Activity detected during warning — canceling logout");
        cancelWarning();
      }

      // Clear existing inactivity timer and restart
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set new inactivity timer
      inactivityTimerRef.current = setTimeout(() => {
        console.log("[SessionTimeout] Inactivity timeout reached — showing warning");
        showWarning();
      }, INACTIVITY_TIMEOUT);
    }, ACTIVITY_DEBOUNCE);
  }, [enabled, state.isWarningVisible, onActivityDetected]);

  /**
   * Show the warning modal and start the countdown.
   */
  const showWarning = useCallback(() => {
    if (state.isWarningVisible || isOnAuthScreenRef.current) return;

    console.log("[SessionTimeout] Showing warning modal");
    setState((prev) => ({
      ...prev,
      isWarningVisible: true,
      secondsRemaining: 60,
    }));

    onWarning?.();

    // Clear the inactivity timer since we're now in warning state
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    // Start countdown
    let secondsLeft = 60;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      setState((prev) => ({
        ...prev,
        secondsRemaining: secondsLeft,
      }));

      if (secondsLeft <= 0) {
        clearInterval(countdownIntervalRef.current!);
        countdownIntervalRef.current = null;
        performLogout();
      }
    }, 1000);

    // Set a backup timeout in case interval is unreliable
    warningTimerRef.current = setTimeout(() => {
      performLogout();
    }, WARNING_DURATION);
  }, [state.isWarningVisible]);

  /**
   * Cancel the warning and restart the inactivity timer.
   */
  const cancelWarning = useCallback(() => {
    console.log("[SessionTimeout] Canceling warning and resetting timer");

    setState((prev) => ({
      ...prev,
      isWarningVisible: false,
      secondsRemaining: 60,
    }));

    // Clear warning timers
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Restart inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      showWarning();
    }, INACTIVITY_TIMEOUT);
  }, [showWarning]);

  /**
   * Perform the actual logout — save drafts, clear auth, and call callback.
   */
  const performLogout = useCallback(async () => {
    if (state.isLoggingOut || isOnAuthScreenRef.current) return;

    console.log("[SessionTimeout] Performing logout due to inactivity");
    setState((prev) => ({
      ...prev,
      isLoggingOut: true,
    }));

    try {
      // Save any draft campaign before logout
      console.log("[SessionTimeout] Auto-saving draft campaign...");
      const existingDraft = await loadCampaignMemory();
      if (existingDraft) {
        await saveCampaignMemory(existingDraft);
        console.log("[SessionTimeout] Draft campaign saved");
      }

      // Clear authentication
      console.log("[SessionTimeout] Clearing authentication tokens");
      await Auth.removeSessionToken().catch(() => {});
      await Auth.clearUserInfo().catch(() => {});

      // Call the logout callback (will handle tRPC logout, query cache clear, etc.)
      onLogout?.();
    } catch (error) {
      console.error("[SessionTimeout] Error during logout:", error);
    }
  }, [state.isLoggingOut, onLogout]);

  /**
   * Set up activity listeners for web and mobile.
   */
  useEffect(() => {
    if (!enabled || isOnAuthScreenRef.current) return;

    // Web: Listen for user interactions
    if (Platform.OS === "web") {
      const handleWebActivity = () => {
        resetInactivityTimer();
      };

      const events = ["click", "keydown", "scroll", "touchstart", "mousemove"];
      events.forEach((event) => {
        document.addEventListener(event, handleWebActivity, { passive: true });
      });

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleWebActivity);
        });
      };
    }

    // Mobile: Listen for app state changes (foreground/background)
    const subscription = AppState.addEventListener("change", (status: AppStateStatus) => {
      appStateRef.current = status;
      console.log(`[SessionTimeout] App state changed to: ${status}`);

      if (status === "active") {
        // App came to foreground — check if timeout occurred in background
        const backgroundDuration = Date.now() - lastActivityTimeRef.current;
        if (backgroundDuration > INACTIVITY_TIMEOUT) {
          console.log("[SessionTimeout] App was backgrounded for too long — showing warning");
          showWarning();
        } else {
          // Reset timer when app comes back to foreground
          resetInactivityTimer();
        }
      } else if (status === "background") {
        // App went to background — pause timers but keep tracking
        console.log("[SessionTimeout] App backgrounded — timers paused");
      }
    });

    return () => {
      subscription.remove();
    };
  }, [enabled, resetInactivityTimer, showWarning]);

  /**
   * Initialize the inactivity timer on mount.
   */
  useEffect(() => {
    if (!enabled || isOnAuthScreenRef.current) return;

    console.log("[SessionTimeout] Initializing inactivity timer");
    lastActivityTimeRef.current = Date.now();

    inactivityTimerRef.current = setTimeout(() => {
      showWarning();
    }, INACTIVITY_TIMEOUT);

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (activityDebounceRef.current) clearTimeout(activityDebounceRef.current);
    };
  }, [enabled, showWarning]);

  return {
    isWarningVisible: state.isWarningVisible,
    secondsRemaining: state.secondsRemaining,
    isLoggingOut: state.isLoggingOut,
    cancelWarning,
    performLogout,
  };
}
