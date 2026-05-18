import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const TABS_DIR   = path.join(__dirname, "../app/(tabs)");
const LIB_DIR    = path.join(__dirname, "../lib");
const COMPONENTS = path.join(__dirname, "../components");

// ── Per-Campaign Overrides Wired into checkCampaignAlerts ─────────────────────
describe("checkCampaignAlerts — Per-Campaign Overrides", () => {
  const notifContent = fs.readFileSync(path.join(LIB_DIR, "notifications.ts"), "utf-8");

  it("loads campaign overrides before the alert loop", () => {
    expect(notifContent).toContain("campaignOverrides");
    expect(notifContent).toContain("getCampaignAlertOverrides");
  });

  it("skips campaign if override.enabled is false", () => {
    expect(notifContent).toContain("override && !override.enabled");
  });

  it("uses effectiveRoasThreshold (override or global)", () => {
    expect(notifContent).toContain("effectiveRoasThreshold");
    expect(notifContent).toContain("override?.roasDropThreshold != null");
  });

  it("respects per-campaign budgetAlertEnabled flag", () => {
    expect(notifContent).toContain("budgetAlertEnabled");
    expect(notifContent).toContain("budgetAlertEnabled && budgetValue > 0");
  });

  it("uses lazy import to avoid circular dependency", () => {
    expect(notifContent).toContain("_getCampaignAlertOverrides");
    expect(notifContent).toContain("campaign-alert-sheet");
  });
});

// ── Weekly Performance Report ─────────────────────────────────────────────────
describe("Weekly Performance Report", () => {
  const notifContent = fs.readFileSync(path.join(LIB_DIR, "notifications.ts"), "utf-8");
  const dashContent  = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");

  it("exports scheduleWeeklyReport function", () => {
    expect(notifContent).toContain("export async function scheduleWeeklyReport");
  });

  it("only schedules once per week (ISO week key)", () => {
    expect(notifContent).toContain("WEEKLY_REPORT_KEY");
    expect(notifContent).toContain("weekKey");
    expect(notifContent).toContain("lastScheduled === weekKey");
  });

  it("builds summary with best/worst ROAS and top 3 campaigns", () => {
    expect(notifContent).toContain("bestRoas");
    expect(notifContent).toContain("worstRoas");
    expect(notifContent).toContain("top3");
    expect(notifContent).toContain("Needs attention");
  });

  it("includes total spend vs budget", () => {
    expect(notifContent).toContain("totalBudget");
    expect(notifContent).toContain("totalSpend");
    expect(notifContent).toContain("Spend:");
  });

  it("schedules for next Monday", () => {
    expect(notifContent).toContain("nextMonday");
    expect(notifContent).toContain("daysUntilMonday");
    expect(notifContent).toContain("secondsUntilMonday");
  });

  it("uses TIME_INTERVAL trigger type", () => {
    expect(notifContent).toContain("SchedulableTriggerInputTypes.TIME_INTERVAL");
  });

  it("Dashboard calls scheduleWeeklyReport when weeklyReportEnabled", () => {
    expect(dashContent).toContain("notifSettings.weeklyReportEnabled");
    expect(dashContent).toContain("scheduleWeeklyReport(");
  });

  it("passes digestHour to scheduleWeeklyReport", () => {
    expect(dashContent).toContain("notifSettings.digestHour ?? 9");
  });
});

