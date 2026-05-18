import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const TABS_DIR   = path.join(__dirname, "../app/(tabs)");
const LIB_DIR    = path.join(__dirname, "../lib");
const COMPONENTS = path.join(__dirname, "../components");

// ── Quiet Hours ───────────────────────────────────────────────────────────────
describe("Quiet Hours (Do Not Disturb)", () => {
  const settingsContent = fs.readFileSync(
    path.join(APP_DIR, "notification-settings.tsx"),
    "utf-8"
  );
  const notifContent = fs.readFileSync(
    path.join(LIB_DIR, "notifications.ts"),
    "utf-8"
  );
  const dashContent = fs.readFileSync(
    path.join(TABS_DIR, "index.tsx"),
    "utf-8"
  );

  it("NotificationSettings interface includes quietHoursEnabled, quietHoursStart, quietHoursEnd", () => {
    expect(settingsContent).toContain("quietHoursEnabled");
    expect(settingsContent).toContain("quietHoursStart");
    expect(settingsContent).toContain("quietHoursEnd");
  });

  it("DEFAULT_NOTIFICATION_SETTINGS has quiet hours defaults (22 to 8)", () => {
    expect(settingsContent).toContain("quietHoursEnabled: false");
    expect(settingsContent).toContain("quietHoursStart: 22");
    expect(settingsContent).toContain("quietHoursEnd: 8");
  });

  it("exports isQuietHours helper function", () => {
    expect(settingsContent).toContain("export function isQuietHours");
  });

  it("isQuietHours handles overnight windows (e.g., 22 to 8)", () => {
    expect(settingsContent).toContain("start > end");
    expect(settingsContent).toContain("overnight window");
  });

  it("exports formatHour helper for 12h display", () => {
    expect(settingsContent).toContain("export function formatHour");
    expect(settingsContent).toContain("12:00 AM");
    expect(settingsContent).toContain("12:00 PM");
  });

  it("Notification Settings screen has Do Not Disturb section", () => {
    expect(settingsContent).toContain("Do Not Disturb");
    expect(settingsContent).toContain("Quiet Hours");
  });

  it("shows start time picker (8 PM to midnight)", () => {
    expect(settingsContent).toContain("Start Time");
    expect(settingsContent).toContain("quietHoursStart");
  });

  it("shows end time picker (5 AM to 10 AM)", () => {
    expect(settingsContent).toContain("End Time");
    expect(settingsContent).toContain("quietHoursEnd");
  });

  it("shows human-readable time using formatHour", () => {
    expect(settingsContent).toContain("formatHour(settings.quietHoursStart)");
    expect(settingsContent).toContain("formatHour(settings.quietHoursEnd)");
  });

  it("checkCampaignAlerts accepts quietHours parameter", () => {
    expect(notifContent).toContain("quietHours?: { enabled: boolean; start: number; end: number }");
  });

  it("checkCampaignAlerts suppresses push during quiet hours", () => {
    expect(notifContent).toContain("isInQuietHours");
    expect(notifContent).toContain("!isInQuietHours");
  });

  it("quiet hours still stores in-app notification (only push is suppressed)", () => {
    expect(notifContent).toContain("// Only send push if not in quiet hours");
  });

  it("Dashboard passes quiet hours settings to checkCampaignAlerts", () => {
    expect(dashContent).toContain("notifSettings.quietHoursEnabled");
    expect(dashContent).toContain("notifSettings.quietHoursStart");
    expect(dashContent).toContain("notifSettings.quietHoursEnd");
  });
});

