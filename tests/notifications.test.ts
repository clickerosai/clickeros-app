import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const LIB_DIR    = path.join(__dirname, "../lib");
const APP_DIR    = path.join(__dirname, "../app");
const TABS_DIR   = path.join(__dirname, "../app/(tabs)");
const COMPONENTS = path.join(__dirname, "../components");

// ── Push Notification Service ─────────────────────────────────────────────────
describe("Push Notification Service (lib/notifications.ts)", () => {
  const notifContent = fs.readFileSync(path.join(LIB_DIR, "notifications.ts"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(LIB_DIR, "notifications.ts"))).toBe(true);
  });

  it("exports setupNotificationHandler", () => {
    expect(notifContent).toContain("export function setupNotificationHandler");
  });

  it("sets shouldShowBanner and shouldShowList (Expo SDK 54 requirement)", () => {
    expect(notifContent).toContain("shouldShowBanner: true");
    expect(notifContent).toContain("shouldShowList: true");
  });

  it("exports setupAndroidChannels with campaign-alerts channel", () => {
    expect(notifContent).toContain("setupAndroidChannels");
    expect(notifContent).toContain("campaign-alerts");
    expect(notifContent).toContain("optimization");
  });

  it("exports requestNotificationPermissions", () => {
    expect(notifContent).toContain("requestNotificationPermissions");
    expect(notifContent).toContain("requestPermissionsAsync");
  });

  it("has in-app notification store with AsyncStorage", () => {
    expect(notifContent).toContain("getStoredNotifications");
    expect(notifContent).toContain("addNotification");
    expect(notifContent).toContain("markNotificationRead");
    expect(notifContent).toContain("markAllNotificationsRead");
    expect(notifContent).toContain("clearAllNotifications");
    expect(notifContent).toContain("getUnreadCount");
  });

  it("limits stored notifications to 50", () => {
    expect(notifContent).toContain("MAX_NOTIFICATIONS");
    expect(notifContent).toContain("50");
  });

  it("supports all notification types", () => {
    expect(notifContent).toContain("roas_drop");
    expect(notifContent).toContain("budget_exhausted");
    expect(notifContent).toContain("optimization");
    expect(notifContent).toContain("campaign_paused");
    expect(notifContent).toContain("system");
    expect(notifContent).toContain("achievement");
  });

  it("exports checkCampaignAlerts for ROAS drop detection", () => {
    expect(notifContent).toContain("checkCampaignAlerts");
    expect(notifContent).toContain("roasDropThreshold");
    expect(notifContent).toContain("ROAS Drop");
  });

  it("exports checkCampaignAlerts for budget exhausted detection", () => {
    expect(notifContent).toContain("budgetExhaustedPercent");
    expect(notifContent).toContain("Budget Alert");
  });

  it("exports addOptimizationNotification", () => {
    expect(notifContent).toContain("addOptimizationNotification");
    expect(notifContent).toContain("Optimization Applied");
  });

  it("exports NOTIFICATION_ICONS and NOTIFICATION_COLORS", () => {
    expect(notifContent).toContain("NOTIFICATION_ICONS");
    expect(notifContent).toContain("NOTIFICATION_COLORS");
  });

  it("is web-safe (Platform.OS guard)", () => {
    expect(notifContent).toContain('Platform.OS === "web"');
  });

  it("schedules push notifications immediately (trigger: null)", () => {
    expect(notifContent).toContain("trigger: null");
  });
});

// ── Root Layout — Notification Setup ─────────────────────────────────────────
describe("Root Layout — Notification Setup", () => {
  const layoutContent = fs.readFileSync(path.join(APP_DIR, "_layout.tsx"), "utf-8");

  it("imports setupNotificationHandler", () => {
    expect(layoutContent).toContain("setupNotificationHandler");
  });

  it("imports setupAndroidChannels", () => {
    expect(layoutContent).toContain("setupAndroidChannels");
  });

  it("calls setupNotificationHandler at module level", () => {
    expect(layoutContent).toContain("setupNotificationHandler();");
  });

  it("calls setupAndroidChannels in useEffect", () => {
    expect(layoutContent).toContain("setupAndroidChannels().catch");
  });

  it("imports and renders WhatsNewModal", () => {
    expect(layoutContent).toContain("WhatsNewModal");
    expect(layoutContent).toContain("<WhatsNewModal />");
  });
});

