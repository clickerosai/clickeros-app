/**
 * useSettingsSync — Syncs notification settings and campaign overrides
 * between AsyncStorage (local/offline) and the database (cross-device).
 *
 * Strategy:
 * 1. On mount: load from AsyncStorage immediately (fast, offline-first)
 * 2. If user is authenticated: fetch from DB and merge (DB wins for newer data)
 * 3. On save: write to AsyncStorage AND DB simultaneously
 *
 * Usage:
 *   const { syncSettingsToDb, syncOverridesToDb } = useSettingsSync();
 */
import { useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import {
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from "@/app/notification-settings";
import {
  getCampaignAlertOverrides,
  saveCampaignAlertOverride,
  type CampaignAlertOverride,
} from "@/components/campaign-alert-sheet";

export function useSettingsSync() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // ── tRPC mutations ──────────────────────────────────────────────────────────
  const saveSettingsMutation = trpc.userSettings.saveNotificationSettings.useMutation();
  const saveOverrideMutation = trpc.userSettings.saveCampaignOverride.useMutation();
  const deleteOverrideMutation = trpc.userSettings.deleteCampaignOverride.useMutation();

  // ── Sync FROM DB on login ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncFromDb = async () => {
      try {
        // Fetch settings from DB
        const dbSettings = await utils.userSettings.getNotificationSettings.fetch();
        if (dbSettings) {
          // Merge DB settings into local AsyncStorage (DB wins)
          const localSettings = await getNotificationSettings();
          const merged: NotificationSettings = {
            ...localSettings,
            enabled: dbSettings.enabled,
            roasDropThreshold: dbSettings.roasDropThreshold
              ? parseFloat(dbSettings.roasDropThreshold)
              : localSettings.roasDropThreshold,
            budgetExhaustedPercent: dbSettings.budgetExhaustedPercent ?? localSettings.budgetExhaustedPercent,
            frequency: (dbSettings.frequency as NotificationSettings["frequency"]) ?? localSettings.frequency,
            quietHoursEnabled: dbSettings.quietHoursEnabled,
            quietHoursStart: dbSettings.quietHoursStart ?? localSettings.quietHoursStart,
            quietHoursEnd: dbSettings.quietHoursEnd ?? localSettings.quietHoursEnd,
            digestHour: dbSettings.digestHour ?? localSettings.digestHour,
            weeklyReportEnabled: dbSettings.weeklyReportEnabled,
            types: (dbSettings.types as Record<string, boolean> | null | undefined) ?? localSettings.types,
          };
          await saveNotificationSettings(merged);
          console.log("[SettingsSync] Synced notification settings from DB");
        }

        // Fetch campaign overrides from DB
        const dbOverrides = await utils.userSettings.getCampaignOverrides.fetch();
        if (dbOverrides && Object.keys(dbOverrides).length > 0) {
          // Merge DB overrides into local AsyncStorage
          for (const [campaignId, override] of Object.entries(dbOverrides)) {
            await saveCampaignAlertOverride(override as CampaignAlertOverride);
          }
          console.log("[SettingsSync] Synced campaign overrides from DB:", Object.keys(dbOverrides).length);
        }
      } catch (err) {
        // Non-critical — local data is still used
        console.warn("[SettingsSync] Failed to sync from DB:", err);
      }
    };

    syncFromDb();
  }, [isAuthenticated, user?.id]);

  // ── Sync notification settings TO DB ───────────────────────────────────────
  const syncSettingsToDb = useCallback(async (settings: NotificationSettings) => {
    if (!isAuthenticated) return;
    try {
      await saveSettingsMutation.mutateAsync({
        enabled: settings.enabled,
        types: settings.types,
        roasDropThreshold: String(settings.roasDropThreshold),
        budgetExhaustedPercent: settings.budgetExhaustedPercent,
        frequency: settings.frequency,
        quietHoursEnabled: settings.quietHoursEnabled,
        quietHoursStart: settings.quietHoursStart,
        quietHoursEnd: settings.quietHoursEnd,
        digestHour: settings.digestHour,
        weeklyReportEnabled: settings.weeklyReportEnabled,
      });
      console.log("[SettingsSync] Notification settings synced to DB");
    } catch (err) {
      console.warn("[SettingsSync] Failed to sync settings to DB:", err);
    }
  }, [isAuthenticated, saveSettingsMutation]);

  // ── Sync campaign override TO DB ────────────────────────────────────────────
  const syncOverrideToDb = useCallback(async (override: CampaignAlertOverride) => {
    if (!isAuthenticated) return;
    try {
      await saveOverrideMutation.mutateAsync({
        campaignId: override.campaignId,
        enabled: override.enabled,
        roasDropThreshold: override.roasDropThreshold != null
          ? String(override.roasDropThreshold)
          : null,
        budgetAlertEnabled: override.budgetAlertEnabled,
      });
      console.log("[SettingsSync] Campaign override synced to DB:", override.campaignId);
    } catch (err) {
      console.warn("[SettingsSync] Failed to sync override to DB:", err);
    }
  }, [isAuthenticated, saveOverrideMutation]);

  // ── Delete campaign override FROM DB ───────────────────────────────────────
  const deleteOverrideFromDb = useCallback(async (campaignId: string) => {
    if (!isAuthenticated) return;
    try {
      await deleteOverrideMutation.mutateAsync({ campaignId });
      console.log("[SettingsSync] Campaign override deleted from DB:", campaignId);
    } catch (err) {
      console.warn("[SettingsSync] Failed to delete override from DB:", err);
    }
  }, [isAuthenticated, deleteOverrideMutation]);

  return {
    syncSettingsToDb,
    syncOverrideToDb,
    deleteOverrideFromDb,
    isSyncing: saveSettingsMutation.isPending || saveOverrideMutation.isPending,
  };
}
