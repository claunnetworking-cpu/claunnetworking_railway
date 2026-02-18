import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("metrics", () => {
  it("should record a site visit", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.metrics.recordVisit();

    expect(result).toEqual({ success: true });
  });

  it("should get metrics for a period", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Record a visit first
    await caller.metrics.recordVisit();

    // Get metrics for last 30 days
    const metrics = await caller.metrics.getPeriodMetrics({ daysAgo: 30 });

    expect(metrics).toBeDefined();
    expect(metrics).toHaveProperty("siteVisits");
    expect(metrics).toHaveProperty("totalClicks");
    expect(metrics).toHaveProperty("redirects");
    expect(metrics).toHaveProperty("whatsappShares");
    expect(typeof metrics?.siteVisits).toBe("number");
    expect(typeof metrics?.totalClicks).toBe("number");
  });

  it("should get metrics for different periods", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const metrics7 = await caller.metrics.getPeriodMetrics({ daysAgo: 7 });
    const metrics30 = await caller.metrics.getPeriodMetrics({ daysAgo: 30 });
    const metrics90 = await caller.metrics.getPeriodMetrics({ daysAgo: 90 });

    expect(metrics7).toBeDefined();
    expect(metrics30).toBeDefined();
    expect(metrics90).toBeDefined();
  });
});