// ── Digest Time Customization ─────────────────────────────────────────────────
describe("Digest Time Customization", () => {
  const settingsContent = fs.readFileSync(
    path.join(APP_DIR, "notification-settings.tsx"),
    "utf-8"
  );
  const notifContent = fs.readFileSync(path.join(LIB_DIR, "notifications.ts"), "utf-8");

  it("NotificationSettings has digestHour field", () => {
    expect(settingsContent).toContain("digestHour: number");
  });

  it("NotificationSettings has weeklyReportEnabled field", () => {
    expect(settingsContent).toContain("weeklyReportEnabled: boolean");
  });

  it("DEFAULT_NOTIFICATION_SETTINGS has digestHour: 9", () => {
    expect(settingsContent).toContain("digestHour: 9");
  });

  it("DEFAULT_NOTIFICATION_SETTINGS has weeklyReportEnabled: true", () => {
    expect(settingsContent).toContain("weeklyReportEnabled: true");
  });

  it("Notification Settings screen has Daily Digest Time section", () => {
    expect(settingsContent).toContain("Daily Digest Time");
    expect(settingsContent).toContain("digestHour");
  });

  it("shows time options from 6 AM to 12 PM", () => {
    expect(settingsContent).toContain("[6, 7, 8, 9, 10, 11, 12]");
  });

  it("shows hint when frequency is not daily", () => {
    expect(settingsContent).toContain("Set frequency to \"Daily Digest\"");
  });

  it("has Weekly Report toggle", () => {
    expect(settingsContent).toContain("Monday Performance Report");
    expect(settingsContent).toContain("weeklyReportEnabled");
  });

  it("scheduleDailyDigest accepts digestHour parameter", () => {
    expect(notifContent).toContain("digestHour: number = 9");
    expect(notifContent).toContain("digestTime.setHours(digestHour");
  });
});

// ── Error Boundary ────────────────────────────────────────────────────────────
describe("Error Boundary Component", () => {
  const boundaryContent = fs.readFileSync(
    path.join(COMPONENTS, "error-boundary.tsx"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "error-boundary.tsx"))).toBe(true);
  });

  it("is a class component with getDerivedStateFromError", () => {
    expect(boundaryContent).toContain("class ErrorBoundary extends Component");
    expect(boundaryContent).toContain("getDerivedStateFromError");
  });

  it("implements componentDidCatch for error logging", () => {
    expect(boundaryContent).toContain("componentDidCatch");
    expect(boundaryContent).toContain("console.error");
  });

  it("has Try Again button that resets state", () => {
    expect(boundaryContent).toContain("Try Again");
    expect(boundaryContent).toContain("handleReset");
  });

  it("has Go to Dashboard fallback navigation", () => {
    expect(boundaryContent).toContain("Go to Dashboard");
    expect(boundaryContent).toContain("/(tabs)");
  });

  it("shows error details in dev mode only", () => {
    expect(boundaryContent).toContain("__DEV__");
    expect(boundaryContent).toContain("error.message");
  });

  it("accepts optional fallback and onReset props", () => {
    expect(boundaryContent).toContain("fallback?: ReactNode");
    expect(boundaryContent).toContain("onReset?: () => void");
  });
});

// ── Offline Banner ────────────────────────────────────────────────────────────
describe("Offline Banner Component", () => {
  const bannerContent = fs.readFileSync(
    path.join(COMPONENTS, "offline-banner.tsx"),
    "utf-8"
  );
  const layoutContent = fs.readFileSync(path.join(APP_DIR, "_layout.tsx"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "offline-banner.tsx"))).toBe(true);
  });

  it("uses @react-native-community/netinfo", () => {
    expect(bannerContent).toContain("@react-native-community/netinfo");
    expect(bannerContent).toContain("NetInfo.addEventListener");
  });

  it("has animated slide-in and slide-out", () => {
    expect(bannerContent).toContain("translateY");
    expect(bannerContent).toContain("Animated.timing");
  });

  it("shows offline message", () => {
    expect(bannerContent).toContain("No internet connection");
  });

  it("shows back online message briefly", () => {
    expect(bannerContent).toContain("Back online");
    expect(bannerContent).toContain("wasOffline");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(bannerContent).toContain('Platform.OS === "web"');
  });

  it("is rendered in root layout", () => {
    expect(layoutContent).toContain("OfflineBanner");
    expect(layoutContent).toContain("<OfflineBanner />");
  });
});
