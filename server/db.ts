import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  userNotificationSettings,
  campaignAlertOverrides,
  type InsertUserNotificationSettings,
  type InsertCampaignAlertOverride,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Notification Settings ────────────────────────────────────────────────────

export async function getUserNotificationSettings(userId: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db
      .select()
      .from(userNotificationSettings)
      .where(eq(userNotificationSettings.userId, userId))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error("[DB] getUserNotificationSettings failed:", err);
    return null;
  }
}

export async function upsertUserNotificationSettings(
  userId: number,
  settings: Omit<InsertUserNotificationSettings, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(userNotificationSettings)
      .values({ userId, ...settings })
      .onDuplicateKeyUpdate({ set: settings });
  } catch (err) {
    console.error("[DB] upsertUserNotificationSettings failed:", err);
  }
}

// ── Campaign Alert Overrides ──────────────────────────────────────────────────

export async function getCampaignAlertOverridesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(campaignAlertOverrides)
      .where(eq(campaignAlertOverrides.userId, userId));
  } catch (err) {
    console.error("[DB] getCampaignAlertOverridesForUser failed:", err);
    return [];
  }
}

export async function upsertCampaignAlertOverride(
  userId: number,
  campaignId: string,
  override: Omit<InsertCampaignAlertOverride, "id" | "userId" | "campaignId" | "createdAt" | "updatedAt">
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(campaignAlertOverrides)
      .values({ userId, campaignId, ...override })
      .onDuplicateKeyUpdate({ set: override });
  } catch (err) {
    console.error("[DB] upsertCampaignAlertOverride failed:", err);
  }
}

export async function deleteCampaignAlertOverride(
  userId: number,
  campaignId: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .delete(campaignAlertOverrides)
      .where(
        and(
          eq(campaignAlertOverrides.userId, userId),
          eq(campaignAlertOverrides.campaignId, campaignId)
        )
      );
  } catch (err) {
    console.error("[DB] deleteCampaignAlertOverride failed:", err);
  }
}
