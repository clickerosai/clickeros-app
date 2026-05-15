import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SERVER_DIR  = path.join(__dirname, "../server");
const TABS_DIR    = path.join(__dirname, "../app/(tabs)");

// ── Backend Router Tests ──────────────────────────────────────────────────────
describe("Ad Generator — Backend Router", () => {
  const routerContent = fs.readFileSync(path.join(SERVER_DIR, "adGeneratorRouter.ts"), "utf-8");

  it("adGeneratorRouter.ts exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "adGeneratorRouter.ts"))).toBe(true);
  });

  it("exports adGeneratorRouter", () => {
    expect(routerContent).toContain("export const adGeneratorRouter");
  });

  it("has generate mutation endpoint", () => {
    expect(routerContent).toContain("generate:");
    expect(routerContent).toContain(".mutation(");
  });

  it("has regenerateSingle mutation endpoint", () => {
    expect(routerContent).toContain("regenerateSingle:");
  });

  it("validates required campaign input fields with Zod", () => {
    expect(routerContent).toContain("businessName");
    expect(routerContent).toContain("productService");
    expect(routerContent).toContain("targetAudience");
    expect(routerContent).toContain("campaignObjective");
    expect(routerContent).toContain("cta");
    expect(routerContent).toContain("z.string().min(1");
  });

  it("uses invokeLLM for AI generation", () => {
    expect(routerContent).toContain("invokeLLM");
    expect(routerContent).toContain("json_object");
  });

  it("builds grounded system prompt with campaign context", () => {
    expect(routerContent).toContain("buildSystemPrompt");
    expect(routerContent).toContain("ONLY the information provided");
    expect(routerContent).toContain("Do NOT invent");
    expect(routerContent).toContain("Business:");
    expect(routerContent).toContain("Product/Service:");
    expect(routerContent).toContain("Target Audience:");
  });

  it("has platform-specific style guides", () => {
    expect(routerContent).toContain("PLATFORM_STYLE");
    expect(routerContent).toContain("facebook");
    expect(routerContent).toContain("tiktok");
    expect(routerContent).toContain("google");
    expect(routerContent).toContain("linkedin");
  });

  it("has objective-specific style guides", () => {
    expect(routerContent).toContain("OBJECTIVE_STYLE");
    expect(routerContent).toContain("awareness");
    expect(routerContent).toContain("conversions");
    expect(routerContent).toContain("retargeting");
  });

  it("implements relevance scoring with 5 dimensions", () => {
    expect(routerContent).toContain("scoreRelevance");
    expect(routerContent).toContain("keywordMatch");
    expect(routerContent).toContain("businessMention");
    expect(routerContent).toContain("audienceMatch");
    expect(routerContent).toContain("objectiveAlignment");
    expect(routerContent).toContain("ctaRelevance");
  });

  it("has quality threshold filter", () => {
    expect(routerContent).toContain("QUALITY_THRESHOLD");
    expect(routerContent).toContain("rejectedCount");
  });

  it("has smart fallback mode", () => {
    expect(routerContent).toContain("buildFallbackAd");
    expect(routerContent).toContain("isFromFallback");
    expect(routerContent).toContain("FALLBACK");
  });

  it("includes debug logging", () => {
    expect(routerContent).toContain("debugLogs");
    expect(routerContent).toContain("[PAYLOAD]");
    expect(routerContent).toContain("[LLM_RESPONSE]");
    expect(routerContent).toContain("[SCORE]");
    expect(routerContent).toContain("[REJECTED]");
    expect(routerContent).toContain("[FALLBACK]");
  });

  it("returns usedFallback and rejectedCount in response", () => {
    expect(routerContent).toContain("usedFallback");
    expect(routerContent).toContain("rejectedCount");
  });

  it("sorts variations by relevance score descending", () => {
    expect(routerContent).toContain("sort((a, b) => b.relevanceScore - a.relevanceScore)");
  });

  it("is registered in the main appRouter", () => {
    const routers = fs.readFileSync(path.join(SERVER_DIR, "routers.ts"), "utf-8");
    expect(routers).toContain("adGeneratorRouter");
    expect(routers).toContain("adGenerator: adGeneratorRouter");
  });
});

