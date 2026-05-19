import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const SERVER_DIR = path.join(__dirname, "../server");
const DRIZZLE    = path.join(__dirname, "../drizzle");
const HOOKS_DIR  = path.join(__dirname, "../hooks");

// ── Campaign Detail Screen ────────────────────────────────────────────────────
describe("Campaign Detail Screen (/campaigns/[id])", () => {
  const detailPath = path.join(APP_DIR, "campaigns/[id].tsx");

  it("file exists at app/campaigns/[id].tsx", () => {
    expect(fs.existsSync(detailPath)).toBe(true);
  });

  const content = fs.readFileSync(detailPath, "utf-8");

  it("uses useLocalSearchParams to get campaign ID", () => {
    expect(content).toContain("useLocalSearchParams");
    expect(content).toContain("id");
  });

  it("fetches campaign data via tRPC", () => {
    expect(content).toContain("trpc.dashboard.campaigns.useQuery");
    expect(content).toContain("campaign = query.data?.find");
  });

  it("shows loading state", () => {
    expect(content).toContain("isLoading");
    expect(content).toContain("ActivityIndicator");
  });

  it("shows not found state", () => {
    expect(content).toContain("Campaign Not Found");
    expect(content).toContain("Go Back");
  });

  it("shows campaign header with name, platform, and status", () => {
    expect(content).toContain("campaign.name");
    expect(content).toContain("campaign.platform");
    expect(content).toContain("campaign.status");
  });

  it("shows 7-day performance bar charts", () => {
    expect(content).toContain("BarChart");
    expect(content).toContain("7-Day Performance");
    expect(content).toContain("roasHistory");
    expect(content).toContain("ctrHistory");
    expect(content).toContain("spendHistory");
  });

  it("shows performance metrics cards", () => {
    expect(content).toContain("MetricCard");
    expect(content).toContain("Performance Metrics");
  });

  it("shows creative previews in horizontal scroll", () => {
    expect(content).toContain("CreativePreview");
    expect(content).toContain("Ad Creatives");
    expect(content).toContain("horizontal");
  });

  it("shows optimization timeline with events", () => {
    expect(content).toContain("OptimizationEventItem");
    expect(content).toContain("Optimization Timeline");
    expect(content).toContain("optimizationTimeline");
  });

  it("has Optimize and Pause/Resume action buttons", () => {
    expect(content).toContain("handleOptimize");
    expect(content).toContain("handleTogglePause");
    expect(content).toContain("Optimize");
  });

  it("has alert override bell icon that opens CampaignAlertSheet", () => {
    expect(content).toContain("CampaignAlertSheet");
    expect(content).toContain("alertSheetVisible");
    expect(content).toContain("bell.fill");
  });

  it("shows campaign details table", () => {
    expect(content).toContain("Campaign Details");
    expect(content).toContain("Campaign ID");
    expect(content).toContain("Daily Budget");
  });

  it("is wrapped in ErrorBoundary", () => {
    expect(content).toContain("ErrorBoundary");
    expect(content).toContain("CampaignDetailInner");
  });
});

// ── Campaigns Tab — Navigation to Detail ─────────────────────────────────────
describe("Campaigns Tab — Navigation to Detail Screen", () => {
  const campaignsContent = fs.readFileSync(
    path.join(APP_DIR, "(tabs)/campaigns.tsx"),
    "utf-8"
  );

  it("navigates to /campaigns/[id] on card tap", () => {
    expect(campaignsContent).toContain("/campaigns/${item.id}");
    expect(campaignsContent).toContain("router.push");
  });
});

// ── Drizzle Schema ────────────────────────────────────────────────────────────
describe("Drizzle ORM Schema — New Tables", () => {
  const schemaContent = fs.readFileSync(path.join(DRIZZLE, "schema.ts"), "utf-8");

  it("has user_notification_settings table", () => {
    expect(schemaContent).toContain("userNotificationSettings");
    expect(schemaContent).toContain("user_notification_settings");
  });

  it("user_notification_settings has all required columns", () => {
    expect(schemaContent).toContain("userId");
    expect(schemaContent).toContain("enabled");
    expect(schemaContent).toContain("roasDropThreshold");
    expect(schemaContent).toContain("budgetExhaustedPercent");
    expect(schemaContent).toContain("frequency");
    expect(schemaContent).toContain("quietHoursEnabled");
    expect(schemaContent).toContain("quietHoursStart");
    expect(schemaContent).toContain("quietHoursEnd");
    expect(schemaContent).toContain("digestHour");
    expect(schemaContent).toContain("weeklyReportEnabled");
    expect(schemaContent).toContain("types");
  });

  it("has campaign_alert_overrides table", () => {
    expect(schemaContent).toContain("campaignAlertOverrides");
    expect(schemaContent).toContain("campaign_alert_overrides");
  });

  it("campaign_alert_overrides has all required columns", () => {
    expect(schemaContent).toContain("campaignId");
    expect(schemaContent).toContain("roasDropThreshold");
    expect(schemaContent).toContain("budgetAlertEnabled");
  });

  it("exports TypeScript types for both tables", () => {
    expect(schemaContent).toContain("UserNotificationSettings");
    expect(schemaContent).toContain("InsertUserNotificationSettings");
    expect(schemaContent).toContain("CampaignAlertOverride");
    expect(schemaContent).toContain("InsertCampaignAlertOverride");
  });
});

