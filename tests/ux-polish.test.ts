import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR  = path.join(__dirname, "../app");
const TABS_DIR = path.join(__dirname, "../app/(tabs)");

// ── Sign Out Everywhere ───────────────────────────────────────────────────────
describe("Settings — Sign Out Everywhere", () => {
  const settingsContent = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");

  it("imports clearBiometricToken", () => {
    expect(settingsContent).toContain("clearBiometricToken");
  });

  it("imports Auth for session cleanup", () => {
    expect(settingsContent).toContain("import * as Auth");
  });

  it("imports useToast for success notification", () => {
    expect(settingsContent).toContain("useToast");
    expect(settingsContent).toContain("showToast");
  });

  it("has Sign Out (this device) button", () => {
    expect(settingsContent).toContain("Sign Out");
    expect(settingsContent).toContain("Sign out of this device only");
  });

  it("has Sign Out Everywhere button", () => {
    expect(settingsContent).toContain("Sign Out Everywhere");
    expect(settingsContent).toContain("Clears all sessions, biometric sign-in, and keychain tokens");
  });

  it("Sign Out Everywhere clears biometric token", () => {
    expect(settingsContent).toContain("clearBiometricToken()");
  });

  it("Sign Out Everywhere clears session token", () => {
    expect(settingsContent).toContain("Auth.removeSessionToken()");
  });

  it("Sign Out Everywhere clears user info", () => {
    expect(settingsContent).toContain("Auth.clearUserInfo()");
  });

  it("shows confirmation alert before signing out", () => {
    expect(settingsContent).toContain("Alert.alert");
    expect(settingsContent).toContain("style: \"destructive\"");
  });

  it("shows success toast after sign out everywhere", () => {
    expect(settingsContent).toContain("Signed out everywhere");
    expect(settingsContent).toContain("All sessions cleared");
  });

  it("shows loading state during sign out", () => {
    expect(settingsContent).toContain("isSigningOut");
    expect(settingsContent).toContain("isSigningOutEverywhere");
    expect(settingsContent).toContain("ActivityIndicator");
  });

  it("redirects to signup after sign out", () => {
    expect(settingsContent).toContain("/signup");
    expect(settingsContent).toContain("router.replace");
  });

  it("uses heavy haptic for Sign Out Everywhere", () => {
    expect(settingsContent).toContain("ImpactFeedbackStyle.Heavy");
  });

  it("uses tRPC logout mutation for server-side session invalidation", () => {
    expect(settingsContent).toContain("trpc.auth.logout.useMutation");
    expect(settingsContent).toContain("logoutMutation.mutateAsync");
  });
});

// ── Campaign Toast Notifications ──────────────────────────────────────────────
describe("Campaigns Screen — Toast Notifications", () => {
  const campaignsContent = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");

  it("imports useToast", () => {
    expect(campaignsContent).toContain("useToast");
    expect(campaignsContent).toContain("showToast");
  });

  it("shows success toast when campaign is paused", () => {
    expect(campaignsContent).toContain("Campaign paused ✅");
  });

  it("shows success toast when campaign is resumed", () => {
    expect(campaignsContent).toContain("Campaign resumed ✅");
  });

  it("shows info toast when optimization starts", () => {
    expect(campaignsContent).toContain("Optimizing campaign");
    expect(campaignsContent).toContain("type: \"info\"");
  });

  it("shows success toast when optimization completes", () => {
    expect(campaignsContent).toContain("Optimization applied ✅");
    expect(campaignsContent).toContain("Budget reallocated");
  });

  it("shows error toast when pause/resume fails", () => {
    expect(campaignsContent).toContain("Failed to pause campaign");
    expect(campaignsContent).toContain("Failed to resume campaign");
  });

  it("shows error toast when optimization fails", () => {
    expect(campaignsContent).toContain("Optimization failed");
  });

  it("has Retry action button on error toasts", () => {
    expect(campaignsContent).toContain("label: \"Retry\"");
  });

  it("has View changes action on optimization success toast", () => {
    expect(campaignsContent).toContain("View changes");
  });

  it("uses optimistic status updates for instant UI feedback", () => {
    expect(campaignsContent).toContain("localStatuses");
    expect(campaignsContent).toContain("setLocalStatuses");
  });

  it("reverts optimistic update on failure", () => {
    expect(campaignsContent).toContain("currentStatus");
    expect(campaignsContent).toContain("Revert optimistic update");
  });

  it("tracks processing state per campaign", () => {
    expect(campaignsContent).toContain("processingIds");
    expect(campaignsContent).toContain("setProcessingIds");
  });

  it("shows spinner on action buttons while processing", () => {
    expect(campaignsContent).toContain("isProcessing");
    expect(campaignsContent).toContain("isOptimizing");
    expect(campaignsContent).toContain("ActivityIndicator");
  });

  it("uses haptic feedback for pause/resume", () => {
    expect(campaignsContent).toContain("ImpactFeedbackStyle.Light");
  });

  it("uses haptic feedback for optimization", () => {
    expect(campaignsContent).toContain("ImpactFeedbackStyle.Medium");
  });
});

// ── Biometric Enrollment Prompt ───────────────────────────────────────────────
describe("OAuth Callback — Biometric Enrollment Prompt", () => {
  const callbackContent = fs.readFileSync(
    path.join(APP_DIR, "oauth/callback.tsx"),
    "utf-8"
  );

  it("imports getBiometricInfo", () => {
    expect(callbackContent).toContain("getBiometricInfo");
  });

  it("imports useToast for enrollment prompt", () => {
    expect(callbackContent).toContain("useToast");
    expect(callbackContent).toContain("showToast");
  });

  it("shows enrollment prompt for devices with hardware but no enrollment", () => {
    expect(callbackContent).toContain("available && !bioInfo.enrolled");
    expect(callbackContent).toContain("for faster sign-in");
  });

  it("shows Remember Me prompt for enrolled devices with Remember Me off", () => {
    expect(callbackContent).toContain("available && bioInfo.enrolled");
    expect(callbackContent).toContain("Use");
    expect(callbackContent).toContain("for quick sign-in");
  });

  it("links to device settings for biometric enrollment", () => {
    expect(callbackContent).toContain("app-settings:");
    expect(callbackContent).toContain("Linking.openURL");
    expect(callbackContent).toContain("Open Settings");
  });

  it("only shows the prompt once per install", () => {
    expect(callbackContent).toContain("BIOMETRIC_PROMPT_SHOWN_KEY");
    expect(callbackContent).toContain("alreadyShown");
    expect(callbackContent).toContain("AsyncStorage.setItem");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(callbackContent).toContain('Platform.OS === "web"');
  });

  it("shows prompt after successful sign-in with delay", () => {
    expect(callbackContent).toContain("showBiometricEnrollmentPrompt");
    expect(callbackContent).toContain("1500");
  });

  it("has Enable action button that sets Remember Me to true", () => {
    expect(callbackContent).toContain("label: \"Enable\"");
    expect(callbackContent).toContain("setRememberMe(true)");
  });

  it("shows success toast after enabling Remember Me from prompt", () => {
    expect(callbackContent).toContain("sign-in enabled ✅");
  });
});
