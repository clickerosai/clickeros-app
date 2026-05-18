/**
 * Notification Settings Screen
 *
 * Lets users configure:
 * - Which notification types to receive (toggles)
 * - ROAS drop alert threshold (1.0x, 1.5x, 2.0x, 2.5x, 3.0x)
 * - Budget exhausted alert threshold (70%, 80%, 90%, 95%)
 * - Notification frequency (immediate, hourly, daily digest)
 *
 * All settings persisted in AsyncStorage.
 */
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToast } from "@/components/toast";
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  type NotificationType,
} from "@/lib/notifications";

const SETTINGS_KEY = "@clickeros:notification_settings";

// ── Default Settings ──────────────────────────────────────────────────────────

export interface NotificationSettings {
  // Type toggles
  enabled: boolean;
  types: Record<NotificationType, boolean>;
  // Thresholds
  roasDropThreshold: number;
  budgetExhaustedPercent: number;
  // Frequency
  frequency: "immediate" | "hourly" | "daily";
  // Quiet Hours (Do Not Disturb)
  quietHoursEnabled: boolean;
  quietHoursStart: number; // 0-23 (hour of day, 24h format)
  quietHoursEnd: number;   // 0-23
  // Digest & Weekly Report
  digestHour: number;          // Hour to send daily digest (0-23), default 9
  weeklyReportEnabled: boolean; // Send weekly Monday report
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  types: {
    roas_drop:        true,
    budget_exhausted: true,
    optimization:     true,
    campaign_paused:  false,
    system:           true,
    achievement:      true,
  },
  roasDropThreshold: 2.0,
  budgetExhaustedPercent: 90,
  frequency: "immediate",
  quietHoursEnabled: false,
  quietHoursStart: 22, // 10 PM
  quietHoursEnd: 8,    // 8 AM
  digestHour: 9,       // 9 AM
  weeklyReportEnabled: true,
};

/**
 * Check if the current time falls within quiet hours.
 * Returns true if notifications should be suppressed.
 */
export function isQuietHours(settings: NotificationSettings): boolean {
  if (!settings.quietHoursEnabled) return false;
  const now = new Date();
  const currentHour = now.getHours();
  const { quietHoursStart: start, quietHoursEnd: end } = settings;
  // Handle overnight window (e.g., 22 to 8)
  if (start > end) {
    return currentHour >= start || currentHour < end;
  }
  // Same-day window (e.g., 13 to 17)
  return currentHour >= start && currentHour < end;
}

/**
 * Format a 24h hour number to a human-readable 12h string.
 */
export function formatHour(hour: number): string {
  if (hour === 0)  return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour < 12)   return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

// ── UI Helpers ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<NotificationType, { label: string; desc: string; icon: string }> = {
  roas_drop:        { label: "ROAS Drop Alerts",       desc: "When ROAS falls below your threshold",         icon: "⚠️" },
  budget_exhausted: { label: "Budget Alerts",           desc: "When daily budget is nearly exhausted",        icon: "💸" },
  optimization:     { label: "Optimization Results",    desc: "When AI optimization is applied",              icon: "✅" },
  campaign_paused:  { label: "Campaign Status Changes", desc: "When campaigns are paused or resumed",         icon: "⏸️" },
  system:           { label: "System Notifications",    desc: "Account updates and platform announcements",   icon: "ℹ️" },
  achievement:      { label: "Achievements",            desc: "Milestones and performance celebrations",      icon: "🏆" },
};

const ROAS_THRESHOLDS = [
  { value: 1.0, label: "Below 1.0x", desc: "Losing money" },
  { value: 1.5, label: "Below 1.5x", desc: "Low performance" },
  { value: 2.0, label: "Below 2.0x", desc: "Recommended" },
  { value: 2.5, label: "Below 2.5x", desc: "Moderate" },
  { value: 3.0, label: "Below 3.0x", desc: "High standard" },
];

const BUDGET_THRESHOLDS = [
  { value: 70,  label: "70% spent",  desc: "Early warning" },
  { value: 80,  label: "80% spent",  desc: "Moderate warning" },
  { value: 90,  label: "90% spent",  desc: "Recommended" },
  { value: 95,  label: "95% spent",  desc: "Late warning" },
];

