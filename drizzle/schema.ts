import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── User Notification Settings ────────────────────────────────────────────────

/**
 * Stores per-user notification preferences.
 * One row per user — upserted on save.
 * Synced to/from AsyncStorage for offline-first support.
 */
export const userNotificationSettings = mysqlTable("user_notification_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),

  // Master toggle
  enabled: boolean("enabled").default(true).notNull(),

  // Type toggles (stored as JSON for flexibility)
  types: json("types").$type<Record<string, boolean>>(),

  // Thresholds
  roasDropThreshold: varchar("roasDropThreshold", { length: 10 }).default("2.0"),
  budgetExhaustedPercent: int("budgetExhaustedPercent").default(90),

  // Frequency: immediate | hourly | daily
  frequency: varchar("frequency", { length: 20 }).default("immediate"),

  // Quiet Hours
  quietHoursEnabled: boolean("quietHoursEnabled").default(false).notNull(),
  quietHoursStart: int("quietHoursStart").default(22),
  quietHoursEnd: int("quietHoursEnd").default(8),

  // Digest & Weekly Report
  digestHour: int("digestHour").default(9),
  weeklyReportEnabled: boolean("weeklyReportEnabled").default(true).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserNotificationSettings = typeof userNotificationSettings.$inferSelect;
export type InsertUserNotificationSettings = typeof userNotificationSettings.$inferInsert;

// ── Campaign Alert Overrides ──────────────────────────────────────────────────

/**
 * Stores per-user, per-campaign alert threshold overrides.
 * Multiple rows per user (one per campaign that has a custom override).
 * Synced to/from AsyncStorage for offline-first support.
 */
export const campaignAlertOverrides = mysqlTable("campaign_alert_overrides", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: varchar("campaignId", { length: 64 }).notNull(),

  // Override settings
  enabled: boolean("enabled").default(true).notNull(),
  roasDropThreshold: varchar("roasDropThreshold", { length: 10 }), // null = use global
  budgetAlertEnabled: boolean("budgetAlertEnabled").default(true).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CampaignAlertOverride = typeof campaignAlertOverrides.$inferSelect;
export type InsertCampaignAlertOverride = typeof campaignAlertOverrides.$inferInsert;
