import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

export const wildfires = mysqlTable("wildfires", {
  id: int("id").autoincrement().primaryKey(),
  latitude: varchar("latitude", { length: 32 }).notNull(),
  longitude: varchar("longitude", { length: 32 }).notNull(),
  brightness: varchar("brightness", { length: 32 }),
  confidence: varchar("confidence", { length: 32 }),
  acqDate: varchar("acqDate", { length: 16 }).notNull(),
  acqTime: varchar("acqTime", { length: 8 }).notNull(),
  satellite: varchar("satellite", { length: 32 }),
  frp: varchar("frp", { length: 32 }),
  daynight: varchar("daynight", { length: 8 }),
  source: varchar("source", { length: 32 }).notNull(),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
});

export type Wildfire = typeof wildfires.$inferSelect;
export type InsertWildfire = typeof wildfires.$inferInsert;

export const earthquakes = mysqlTable("earthquakes", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 64 }).notNull().unique(),
  latitude: varchar("latitude", { length: 32 }).notNull(),
  longitude: varchar("longitude", { length: 32 }).notNull(),
  magnitude: varchar("magnitude", { length: 16 }).notNull(),
  depth: varchar("depth", { length: 16 }),
  place: text("place"),
  time: varchar("time", { length: 32 }).notNull(),
  tsunami: int("tsunami").default(0),
  type: varchar("type", { length: 32 }),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
});

export type Earthquake = typeof earthquakes.$inferSelect;
export type InsertEarthquake = typeof earthquakes.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  role: varchar("role", { length: 16 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// TODO: Add your tables here