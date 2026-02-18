import { eq, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobs, courses, shortenedLinks, clickMetrics, siteVisits, userEvents, conversions, whatsappShares, whatsappClicks, whatsappAnalytics } from "../drizzle/schema";
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

// ============ JOBS ============

export async function getAllJobs() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs);
}

export async function getJobById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createJob(job: typeof jobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(jobs).values(job);
  return job;
}

export async function updateJob(id: string, data: Partial<typeof jobs.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobs).set(data).where(eq(jobs.id, id));
  return getJobById(id);
}

export async function deleteJob(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobs).where(eq(jobs.id, id));
}

export async function getJobsByFilters(filters: {
  modality?: string;
  state?: string;
  isPCD?: boolean;
  category?: string;
  status?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.modality) conditions.push(eq(jobs.modality, filters.modality as any));
  if (filters.state) conditions.push(eq(jobs.state, filters.state));
  if (filters.isPCD !== undefined) conditions.push(eq(jobs.isPCD, filters.isPCD));
  if (filters.category) conditions.push(eq(jobs.category, filters.category as any));
  if (filters.status) conditions.push(eq(jobs.status, filters.status as any));
  else conditions.push(eq(jobs.status, 'ativa')); // Default: only active jobs

  if (conditions.length === 0) return getAllJobs();
  return await db.select().from(jobs).where(and(...conditions));
}

// ============ COURSES ============

export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses);
}

export async function getCourseById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCourse(course: typeof courses.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courses).values(course);
  return course;
}

export async function updateCourse(id: string, data: Partial<typeof courses.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courses).set(data).where(eq(courses.id, id));
  return getCourseById(id);
}

export async function deleteCourse(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courses).where(eq(courses.id, id));
}

export async function getCoursesByFilters(filters: {
  modality?: string;
  isFree?: boolean;
  status?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.modality) conditions.push(eq(courses.modality, filters.modality as any));
  if (filters.isFree !== undefined) conditions.push(eq(courses.isFree, filters.isFree));
  if (filters.status) conditions.push(eq(courses.status, filters.status as any));

  if (conditions.length === 0) return getAllCourses();
  return await db.select().from(courses).where(and(...conditions));
}

// ============ SHORTENED LINKS ============

export async function createShortenedLink(link: typeof shortenedLinks.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(shortenedLinks).values(link);
  return link;
}

export async function getShortenedLinkByCode(shortCode: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(shortenedLinks).where(eq(shortenedLinks.shortCode, shortCode)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllShortenedLinks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(shortenedLinks);
}

export async function updateShortenedLinkClicks(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const link = await db.select().from(shortenedLinks).where(eq(shortenedLinks.id, id)).limit(1);
  if (link.length > 0) {
    await db.update(shortenedLinks).set({ clicks: (link[0].clicks || 0) + 1 }).where(eq(shortenedLinks.id, id));
  }
}

// ============ CLICK METRICS ============

export async function recordClickMetric(metric: typeof clickMetrics.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clickMetrics).values(metric);
}

export async function getMetricsForResource(resourceType: string, resourceId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clickMetrics).where(
    and(
      eq(clickMetrics.resourceType, resourceType as any),
      eq(clickMetrics.resourceId, resourceId)
    )
  );
}

// ============ SITE VISITS ============

export async function recordSiteVisit() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteVisits).values({ id: Math.random().toString(36).substring(7) });
}

export async function getSiteVisitsCount(daysAgo: number = 30) {
  const db = await getDb();
  if (!db) return 0;
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysAgo);
  const result = await db.select().from(siteVisits).where(gte(siteVisits.timestamp, dateFrom));
  return result.length;
}

// ============ METRICS AGGREGATION ============

export async function getMetricsForPeriod(daysAgo: number = 30) {
  const db = await getDb();
  if (!db) return null;

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysAgo);

  // Total site visits
  const visits = await db.select().from(siteVisits).where(gte(siteVisits.timestamp, dateFrom));

  // Total clicks
  const clicks = await db.select().from(clickMetrics).where(gte(clickMetrics.timestamp, dateFrom));

  const redirects = clicks.filter(c => c.clickType === 'redirect').length;
  const whatsappShares = clicks.filter(c => c.clickType === 'whatsapp').length;

  return {
    siteVisits: visits.length,
    totalClicks: clicks.length,
    redirects,
    whatsappShares,
  };
}

// ============ EXPIRATION CHECK ============

export async function inactivateExpiredJobs() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  await db.update(jobs).set({ status: 'inativa' }).where(
    and(
      gte(jobs.expiresAt, new Date(0)),
      eq(jobs.status, 'ativa')
    )
  );
}

