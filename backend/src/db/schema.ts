import { mysqlTable, varchar, text, int, boolean, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

// Tabela de Usuários
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: text('name'),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Vagas
export const jobs = mysqlTable('jobs', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  description: text('description'),
  link: text('link').notNull(),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  modality: mysqlEnum('modality', ['Presencial', 'Remoto', 'Híbrido']).notNull(),
  isPCD: boolean('isPCD').default(false),
  category: varchar('category', { length: 50 }),
  status: mysqlEnum('status', ['ativa', 'inativa']).default('ativa'),
  clicks: int('clicks').default(0),
  whatsappShares: int('whatsappShares').default(0),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// Tabela de Cursos
export const courses = mysqlTable('courses', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  title: varchar('title', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  description: text('description'),
  link: text('link').notNull(),
  duration: varchar('duration', { length: 100 }),
  modality: mysqlEnum('modality', ['Online', 'Presencial', 'Híbrido']).notNull(),
  isFree: boolean('isFree').default(false),
  category: varchar('category', { length: 50 }),
  status: mysqlEnum('status', ['ativo', 'inativo']).default('ativo'),
  clicks: int('clicks').default(0),
  whatsappShares: int('whatsappShares').default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// Tabela de Links Encurtados
export const shortenedLinks = mysqlTable('shortened_links', {
  id: varchar('id', { length: 36 }).primaryKey(),
  originalUrl: text('originalUrl').notNull(),
  shortCode: varchar('shortCode', { length: 20 }).notNull().unique(),
  alias: varchar('alias', { length: 255 }),
  resourceType: mysqlEnum('resourceType', ['job', 'course']).notNull().default('job'),
  resourceId: varchar('resourceId', { length: 36 }),
  clicks: int('clicks').default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type ShortenedLink = typeof shortenedLinks.$inferSelect;
export type InsertShortenedLink = typeof shortenedLinks.$inferInsert;

// Tabela de Métricas de Cliques
export const clickMetrics = mysqlTable('click_metrics', {
  id: varchar('id', { length: 36 }).primaryKey(),
  resourceType: mysqlEnum('resourceType', ['job', 'course', 'link']).notNull(),
  resourceId: varchar('resourceId', { length: 36 }).notNull(),
  clickType: mysqlEnum('clickType', ['redirect', 'whatsapp']).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type ClickMetric = typeof clickMetrics.$inferSelect;
export type InsertClickMetric = typeof clickMetrics.$inferInsert;

// Tabela de Visitas ao Site
export const siteVisits = mysqlTable('site_visits', {
  id: varchar('id', { length: 36 }).primaryKey(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertSiteVisit = typeof siteVisits.$inferInsert;
