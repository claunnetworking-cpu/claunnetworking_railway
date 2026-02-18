import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { jobs } from "../drizzle/schema";
import { sql, eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByFilters,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByFilters,
  getAllShortenedLinks,
  createShortenedLink,
  getShortenedLinkByCode,
  updateShortenedLinkClicks,
  recordClickMetric,
  getMetricsForResource,
  recordSiteVisit,
  getSiteVisitsCount,
  getMetricsForPeriod,
  recordUserEvent,
  getUserEventsForResource,
  recordConversion,
  getConversionsForResource,
  getConversionRateForResource,
  getTopResourcesByConversions,
  createWhatsappShare,
  getWhatsappShareByToken,
  getAllWhatsappShares,
  getWhatsappSharesForResource,
  recordWhatsappClick,
  getWhatsappClicksByToken,
  getWhatsappAnalyticsByToken,
  getWhatsappAnalyticsForResource,
  createOrUpdateWhatsappAnalytics,
  updateWhatsappAnalyticsMetrics,
} from "./db";
import { extractJobData, extractCourseData } from "./extractors";


export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ EXTRACTORS ============
  extract: router({
    job: publicProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        try {
          const data = await extractJobData(input.url);
          return { success: true, data };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro ao extrair dados',
          };
        }
      }),

    course: publicProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        try {
          const data = await extractCourseData(input.url);
          return { success: true, data };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro ao extrair dados',
          };
        }
      }),
  }),

  // ============ JOBS ============
  jobs: router({
    list: publicProcedure.query(async () => {
      return await getAllJobs();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getJobById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          company: z.string(),
          description: z.string().optional(),
          link: z.string().url(),
          city: z.string().optional(),
          state: z.string().optional(),
          modality: z.enum(["Presencial", "Remoto", "Híbrido"]),
          isPCD: z.boolean().default(false),
          category: z.enum([
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
            "comercial",
          ]),
        })
      )
      .mutation(async ({ input }) => {
        const job = {
          id: nanoid(),
          ...input,
          status: "ativa" as const,
        };
        return await createJob(job);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          company: z.string().optional(),
          description: z.string().optional(),
          link: z.string().url().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          modality: z.enum(["Presencial", "Remoto", "Híbrido"]).optional(),
          isPCD: z.boolean().optional(),
          category: z.enum([
            "atendimento",
            "assistente",
            "gestao",
            "saude",
            "telemarketing",
            "vendas",
            "operacional",
            "tecnologia",
            "marketing",
            "financas",
            "administrativo",
            "comercial",
          ]).optional(),
          status: z.enum(["ativa", "inativa"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateJob(id, data as any);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteJob(input.id);
        return { success: true };
      }),

    filter: publicProcedure
      .input(
        z.object({
          modality: z.string().optional(),
          state: z.string().optional(),
          isPCD: z.boolean().optional(),
          category: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getJobsByFilters(input);
      }),

    recordClick: publicProcedure
      .input(z.object({ jobId: z.string(), type: z.enum(["redirect", "whatsapp"]) }))
      .mutation(async ({ input }) => {
        await recordClickMetric({
          id: nanoid(),
          resourceType: "job",
          resourceId: input.jobId,
          clickType: input.type,
        });
        return { success: true };
      }),

    getMetrics: publicProcedure
      .input(z.object({ jobId: z.string() }))
      .query(async ({ input }) => {
        const metrics = await getMetricsForResource("job", input.jobId);
        return {
          redirects: metrics.filter(m => m.clickType === "redirect").length,
          whatsappShares: metrics.filter(m => m.clickType === "whatsapp").length,
        };
      }),
  }),

  // ============ COURSES ============
  courses: router({
    list: publicProcedure.query(async () => {
      return await getAllCourses();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getCourseById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          institution: z.string(),
          description: z.string().optional(),
          link: z.string().url(),
          duration: z.string().optional(),
          modality: z.enum(["Online", "Presencial", "Híbrido"]),
          isFree: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const course = {
          id: nanoid(),
          ...input,
          status: "ativo" as const,
        };
        return await createCourse(course);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          institution: z.string().optional(),
          description: z.string().optional(),
          link: z.string().url().optional(),
          duration: z.string().optional(),
          modality: z.enum(["Online", "Presencial", "Híbrido"]).optional(),
          isFree: z.boolean().optional(),
          status: z.enum(["ativo", "inativo"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateCourse(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteCourse(input.id);
        return { success: true };
      }),

    filter: publicProcedure
      .input(
        z.object({
          modality: z.string().optional(),
          isFree: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getCoursesByFilters(input);
      }),

    recordClick: publicProcedure
      .input(z.object({ courseId: z.string(), type: z.enum(["redirect", "whatsapp"]) }))
      .mutation(async ({ input }) => {
        await recordClickMetric({
          id: nanoid(),
          resourceType: "course",
          resourceId: input.courseId,
          clickType: input.type,
        });
        return { success: true };
      }),

    getMetrics: publicProcedure
      .input(z.object({ courseId: z.string() }))
      .query(async ({ input }) => {
        const metrics = await getMetricsForResource("course", input.courseId);
        return {
          redirects: metrics.filter(m => m.clickType === "redirect").length,
          whatsappShares: metrics.filter(m => m.clickType === "whatsapp").length,
        };
      }),
  }),

  // ============ METRICS ============
  metrics: router({
    recordVisit: publicProcedure.mutation(async () => {
      try {
        await recordSiteVisit();
        return { success: true };
      } catch (error) {
        console.error("Failed to record site visit:", error);
        return { success: false };
      }
    }),

    getPeriodMetrics: publicProcedure
      .input(z.object({ daysAgo: z.number().default(30) }))
      .query(async ({ input }) => {
        return await getMetricsForPeriod(input.daysAgo);
      }),

    recordEvent: publicProcedure
      .input(
        z.object({
          eventType: z.enum(["view", "click", "share", "conversion"]),
          resourceType: z.enum(["job", "course", "link"]),
          resourceId: z.string(),
          sessionId: z.string().optional(),
          referrer: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await recordUserEvent({
            id: nanoid(),
            ...input,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to record event:", error);
          return { success: false };
        }
      }),

    getResourceAnalytics: publicProcedure
      .input(
        z.object({
          resourceType: z.enum(["job", "course", "link"]),
          resourceId: z.string(),
          daysAgo: z.number().default(30),
        })
      )
      .query(async ({ input }) => {
        const events = await getUserEventsForResource(input.resourceType, input.resourceId, input.daysAgo);
        const conversions = await getConversionsForResource(input.resourceType, input.resourceId, input.daysAgo);
        const conversionRate = await getConversionRateForResource(input.resourceType, input.resourceId, input.daysAgo);

        return {
          views: events.filter(e => e.eventType === "view").length,
          clicks: events.filter(e => e.eventType === "click").length,
          shares: events.filter(e => e.eventType === "share").length,
          conversions: conversions.length,
          conversionRate: Math.round(conversionRate * 100) / 100,
        };
      }),

    getTopResources: publicProcedure
      .input(
        z.object({
          resourceType: z.enum(["job", "course", "link"]),
          daysAgo: z.number().default(30),
          limit: z.number().default(10),
        })
      )
      .query(async ({ input }) => {
        return await getTopResourcesByConversions(input.resourceType, input.daysAgo, input.limit);
      }),
  }),

  // ============ STATISTICS ============
  stats: router({
    getJobsByCategory: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db
        .select({
          category: jobs.category,
          count: sql`COUNT(*) as count`,
        })
        .from(jobs)
        .where(eq(jobs.status, 'ativa'))
        .groupBy(jobs.category)
        .orderBy(sql`count DESC`);
      
      return result.map(r => ({
        category: r.category || 'Sem categoria',
        count: Number(r.count),
      }));
    }),

    getOverview: publicProcedure.query(async () => {
      const allJobs = await getAllJobs();
      const allCourses = await getAllCourses();
      
      const totalVagas = allJobs.filter(j => j.status === 'ativa').length;
      const totalCursos = allCourses.filter(c => c.status === 'ativo').length;
      const vagasRemoto = allJobs.filter(j => j.status === 'ativa' && j.modality === 'Remoto').length;
      const vagasPCD = allJobs.filter(j => j.status === 'ativa' && j.isPCD).length;
      
      const states = new Set<string>();
      allJobs.forEach(j => {
        if (j.state) states.add(j.state);
      });
      
      return {
        totalVagas,
        totalCursos,
        vagasRemoto,
        vagasPCD,
        estadosCobertos: states.size,
      };
    }),
  }),

  // ============ WHATSAPP SHARES ============
  whatsapp: router({
    createShare: publicProcedure
      .input(
        z.object({
          resourceType: z.enum(["job", "course"]),
          resourceId: z.string(),
          userPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const shareToken = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const share = {
          id: nanoid(),
          shareToken,
          resourceType: input.resourceType as "job" | "course",
          resourceId: input.resourceId,
          userPhone: input.userPhone,
          expiresAt,
          isActive: true,
        };

        await createWhatsappShare(share);
        
        // Criar analytics inicial
        const analytics = {
          id: nanoid(),
          shareToken,
          resourceType: input.resourceType as "job" | "course",
          resourceId: input.resourceId,
          totalShares: 1,
          totalClicks: 0,
          totalConversions: 0,
          conversionRate: "0",
        };
        await createOrUpdateWhatsappAnalytics(analytics);

        return share;
      }),

    getShare: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(async ({ input }) => {
        return await getWhatsappShareByToken(input.shareToken);
      }),

    recordClick: publicProcedure
      .input(
        z.object({
          shareToken: z.string(),
          sessionId: z.string().optional(),
          userAgent: z.string().optional(),
          ipAddress: z.string().optional(),
          converted: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const click = {
          id: nanoid(),
          shareToken: input.shareToken,
          sessionId: input.sessionId,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          converted: input.converted || false,
        };

        await recordWhatsappClick(click);
        await updateWhatsappAnalyticsMetrics(input.shareToken);

        return { success: true };
      }),

    getAnalytics: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(async ({ input }) => {
        return await getWhatsappAnalyticsByToken(input.shareToken);
      }),

    getResourceAnalytics: publicProcedure
      .input(
        z.object({
          resourceType: z.enum(["job", "course"]),
          resourceId: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await getWhatsappAnalyticsForResource(input.resourceType, input.resourceId);
      }),
  }),

  // ============ BULK IMPORT ============
  bulkImport: router({
    importJobs: protectedProcedure
      .input(
        z.object({
          urls: z.array(z.string().url()),
        })
      )
      .mutation(async ({ input }) => {
        const results = [];
        
        for (const url of input.urls) {
          try {
            const extractedData = await extractJobData(url);
            const job = {
              id: nanoid(),
              title: extractedData.title,
              company: extractedData.company || 'Empresa não identificada',
              description: extractedData.description || '',
              link: extractedData.link,
              city: extractedData.city || '',
              state: extractedData.state || '',
              modality: extractedData.modality || 'Presencial',
              isPCD: extractedData.isPCD || false,
              category: (['atendimento', 'assistente', 'gestão', 'saúde', 'telemarketing', 'vendas', 'operacional', 'tecnologia', 'marketing', 'finanças', 'administrativo', 'comercial'] as const).includes(extractedData.category as any) ? (extractedData.category as 'atendimento' | 'assistente' | 'gestão' | 'saúde' | 'telemarketing' | 'vendas' | 'operacional' | 'tecnologia' | 'marketing' | 'finanças' | 'administrativo' | 'comercial') : 'operacional',
              isActive: true,
              createdAt: new Date(),
            };
            
            await createJob(job);
            results.push({ url, success: true, id: job.id });
          } catch (error) {
            results.push({ url, success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' });
          }
        }
        
        return { results, totalProcessed: input.urls.length, totalSuccess: results.filter(r => r.success).length };
      }),

    importCourses: protectedProcedure
      .input(
        z.object({
          urls: z.array(z.string().url()),
        })
      )
      .mutation(async ({ input }) => {
        const results = [];
        
        for (const url of input.urls) {
          try {
            const extractedData = await extractCourseData(url);
            const course = {
              id: nanoid(),
              title: extractedData.title,
              institution: extractedData.institution || 'Instituição não identificada',
              description: extractedData.description || '',
              link: extractedData.link,
              duration: extractedData.duration || '',
              modality: extractedData.modality || 'Online',
              isFree: extractedData.isFree || false,
              category: undefined,
              isActive: true,
              createdAt: new Date(),
            };
            
            await createCourse(course);
            results.push({ url, success: true, id: course.id });
          } catch (error) {
            results.push({ url, success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' });
          }
        }
        
        return { results, totalProcessed: input.urls.length, totalSuccess: results.filter(r => r.success).length };
      }),
  }),

  // ============ SHORTENED LINKS ============
  links: router({
    list: publicProcedure.query(async () => {
      return await getAllShortenedLinks();
    }),

    create: protectedProcedure
      .input(
        z.object({
          originalUrl: z.string().url(),
          alias: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const shortCode = nanoid(8);
        const link = {
          id: nanoid(),
          originalUrl: input.originalUrl,
          shortCode,
          alias: input.alias,
        };
        return await createShortenedLink(link);
      }),

    getByCode: publicProcedure
      .input(z.object({ shortCode: z.string() }))
      .query(async ({ input }) => {
        return await getShortenedLinkByCode(input.shortCode);
      }),

    recordClick: publicProcedure
      .input(z.object({ linkId: z.string() }))
      .mutation(async ({ input }) => {
        await updateShortenedLinkClicks(input.linkId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
