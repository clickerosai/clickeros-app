import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR  = path.join(__dirname, "../app");
const TABS_DIR = path.join(__dirname, "../app/(tabs)");

// ── Notification Settings Screen ──────────────────────────────────────────────
describe("Notification Settings Screen", () => {
  const content = fs.readFileSync(
    path.join(APP_DIR, "notification-settings.tsx"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "notification-settings.tsx"))).toBe(true);
  });

  it("exports getNotificationSettings", () => {
    expect(content).toContain("export async function getNotificationSettings");
  });

  it("exports saveNotificationSettings", () => {
    expect(content).toContain("export async function saveNotificationSettings");
  });

  it("exports DEFAULT_NOTIFICATION_SETTINGS", () => {
    expect(content).toContain("export const DEFAULT_NOTIFICATION_SETTINGS");
  });

  it("has master on/off toggle", () => {
    expect(content).toContain("All Notifications");
    expect(content).toContain("handleToggleEnabled");
    expect(content).toContain("Switch");
  });

  it("has toggles for all 6 notification types", () => {
    expect(content).toContain("roas_drop");
    expect(content).toContain("budget_exhausted");
    expect(content).toContain("optimization");
    expect(content).toContain("campaign_paused");
    expect(content).toContain("system");
    expect(content).toContain("achievement");
  });

  it("has ROAS threshold selector with 5 options", () => {
    expect(content).toContain("ROAS Drop Threshold");
    expect(content).toContain("roasDropThreshold");
    expect(content).toContain("1.0");
    expect(content).toContain("1.5");
    expect(content).toContain("2.0");
    expect(content).toContain("2.5");
    expect(content).toContain("3.0");
  });

  it("has budget threshold selector with 4 options", () => {
    expect(content).toContain("Budget Alert Threshold");
    expect(content).toContain("budgetExhaustedPercent");
    expect(content).toContain("70");
    expect(content).toContain("80");
    expect(content).toContain("90");
    expect(content).toContain("95");
  });

  it("has frequency selector (immediate, hourly, daily)", () => {
    expect(content).toContain("Alert Frequency");
    expect(content).toContain("immediate");
    expect(content).toContain("hourly");
    expect(content).toContain("daily");
  });

  it("shows permission banner when notifications are disabled", () => {
    expect(content).toContain("Notifications are disabled");
    expect(content).toContain("handleRequestPermission");
  });

  it("links to device settings when permission is denied", () => {
    expect(content).toContain("app-settings:");
    expect(content).toContain("Linking.openURL");
  });

  it("has Reset to Defaults button with confirmation", () => {
    expect(content).toContain("Reset to Defaults");
    expect(content).toContain("handleResetDefaults");
    expect(content).toContain("Alert.alert");
  });

  it("shows current settings summary card", () => {
    expect(content).toContain("Current Alert Configuration");
    expect(content).toContain("ROAS Alert");
    expect(content).toContain("Budget Alert");
    expect(content).toContain("Frequency");
    expect(content).toContain("Active Types");
  });

  it("persists settings to AsyncStorage", () => {
    expect(content).toContain("SETTINGS_KEY");
    expect(content).toContain("AsyncStorage.setItem");
    expect(content).toContain("AsyncStorage.getItem");
  });

  it("dims type toggles when master toggle is off", () => {
    expect(content).toContain("opacity: settings.enabled ? 1 : 0.4");
  });
});

// ── Settings Screen — Notification Section ────────────────────────────────────
describe("Settings Screen — Notification Section", () => {
  const settingsContent = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");

  it("has Notifications section with two items", () => {
    expect(settingsContent).toContain("Notification Settings");
    expect(settingsContent).toContain("Notification Center");
  });

  it("links to /notification-settings", () => {
    expect(settingsContent).toContain("/notification-settings");
  });

  it("links to /notifications", () => {
    expect(settingsContent).toContain("/notifications");
  });
});

// ── Dashboard — Permission Prompt ─────────────────────────────────────────────
describe("Dashboard — Notification Permission Prompt", () => {
  const dashContent = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");

  it("imports requestNotificationPermissions", () => {
    expect(dashContent).toContain("requestNotificationPermissions");
  });

  it("imports getNotificationPermissionStatus", () => {
    expect(dashContent).toContain("getNotificationPermissionStatus");
  });

  it("imports getNotificationSettings", () => {
    expect(dashContent).toContain("getNotificationSettings");
  });

  it("has NOTIF_PROMPT_KEY to prevent showing prompt more than once", () => {
    expect(dashContent).toContain("NOTIF_PROMPT_KEY");
    expect(dashContent).toContain("AsyncStorage.getItem(NOTIF_PROMPT_KEY)");
    expect(dashContent).toContain("AsyncStorage.setItem(NOTIF_PROMPT_KEY");
  });

  it("only shows prompt when campaigns are loaded", () => {
    expect(dashContent).toContain("campaignsQuery.data.length === 0");
  });

  it("shows info toast with Enable action button", () => {
    expect(dashContent).toContain("Enable campaign alerts");
    expect(dashContent).toContain("label: \"Enable\"");
  });

  it("shows success toast after permission is granted", () => {
    expect(dashContent).toContain("Campaign alerts enabled ✅");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(dashContent).toContain('Platform.OS === "web"');
  });
});

// ── Dashboard — checkCampaignAlerts on Refresh ────────────────────────────────
describe("Dashboard — checkCampaignAlerts Wired to Refresh", () => {
  const dashContent = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");

  it("calls checkCampaignAlerts after pull-to-refresh", () => {
    expect(dashContent).toContain("checkCampaignAlerts");
  });

  it("uses user's configured thresholds from getNotificationSettings", () => {
    expect(dashContent).toContain("getNotificationSettings");
    expect(dashContent).toContain("notifSettings.roasDropThreshold");
    expect(dashContent).toContain("notifSettings.budgetExhaustedPercent");
  });

  it("only runs alerts when notifications are enabled", () => {
    expect(dashContent).toContain("notifSettings.enabled");
  });

  it("refreshes unread count after alerts are checked", () => {
    expect(dashContent).toContain("getUnreadCount().then(setUnreadNotifCount)");
  });

  it("passes all required campaign fields to checkCampaignAlerts", () => {
    expect(dashContent).toContain("c.id");
    expect(dashContent).toContain("c.name");
    expect(dashContent).toContain("c.roas");
    expect(dashContent).toContain("c.spend");
    expect(dashContent).toContain("c.budget");
    expect(dashContent).toContain("c.status");
    expect(dashContent).toContain("c.platform");
  });
});