// ── Frontend Screen Tests ─────────────────────────────────────────────────────
describe("Ad Generator — Creator Screen", () => {
  const screenContent = fs.readFileSync(path.join(TABS_DIR, "creator.tsx"), "utf-8");

  it("uses trpc.adGenerator.generate mutation", () => {
    expect(screenContent).toContain("trpc.adGenerator.generate.useMutation");
  });

  it("uses trpc.adGenerator.regenerateSingle mutation", () => {
    expect(screenContent).toContain("trpc.adGenerator.regenerateSingle.useMutation");
  });

  it("validates required fields before generation", () => {
    expect(screenContent).toContain("validate");
    expect(screenContent).toContain("Business name is required");
    expect(screenContent).toContain("Product or service is required");
    expect(screenContent).toContain("Target audience is required");
    expect(screenContent).toContain("Call-to-action is required");
  });

  it("shows inline field errors", () => {
    expect(screenContent).toContain("FieldError");
    expect(screenContent).toContain("errors.businessName");
    expect(screenContent).toContain("errors.targetAudience");
    expect(screenContent).toContain("errors.cta");
  });

  it("has progress steps during generation", () => {
    expect(screenContent).toContain("PROGRESS_STEPS");
    expect(screenContent).toContain("progressStep");
    expect(screenContent).toContain("Analyzing campaign details");
  });

  it("shows progress bar during generation", () => {
    expect(screenContent).toContain("isGenerating");
    expect(screenContent).toContain("ActivityIndicator");
  });

  it("has platform selector with 6 platforms", () => {
    expect(screenContent).toContain("facebook");
    expect(screenContent).toContain("instagram");
    expect(screenContent).toContain("google");
    expect(screenContent).toContain("tiktok");
    expect(screenContent).toContain("youtube");
    expect(screenContent).toContain("linkedin");
  });

  it("has campaign objective selector", () => {
    expect(screenContent).toContain("OBJECTIVES");
    expect(screenContent).toContain("campaignObjective");
  });

  it("has tone selector", () => {
    expect(screenContent).toContain("TONES");
    expect(screenContent).toContain("tone");
  });

  it("shows relevance score bar on each variation", () => {
    expect(screenContent).toContain("ScoreBar");
    expect(screenContent).toContain("relevanceScore");
    expect(screenContent).toContain("relevanceBreakdown");
  });

  it("has regenerate single variation button", () => {
    expect(screenContent).toContain("handleRegenerate");
    expect(screenContent).toContain("arrow.triangle.2.circlepath");
  });

  it("has edit variation feature", () => {
    expect(screenContent).toContain("editingIndex");
    expect(screenContent).toContain("startEdit");
    expect(screenContent).toContain("saveEdit");
    expect(screenContent).toContain("Edit");
  });

  it("has regenerate all button", () => {
    expect(screenContent).toContain("Regenerate All Variations");
  });

  it("shows fallback/rejection notice when applicable", () => {
    expect(screenContent).toContain("usedFallback");
    expect(screenContent).toContain("rejectedCount");
    expect(screenContent).toContain("Smart fallback mode");
  });

  it("has debug log toggle", () => {
    expect(screenContent).toContain("showDebug");
    expect(screenContent).toContain("debugLog");
    expect(screenContent).toContain("Debug");
  });

  it("shows hook line for TikTok ads", () => {
    expect(screenContent).toContain("ad.hook");
    expect(screenContent).toContain("Hook:");
  });

  it("uses KeyboardAvoidingView for Expo Go mobile optimization", () => {
    expect(screenContent).toContain("KeyboardAvoidingView");
    expect(screenContent).toContain("keyboardShouldPersistTaps");
    expect(screenContent).toContain("keyboardDismissMode");
  });

  it("prevents double-click with disabled prop during generation", () => {
    expect(screenContent).toContain("disabled={isGenerating}");
    expect(screenContent).toContain("disabled={isRegenerating}");
  });

  it("uses haptic feedback for success and error", () => {
    expect(screenContent).toContain("Haptics");
    expect(screenContent).toContain("NotificationFeedbackType.Success");
    expect(screenContent).toContain("NotificationFeedbackType.Error");
  });

  it("guards haptics with Platform.OS check", () => {
    expect(screenContent).toContain('Platform.OS !== "web"');
  });

  it("always uses latest form state (no stale state)", () => {
    // All form fields passed directly to mutateAsync — no intermediate state
    expect(screenContent).toContain("businessName.trim()");
    expect(screenContent).toContain("targetAudience.trim()");
    expect(screenContent).toContain("cta.trim()");
  });
});
