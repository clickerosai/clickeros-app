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
 * Call this periodically (e.g., every 30 minutes) or after each data refresh.
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
  config: CampaignAlertConfig = DEFAULT_ALERT_CONFIG
): Promise<void> {
  if (Platform.OS === "web") return;

  const hasPermission = await requestNotificationPermissions();

  for (const campaign of campaigns) {
    if (campaign.status !== "Active" && campaign.status !== "Scaling") continue;

    const roasValue = parseFloat(campaign.roas?.replace(/[^0-9.]/g, "") ?? "0");
    const spendValue = parseFloat(campaign.spend?.replace(/[^0-9.]/g, "") ?? "0");
    const budgetValue = parseFloat(campaign.budget?.replace(/[^0-9.]/g, "") ?? "0");

    // ── ROAS Drop Alert ──────────────────────────────────────────────────────
    if (roasValue > 0 && roasValue < config.roasDropThreshold) {
      const notification = await addNotification({
        type: "roas_drop",
        title: `⚠️ ROAS Drop — ${campaign.name}`,
        body: `ROAS fell to ${campaign.roas} (below ${config.roasDropThreshold}x threshold). Consider pausing or optimizing.`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        data: { roas: roasValue, threshold: config.roasDropThreshold },
      });

      if (hasPermission) {
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
    if (budgetValue > 0 && spendValue > 0) {
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

        if (hasPermission) {
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
