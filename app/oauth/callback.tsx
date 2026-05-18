import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { AuthSplash } from "@/components/auth-splash";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  storeBiometricToken,
  getRememberMe,
  getBiometricInfo,
  setRememberMe,
} from "@/lib/biometric-auth";
import { useToast } from "@/components/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Status = "processing" | "success" | "error";

const BIOMETRIC_PROMPT_SHOWN_KEY = "@clickeros:biometric_prompt_shown";

export default function OAuthCallback() {
  const router = useRouter();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{
    code?: string;
    state?: string;
    error?: string;
    sessionToken?: string;
    user?: string;
  }>();

  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  // ── Check if we should show biometric enrollment prompt ──────────────────
  const showBiometricEnrollmentPrompt = async () => {
    if (Platform.OS === "web") return;

    try {
      // Only show once per install
      const alreadyShown = await AsyncStorage.getItem(BIOMETRIC_PROMPT_SHOWN_KEY);
      if (alreadyShown) return;

      const bioInfo = await getBiometricInfo();

      // Device has biometric hardware but user hasn't enrolled
      if (bioInfo.available && !bioInfo.enrolled) {
        await AsyncStorage.setItem(BIOMETRIC_PROMPT_SHOWN_KEY, "1");
        showToast({
          type: "info",
          message: `Enable ${bioInfo.label} for faster sign-in`,
          subMessage: "Go to Settings → Biometrics to set it up.",
          duration: 6000,
          action: {
            label: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:").catch(() => {
                // Fallback for Android
                Linking.openURL("android.settings.SECURITY_SETTINGS").catch(() => {});
              });
            },
          },
        });
        return;
      }

      // Device has biometrics enrolled but Remember Me is off — offer to enable
      if (bioInfo.available && bioInfo.enrolled) {
        const rememberMe = await getRememberMe();
        if (!rememberMe) {
          await AsyncStorage.setItem(BIOMETRIC_PROMPT_SHOWN_KEY, "1");
          showToast({
            type: "info",
            message: `Use ${bioInfo.label} for quick sign-in`,
            subMessage: "Enable Remember Me to sign in with one tap next time.",
            duration: 6000,
            action: {
              label: "Enable",
              onPress: async () => {
                await setRememberMe(true);
                showToast({
                  type: "success",
                  message: `${bioInfo.label} sign-in enabled ✅`,
                  subMessage: "You'll be able to sign in with one tap next time.",
                  duration: 3000,
                });
              },
            },
          });
        }
      }
    } catch {
      // Non-critical — silently ignore
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      console.log("[OAuth] Callback triggered:", {
        hasCode: !!params.code,
        hasState: !!params.state,
        hasError: !!params.error,
        hasSessionToken: !!params.sessionToken,
        hasUser: !!params.user,
      });

      try {
        // ── Case 1: Error ──────────────────────────────────────────────────
        if (params.error) {
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

        // ── Case 2: sessionToken from server redirect (primary web flow) ──
        if (params.sessionToken) {
          await Auth.setSessionToken(params.sessionToken);

          if (params.user) {
            try {
              const decoded =
                typeof atob !== "undefined"
                  ? atob(decodeURIComponent(params.user))
                  : Buffer.from(decodeURIComponent(params.user), "base64").toString("utf-8");
              const userData = JSON.parse(decoded);
              await Auth.setUserInfo({
                id: userData.id,
                openId: userData.openId,
                name: userData.name,
                email: userData.email,
                loginMethod: userData.loginMethod,
                lastSignedIn: new Date(userData.lastSignedIn || Date.now()),
              });
            } catch (err) {
              console.warn("[OAuth] Could not parse user data:", err);
            }
          }

          // Store biometric token if Remember Me is enabled
          const rememberMe = await getRememberMe();
          if (rememberMe && Platform.OS !== "web") {
            await storeBiometricToken(params.sessionToken);
          }

          // Clean URL
          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.history.replaceState({}, "", "/");
          }

          setStatus("success");

          // Show biometric enrollment prompt after a short delay
          setTimeout(() => showBiometricEnrollmentPrompt(), 1500);

          setTimeout(() => router.replace("/(tabs)"), 800);
          return;
        }

        // ── Case 3: Raw code + state (native deep link fallback) ──────────
        let code = params.code ?? null;
        let state = params.state ?? null;

        if (!code || !state) {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            try {
              const urlObj = new URL(initialUrl);
              code = urlObj.searchParams.get("code");
              state = urlObj.searchParams.get("state");
              const token = urlObj.searchParams.get("sessionToken");
              if (token) {
                await Auth.setSessionToken(token);
                const rememberMe = await getRememberMe();
                if (rememberMe && Platform.OS !== "web") {
                  await storeBiometricToken(token);
                }
                setStatus("success");
                setTimeout(() => showBiometricEnrollmentPrompt(), 1500);
                setTimeout(() => router.replace("/(tabs)"), 800);
                return;
              }
            } catch {
              const match = initialUrl.match(/[?&]code=([^&]+)/);
              const stateMatch = initialUrl.match(/[?&]state=([^&]+)/);
              if (match) code = decodeURIComponent(match[1]);
              if (stateMatch) state = decodeURIComponent(stateMatch[1]);
            }
          }
        }

        if (!code || !state) {
          setStatus("error");
          setErrorMessage("Authentication parameters missing. Please try signing in again.");
          return;
        }

        const result = await Api.exchangeOAuthCode(code, state);
        if (!result.sessionToken) throw new Error("No session token returned from server");

        await Auth.setSessionToken(result.sessionToken);

        if (result.user) {
          await Auth.setUserInfo({
            id: result.user.id,
            openId: result.user.openId,
            name: result.user.name,
            email: result.user.email,
            loginMethod: result.user.loginMethod,
            lastSignedIn: new Date(result.user.lastSignedIn || Date.now()),
          });
        }

        const rememberMe = await getRememberMe();
        if (rememberMe && Platform.OS !== "web") {
          await storeBiometricToken(result.sessionToken);
        }

        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.history.replaceState({}, "", "/");
        }

        setStatus("success");
        setTimeout(() => showBiometricEnrollmentPrompt(), 1500);
        setTimeout(() => router.replace("/(tabs)"), 800);
      } catch (err) {
        console.error("[OAuth] Callback error:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Authentication failed. Please try again."
        );
      }
    };

    handleCallback();
  }, []);

  if (status === "processing") {
    return <AuthSplash message="Signing you in…" subMessage="Setting up your dashboard" />;
  }

  if (status === "success") {
    return <AuthSplash message="Welcome to Clickeros AI! ✅" subMessage="Loading your dashboard…" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#7C3AED" }} edges={["top", "bottom", "left", "right"]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginBottom: 10 }}>
          Sign-in Failed
        </Text>
        <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 24, marginBottom: 32, maxWidth: 300 }}>
          {errorMessage || "Something went wrong. Please try again."}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#FFFFFF", borderRadius: 14, paddingHorizontal: 28, paddingVertical: 16, marginBottom: 14, width: "100%", maxWidth: 280, alignItems: "center" }}
          onPress={() => router.replace("/signup" as any)}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#7C3AED", fontSize: 16, fontWeight: "700" }}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ minHeight: 44, justifyContent: "center" }}
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.7}
        >
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "500" }}>
            Continue without signing in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
