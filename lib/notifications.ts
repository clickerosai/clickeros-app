/**
 * Push Notification Service
 *
 * Handles:
 * - Permission requests
 * - Android notification channel setup
 * - Campaign performance alerts (ROAS drop, budget exhausted)
 * - Local notification scheduling
 * - In-app notification store (AsyncStorage)
 */
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// Lazy import to avoid circular dependency — loaded at runtime
let _getCampaignAlertOverrides: (() => Promise<Record<string, any>>) | null = null;
async function getCampaignAlertOverrides(): Promise<Record<string, any>> {
  if (!_getCampaignAlertOverrides) {
    const mod = await import("../components/campaign-alert-sheet");
    _getCampaignAlertOverrides = mod.getCampaignAlertOverrides;
  }
  return _getCampaignAlertOverrides!();
}

// ── Notification Handler (must be called at app root) ─────────────────────────
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// ── Android Channel Setup ─────────────────────────────────────────────────────
export async function setupAndroidChannels() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("campaign-alerts", {
    name: "Campaign Alerts",
    description: "ROAS drops, budget exhausted, and performance warnings",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#7C3AED",
    sound: "default",
  });
  await Notifications.setNotificationChannelAsync("optimization", {
    name: "Optimization Updates",
    description: "AI optimization results and recommendations",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
  });
  await Notifications.setNotificationChannelAsync("system", {
    name: "System",
    description: "Account and system notifications",
    importance: Notifications.AndroidImportance.LOW,
  });
}

// ── Permission Request ────────────────────────────────────────────────────────
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function getNotificationPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  if (Platform.OS === "web") return "denied";
  const { status } = await Notifications.getPermissionsAsync();
  return status as "granted" | "denied" | "undetermined";
}

// ── In-App Notification Store ─────────────────────────────────────────────────

const NOTIFICATIONS_KEY = "@clickeros:notifications";
const MAX_NOTIFICATIONS = 50;

export type NotificationType = "roas_drop" | "budget_exhausted" | "optimization" | "campaign_paused" | "system" | "achievement";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  campaignId?: string;
  campaignName?: string;
  data?: Record<string, string | number>;
  read: boolean;
  createdAt: string; // ISO string
}

export async function getStoredNotifications(): Promise<AppNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

export async function addNotification(
  notification: Omit<AppNotification, "id" | "read" | "createdAt">
): Promise<AppNotification> {
  const newNotif: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  try {
    const existing = await getStoredNotifications();
    const updated = [newNotif, ...existing].slice(0, MAX_NOTIFICATIONS);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch {}
  return newNotif;
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    const notifications = await getStoredNotifications();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch {}
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    const notifications = await getStoredNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch {}
}

export async function clearAllNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
  } catch {}
}

export async function getUnreadCount(): Promise<number> {
  const notifications = await getStoredNotifications();
  return notifications.filter((n) => !n.read).length;
}

// ── Campaign Alert Triggers ───────────────────────────────────────────────────

export interface CampaignAlertConfig {
  roasDropThreshold: number;   // e.g., 2.0 — alert if ROAS falls below this
  budgetExhaustedPercent: number; // e.g., 90 — alert when 90% of budget is spent
}

const DEFAULT_ALERT_CONFIG: CampaignAlertConfig = {
  roasDropThreshold: 2.0,
  budgetExhaustedPercent: 90,
};

/**
 * Check campaign metrics and fire push + in-app notifications if thresholds are breached.
 * Respects quiet hours — push notifications are suppressed during DND window.
 * Call this after each data refresh.
 */
