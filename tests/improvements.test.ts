import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const TABS_DIR  = path.join(__dirname, "../app/(tabs)");
const SERVER    = path.join(__dirname, "../server");
const HOOKS_DIR = path.join(__dirname, "../hooks");

// ── Step 1: Pull-to-refresh on Analytics ─────────────────────────────────────
describe("Step 1 — Pull-to-Refresh on Analytics Screen", () => {
  const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");

  it("imports RefreshControl", () => expect(analytics).toContain("RefreshControl"));
  it("imports expo-haptics", () => expect(analytics).toContain("expo-haptics"));
  it("has onRefresh callback", () => expect(analytics).toContain("onRefresh"));
  it("passes RefreshControl to ScrollView", () => expect(analytics).toContain("refreshControl="));
  it("shows last updated timestamp", () => expect(analytics).toContain("lastUpdated"));
  it("uses violet brand color for spinner", () => expect(analytics).toContain("tintColor"));
  it("triggers haptic on refresh start", () => expect(analytics).toContain("ImpactFeedbackStyle.Medium"));
  it("triggers success haptic on complete", () => expect(analytics).toContain("NotificationFeedbackType.Success"));
  it("guards haptics for web compatibility", () => expect(analytics).toContain('Platform.OS !== "web"'));
  it("dims metrics while refreshing", () => expect(analytics).toContain("isRefreshing ? 0.6 : 1"));
});

// ── Step 2: tRPC Backend Router ───────────────────────────────────────────────
describe("Step 2 — tRPC Dashboard Router", () => {
  it("dashboardRouter.ts exists", () => {
    expect(fs.existsSync(path.join(SERVER, "dashboardRouter.ts"))).toBe(true);
  });

  it("exports dashboardRouter", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("export const dashboardRouter");
  });

  it("has stats endpoint", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("stats:");
  });

  it("has campaigns endpoint", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("campaigns:");
  });

  it("has analyticsMetrics endpoint", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("analyticsMetrics:");
  });

  it("has channelBreakdown endpoint", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("channelBreakdown:");
  });

  it("has topContent endpoint", () => {
    const router = fs.readFileSync(path.join(SERVER, "dashboardRouter.ts"), "utf-8");
    expect(router).toContain("topContent:");
  });

  it("routers.ts registers dashboardRouter", () => {
    const routers = fs.readFileSync(path.join(SERVER, "routers.ts"), "utf-8");
    expect(routers).toContain("dashboardRouter");
    expect(routers).toContain("dashboard: dashboardRouter");
  });

  it("Dashboard screen uses trpc.dashboard.stats", () => {
    const dashboard = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");
    expect(dashboard).toContain("trpc.dashboard.stats.useQuery");
  });

  it("Dashboard screen uses trpc.dashboard.campaigns", () => {
    const dashboard = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");
    expect(dashboard).toContain("trpc.dashboard.campaigns.useQuery");
  });

  it("Campaigns screen uses trpc.dashboard.campaigns", () => {
    const campaigns = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");
    expect(campaigns).toContain("trpc.dashboard.campaigns.useQuery");
  });

  it("Analytics screen uses trpc.dashboard.analyticsMetrics", () => {
    const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");
    expect(analytics).toContain("trpc.dashboard.analyticsMetrics.useQuery");
  });

  it("Analytics screen uses trpc.dashboard.channelBreakdown", () => {
    const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");
    expect(analytics).toContain("trpc.dashboard.channelBreakdown.useQuery");
  });

  it("Analytics screen uses trpc.dashboard.topContent", () => {
    const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");
    expect(analytics).toContain("trpc.dashboard.topContent.useQuery");
  });

  it("all screens use query.refetch() for pull-to-refresh", () => {
    const dashboard = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");
    const campaigns = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");
    const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");
    expect(dashboard).toContain(".refetch()");
    expect(campaigns).toContain(".refetch()");
    expect(analytics).toContain(".refetch()");
  });

  it("screens show skeleton loading states", () => {
    const dashboard = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");
    const campaigns = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");
    const analytics = fs.readFileSync(path.join(TABS_DIR, "analytics.tsx"), "utf-8");
    expect(dashboard).toContain("isLoading");
    expect(campaigns).toContain("isLoading");
    expect(analytics).toContain("isLoading");
  });
});
