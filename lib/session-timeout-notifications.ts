/**
 * Session Timeout Notifications — Push and in-app alerts for session expiry warning.
 *
 * Sends:
 * - Push notification (native only): "Your session will expire in 60 seconds"
 * - In-app notification: Stored in AsyncStorage for notification center
 */

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const SESSION_TIMEOUT_NOTIFICATION_KEY = "@clickeros:session_timeout_notif";

/**
 * Send a push notification warning about session timeout.
 * Only works on native platforms (iOS/Android).
 */
export async function sendSessionTimeoutWarningPush(): Promise<void> {
  if (Platform.OS === "web") {
    console.log("[SessionTimeoutNotif] Skipping push on web platform");
    return;
  }

  try {
    console.log("[SessionTimeoutNotif] Sending session timeout warning push...");

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Session Expiring Soon",
        body: "Your session will expire in 60 seconds due to inactivity. Please interact with the app to stay logged in.",
        sound: "default",
        badge: 1,
        data: {
          type: "session_timeout_warning",
          timestamp: new Date().toISOString(),
        },
      },
      trigger: null, // Send immediately
    });

    console.log("[SessionTimeoutNotif] Push notification sent successfully");
  } catch (error) {
    console.error("[SessionTimeoutNotif] Failed to send push:", error);
  }
}

/**
 * Add a session timeout warning to the in-app notification center.
 */
export async function addSessionTimeoutWarningNotification(): Promise<void> {
  try {
    console.log("[SessionTimeoutNotif] Adding in-app notification...");

    const notificationId = `session-timeout-${Date.now()}`;
    const notification = {
      id: notificationId,
      type: "session_timeout_warning" as const,
      title: "Session Expiring Soon",
      message: "Your session will expire in 60 seconds due to inactivity.",
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: null,
    };

    // Store in AsyncStorage (similar to campaign alerts)
    const raw = await AsyncStorage.getItem(SESSION_TIMEOUT_NOTIFICATION_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [notification, ...existing].slice(0, 50); // Keep last 50
    await AsyncStorage.setItem(SESSION_TIMEOUT_NOTIFICATION_KEY, JSON.stringify(updated));

    console.log("[SessionTimeoutNotif] In-app notification added successfully");
  } catch (error) {
    console.error("[SessionTimeoutNotif] Failed to add in-app notification:", error);
  }
}

/**
 * Get all session timeout notifications from storage.
 */
export async function getSessionTimeoutNotifications(): Promise<any[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_TIMEOUT_NOTIFICATION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("[SessionTimeoutNotif] Failed to get notifications:", error);
    return [];
  }
}

/**
 * Clear all session timeout notifications.
 */
export async function clearSessionTimeoutNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_TIMEOUT_NOTIFICATION_KEY);
    console.log("[SessionTimeoutNotif] Notifications cleared");
  } catch (error) {
    console.error("[SessionTimeoutNotif] Failed to clear notifications:", error);
  }
}

/**
 * Send both push and in-app notifications for session timeout warning.
 * Call this when the warning modal is shown (9 minutes of inactivity).
 */
export async function sendSessionTimeoutWarnings(): Promise<void> {
  console.log("[SessionTimeoutNotif] Sending all session timeout warnings...");

  // Send push notification (native only)
  await sendSessionTimeoutWarningPush().catch(() => {});

  // Add to in-app notification center
  await addSessionTimeoutWarningNotification().catch(() => {});

  console.log("[SessionTimeoutNotif] All warnings sent");
}