export async function checkCampaignAlerts(
  campaigns: Array<{
    id: string;
    name: string;
    roas: string;
    spend: string;
    budget: string;
    status: string;
    platform: string;
  }>,
  config: CampaignAlertConfig = DEFAULT_ALERT_CONFIG,
  quietHours?: { enabled: boolean; start: number; end: number }
): Promise<void> {
  if (Platform.OS === "web") return;

  const hasPermission = await requestNotificationPermissions();

  // Check quiet hours — suppress push notifications but still store in-app notifications
  const isInQuietHours = (() => {
    if (!quietHours?.enabled) return false;
    const hour = new Date().getHours();
    const { start, end } = quietHours;
    return start > end
      ? hour >= start || hour < end   // overnight window
      : hour >= start && hour < end;  // same-day window
  })();

  // Load all per-campaign overrides once before the loop
  const campaignOverrides = await getCampaignAlertOverrides().catch(() => ({} as Record<string, any>));

  for (const campaign of campaigns) {
    if (campaign.status !== "Active" && campaign.status !== "Scaling") continue;

    // Check per-campaign override — if override exists and alerts are disabled, skip
    const override = campaignOverrides[campaign.id];
    if (override && !override.enabled) continue;

    const roasValue = parseFloat(campaign.roas?.replace(/[^0-9.]/g, "") ?? "0");
    const spendValue = parseFloat(campaign.spend?.replace(/[^0-9.]/g, "") ?? "0");
    const budgetValue = parseFloat(campaign.budget?.replace(/[^0-9.]/g, "") ?? "0");

    // Use per-campaign ROAS threshold if set, otherwise fall back to global
    const effectiveRoasThreshold =
      override?.roasDropThreshold != null
        ? override.roasDropThreshold
        : config.roasDropThreshold;

    // Use per-campaign budget alert setting if set
    const budgetAlertEnabled =
      override != null ? override.budgetAlertEnabled : true;

    // ── ROAS Drop Alert ────────────────────────────────────────────────────────────────────────
    if (roasValue > 0 && roasValue < effectiveRoasThreshold) {
      const notification = await addNotification({
        type: "roas_drop",
        title: `⚠️ ROAS Drop — ${campaign.name}`,
        body: `ROAS fell to ${campaign.roas} (below ${effectiveRoasThreshold}x threshold). Consider pausing or optimizing.`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        data: { roas: roasValue, threshold: config.roasDropThreshold },
      });

      // Only send push if not in quiet hours
      if (hasPermission && !isInQuietHours) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: { notificationId: notification.id, type: "roas_drop", campaignId: campaign.id },
            categoryIdentifier: "campaign-alerts",
          },
          trigger: null, // Show immediately
        }).catch(() => {});
      }
    }

    // ── Budget Exhausted Alert ───────────────────────────────────────────────
    if (budgetAlertEnabled && budgetValue > 0 && spendValue > 0) {
      const spendPercent = (spendValue / budgetValue) * 100;
      if (spendPercent >= config.budgetExhaustedPercent) {
        const notification = await addNotification({
          type: "budget_exhausted",
          title: `💸 Budget Alert — ${campaign.name}`,
          body: `${Math.round(spendPercent)}% of daily budget spent ($${spendValue.toFixed(0)} of $${budgetValue.toFixed(0)}). Campaign may stop soon.`,
          campaignId: campaign.id,
          campaignName: campaign.name,
          data: { spendPercent, spend: spendValue, budget: budgetValue },
        });

        // Only send push if not in quiet hours
        if (hasPermission && !isInQuietHours) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.title,
              body: notification.body,
              data: { notificationId: notification.id, type: "budget_exhausted", campaignId: campaign.id },
              categoryIdentifier: "campaign-alerts",
            },
            trigger: null,
          }).catch(() => {});
        }
      }
    }
  }
}

/**
 * Add an optimization result notification (called after AI optimization completes).
 */
export async function addOptimizationNotification(
  campaignId: string,
  campaignName: string,
  improvement: string
): Promise<void> {
  await addNotification({
    type: "optimization",
    title: `✅ Optimization Applied — ${campaignName}`,
    body: `${improvement} Budget reallocated for better performance.`,
    campaignId,
    campaignName,
  });

  if (Platform.OS === "web") return;
  const hasPermission = await getNotificationPermissionStatus();
  if (hasPermission !== "granted") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `✅ Campaign Optimized`,
      body: `"${campaignName}" has been optimized. ${improvement}`,
      data: { type: "optimization", campaignId },
      categoryIdentifier: "optimization",
    },
    trigger: null,
  }).catch(() => {});
}

// ── Daily Performance Digest ─────────────────────────────────────────────────

const DIGEST_SCHEDULED_KEY = "@clickeros:digest_scheduled_date";

/**
 * Schedule the daily performance digest push notification at 9 AM.
 * Only schedules once per day — checks AsyncStorage to avoid duplicates.
 *
 * @param campaigns - Current campaign data for the summary
 */
export async function scheduleDailyDigest(
  campaigns: Array<{
    id: string;
    name: string;
    roas: string;
    spend: string;
    status: string;
  }>,
  digestHour: number = 9
): Promise<void> {
  if (Platform.OS === "web") return;

  const hasPermission = await getNotificationPermissionStatus();
  if (hasPermission !== "granted") return;

  // Only schedule once per calendar day
  const today = new Date().toDateString();
  try {
    const lastScheduled = await AsyncStorage.getItem(DIGEST_SCHEDULED_KEY);
    if (lastScheduled === today) return; // Already scheduled today
    await AsyncStorage.setItem(DIGEST_SCHEDULED_KEY, today);
  } catch {}

  // Build digest summary
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "Active" || c.status === "Scaling"
  );

  const roasValues = activeCampaigns
    .map((c) => parseFloat(c.roas?.replace(/[^0-9.]/g, "") ?? "0"))
    .filter((v) => v > 0);

  const avgRoas = roasValues.length > 0
    ? (roasValues.reduce((a, b) => a + b, 0) / roasValues.length).toFixed(1)
    : "N/A";

  const totalSpend = campaigns
    .map((c) => parseFloat(c.spend?.replace(/[^0-9.]/g, "") ?? "0"))
    .reduce((a, b) => a + b, 0);

  const topCampaign = activeCampaigns.sort((a, b) => {
    const ra = parseFloat(a.roas?.replace(/[^0-9.]/g, "") ?? "0");
    const rb = parseFloat(b.roas?.replace(/[^0-9.]/g, "") ?? "0");
    return rb - ra;
  })[0];

  const title = `📊 Daily Performance Digest`;
  const body = [
    `${activeCampaigns.length} active campaign${activeCampaigns.length !== 1 ? "s" : ""}`,
    `Avg ROAS: ${avgRoas}x`,
    `Total spend: $${totalSpend.toFixed(0)}`,
    topCampaign ? `Top: ${topCampaign.name} (${topCampaign.roas})` : null,
  ].filter(Boolean).join(" · ");

  // Schedule for the configured digest hour (or tomorrow if already past)
  const now = new Date();
  const digestTime = new Date();
  digestTime.setHours(digestHour, 0, 0, 0);
  if (digestTime <= now) {
    // Already past the digest hour today — schedule for tomorrow
    digestTime.setDate(digestTime.getDate() + 1);
  }

  const secondsUntilDigest = Math.floor((digestTime.getTime() - now.getTime()) / 1000);

  // Store as in-app notification too
  await addNotification({
    type: "system",
    title,
    body,
  });

  // Schedule the push
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: "daily_digest" },
      categoryIdentifier: "system",
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntilDigest },
  }).catch(() => {});
}

