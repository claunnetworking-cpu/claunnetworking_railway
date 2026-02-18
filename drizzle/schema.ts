import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

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

// Tabela de Vagas
export const jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  description: text("description"),
  link: text("link").notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  modality: mysqlEnum("modality", ["Presencial", "Remoto", "Híbrido"]).notNull(),
  isPCD: boolean("isPCD").default(false),
  category: mysqlEnum("category", [
    "atendimento",
    "assistente",
    "gestão",
    "saúde",
    "telemarketing",
    "vendas",
    "operacional",
    "tecnologia",
    "marketing",
    "finanças",
    "administrativo",
    "comercial"
  ]),
  status: mysqlEnum("status", ["ativa", "inativa"]).default("ativa"),
  clicks: int("clicks").default(0),
  whatsappShares: int("whatsappShares").default(0),
  expiresAt: timestamp("expiresAt"), // Expira após 30 dias
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// Tabela de Cursos
export const courses = mysqlTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  title: varchar("title", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  description: text("description"),
  link: text("link").notNull(),
  duration: varchar("duration", { length: 100 }), // ex: "40h"
  modality: mysqlEnum("modality", ["Online", "Presencial", "Híbrido"]).notNull(),
  isFree: boolean("isFree").default(false),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
  clicks: int("clicks").default(0),
  whatsappShares: int("whatsappShares").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// Tabela de Links Encurtados
export const shortenedLinks = mysqlTable("shortened_links", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  originalUrl: text("originalUrl").notNull(),
  shortCode: varchar("shortCode", { length: 20 }).notNull().unique(),
  alias: varchar("alias", { length: 255 }),
  clicks: int("clicks").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShortenedLink = typeof shortenedLinks.$inferSelect;
export type InsertShortenedLink = typeof shortenedLinks.$inferInsert;

// Tabela de Métricas de Cliques
export const clickMetrics = mysqlTable("click_metrics", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  resourceType: mysqlEnum("resourceType", ["job", "course", "link"]).notNull(),
  resourceId: varchar("resourceId", { length: 36 }).notNull(),
  clickType: mysqlEnum("clickType", ["redirect", "whatsapp"]).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type ClickMetric = typeof clickMetrics.$inferSelect;
export type InsertClickMetric = typeof clickMetrics.$inferInsert;

// Tabela de Visitas ao Site
export const siteVisits = mysqlTable("site_visits", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertSiteVisit = typeof siteVisits.$inferInsert;
// Tabela de Eventos de Usuario (rastreamento avancado)
export const userEvents = mysqlTable("user_events", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  eventType: mysqlEnum("eventType", ["view", "click", "share", "conversion"]).notNull(),
  resourceType: mysqlEnum("resourceType", ["job", "course", "link"]).notNull(),
  resourceId: varchar("resourceId", { length: 36 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  referrer: text("referrer"), // origem do trafego
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type UserEvent = typeof userEvents.$inferSelect;
export type InsertUserEvent = typeof userEvents.$inferInsert;

// Tabela de Conversoes (quando usuario vai para site externo)
export const conversions = mysqlTable("conversions", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  resourceType: mysqlEnum("resourceType", ["job", "course", "link"]).notNull(),
  resourceId: varchar("resourceId", { length: 36 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = typeof conversions.$inferInsert;

// Tabela de Links de Compartilhamento WhatsApp
export const whatsappShares = mysqlTable("whatsapp_shares", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  shareToken: varchar("shareToken", { length: 64 }).notNull().unique(), // Token único para rastreamento
  resourceType: mysqlEnum("resourceType", ["job", "course"]).notNull(),
  resourceId: varchar("resourceId", { length: 36 }).notNull(),
  userPhone: varchar("userPhone", { length: 20 }), // Telefone do usuário que compartilhou (opcional)
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Link expira após 30 dias
  isActive: boolean("isActive").default(true),
});

export type WhatsappShare = typeof whatsappShares.$inferSelect;
export type InsertWhatsappShare = typeof whatsappShares.$inferInsert;

// Tabela de Cliques em Links de Compartilhamento WhatsApp
export const whatsappClicks = mysqlTable("whatsapp_clicks", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  shareToken: varchar("shareToken", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
  converted: boolean("converted").default(false), // Se clicou no link externo
});

export type WhatsappClick = typeof whatsappClicks.$inferSelect;
export type InsertWhatsappClick = typeof whatsappClicks.$inferInsert;

// Tabela de Análise de Compartilhamentos
export const whatsappAnalytics = mysqlTable("whatsapp_analytics", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  shareToken: varchar("shareToken", { length: 64 }).notNull().unique(),
  resourceType: mysqlEnum("resourceType", ["job", "course"]).notNull(),
  resourceId: varchar("resourceId", { length: 36 }).notNull(),
  totalShares: int("totalShares").default(0),
  totalClicks: int("totalClicks").default(0),
  totalConversions: int("totalConversions").default(0),
  conversionRate: varchar("conversionRate", { length: 10 }).default("0"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
});

export type WhatsappAnalytic = typeof whatsappAnalytics.$inferSelect;
export type InsertWhatsappAnalytic = typeof whatsappAnalytics.$inferInsert;