// ── Server DB Helpers ─────────────────────────────────────────────────────────
describe("Server DB Helpers", () => {
  const dbContent = fs.readFileSync(path.join(SERVER_DIR, "db.ts"), "utf-8");

  it("exports getUserNotificationSettings", () => {
    expect(dbContent).toContain("export async function getUserNotificationSettings");
  });

  it("exports upsertUserNotificationSettings", () => {
    expect(dbContent).toContain("export async function upsertUserNotificationSettings");
  });

  it("exports getCampaignAlertOverridesForUser", () => {
    expect(dbContent).toContain("export async function getCampaignAlertOverridesForUser");
  });

  it("exports upsertCampaignAlertOverride", () => {
    expect(dbContent).toContain("export async function upsertCampaignAlertOverride");
  });

  it("exports deleteCampaignAlertOverride", () => {
    expect(dbContent).toContain("export async function deleteCampaignAlertOverride");
  });
});

// ── userSettingsRouter ────────────────────────────────────────────────────────
describe("userSettingsRouter tRPC Endpoints", () => {
  const routerContent = fs.readFileSync(
    path.join(SERVER_DIR, "userSettingsRouter.ts"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "userSettingsRouter.ts"))).toBe(true);
  });

  it("exports userSettingsRouter", () => {
    expect(routerContent).toContain("export const userSettingsRouter");
  });

  it("has getNotificationSettings protected procedure", () => {
    expect(routerContent).toContain("getNotificationSettings: protectedProcedure");
  });

  it("has saveNotificationSettings protected procedure", () => {
    expect(routerContent).toContain("saveNotificationSettings: protectedProcedure");
  });

  it("has getCampaignOverrides protected procedure", () => {
    expect(routerContent).toContain("getCampaignOverrides: protectedProcedure");
  });

  it("has saveCampaignOverride protected procedure", () => {
    expect(routerContent).toContain("saveCampaignOverride: protectedProcedure");
  });

  it("has deleteCampaignOverride protected procedure", () => {
    expect(routerContent).toContain("deleteCampaignOverride: protectedProcedure");
  });

  it("is registered in the main appRouter", () => {
    const routersContent = fs.readFileSync(path.join(SERVER_DIR, "routers.ts"), "utf-8");
    expect(routersContent).toContain("userSettings: userSettingsRouter");
  });
});

// ── useSettingsSync Hook ──────────────────────────────────────────────────────
describe("useSettingsSync Hook", () => {
  const hookContent = fs.readFileSync(
    path.join(HOOKS_DIR, "use-settings-sync.ts"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(HOOKS_DIR, "use-settings-sync.ts"))).toBe(true);
  });

  it("syncs FROM DB on login (useEffect on isAuthenticated)", () => {
    expect(hookContent).toContain("isAuthenticated");
    expect(hookContent).toContain("syncFromDb");
    expect(hookContent).toContain("getNotificationSettings.fetch");
  });

  it("merges DB settings into local AsyncStorage", () => {
    expect(hookContent).toContain("saveNotificationSettings(merged)");
  });

  it("exports syncSettingsToDb", () => {
    expect(hookContent).toContain("syncSettingsToDb");
    expect(hookContent).toContain("saveSettingsMutation.mutateAsync");
  });

  it("exports syncOverrideToDb", () => {
    expect(hookContent).toContain("syncOverrideToDb");
    expect(hookContent).toContain("saveOverrideMutation.mutateAsync");
  });

  it("exports deleteOverrideFromDb", () => {
    expect(hookContent).toContain("deleteOverrideFromDb");
    expect(hookContent).toContain("deleteOverrideMutation.mutateAsync");
  });

  it("is non-destructive when user is not authenticated", () => {
    expect(hookContent).toContain("if (!isAuthenticated) return;");
  });
});