// ── Weekly Performance Report ───────────────────────────────────────────────

const WEEKLY_REPORT_KEY = "@clickeros:weekly_report_scheduled";

/**
 * Schedule the weekly performance report for next Monday at the configured hour.
 * Only schedules once per week — checks AsyncStorage to avoid duplicates.
 *
 * @param campaigns - Current campaign data for the summary
 * @param digestHour - Hour to send the report (0-23), default 9
 */
export async function scheduleWeeklyReport(
  campaigns: Array<{
    id: string;
    name: string;
    roas: string;
    spend: string;
    budget: string;
    status: string;
  }>,
  digestHour: number = 9
): Promise<void> {
  if (Platform.OS === "web") return;

  const hasPermission = await getNotificationPermissionStatus();
  if (hasPermission !== "granted") return;

  // Only schedule once per week (ISO week number)
  const now = new Date();
  const weekKey = `${now.getFullYear()}-W${Math.ceil((now.getDate() - now.getDay() + 1) / 7)}`;
  try {
    const lastScheduled = await AsyncStorage.getItem(WEEKLY_REPORT_KEY);
    if (lastScheduled === weekKey) return;
    await AsyncStorage.setItem(WEEKLY_REPORT_KEY, weekKey);
  } catch {}

  // Build weekly summary
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "Active" || c.status === "Scaling"
  );

  const roasValues = campaigns
    .map((c) => parseFloat(c.roas?.replace(/[^0-9.]/g, "") ?? "0"))
    .filter((v) => v > 0);

  const sortedByRoas = [...campaigns].sort((a, b) => {
    const ra = parseFloat(a.roas?.replace(/[^0-9.]/g, "") ?? "0");
    const rb = parseFloat(b.roas?.replace(/[^0-9.]/g, "") ?? "0");
    return rb - ra;
  });

  const bestRoas = sortedByRoas[0];
  const worstRoas = sortedByRoas[sortedByRoas.length - 1];
  const top3 = sortedByRoas.slice(0, 3);

  const totalSpend = campaigns
    .map((c) => parseFloat(c.spend?.replace(/[^0-9.]/g, "") ?? "0"))
    .reduce((a, b) => a + b, 0);

  const totalBudget = campaigns
    .map((c) => parseFloat(c.budget?.replace(/[^0-9.]/g, "") ?? "0"))
    .reduce((a, b) => a + b, 0);

  const avgRoas = roasValues.length > 0
    ? (roasValues.reduce((a, b) => a + b, 0) / roasValues.length).toFixed(1)
    : "N/A";

  const title = `📊 Weekly Performance Report`;
  const body = [
    `${activeCampaigns.length} active campaigns`,
    `Avg ROAS: ${avgRoas}x`,
    `Spend: $${totalSpend.toFixed(0)} / $${totalBudget.toFixed(0)}`,
    bestRoas ? `Best: ${bestRoas.name} (${bestRoas.roas})` : null,
    worstRoas && worstRoas.id !== bestRoas?.id ? `Needs attention: ${worstRoas.name} (${worstRoas.roas})` : null,
  ].filter(Boolean).join(" · ");

  // Store as in-app notification
  await addNotification({
    type: "system",
    title,
    body,
  });

  // Find next Monday
  const nextMonday = new Date();
  const dayOfWeek = nextMonday.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysUntilMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  nextMonday.setHours(digestHour, 0, 0, 0);

  const secondsUntilMonday = Math.floor((nextMonday.getTime() - now.getTime()) / 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: "weekly_report" },
      categoryIdentifier: "system",
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntilMonday },
  }).catch(() => {});
}

// ── Notification Icon Config ──────────────────────────────────────────────────

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  roas_drop:        "⚠️",
  budget_exhausted: "💸",
  optimization:     "✅",
  campaign_paused:  "⏸️",
  system:           "ℹ️",
  achievement:      "🏆",
};

export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  roas_drop:        "#F59E0B",
  budget_exhausted: "#EF4444",
  optimization:     "#22C55E",
  campaign_paused:  "#6B7280",
  system:           "#3B82F6",
  achievement:      "#7C3AED",
};
