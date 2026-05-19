import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const SERVER_DIR = path.join(__dirname, "../server");
const COMPONENTS = path.join(__dirname, "../components");
const LIB_DIR    = path.join(__dirname, "../lib");

// ── Notification Settings — DB Sync Wiring ────────────────────────────────────
describe("Notification Settings — DB Sync Wiring", () => {
  const settingsContent = fs.readFileSync(
    path.join(APP_DIR, "notification-settings.tsx"),
    "utf-8"
  );

  it("imports useSettingsSync", () => {
    expect(settingsContent).toContain("useSettingsSync");
    expect(settingsContent).toContain("@/hooks/use-settings-sync");
  });

  it("destructures syncSettingsToDb from useSettingsSync", () => {
    expect(settingsContent).toContain("syncSettingsToDb");
    expect(settingsContent).toContain("const { syncSettingsToDb } = useSettingsSync()");
  });

  it("handleSave calls syncSettingsToDb after saving to AsyncStorage", () => {
    expect(settingsContent).toContain("syncSettingsToDb(newSettings)");
    expect(settingsContent).toContain("// Sync to database in background");
  });

  it("syncSettingsToDb is called with .catch to avoid blocking UI", () => {
    expect(settingsContent).toContain("syncSettingsToDb(newSettings).catch(() => {})");
  });

  it("handleSave dependency array includes syncSettingsToDb", () => {
    expect(settingsContent).toContain("[syncSettingsToDb]");
  });
});

// ── CampaignAlertSheet — DB Sync Wiring ──────────────────────────────────────
describe("CampaignAlertSheet — DB Sync Wiring", () => {
  const sheetContent = fs.readFileSync(
    path.join(COMPONENTS, "campaign-alert-sheet.tsx"),
    "utf-8"
  );

  it("imports useSettingsSync", () => {
    expect(sheetContent).toContain("useSettingsSync");
    expect(sheetContent).toContain("@/hooks/use-settings-sync");
  });

  it("destructures syncOverrideToDb and deleteOverrideFromDb", () => {
    expect(sheetContent).toContain("syncOverrideToDb");
    expect(sheetContent).toContain("deleteOverrideFromDb");
    expect(sheetContent).toContain("const { syncOverrideToDb, deleteOverrideFromDb } = useSettingsSync()");
  });

  it("handleSave calls syncOverrideToDb after saveCampaignAlertOverride", () => {
    expect(sheetContent).toContain("syncOverrideToDb(updated)");
    expect(sheetContent).toContain("// Sync to database in background");
  });

  it("handleSave toast mentions cross-device sync", () => {
    expect(sheetContent).toContain("Synced across devices");
  });

  it("handleClearOverride calls deleteOverrideFromDb", () => {
    expect(sheetContent).toContain("deleteOverrideFromDb(campaign.id)");
    expect(sheetContent).toContain("// Remove from database");
  });

  it("handleSave dependency array includes syncOverrideToDb", () => {
    expect(sheetContent).toContain("syncOverrideToDb]");
  });

  it("handleClearOverride dependency array includes deleteOverrideFromDb", () => {
    expect(sheetContent).toContain("deleteOverrideFromDb]");
  });
});

// ── Clickeros API — Metrics History ──────────────────────────────────────────
describe("Clickeros API — getCampaignMetricsHistory", () => {
  const apiContent = fs.readFileSync(
    path.join(LIB_DIR, "clickeros-api.ts"),
    "utf-8"
  );

  it("exports ClickerosDailyMetric interface", () => {
    expect(apiContent).toContain("export interface ClickerosDailyMetric");
    expect(apiContent).toContain("date: string");
    expect(apiContent).toContain("roas: number");
    expect(apiContent).toContain("ctr: number");
    expect(apiContent).toContain("spend: number");
    expect(apiContent).toContain("impressions: number");
  });

  it("exports ClickerosCampaignMetricsHistory interface", () => {
    expect(apiContent).toContain("export interface ClickerosCampaignMetricsHistory");
    expect(apiContent).toContain("metrics: ClickerosDailyMetric[]");
  });

  it("has getCampaignMetricsHistory method", () => {
    expect(apiContent).toContain("getCampaignMetricsHistory");
    expect(apiContent).toContain("/campaigns/${campaignId}/metrics");
  });

  it("accepts period parameter (7d | 30d | 90d)", () => {
    expect(apiContent).toContain("period: \"7d\" | \"30d\" | \"90d\"");
  });

  it("returns null gracefully when API fails", () => {
    expect(apiContent).toContain("return null");
  });
});

// ── Dashboard Router — campaignMetricsHistory Procedure ──────────────────────
describe("Dashboard Router — campaignMetricsHistory Procedure", () => {
  const routerContent = fs.readFileSync(
    path.join(SERVER_DIR, "dashboardRouter.ts"),
    "utf-8"
  );

  it("has campaignMetricsHistory procedure", () => {
    expect(routerContent).toContain("campaignMetricsHistory: publicProcedure");
  });

  it("accepts campaignId and period inputs", () => {
    expect(routerContent).toContain("campaignId: z.string()");
    expect(routerContent).toContain("period: z.enum([\"7d\", \"30d\", \"90d\"])");
  });

  it("tries real API first when configured", () => {
    expect(routerContent).toContain("clickerosApi.getCampaignMetricsHistory");
    expect(routerContent).toContain("isApiConfigured()");
  });

  it("falls back to realistic mock data", () => {
    expect(routerContent).toContain("Fallback: generate realistic mock history");
    expect(routerContent).toContain("Array.from({ length: days }");
  });

  it("generates correct number of days per period", () => {
    expect(routerContent).toContain("period === \"7d\" ? 7 : input.period === \"30d\" ? 30 : 90");
  });

  it("includes all required metric fields in mock data", () => {
    expect(routerContent).toContain("date:");
    expect(routerContent).toContain("roas:");
    expect(routerContent).toContain("ctr:");
    expect(routerContent).toContain("spend:");
    // shorthand property names (impressions, clicks, conversions, revenue)
    expect(routerContent).toContain("impressions");
    expect(routerContent).toContain("clicks");
    expect(routerContent).toContain("conversions");
    expect(routerContent).toContain("revenue");
  });
});

// ── Campaign Detail Screen — Real Metrics History ─────────────────────────────
describe("Campaign Detail Screen — Real Metrics History", () => {
  const detailContent = fs.readFileSync(
    path.join(APP_DIR, "campaigns/[id].tsx"),
    "utf-8"
  );

  it("imports useMemo for chart arrays", () => {
    expect(detailContent).toContain("useMemo");
  });

  it("calls trpc.dashboard.campaignMetricsHistory.useQuery", () => {
    expect(detailContent).toContain("trpc.dashboard.campaignMetricsHistory.useQuery");
  });

  it("passes campaignId and period to the query", () => {
    expect(detailContent).toContain("campaignId: id ?? \"\"");
    expect(detailContent).toContain("period: \"7d\"");
  });

  it("derives chart arrays from real metrics data", () => {
    expect(detailContent).toContain("metricsHistory.map((d) => d.roas)");
    expect(detailContent).toContain("metricsHistory.map((d) => d.ctr)");
    expect(detailContent).toContain("metricsHistory.map((d) => d.spend)");
  });

  it("no longer uses random Math.random() for chart data", () => {
    // The old random generation code should be removed
    expect(detailContent).not.toContain("Array.from({ length: 7 }, (_, i) => Math.max(0.5, roasBase");
  });
});
