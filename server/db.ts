import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, wildfires, earthquakes, chatMessages, InsertWildfire, InsertEarthquake, InsertChatMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

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
      values.role = 'admin';
      updateSet.role = 'admin';
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

export async function getWildfiresByBoundingBox(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  daysBack: number = 1
) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  try {
    const result = await db
      .select()
      .from(wildfires)
      .where(
        and(
          sql`CAST(${wildfires.latitude} AS DECIMAL(10,6)) >= ${minLat}`,
          sql`CAST(${wildfires.latitude} AS DECIMAL(10,6)) <= ${maxLat}`,
          sql`CAST(${wildfires.longitude} AS DECIMAL(10,6)) >= ${minLon}`,
          sql`CAST(${wildfires.longitude} AS DECIMAL(10,6)) <= ${maxLon}`,
          gte(wildfires.fetchedAt, cutoffDate)
        )
      )
      .limit(10000);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get wildfires:", error);
    return [];
  }
}

export async function getEarthquakesByBoundingBox(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  daysBack: number = 7
) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  try {
    const result = await db
      .select()
      .from(earthquakes)
      .where(
        and(
          sql`CAST(${earthquakes.latitude} AS DECIMAL(10,6)) >= ${minLat}`,
          sql`CAST(${earthquakes.latitude} AS DECIMAL(10,6)) <= ${maxLat}`,
          sql`CAST(${earthquakes.longitude} AS DECIMAL(10,6)) >= ${minLon}`,
          sql`CAST(${earthquakes.longitude} AS DECIMAL(10,6)) <= ${maxLon}`,
          gte(earthquakes.fetchedAt, cutoffDate)
        )
      )
      .limit(10000);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get earthquakes:", error);
    return [];
  }
}

export async function upsertWildfire(fire: InsertWildfire): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(wildfires).values(fire).onDuplicateKeyUpdate({
      set: {
        brightness: fire.brightness,
        confidence: fire.confidence,
        fetchedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert wildfire:", error);
  }
}

export async function upsertEarthquake(eq: InsertEarthquake): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(earthquakes).values(eq).onDuplicateKeyUpdate({
      set: {
        magnitude: eq.magnitude,
        depth: eq.depth,
        fetchedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert earthquake:", error);
  }
}

export async function getChatMessages(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
    return result.reverse();
  } catch (error) {
    console.error("[Database] Failed to get chat messages:", error);
    return [];
  }
}

export async function insertChatMessage(msg: InsertChatMessage): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(chatMessages).values(msg);
  } catch (error) {
    console.error("[Database] Failed to insert chat message:", error);
  }
}

// TODO: add feature queries here as your schema grows.