const FREQUENCIES = [
  { value: "immediate" as const, label: "Immediate",    desc: "As soon as alerts trigger" },
  { value: "hourly"    as const, label: "Hourly Digest", desc: "Bundled once per hour" },
  { value: "daily"     as const, label: "Daily Digest",  desc: "Once per day summary" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "undetermined">("undetermined");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getNotificationSettings(),
      getNotificationPermissionStatus(),
    ]).then(([savedSettings, status]) => {
      setSettings(savedSettings);
      setPermissionStatus(status);
    });
  }, []);

  const handleSave = useCallback(async (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    setIsSaving(true);
    await saveNotificationSettings(newSettings);
    setIsSaving(false);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleToggleEnabled = useCallback(async (value: boolean) => {
    if (value && permissionStatus !== "granted") {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Notifications Disabled",
          "To receive campaign alerts, please enable notifications in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:").catch(() => {
                  Linking.openURL("android.settings.APP_NOTIFICATION_SETTINGS").catch(() => {});
                });
              },
            },
          ]
        );
        return;
      }
      setPermissionStatus("granted");
    }
    await handleSave({ ...settings, enabled: value });
  }, [settings, permissionStatus, handleSave]);

  const handleToggleType = useCallback(async (type: NotificationType, value: boolean) => {
    await handleSave({
      ...settings,
      types: { ...settings.types, [type]: value },
    });
  }, [settings, handleSave]);

  const handleResetDefaults = useCallback(() => {
    Alert.alert(
      "Reset to Defaults",
      "This will reset all notification settings to their default values.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await handleSave(DEFAULT_NOTIFICATION_SETTINGS);
            showToast({
              type: "success",
              message: "Settings reset to defaults",
              duration: 2500,
            });
          },
        },
      ]
    );
  }, [handleSave, showToast]);

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      setPermissionStatus("granted");
      showToast({
        type: "success",
        message: "Notifications enabled ✅",
        subMessage: "You'll now receive campaign alerts.",
        duration: 3000,
      });
    } else {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in your device settings to receive campaign alerts.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openURL("app-settings:").catch(() => {}),
          },
        ]
      );
    }
  }, [showToast]);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>
            Notification Settings
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, marginTop: 4 }}>
            Configure when and how you receive campaign alerts
          </Text>
        </View>

        {/* Permission Banner */}
        {permissionStatus !== "granted" && (
          <View style={{ marginHorizontal: r.px, marginTop: 16 }}>
            <View style={{ backgroundColor: "#FEF9C3", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FDE68A", flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ fontSize: 22, flexShrink: 0 }}>🔔</Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: "#92400E", fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 2 }}>
                  Notifications are disabled
                </Text>
                <Text style={{ color: "#78350F", fontSize: r.fontSize.xs, lineHeight: 16 }}>
                  Enable notifications to receive ROAS drop and budget alerts.
                </Text>
              </View>
              <TouchableOpacity
                style={{ backgroundColor: "#F59E0B", borderRadius: 8, paddingHorizontal: 12, height: 36, alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                onPress={handleRequestPermission}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.xs, fontWeight: "700" }}>Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Master Toggle */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Master Control
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: r.isXs ? 14 : 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>All Notifications</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                {settings.enabled ? "Notifications are on" : "All notifications are off"}
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggleEnabled}
              trackColor={{ false: colors.border, true: "#7C3AED" }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Alert Types
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            {(Object.keys(TYPE_LABELS) as NotificationType[]).map((type, idx) => {
              const info = TYPE_LABELS[type];
              return (
                <View
                  key={type}
                  style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: r.isXs ? 14 : 16, minHeight: 56, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border, gap: 12 }}
                >
                  <Text style={{ fontSize: 18, flexShrink: 0 }}>{info.icon}</Text>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>{info.label}</Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }} numberOfLines={1}>{info.desc}</Text>
                  </View>
                  <Switch
                    value={settings.types[type]}
                    onValueChange={(v) => handleToggleType(type, v)}
                    disabled={!settings.enabled}
                    trackColor={{ false: colors.border, true: "#7C3AED" }}
                    thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* ROAS Drop Threshold */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled && settings.types.roas_drop ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            ROAS Drop Threshold
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, marginBottom: 10, lineHeight: 18 }}>
            Alert me when ROAS falls below:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {ROAS_THRESHOLDS.map((t) => {
              const selected = settings.roasDropThreshold === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: selected ? "#7C3AED" : colors.border, backgroundColor: selected ? "#7C3AED10" : colors.background, alignItems: "center" }}
                  onPress={() => handleSave({ ...settings, roasDropThreshold: t.value })}
                  activeOpacity={0.7}
                  disabled={!settings.enabled || !settings.types.roas_drop}
                >
                  <Text style={{ color: selected ? "#7C3AED" : colors.foreground, fontSize: r.fontSize.base, fontWeight: selected ? "700" : "500" }}>{t.label}</Text>
                  <Text style={{ color: selected ? "#7C3AED" : colors.muted, fontSize: r.fontSize.xs, marginTop: 2, opacity: 0.8 }}>{t.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Budget Threshold */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled && settings.types.budget_exhausted ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Budget Alert Threshold
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, marginBottom: 10, lineHeight: 18 }}>
            Alert me when daily budget reaches:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {BUDGET_THRESHOLDS.map((t) => {
              const selected = settings.budgetExhaustedPercent === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: selected ? "#EF4444" : colors.border, backgroundColor: selected ? "#EF444410" : colors.background, alignItems: "center" }}
                  onPress={() => handleSave({ ...settings, budgetExhaustedPercent: t.value })}
                  activeOpacity={0.7}
                  disabled={!settings.enabled || !settings.types.budget_exhausted}
                >
                  <Text style={{ color: selected ? "#EF4444" : colors.foreground, fontSize: r.fontSize.base, fontWeight: selected ? "700" : "500" }}>{t.label}</Text>
                  <Text style={{ color: selected ? "#EF4444" : colors.muted, fontSize: r.fontSize.xs, marginTop: 2, opacity: 0.8 }}>{t.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Frequency */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Alert Frequency
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            {FREQUENCIES.map((f, idx) => {
              const selected = settings.frequency === f.value;
              return (
                <TouchableOpacity
                  key={f.value}
                  style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: r.isXs ? 14 : 16, minHeight: 56, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border, gap: 12 }}
                  onPress={() => handleSave({ ...settings, frequency: f.value })}
                  activeOpacity={0.7}
                  disabled={!settings.enabled}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: selected ? "#7C3AED" : colors.foreground, fontSize: r.fontSize.base, fontWeight: selected ? "700" : "500" }}>{f.label}</Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>{f.desc}</Text>
                  </View>
                  {selected && <IconSymbol name="checkmark.circle.fill" size={20} color="#7C3AED" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Current Settings Summary */}
        <View style={{ marginHorizontal: r.px, marginTop: 20 }}>
          <View style={{ backgroundColor: "#7C3AED10", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 10 }}>
              📋 Current Alert Configuration
            </Text>
            {[
              { label: "ROAS Alert", value: `Below ${settings.roasDropThreshold}x` },
              { label: "Budget Alert", value: `At ${settings.budgetExhaustedPercent}% spent` },
              { label: "Frequency", value: FREQUENCIES.find((f) => f.value === settings.frequency)?.label ?? "Immediate" },
              { label: "Active Types", value: `${Object.values(settings.types).filter(Boolean).length} of ${Object.keys(settings.types).length}` },
            ].map((row) => (
              <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.xs, fontWeight: "600" }}>{row.label}</Text>
                <Text style={{ color: "#4C1D95", fontSize: r.fontSize.xs, fontWeight: "700" }}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quiet Hours (Do Not Disturb) */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Do Not Disturb
          </Text>
          {/* Master quiet hours toggle */}
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: r.isXs ? 14 : 16, minHeight: 56, gap: 12 }}>
              <Text style={{ fontSize: 18, flexShrink: 0 }}>🌙</Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>Quiet Hours</Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                  {settings.quietHoursEnabled
                    ? `Silenced ${formatHour(settings.quietHoursStart)} – ${formatHour(settings.quietHoursEnd)}`
                    : "Alerts sent at any time"}
                </Text>
              </View>
              <Switch
                value={settings.quietHoursEnabled}
                onValueChange={(v) => handleSave({ ...settings, quietHoursEnabled: v })}
                disabled={!settings.enabled}
                trackColor={{ false: colors.border, true: "#7C3AED" }}
                thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
              />
            </View>

            {/* Time pickers — shown when quiet hours enabled */}
            {settings.quietHoursEnabled && (
              <>
                <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "600", paddingHorizontal: r.isXs ? 14 : 16, paddingTop: 12, paddingBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Start Time</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: r.isXs ? 14 : 16, paddingBottom: 12 }}>
                    {[20, 21, 22, 23, 0].map((h) => {
                      const sel = settings.quietHoursStart === h;
                      return (
                        <TouchableOpacity
                          key={h}
                          style={{ paddingHorizontal: 10, height: 36, borderRadius: 8, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, justifyContent: "center" }}
                          onPress={() => handleSave({ ...settings, quietHoursStart: h })}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.xs, fontWeight: sel ? "700" : "400" }}>{formatHour(h)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "600", paddingHorizontal: r.isXs ? 14 : 16, paddingTop: 12, paddingBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>End Time</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: r.isXs ? 14 : 16, paddingBottom: 12 }}>
                    {[5, 6, 7, 8, 9, 10].map((h) => {
                      const sel = settings.quietHoursEnd === h;
                      return (
                        <TouchableOpacity
                          key={h}
                          style={{ paddingHorizontal: 10, height: 36, borderRadius: 8, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, justifyContent: "center" }}
                          onPress={() => handleSave({ ...settings, quietHoursEnd: h })}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.xs, fontWeight: sel ? "700" : "400" }}>{formatHour(h)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
          </View>
          {settings.quietHoursEnabled && (
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 6, lineHeight: 16 }}>
              🌙 Alerts will be silenced from {formatHour(settings.quietHoursStart)} to {formatHour(settings.quietHoursEnd)}. Urgent alerts may still appear.
            </Text>
          )}
        </View>

        {/* Digest Time & Weekly Report */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled && settings.frequency === "daily" ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Daily Digest Time
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, marginBottom: 10, lineHeight: 18 }}>
            Send daily digest at: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{formatHour(settings.digestHour)}</Text>
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[6, 7, 8, 9, 10, 11, 12].map((h) => {
              const sel = settings.digestHour === h;
              return (
                <TouchableOpacity
                  key={h}
                  style={{ paddingHorizontal: 12, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, justifyContent: "center" }}
                  onPress={() => handleSave({ ...settings, digestHour: h })}
                  activeOpacity={0.7}
                  disabled={!settings.enabled || settings.frequency !== "daily"}
                >
                  <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "700" : "400" }}>{formatHour(h)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {settings.frequency !== "daily" && (
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 6 }}>
              Set frequency to "Daily Digest" to configure this.
            </Text>
          )}
        </View>

        {/* Weekly Report Toggle */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, opacity: settings.enabled ? 1 : 0.4 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Weekly Report
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: r.isXs ? 14 : 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 18, flexShrink: 0 }}>📅</Text>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>Monday Performance Report</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                Weekly summary every Monday at {formatHour(settings.digestHour)}: campaigns, ROAS, spend, top performers
              </Text>
            </View>
            <Switch
              value={settings.weeklyReportEnabled}
              onValueChange={(v) => handleSave({ ...settings, weeklyReportEnabled: v })}
              disabled={!settings.enabled}
              trackColor={{ false: colors.border, true: "#7C3AED" }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>
        </View>

        {/* Reset Defaults */}
        <View style={{ paddingHorizontal: r.px, marginTop: 16 }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.surface, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
            onPress={handleResetDefaults}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base, fontWeight: "600" }}>
              Reset to Defaults
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
