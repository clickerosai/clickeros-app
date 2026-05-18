import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";
import { TRPCClientError } from "@trpc/client";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import * as Auth from "@/lib/_core/auth";
import { ToastProvider, useToast } from "@/components/toast";
import {
  setupNotificationHandler,
  setupAndroidChannels,
} from "@/lib/notifications";
import { WhatsNewModal } from "@/components/whats-new-modal";

// Initialize notification handler at module level (required by expo-notifications)
setupNotificationHandler();

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * SessionGuard — subscribes to QueryCache/MutationCache for UNAUTHORIZED errors.
 * Must be inside ToastProvider to use useToast().
 */
function SessionGuard({ sessionExpiredRef }: { sessionExpiredRef: React.MutableRefObject<boolean> }) {
  const { showToast } = useToast();
  const segments = useSegments();

  // Track if we're on an auth screen to avoid redirect loops
  const isOnAuthScreen =
    segments[0] === "signup" ||
    (segments[0] === "oauth" && segments[1] === "callback");

  const handleSessionExpiry = useCallback(() => {
    if (sessionExpiredRef.current || isOnAuthScreen) return;
    sessionExpiredRef.current = true;

    console.warn("[Session] UNAUTHORIZED — session expired, clearing auth and redirecting");

    // Clear stored session data
    Auth.removeSessionToken().catch(() => {});
    Auth.clearUserInfo().catch(() => {});

    // Show toast BEFORE redirecting so user understands what happened
    showToast({
      type: "warning",
      message: "Your session has expired",
      subMessage: "Please sign in again to continue.",
      duration: 5000,
      action: {
        label: "Sign in now",
        onPress: () => {
          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.location.href = "/signup";
          }
        },
      },
    });

    // Redirect after a brief delay so the toast is visible
    setTimeout(() => {
      sessionExpiredRef.current = false;
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.location.href = "/signup";
      }
    }, 2500); // 2.5 seconds — enough to read the toast
  }, [showToast, isOnAuthScreen, sessionExpiredRef]);

  return null;
}

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Shared ref passed to both QueryClient and SessionGuard
  const sessionExpiredRef = useRef(false);
  // Ref to hold the showToast function (set by SessionGuard after mount)
  const showToastRef = useRef<((opts: any) => void) | null>(null);

  // Initialize Manus runtime and notification channels
  useEffect(() => {
    initManusRuntime();
    // Set up Android notification channels
    setupAndroidChannels().catch(() => {});
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create QueryClient with global UNAUTHORIZED error handler
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 60_000,
          // Don't retry UNAUTHORIZED errors
          retry: (failureCount, error) => {
            if (error instanceof TRPCClientError) {
              const code = error.data?.code;
              if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
            }
            return failureCount < 1;
          },
        },
        mutations: {
          retry: (failureCount, error) => {
            if (error instanceof TRPCClientError) {
              const code = error.data?.code;
              if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
            }
            return failureCount < 1;
          },
        },
      },
    });

    const triggerSessionExpiry = () => {
      if (sessionExpiredRef.current) return;
      sessionExpiredRef.current = true;

      Auth.removeSessionToken().catch(() => {});
      Auth.clearUserInfo().catch(() => {});
      client.clear();

      // Show toast via ref (set after ToastProvider mounts)
      if (showToastRef.current) {
        showToastRef.current({
          type: "warning",
          message: "Your session has expired",
          subMessage: "Please sign in again to continue.",
          duration: 5000,
        });
      }

      setTimeout(() => {
        sessionExpiredRef.current = false;
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.location.href = "/signup";
        }
      }, 2500);
    };

    // Subscribe to query errors
    client.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return;
      const error = event.query.state.error;
      if (!error) return;
      const isUnauth =
        (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") ||
        (error instanceof Error && error.message?.includes("UNAUTHORIZED"));
      if (isUnauth) triggerSessionExpiry();
    });

    // Subscribe to mutation errors
    client.getMutationCache().subscribe((event) => {
      if (event.type !== "updated") return;
      const error = event.mutation?.state?.error;
      if (!error) return;
      const isUnauth =
        (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") ||
        (error instanceof Error && error.message?.includes("UNAUTHORIZED"));
      if (isUnauth) triggerSessionExpiry();
    });

    return client;
  });

  const [trpcClient] = useState(() => createTRPCClient());

  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  /**
   * Inner component that has access to ToastProvider context.
   * Bridges showToast into the showToastRef so QueryClient can call it.
   */
  function ToastBridge() {
    const { showToast } = useToast();
    useEffect(() => {
      showToastRef.current = showToast;
      return () => { showToastRef.current = null; };
    }, [showToast]);
    return null;
  }

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <ToastBridge />
            <SessionGuard sessionExpiredRef={sessionExpiredRef} />
            <WhatsNewModal />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              {/* fullScreenModal prevents back-swipe to the stale ?code= URL */}
              <Stack.Screen name="oauth/callback" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="signup" options={{ presentation: "fullScreenModal" }} />
            </Stack>
            <StatusBar style="auto" />
          </ToastProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
    </ThemeProvider>
  );
}