// ── Notification Center Screen ────────────────────────────────────────────────
describe("Notification Center Screen", () => {
  const notifScreen = fs.readFileSync(path.join(APP_DIR, "notifications.tsx"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "notifications.tsx"))).toBe(true);
  });

  it("loads notifications from AsyncStorage on mount", () => {
    expect(notifScreen).toContain("getStoredNotifications");
    expect(notifScreen).toContain("loadNotifications");
  });

  it("marks notification as read on press", () => {
    expect(notifScreen).toContain("markNotificationRead");
    expect(notifScreen).toContain("handleNotificationPress");
  });

  it("has Mark All Read button", () => {
    expect(notifScreen).toContain("Mark all read");
    expect(notifScreen).toContain("markAllNotificationsRead");
  });

  it("has Clear All button with confirmation alert", () => {
    expect(notifScreen).toContain("Clear all");
    expect(notifScreen).toContain("clearAllNotifications");
    expect(notifScreen).toContain("Alert.alert");
  });

  it("shows unread dot on unread notifications", () => {
    expect(notifScreen).toContain("!item.read");
  });

  it("shows time ago for each notification", () => {
    expect(notifScreen).toContain("timeAgo");
    expect(notifScreen).toContain("Just now");
  });

  it("shows campaign name badge when available", () => {
    expect(notifScreen).toContain("item.campaignName");
  });

  it("shows empty state with sample notifications button", () => {
    expect(notifScreen).toContain("No notifications yet");
    expect(notifScreen).toContain("Load sample notifications");
  });

  it("has pull-to-refresh", () => {
    expect(notifScreen).toContain("RefreshControl");
    expect(notifScreen).toContain("onRefresh");
  });

  it("has filter tabs (All, Alerts, Optimizations, System)", () => {
    expect(notifScreen).toContain("Alerts");
    expect(notifScreen).toContain("Optimizations");
    expect(notifScreen).toContain("System");
  });
});

// ── Dashboard Bell Icon with Unread Badge ─────────────────────────────────────
describe("Dashboard — Bell Icon with Unread Badge", () => {
  const dashContent = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");

  it("imports getUnreadCount", () => {
    expect(dashContent).toContain("getUnreadCount");
  });

  it("loads unread count on mount", () => {
    expect(dashContent).toContain("unreadNotifCount");
    expect(dashContent).toContain("getUnreadCount().then");
  });

  it("shows red badge on bell icon when there are unread notifications", () => {
    expect(dashContent).toContain("unreadNotifCount > 0");
    expect(dashContent).toContain("#EF4444");
    expect(dashContent).toContain("9+");
  });

  it("navigates to /notifications on bell press", () => {
    expect(dashContent).toContain("/notifications");
    expect(dashContent).toContain("router.push");
  });

  it("resets unread count when bell is pressed", () => {
    expect(dashContent).toContain("setUnreadNotifCount(0)");
  });
});

// ── What's New Modal ──────────────────────────────────────────────────────────
describe("What's New Modal", () => {
  const modalContent = fs.readFileSync(
    path.join(COMPONENTS, "whats-new-modal.tsx"),
    "utf-8"
  );

  it("file exists", () => {
    expect(fs.existsSync(path.join(COMPONENTS, "whats-new-modal.tsx"))).toBe(true);
  });

  it("checks AsyncStorage for last seen version", () => {
    expect(modalContent).toContain("WHATS_NEW_KEY");
    expect(modalContent).toContain("AsyncStorage.getItem");
    expect(modalContent).toContain("APP_VERSION");
  });

  it("saves version to AsyncStorage on dismiss", () => {
    expect(modalContent).toContain("AsyncStorage.setItem");
    expect(modalContent).toContain("APP_VERSION");
  });

  it("only shows once per version", () => {
    expect(modalContent).toContain("lastSeen !== APP_VERSION");
  });

  it("has animated entrance (spring scale + fade)", () => {
    expect(modalContent).toContain("Animated.spring");
    expect(modalContent).toContain("Animated.timing");
    expect(modalContent).toContain("scaleAnim");
    expect(modalContent).toContain("opacityAnim");
  });

  it("shows version number and headline", () => {
    expect(modalContent).toContain("What's New in v");
    expect(modalContent).toContain("headline");
  });

  it("shows feature list with icons, titles, descriptions, and badges", () => {
    expect(modalContent).toContain("feature.icon");
    expect(modalContent).toContain("feature.title");
    expect(modalContent).toContain("feature.desc");
    expect(modalContent).toContain("feature.badge");
  });

  it("supports New, Improved, and Fixed badge types", () => {
    expect(modalContent).toContain("New");
    expect(modalContent).toContain("Improved");
    expect(modalContent).toContain("Fixed");
  });

  it("has a changelog with at least 3 versions", () => {
    expect(modalContent).toContain("1.3.0");
    expect(modalContent).toContain("1.2.0");
    expect(modalContent).toContain("1.1.0");
  });

  it("has dismiss button with haptic feedback", () => {
    expect(modalContent).toContain("Got it");
    expect(modalContent).toContain("handleDismiss");
    expect(modalContent).toContain("Haptics");
  });

  it("shows with a 1.5 second delay to let app render first", () => {
    expect(modalContent).toContain("1500");
  });
});
