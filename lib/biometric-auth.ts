/**
 * Biometric Authentication Utility
 *
 * Provides Face ID / fingerprint re-authentication for session renewal.
 * Used when a session expires to let users re-auth without the full OAuth flow.
 *
 * Usage:
 *   const { canUseBiometrics, authenticateWithBiometrics } = useBiometricAuth();
 */
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";

// Key for storing the biometric-protected refresh token
const BIOMETRIC_TOKEN_KEY = "@clickeros:biometric_token";
const REMEMBER_ME_KEY = "@clickeros:remember_me";

// ── Biometric Availability ────────────────────────────────────────────────────

export interface BiometricInfo {
  available: boolean;
  enrolled: boolean;
  type: "face" | "fingerprint" | "iris" | "none";
  label: string; // "Face ID", "Touch ID", "Fingerprint", etc.
}

export async function getBiometricInfo(): Promise<BiometricInfo> {
  // Biometrics only work on native
  if (Platform.OS === "web") {
    return { available: false, enrolled: false, type: "none", label: "None" };
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return { available: false, enrolled: false, type: "none", label: "None" };
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Determine the primary biometric type
    let type: BiometricInfo["type"] = "none";
    let label = "Biometrics";

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      type = "face";
      label = Platform.OS === "ios" ? "Face ID" : "Face Recognition";
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      type = "fingerprint";
      label = Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      type = "iris";
      label = "Iris Scan";
    }

    return { available: hasHardware, enrolled: isEnrolled, type, label };
  } catch {
    return { available: false, enrolled: false, type: "none", label: "None" };
  }
}

// ── Authenticate with Biometrics ──────────────────────────────────────────────

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  cancelled?: boolean;
}

export async function authenticateWithBiometrics(
  promptMessage = "Authenticate to continue"
): Promise<BiometricAuthResult> {
  if (Platform.OS === "web") {
    return { success: false, error: "Biometrics not supported on web" };
  }

  try {
    const info = await getBiometricInfo();

    if (!info.available) {
      return { success: false, error: "No biometric hardware available" };
    }

    if (!info.enrolled) {
      return { success: false, error: `No ${info.label} enrolled on this device` };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false, // Allow passcode fallback
    });

    if (result.success) {
      return { success: true };
    }

    if (result.error === "user_cancel" || result.error === "system_cancel") {
      return { success: false, cancelled: true };
    }

    return { success: false, error: result.error ?? "Authentication failed" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Biometric authentication error",
    };
  }
}

// ── Biometric Token Storage ───────────────────────────────────────────────────

/**
 * Store a session token protected by biometrics.
 * The token is encrypted in the device keychain/keystore.
 */
export async function storeBiometricToken(token: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY, token, {
      requireAuthentication: false, // We handle auth ourselves
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (err) {
    console.warn("[Biometric] Failed to store token:", err);
  }
}

/**
 * Retrieve the biometric-protected session token.
 * Returns null if not stored or if retrieval fails.
 */
export async function getBiometricToken(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  try {
    return await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Delete the biometric-protected session token (e.g., on logout).
 */
export async function clearBiometricToken(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
  } catch {}
}

// ── Remember Me Preference ────────────────────────────────────────────────────

export async function setRememberMe(value: boolean): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(REMEMBER_ME_KEY, value ? "1" : "0");
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(REMEMBER_ME_KEY, value ? "1" : "0");
  } catch {}
}

export async function getRememberMe(): Promise<boolean> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(REMEMBER_ME_KEY) === "1";
    }
    return false;
  }
  try {
    const val = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
    return val === "1";
  } catch {
    return false;
  }
}

// ── React Hook ────────────────────────────────────────────────────────────────

export function useBiometricAuth() {
  const [biometricInfo, setBiometricInfo] = useState<BiometricInfo>({
    available: false,
    enrolled: false,
    type: "none",
    label: "None",
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    getBiometricInfo().then(setBiometricInfo);
  }, []);

  const canUseBiometrics = biometricInfo.available && biometricInfo.enrolled;

  const authenticate = useCallback(
    async (promptMessage?: string): Promise<BiometricAuthResult> => {
      setIsAuthenticating(true);
      try {
        const result = await authenticateWithBiometrics(
          promptMessage ?? `Use ${biometricInfo.label} to sign in`
        );
        return result;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [biometricInfo.label]
  );

  return {
    biometricInfo,
    canUseBiometrics,
    isAuthenticating,
    authenticate,
    storeBiometricToken,
    getBiometricToken,
    clearBiometricToken,
  };
}
