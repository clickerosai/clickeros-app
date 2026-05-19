/**
 * User Settings Router
 *
 * tRPC endpoints for syncing user-specific data to the database:
 * - Notification settings (thresholds, quiet hours, frequency, etc.)
 * - Campaign alert overrides (per-campaign ROAS thresholds)
 *
 * All procedures are protected — requires authenticated user.
 * Falls back gracefully when database is unavailable.
 */
import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import {
  getUserNotificationSettings,
  upsertUserNotificationSettings,
  getCampaignAlertOverridesForUser,
  upsertCampaignAlertOverride,
  deleteCampaignAlertOverride,
} from "./db";

// ── Notification Settings ─────────────────────────────────────────────────────

const NotificationSettingsInput = z.object({
  enabled: z.boolean(),
  types: z.record(z.string(), z.boolean()).optional(),
  roasDropThreshold: z.string().optional(),
  budgetExhaustedPercent: z.number().int().min(1).max(100).optional(),
  frequency: z.enum(["immediate", "hourly", "daily"]).optional(),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.number().int().min(0).max(23).optional(),
  quietHoursEnd: z.number().int().min(0).max(23).optional(),
  digestHour: z.number().int().min(0).max(23).optional(),
  weeklyReportEnabled: z.boolean(),
});

// ── Campaign Override ─────────────────────────────────────────────────────────

const CampaignOverrideInput = z.object({
  campaignId: z.string().min(1),
  enabled: z.boolean(),
  roasDropThreshold: z.string().nullable().optional(),
  budgetAlertEnabled: z.boolean(),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const userSettingsRouter = router({
  /**
   * GET /api/trpc/userSettings.getNotificationSettings
   * Returns the authenticated user's notification settings from the DB.
   * Returns null if not yet saved (client should use local defaults).
   */
  getNotificationSettings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) return null;
    return await getUserNotificationSettings(userId);
  }),

  /**
   * POST /api/trpc/userSettings.saveNotificationSettings
   * Upserts the authenticated user's notification settings to the DB.
   * Also call this after any local settings change to keep DB in sync.
   */
  saveNotificationSettings: protectedProcedure
    .input(NotificationSettingsInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!userId) return { success: false, error: "Not authenticated" };

      await upsertUserNotificationSettings(userId, {
        enabled: input.enabled,
        types: (input.types as Record<string, boolean> | null | undefined) ?? null,
        roasDropThreshold: input.roasDropThreshold ?? "2.0",
        budgetExhaustedPercent: input.budgetExhaustedPercent ?? 90,
        frequency: input.frequency ?? "immediate",
        quietHoursEnabled: input.quietHoursEnabled,
        quietHoursStart: input.quietHoursStart ?? 22,
        quietHoursEnd: input.quietHoursEnd ?? 8,
        digestHour: input.digestHour ?? 9,
        weeklyReportEnabled: input.weeklyReportEnabled,
      });

      return { success: true };
    }),

  /**
   * GET /api/trpc/userSettings.getCampaignOverrides
   * Returns all campaign alert overrides for the authenticated user.
   */
  getCampaignOverrides: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) return [];
    const overrides = await getCampaignAlertOverridesForUser(userId);
    // Convert to the same format as AsyncStorage overrides
    return Object.fromEntries(
      overrides.map((o) => [
        o.campaignId,
        {
          campaignId: o.campaignId,
          enabled: o.enabled,
          roasDropThreshold: o.roasDropThreshold ? parseFloat(o.roasDropThreshold) : null,
          budgetAlertEnabled: o.budgetAlertEnabled,
          updatedAt: o.updatedAt?.toISOString() ?? new Date().toISOString(),
        },
      ])
    );
  }),

  /**
   * POST /api/trpc/userSettings.saveCampaignOverride
   * Upserts a single campaign alert override for the authenticated user.
   */
  saveCampaignOverride: protectedProcedure
    .input(CampaignOverrideInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!userId) return { success: false, error: "Not authenticated" };

      await upsertCampaignAlertOverride(userId, input.campaignId, {
        enabled: input.enabled,
        roasDropThreshold: input.roasDropThreshold
          ? String(input.roasDropThreshold)
          : null,
        budgetAlertEnabled: input.budgetAlertEnabled,
      });

      return { success: true };
    }),

  /**
   * POST /api/trpc/userSettings.deleteCampaignOverride
   * Removes a campaign alert override for the authenticated user.
   */
  deleteCampaignOverride: protectedProcedure
    .input(z.object({ campaignId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!userId) return { success: false, error: "Not authenticated" };

      await deleteCampaignAlertOverride(userId, input.campaignId);
      return { success: true };
    }),
});
