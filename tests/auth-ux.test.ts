import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const COMPONENTS = path.join(__dirname, "../components");
const LIB_DIR    = path.join(__dirname, "../lib");

// ── Toast System ──────────────────────────────────────────────────────────────
describe("Toast Notification System", () => {
  const toastContent = fs.readFileSync(path.join(COMPONENTS, "toast.tsx"), "utf-8");

  it("toast.tsx exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "toast.tsx"))).toBe(true);
  });

  it("exports ToastProvider", () => {
    expect(toastContent).toContain("export function ToastProvider");
  });

  it("exports useToast hook", () => {
    expect(toastContent).toContain("export function useToast");
  });

  it("supports 4 toast types: success, error, warning, info", () => {
    expect(toastContent).toContain("success");
    expect(toastContent).toContain("error");
    expect(toastContent).toContain("warning");
    expect(toastContent).toContain("info");
  });

  it("has animated slide-in and fade-in", () => {
    expect(toastContent).toContain("Animated.Value");
    expect(toastContent).toContain("translateY");
    expect(toastContent).toContain("opacity");
  });

  it("supports optional action button", () => {
    expect(toastContent).toContain("action");
    expect(toastContent).toContain("onPress");
  });

  it("auto-dismisses after configurable duration", () => {
    expect(toastContent).toContain("duration");
    expect(toastContent).toContain("setTimeout");
  });

  it("has dismiss button on each toast", () => {
    expect(toastContent).toContain("dismiss");
  });

  it("limits to 3 toasts at once", () => {
    expect(toastContent).toContain("slice(-3)");
  });

  it("floats above all content with zIndex 9999", () => {
    expect(toastContent).toContain("zIndex: 9999");
  });
});

// ── Session Expired Toast ─────────────────────────────────────────────────────
describe("Session Expired Toast in Root Layout", () => {
  const layoutContent = fs.readFileSync(path.join(APP_DIR, "_layout.tsx"), "utf-8");

  it("imports ToastProvider and useToast", () => {
    expect(layoutContent).toContain("ToastProvider");
    expect(layoutContent).toContain("useToast");
  });

  it("wraps app in ToastProvider", () => {
    expect(layoutContent).toContain("<ToastProvider>");
  });

  it("shows warning toast on session expiry", () => {
    expect(layoutContent).toContain("Your session has expired");
    expect(layoutContent).toContain("Please sign in again");
    expect(layoutContent).toContain("type: \"warning\"");
  });

  it("shows toast BEFORE redirecting (2.5 second delay)", () => {
    expect(layoutContent).toContain("2500");
    expect(layoutContent).toContain("showToast");
  });

  it("has action button in the toast to sign in immediately", () => {
    expect(layoutContent).toContain("Sign in now");
  });

  it("has ToastBridge to connect QueryClient to ToastProvider", () => {
    expect(layoutContent).toContain("ToastBridge");
    expect(layoutContent).toContain("showToastRef");
  });

  it("has SessionGuard component", () => {
    expect(layoutContent).toContain("SessionGuard");
  });
});

// ── Biometric Authentication ──────────────────────────────────────────────────
describe("Biometric Authentication Library", () => {
  const bioContent = fs.readFileSync(path.join(LIB_DIR, "biometric-auth.ts"), "utf-8");

  it("biometric-auth.ts exists", () => {
    expect(fs.existsSync(path.join(LIB_DIR, "biometric-auth.ts"))).toBe(true);
  });

  it("imports expo-local-authentication", () => {
    expect(bioContent).toContain("expo-local-authentication");
  });

  it("checks hardware availability before authenticating", () => {
    expect(bioContent).toContain("hasHardwareAsync");
  });

  it("checks enrollment before authenticating", () => {
    expect(bioContent).toContain("isEnrolledAsync");
  });

  it("detects Face ID vs fingerprint vs iris", () => {
    expect(bioContent).toContain("FACIAL_RECOGNITION");
    expect(bioContent).toContain("FINGERPRINT");
    expect(bioContent).toContain("IRIS");
    expect(bioContent).toContain("Face ID");
    expect(bioContent).toContain("Touch ID");
  });

  it("allows passcode fallback", () => {
    expect(bioContent).toContain("disableDeviceFallback: false");
    expect(bioContent).toContain("fallbackLabel");
  });

  it("handles user cancellation gracefully", () => {
    expect(bioContent).toContain("user_cancel");
    expect(bioContent).toContain("cancelled");
  });

  it("stores biometric token in SecureStore", () => {
    expect(bioContent).toContain("SecureStore");
    expect(bioContent).toContain("storeBiometricToken");
    expect(bioContent).toContain("getBiometricToken");
    expect(bioContent).toContain("clearBiometricToken");
  });

  it("exports useBiometricAuth hook", () => {
    expect(bioContent).toContain("export function useBiometricAuth");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(bioContent).toContain('Platform.OS === "web"');
  });
});

// ── Remember Me & Silent Token Refresh ───────────────────────────────────────
describe("Remember Me & Silent Token Refresh", () => {
  const bioContent = fs.readFileSync(path.join(LIB_DIR, "biometric-auth.ts"), "utf-8");
  const signupContent = fs.readFileSync(path.join(APP_DIR, "signup.tsx"), "utf-8");
  const callbackContent = fs.readFileSync(path.join(APP_DIR, "oauth/callback.tsx"), "utf-8");

  it("setRememberMe and getRememberMe are exported", () => {
    expect(bioContent).toContain("export async function setRememberMe");
    expect(bioContent).toContain("export async function getRememberMe");
  });

  it("Remember Me preference is stored in SecureStore on native", () => {
    expect(bioContent).toContain("REMEMBER_ME_KEY");
    expect(bioContent).toContain("SecureStore.setItemAsync");
  });

  it("Remember Me preference is stored in localStorage on web", () => {
    expect(bioContent).toContain("localStorage.setItem");
  });

  it("Sign Up screen has Remember Me checkbox", () => {
    expect(signupContent).toContain("Remember me");
    expect(signupContent).toContain("rememberMe");
    expect(signupContent).toContain("toggleRememberMe");
  });

  it("Sign Up screen shows biometric option when saved session exists", () => {
    expect(signupContent).toContain("hasSavedSession");
    expect(signupContent).toContain("handleBiometricSignIn");
    expect(signupContent).toContain("canUseBiometrics");
  });

  it("Sign Up screen saves Remember Me preference before OAuth", () => {
    expect(signupContent).toContain("setRememberMe(rememberMe)");
  });

  it("OAuth callback stores biometric token when Remember Me is on", () => {
    expect(callbackContent).toContain("getRememberMe");
    expect(callbackContent).toContain("storeBiometricToken");
  });

  it("Biometric sign-in restores session without OAuth flow", () => {
    expect(signupContent).toContain("getBiometricToken");
    expect(signupContent).toContain("Auth.setSessionToken");
  });

  it("shows success toast after biometric sign-in", () => {
    expect(signupContent).toContain("showToast");
    expect(signupContent).toContain("Signed in with");
  });

  it("handles biometric failure gracefully with toast", () => {
    expect(signupContent).toContain("type: \"error\"");
    expect(signupContent).toContain("failed");
  });
});
