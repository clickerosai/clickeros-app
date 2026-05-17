import { ThemedView } from "@/components/themed-view";
import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Status = "processing" | "success" | "error";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    state?: string;
    error?: string;
    sessionToken?: string;
    user?: string;
  }>();

  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false); // Prevent double-execution in React strict mode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      console.log("[OAuth] Callback triggered with params:", {
        hasCode: !!params.code,
        hasState: !!params.state,
        hasError: !!params.error,
        hasSessionToken: !!params.sessionToken,
        hasUser: !!params.user,
      });

      try {
        // ── Case 1: Error from OAuth provider ─────────────────────────────
        if (params.error) {
          console.error("[OAuth] Provider returned error:", params.error);
          setStatus("error");
          setErrorMessage(
            params.error === "access_denied"
              ? "You cancelled the sign-in. Please try again."
              : params.error === "auth_failed"
              ? "Authentication failed. Please try again."
              : `Sign-in error: ${params.error}`
          );
          return;
        }

        // ── Case 2: Server already exchanged the code and passed sessionToken ──
        // This is the PRIMARY web flow: server redirects to /oauth/callback?sessionToken=...
        if (params.sessionToken) {
          console.log("[OAuth] Session token received from server redirect");
          await Auth.setSessionToken(params.sessionToken);

          if (params.user) {
            try {
              const decoded =
                typeof atob !== "undefined"
                  ? atob(decodeURIComponent(params.user))
                  : Buffer.from(decodeURIComponent(params.user), "base64").toString("utf-8");
              const userData = JSON.parse(decoded);
              const userInfo: Auth.User = {
                id: userData.id,
                openId: userData.openId,
                name: userData.name,
                email: userData.email,
                loginMethod: userData.loginMethod,
                lastSignedIn: new Date(userData.lastSignedIn || Date.now()),
              };
              await Auth.setUserInfo(userInfo);
              console.log("[OAuth] User stored:", userInfo.email);
            } catch (err) {
              console.warn("[OAuth] Could not parse user data:", err);
              // Non-fatal — session token is already stored
            }
          }

          // Clean the URL before redirecting (remove ?sessionToken= from browser history)
          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.history.replaceState({}, "", "/");
          }

          setStatus("success");
          setTimeout(() => router.replace("/(tabs)"), 800);
          return;
        }

        // ── Case 3: Raw code + state (native deep link or fallback web) ───
        // The server should have handled this, but we support it as a fallback.
        let code = params.code ?? null;
        let state = params.state ?? null;

        // If not in params, try Linking (native deep link)
        if (!code || !state) {
          const initialUrl = await Linking.getInitialURL();
          console.log("[OAuth] Checking Linking.getInitialURL():", initialUrl);
          if (initialUrl) {
            try {
              const urlObj = new URL(initialUrl);
              code = urlObj.searchParams.get("code");
              state = urlObj.searchParams.get("state");
              const token = urlObj.searchParams.get("sessionToken");
              if (token) {
                // Deep link included a session token — use it directly
                await Auth.setSessionToken(token);
                setStatus("success");
                setTimeout(() => router.replace("/(tabs)"), 800);
                return;
              }
            } catch {
              // Relative URL fallback
              const match = initialUrl.match(/[?&]code=([^&]+)/);
              const stateMatch = initialUrl.match(/[?&]state=([^&]+)/);
              if (match) code = decodeURIComponent(match[1]);
              if (stateMatch) state = decodeURIComponent(stateMatch[1]);
            }
          }
        }

        if (!code || !state) {
          console.error("[OAuth] No code, state, or sessionToken found");
          setStatus("error");
          setErrorMessage("Authentication parameters missing. Please try signing in again.");
          return;
        }

        // Exchange code for token via the mobile endpoint
        console.log("[OAuth] Exchanging code for session token...");
        const result = await Api.exchangeOAuthCode(code, state);

        if (!result.sessionToken) {
          throw new Error("No session token returned from server");
        }

        await Auth.setSessionToken(result.sessionToken);

        if (result.user) {
          const userInfo: Auth.User = {
            id: result.user.id,
            openId: result.user.openId,
            name: result.user.name,
            email: result.user.email,
            loginMethod: result.user.loginMethod,
            lastSignedIn: new Date(result.user.lastSignedIn || Date.now()),
          };
          await Auth.setUserInfo(userInfo);
        }

        // Clean URL on web
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.history.replaceState({}, "", "/");
        }

        setStatus("success");
        setTimeout(() => router.replace("/(tabs)"), 800);
      } catch (err) {
        console.error("[OAuth] Callback error:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Authentication failed. Please try again."
        );
      }
    };

    handleCallback();
  }, []); // Empty deps — run once only

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left", "right"]}>
      <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        {status === "processing" && (
          <View style={{ alignItems: "center", gap: 16 }}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={{ fontSize: 16, textAlign: "center", color: "#64748B", lineHeight: 24 }}>
              Completing sign-in…
            </Text>
            <Text style={{ fontSize: 13, textAlign: "center", color: "#94A3B8" }}>
              Please wait, this only takes a moment.
            </Text>
          </View>
        )}

        {status === "success" && (
          <View style={{ alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 32 }}>✅</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#22C55E" }}>
              Signed in successfully!
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", textAlign: "center" }}>
              Redirecting to your dashboard…
            </Text>
            <ActivityIndicator size="small" color="#7C3AED" style={{ marginTop: 8 }} />
          </View>
        )}

        {status === "error" && (
          <View style={{ alignItems: "center", gap: 16, maxWidth: 320 }}>
            <Text style={{ fontSize: 32 }}>❌</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#EF4444", textAlign: "center" }}>
              Sign-in Failed
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 22 }}>
              {errorMessage || "Something went wrong. Please try again."}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#7C3AED",
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 14,
                marginTop: 8,
              }}
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
                Go to Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 4, minHeight: 44, justifyContent: "center" }}
              onPress={() => router.replace("/signup" as any)}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#7C3AED", fontSize: 14, fontWeight: "600" }}>
                Try signing in again
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