// TODO: add feature queries here as your schema grows.

// ============ USER EVENTS ============

export async function recordUserEvent(event: typeof userEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userEvents).values(event);
}

export async function getUserEventsForResource(resourceType: string, resourceId: string, daysAgo: number = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysAgo);
  
  return await db.select().from(userEvents).where(
    and(
      eq(userEvents.resourceType, resourceType as any),
      eq(userEvents.resourceId, resourceId),
      gte(userEvents.timestamp, dateFrom)
    )
  );
}

// ============ CONVERSIONS ============

export async function recordConversion(conversion: typeof conversions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(conversions).values(conversion);
}

export async function getConversionsForResource(resourceType: string, resourceId: string, daysAgo: number = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysAgo);
  
  return await db.select().from(conversions).where(
    and(
      eq(conversions.resourceType, resourceType as any),
      eq(conversions.resourceId, resourceId),
      gte(conversions.timestamp, dateFrom)
    )
  );
}

export async function getConversionRateForResource(resourceType: string, resourceId: string, daysAgo: number = 30) {
  const views = await getUserEventsForResource(resourceType, resourceId, daysAgo);
  const convs = await getConversionsForResource(resourceType, resourceId, daysAgo);
  
  const viewCount = views.filter(e => e.eventType === 'view').length;
  if (viewCount === 0) return 0;
  
  return (convs.length / viewCount) * 100;
}

export async function getTopResourcesByConversions(resourceType: string, daysAgo: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysAgo);
  
  const allConversions = await db.select().from(conversions).where(
    and(
      eq(conversions.resourceType, resourceType as any),
      gte(conversions.timestamp, dateFrom)
    )
  );
  
  const grouped: Record<string, number> = {};
  allConversions.forEach(c => {
    grouped[c.resourceId] = (grouped[c.resourceId] || 0) + 1;
  });
  
  return Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([resourceId, count]) => ({ resourceId, conversionCount: count }));
}

// ============ WHATSAPP SHARES ============

export async function createWhatsappShare(share: typeof whatsappShares.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(whatsappShares).values(share);
  return share;
}

export async function getWhatsappShareByToken(shareToken: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(whatsappShares).where(eq(whatsappShares.shareToken, shareToken)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllWhatsappShares() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(whatsappShares);
}

export async function getWhatsappSharesForResource(resourceType: string, resourceId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(whatsappShares).where(
    and(
      eq(whatsappShares.resourceType, resourceType as any),
      eq(whatsappShares.resourceId, resourceId)
    )
  );
}

// ============ WHATSAPP CLICKS ============

export async function recordWhatsappClick(click: typeof whatsappClicks.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(whatsappClicks).values(click);
  return click;
}

export async function getWhatsappClicksByToken(shareToken: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(whatsappClicks).where(eq(whatsappClicks.shareToken, shareToken));
}

export async function getWhatsappClicksCount(shareToken: string) {
  const clicks = await getWhatsappClicksByToken(shareToken);
  return clicks.length;
}

export async function getWhatsappConversionsCount(shareToken: string) {
  const clicks = await getWhatsappClicksByToken(shareToken);
  return clicks.filter(c => c.converted).length;
}

// ============ WHATSAPP ANALYTICS ============

export async function createOrUpdateWhatsappAnalytics(analytics: typeof whatsappAnalytics.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(whatsappAnalytics).where(eq(whatsappAnalytics.shareToken, analytics.shareToken)).limit(1);
  
  if (existing.length > 0) {
    await db.update(whatsappAnalytics).set(analytics).where(eq(whatsappAnalytics.shareToken, analytics.shareToken));
  } else {
    await db.insert(whatsappAnalytics).values(analytics);
  }
  
  return analytics;
}

export async function getWhatsappAnalyticsByToken(shareToken: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(whatsappAnalytics).where(eq(whatsappAnalytics.shareToken, shareToken)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getWhatsappAnalyticsForResource(resourceType: string, resourceId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(whatsappAnalytics).where(
    and(
      eq(whatsappAnalytics.resourceType, resourceType as any),
      eq(whatsappAnalytics.resourceId, resourceId)
    )
  );
}

export async function updateWhatsappAnalyticsMetrics(shareToken: string) {
  const clicks = await getWhatsappClicksCount(shareToken);
  const conversions = await getWhatsappConversionsCount(shareToken);
  const conversionRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : "0";
  
  const analytics = await getWhatsappAnalyticsByToken(shareToken);
  if (analytics) {
    await createOrUpdateWhatsappAnalytics({
      ...analytics,
      totalClicks: clicks,
      totalConversions: conversions,
      conversionRate: conversionRate,
    });
  }
}