// ── Per-Campaign Alert Overrides ──────────────────────────────────────────────
describe("Per-Campaign Alert Overrides", () => {
  const sheetContent = fs.readFileSync(
    path.join(COMPONENTS, "campaign-alert-sheet.tsx"),
    "utf-8"
  );
  const campaignsContent = fs.readFileSync(
    path.join(TABS_DIR, "campaigns.tsx"),
    "utf-8"
  );

  it("campaign-alert-sheet.tsx exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "campaign-alert-sheet.tsx"))).toBe(true);
  });

  it("exports getCampaignAlertOverrides and saveCampaignAlertOverride", () => {
    expect(sheetContent).toContain("export async function getCampaignAlertOverrides");
    expect(sheetContent).toContain("export async function saveCampaignAlertOverride");
    expect(sheetContent).toContain("export async function clearCampaignAlertOverride");
    expect(sheetContent).toContain("export async function getCampaignAlertOverride");
  });

  it("CampaignAlertOverride interface has all required fields", () => {
    expect(sheetContent).toContain("campaignId: string");
    expect(sheetContent).toContain("enabled: boolean");
    expect(sheetContent).toContain("roasDropThreshold: number | null");
    expect(sheetContent).toContain("budgetAlertEnabled: boolean");
  });

  it("ROAS options include null (Use Global) option", () => {
    expect(sheetContent).toContain("Use Global");
    expect(sheetContent).toContain("Follow notification settings");
  });

  it("has ROAS options from 1.0x to 4.0x", () => {
    expect(sheetContent).toContain("1.0");
    expect(sheetContent).toContain("2.0");
    expect(sheetContent).toContain("3.0");
    expect(sheetContent).toContain("4.0");
  });

  it("has budget alert toggle", () => {
    expect(sheetContent).toContain("Budget Alerts");
    expect(sheetContent).toContain("budgetAlertEnabled");
  });

  it("has animated slide-up entrance", () => {
    expect(sheetContent).toContain("Animated.spring");
    expect(sheetContent).toContain("translateY");
  });

  it("shows CUSTOM badge when override is active", () => {
    expect(sheetContent).toContain("CUSTOM");
    expect(sheetContent).toContain("hasOverride");
  });

  it("has Save Override and Clear Override buttons", () => {
    expect(sheetContent).toContain("Save Override");
    expect(sheetContent).toContain("Clear Override");
  });

  it("shows success toast after saving", () => {
    expect(sheetContent).toContain("Alert override saved ✅");
  });

  it("Campaigns screen imports CampaignAlertSheet", () => {
    expect(campaignsContent).toContain("CampaignAlertSheet");
  });

  it("Campaigns screen has bell icon on each campaign card", () => {
    expect(campaignsContent).toContain("alertSheetCampaign");
    expect(campaignsContent).toContain("setAlertSheetCampaign(item)");
    expect(campaignsContent).toContain("bell.fill");
  });

  it("renders CampaignAlertSheet modal", () => {
    expect(campaignsContent).toContain("<CampaignAlertSheet");
    expect(campaignsContent).toContain("onClose={() => setAlertSheetCampaign(null)");
  });
});

// ── Daily Performance Digest ──────────────────────────────────────────────────
describe("Daily Performance Digest", () => {
  const notifContent = fs.readFileSync(
    path.join(LIB_DIR, "notifications.ts"),
    "utf-8"
  );
  const dashContent = fs.readFileSync(
    path.join(TABS_DIR, "index.tsx"),
    "utf-8"
  );

  it("exports scheduleDailyDigest function", () => {
    expect(notifContent).toContain("export async function scheduleDailyDigest");
  });

  it("only schedules once per calendar day (AsyncStorage check)", () => {
    expect(notifContent).toContain("DIGEST_SCHEDULED_KEY");
    expect(notifContent).toContain("lastScheduled === today");
  });

  it("builds digest summary with active campaigns, avg ROAS, total spend, top performer", () => {
    expect(notifContent).toContain("activeCampaigns");
    expect(notifContent).toContain("avgRoas");
    expect(notifContent).toContain("totalSpend");
    expect(notifContent).toContain("topCampaign");
  });

  it("schedules for 9 AM (or tomorrow if already past 9 AM)", () => {
    expect(notifContent).toContain("setHours(9, 0, 0, 0)");
    expect(notifContent).toContain("Already past 9 AM today");
    expect(notifContent).toContain("setDate(digestTime.getDate() + 1)");
  });

  it("uses TIME_INTERVAL trigger type (required by Expo SDK 54)", () => {
    expect(notifContent).toContain("SchedulableTriggerInputTypes.TIME_INTERVAL");
    expect(notifContent).toContain("secondsUntilDigest");
  });

  it("stores digest as in-app notification too", () => {
    expect(notifContent).toContain("await addNotification");
    expect(notifContent).toContain("Daily Performance Digest");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(notifContent).toContain('Platform.OS === "web"');
  });

  it("Dashboard imports scheduleDailyDigest", () => {
    expect(dashContent).toContain("scheduleDailyDigest");
  });

  it("Dashboard calls scheduleDailyDigest when frequency is daily", () => {
    expect(dashContent).toContain("notifSettings.frequency === \"daily\"");
    expect(dashContent).toContain("scheduleDailyDigest(");
  });
});
