import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR       = path.join(__dirname, "../app");
const COMPONENTS    = path.join(__dirname, "../components");
const SERVER_OAUTH  = path.join(__dirname, "../server/_core/oauth.ts");

// ── OAuth Server Fix ──────────────────────────────────────────────────────────
describe("OAuth Server — Redirect Fix", () => {
  const oauthContent = fs.readFileSync(SERVER_OAUTH, "utf-8");

  it("redirects to /oauth/callback with sessionToken instead of root URL", () => {
    expect(oauthContent).toContain("/oauth/callback?sessionToken=");
  });

  it("strips query params from the frontend URL before building redirect", () => {
    expect(oauthContent).toContain("cleanFrontendUrl");
    expect(oauthContent).toContain("split(\"?\")[0]");
  });

  it("encodes user data as base64 for the callback screen", () => {
    expect(oauthContent).toContain("Buffer.from");
    expect(oauthContent).toContain("base64");
    expect(oauthContent).toContain("userPayload");
  });

  it("redirects to /oauth/callback?error=auth_failed on failure", () => {
    expect(oauthContent).toContain("error=auth_failed");
  });

  it("logs the clean frontend URL for debugging", () => {
    expect(oauthContent).toContain("Redirecting to frontend callback");
  });
});

// ── OAuth Callback Screen ─────────────────────────────────────────────────────
describe("OAuth Callback Screen", () => {
  const callbackContent = fs.readFileSync(
    path.join(APP_DIR, "oauth/callback.tsx"),
    "utf-8"
  );

  it("uses AuthSplash during processing state", () => {
    expect(callbackContent).toContain("AuthSplash");
    expect(callbackContent).toContain("Signing you in");
  });

  it("uses AuthSplash during success state", () => {
    expect(callbackContent).toContain("Welcome to Clickeros AI");
    expect(callbackContent).toContain("Loading your dashboard");
  });

  it("has useRef guard to prevent double-execution", () => {
    expect(callbackContent).toContain("hasRun");
    expect(callbackContent).toContain("hasRun.current");
  });

  it("handles error from OAuth provider", () => {
    expect(callbackContent).toContain("access_denied");
    expect(callbackContent).toContain("auth_failed");
  });

  it("handles sessionToken from server redirect (primary web flow)", () => {
    expect(callbackContent).toContain("params.sessionToken");
    expect(callbackContent).toContain("Auth.setSessionToken");
  });

  it("cleans URL with window.history.replaceState", () => {
    expect(callbackContent).toContain("window.history.replaceState");
    expect(callbackContent).toContain('window.history.replaceState({}, "", "/")');
  });

  it("has retry button on error", () => {
    expect(callbackContent).toContain("Try Again");
    expect(callbackContent).toContain("/signup");
  });

  it("has continue without signing in option", () => {
    expect(callbackContent).toContain("Continue without signing in");
  });

  it("handles raw code+state as fallback", () => {
    expect(callbackContent).toContain("exchangeOAuthCode");
  });

  it("stores user info after successful auth", () => {
    expect(callbackContent).toContain("Auth.setUserInfo");
  });
});

// ── AuthSplash Component ──────────────────────────────────────────────────────
describe("AuthSplash Component", () => {
  const splashContent = fs.readFileSync(
    path.join(COMPONENTS, "auth-splash.tsx"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "auth-splash.tsx"))).toBe(true);
  });

  it("uses Animated for fade-in and scale entrance", () => {
    expect(splashContent).toContain("Animated.Value");
    expect(splashContent).toContain("Animated.parallel");
    expect(splashContent).toContain("Animated.timing");
    expect(splashContent).toContain("Animated.spring");
  });

  it("shows the Clickeros logo", () => {
    expect(splashContent).toContain("icon.png");
    expect(splashContent).toContain("Image");
  });

  it("shows the app name", () => {
    expect(splashContent).toContain("Clickeros AI");
  });

  it("shows ActivityIndicator spinner", () => {
    expect(splashContent).toContain("ActivityIndicator");
  });

  it("accepts customizable message and subMessage props", () => {
    expect(splashContent).toContain("message");
    expect(splashContent).toContain("subMessage");
  });

  it("uses violet brand color (#7C3AED)", () => {
    expect(splashContent).toContain("#7C3AED");
  });

  it("uses useNativeDriver for smooth animations", () => {
    expect(splashContent).toContain("useNativeDriver: true");
  });
});

// ── Root Layout — Session Expiry Handler ──────────────────────────────────────
describe("Root Layout — Session Expiry Handler", () => {
  const layoutContent = fs.readFileSync(path.join(APP_DIR, "_layout.tsx"), "utf-8");

  it("imports TRPCClientError for error type checking", () => {
    expect(layoutContent).toContain("TRPCClientError");
  });

  it("imports Auth for session cleanup", () => {
    expect(layoutContent).toContain("import * as Auth");
  });

  it("has retry: false for UNAUTHORIZED errors in queries", () => {
    expect(layoutContent).toContain("UNAUTHORIZED");
    expect(layoutContent).toContain("return false");
  });

  it("subscribes to QueryCache for global error detection", () => {
    expect(layoutContent).toContain("getQueryCache().subscribe");
  });

  it("subscribes to MutationCache for mutation error detection", () => {
    expect(layoutContent).toContain("getMutationCache().subscribe");
  });

  it("clears session token on UNAUTHORIZED", () => {
    expect(layoutContent).toContain("Auth.removeSessionToken");
  });

  it("clears user info on UNAUTHORIZED", () => {
    expect(layoutContent).toContain("Auth.clearUserInfo");
  });

  it("clears query cache on UNAUTHORIZED", () => {
    expect(layoutContent).toContain("client.clear()");
  });

  it("redirects to /signup on session expiry", () => {
    expect(layoutContent).toContain("/signup");
    expect(layoutContent).toContain("window.location.href");
  });

  it("uses sessionExpiredRef to prevent redirect loops", () => {
    expect(layoutContent).toContain("sessionExpiredRef");
    expect(layoutContent).toContain("sessionExpiredRef.current = true");
  });

  it("resets the flag after 5 seconds to allow re-auth", () => {
    expect(layoutContent).toContain("5000");
    expect(layoutContent).toContain("sessionExpiredRef.current = false");
  });

  it("has SessionGuard component rendered inside providers", () => {
    expect(layoutContent).toContain("SessionGuard");
    expect(layoutContent).toContain("<SessionGuard />");
  });

  it("uses fullScreenModal for oauth/callback to prevent back-swipe", () => {
    expect(layoutContent).toContain("fullScreenModal");
    expect(layoutContent).toContain("oauth/callback");
  });
});
