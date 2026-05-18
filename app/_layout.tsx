import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
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

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * SessionGuard — listens for UNAUTHORIZED errors from TanStack Query
 * and redirects to the Sign Up screen when the session expires.
 *
 * Must be rendered inside QueryClientProvider to access the query cache.
 */
function SessionGuard() {
  const router = useRouter();
  const segments = useSegments();
  const redirectingRef = useRef(false);

  useEffect(() => {
    // Don't redirect if already on auth screens
    const isOnAuthScreen =
      segments[0] === "signup" ||
      (segments[0] === "oauth" && segments[1] === "callback");

    if (isOnAuthScreen) {
      redirectingRef.current = false;
    }
  }, [segments]);

  return null;
}

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Track whether we've already triggered a session expiry redirect
  const sessionExpiredRef = useRef(false);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
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
          // Don't retry UNAUTHORIZED errors — they won't succeed without re-auth
          retry: (failureCount, error) => {
            if (error instanceof TRPCClientError) {
              const code = error.data?.code;
              if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
                return false; // Don't retry auth errors
              }
            }
            return failureCount < 1; // Retry once for other errors
          },
          // Stale time: 60 seconds (data stays fresh for 1 minute)
          staleTime: 60_000,
        },
        mutations: {
          // Don't retry mutations on auth errors
          retry: (failureCount, error) => {
            if (error instanceof TRPCClientError) {
              const code = error.data?.code;
              if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
                return false;
              }
            }
            return failureCount < 1;
          },
        },
      },
    });

    // Global error handler — intercepts all query/mutation errors
    client.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return;
      const error = event.query.state.error;
      if (!error) return;

      const isUnauthorized =
        (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") ||
        (error instanceof Error && error.message?.includes("UNAUTHORIZED"));

      if (isUnauthorized && !sessionExpiredRef.current) {
        sessionExpiredRef.current = true;
        console.warn("[Session] UNAUTHORIZED detected — session expired, clearing auth");

        // Clear stored session data
        Auth.removeSessionToken().catch(() => {});
        Auth.clearUserInfo().catch(() => {});

        // Clear all cached queries to prevent stale data showing
        client.clear();

        // Reset the flag after a delay to allow re-auth
        setTimeout(() => {
          sessionExpiredRef.current = false;
        }, 5000);

        // Navigate to sign up — use a small delay to let the current render finish
        setTimeout(() => {
          try {
            // Use window.location for web (most reliable cross-render navigation)
            if (Platform.OS === "web" && typeof window !== "undefined") {
              window.location.href = "/signup";
            }
          } catch (navErr) {
            console.error("[Session] Navigation failed:", navErr);
          }
        }, 100);
      }
    });

    // Also subscribe to mutation cache for mutation-level UNAUTHORIZED errors
    client.getMutationCache().subscribe((event) => {
      if (event.type !== "updated") return;
      const error = event.mutation?.state?.error;
      if (!error) return;

      const isUnauthorized =
        (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") ||
        (error instanceof Error && error.message?.includes("UNAUTHORIZED"));

      if (isUnauthorized && !sessionExpiredRef.current) {
        sessionExpiredRef.current = true;
        console.warn("[Session] UNAUTHORIZED mutation — session expired");

        Auth.removeSessionToken().catch(() => {});
        Auth.clearUserInfo().catch(() => {});
        client.clear();

        setTimeout(() => { sessionExpiredRef.current = false; }, 5000);

        setTimeout(() => {
          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.location.href = "/signup";
          }
        }, 100);
      }
    });

    return client;
  });

  const [trpcClient] = useState(() => createTRPCClient());

  // Ensure minimum safe area padding on mobile
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

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SessionGuard />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            {/* fullScreenModal prevents back-swipe to the stale ?code= URL */}
            <Stack.Screen name="oauth/callback" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="signup" options={{ presentation: "fullScreenModal" }} />
          </Stack>
          <StatusBar style="auto" />
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
