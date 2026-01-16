import { Router, Request, Response } from "express";
import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

const router = Router();

// Helper function to calculate percentage change
const calculatePercentageChange = (
  current: number,
  previous: number
): { value: string; positive: boolean } => {
  if (previous === 0) {
    return current > 0
      ? { value: "100%", positive: true }
      : { value: "0%", positive: false };
  }
  const change = ((current - previous) / previous) * 100;
  const positive = change >= 0;
  const absChange = Math.abs(change);
  return {
    value: `${absChange.toFixed(1)}%`,
    positive,
  };
};

router.get("/", async (req: Request, res: Response) => {
  const shop = res.locals.user_shop;
  const days = req.query.days as string; // Expected: "7", "30", or "90"
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "20", 10);
  const skip = (page - 1) * limit;

  try {
    // If days parameter is provided (7, 30, or 90), calculate period-based analytics
    if (days && ["7", "30", "90"].includes(days)) {
      const daysNum = parseInt(days, 10);
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      // Current period: last N days
      const currentPeriodEnd = new Date(now);
      const currentPeriodStart = new Date(now);
      currentPeriodStart.setDate(currentPeriodStart.getDate() - daysNum);
      currentPeriodStart.setHours(0, 0, 0, 0);

      // Previous period: N days before current period
      const previousPeriodEnd = new Date(currentPeriodStart);
      previousPeriodEnd.setMilliseconds(
        previousPeriodEnd.getMilliseconds() - 1
      );
      const previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - daysNum);
      previousPeriodStart.setHours(0, 0, 0, 0);

      // Use Prisma aggregate for efficient database-level aggregation (for store analytics)
      const [
        currentAggregated,
        previousAggregated,
        currentTopProductByShared,
        previousTopProductByShared,
        currentProducts,
        totalProducts,
      ] = await Promise.all([
        // Current period aggregation (database-level, much faster)
        prisma.productAnalytics.aggregate({
          where: {
            shop: shop,
            createdAt: {
              gte: currentPeriodStart,
              lte: currentPeriodEnd,
            },
          },
          _sum: {
            revenue: true,
            shared: true,
            totalProductClicks: true, // Sum of product clicks
            addToCartCount: true,
            purchaseCount: true,
          },
        }),
        // Previous period aggregation (database-level, much faster)
        prisma.productAnalytics.aggregate({
          where: {
            shop: shop,
            createdAt: {
              gte: previousPeriodStart,
              lte: previousPeriodEnd,
            },
          },
          _sum: {
            revenue: true,
            shared: true,
            totalProductClicks: true, // Sum of product clicks
            addToCartCount: true,
            purchaseCount: true,
          },
        }),
        // Get top product by shared count for current period
        prisma.productAnalytics.findFirst({
          where: {
            shop: shop,
            createdAt: {
              gte: currentPeriodStart,
              lte: currentPeriodEnd,
            },
          },
          orderBy: {
            shared: "desc",
          },
          select: {
            shared: true,
          },
        }),
        // Get top product by shared count for previous period
        prisma.productAnalytics.findFirst({
          where: {
            shop: shop,
            createdAt: {
              gte: previousPeriodStart,
              lte: previousPeriodEnd,
            },
          },
          orderBy: {
            shared: "desc",
          },
          select: {
            shared: true,
          },
        }),
        // Paginated products list (only fetch what we need)
        // Order by revenue descending to show top products first
        prisma.productAnalytics.findMany({
          where: {
            shop: shop,
            createdAt: {
              gte: currentPeriodStart,
              lte: currentPeriodEnd,
            },
          },
          skip: skip,
          take: limit,
          orderBy: {
            totalProductClicks: "desc",
          },
        }),
        // Get total count for pagination
        prisma.productAnalytics.count({
          where: {
            shop: shop,
            createdAt: {
              gte: currentPeriodStart,
              lte: currentPeriodEnd,
            },
          },
        }),
      ]);

      // Map aggregated results (handle undefined values)
      const currentAgg = {
        totalRevenue: currentAggregated._sum?.revenue || 0,
        totalFitsShared: currentAggregated._sum?.shared || 0,
        totalClicks: currentAggregated._sum?.totalProductClicks || 0, // Sum of totalProductClicks from all products
        totalFitShared: currentTopProductByShared?.shared || 0, // Top product's shared count
        totalAddToCartCount: currentAggregated._sum?.addToCartCount || 0,
        totalPurchaseCount: currentAggregated._sum?.purchaseCount || 0,
      };

      const previousAgg = {
        totalRevenue: previousAggregated._sum?.revenue || 0,
        totalFitsShared: previousAggregated._sum?.shared || 0,
        totalClicks: previousAggregated._sum?.totalProductClicks || 0, // Sum of totalProductClicks from all products
        totalFitShared: previousTopProductByShared?.shared || 0, // Top product's shared count
        totalAddToCartCount: previousAggregated._sum?.addToCartCount || 0,
        totalPurchaseCount: previousAggregated._sum?.purchaseCount || 0,
      };

      // Calculate conversion rates
      const currentConversionRate =
        currentAgg.totalAddToCartCount > 0
          ? (currentAgg.totalPurchaseCount / currentAgg.totalAddToCartCount) *
            100
          : 0;

      const previousConversionRate =
        previousAgg.totalAddToCartCount > 0
          ? (previousAgg.totalPurchaseCount / previousAgg.totalAddToCartCount) *
            100
          : 0;

      // Build store analytics with percentage changes
      const analytics = {
        shop: shop,
        totalRevenue: currentAgg.totalRevenue,
        totalRevenueChange: calculatePercentageChange(
          currentAgg.totalRevenue,
          previousAgg.totalRevenue
        ),
        totalFitsShared: currentAgg.totalFitsShared,
        totalFitsSharedChange: calculatePercentageChange(
          currentAgg.totalFitsShared,
          previousAgg.totalFitsShared
        ),
        totalClicks: currentAgg.totalClicks,
        totalClicksChange: calculatePercentageChange(
          currentAgg.totalClicks,
          previousAgg.totalClicks
        ),
        totalFitShared: currentAgg.totalFitShared,
        totalFitSharedChange: calculatePercentageChange(
          currentAgg.totalFitShared,
          previousAgg.totalFitShared
        ),
        totalAddToCartCount: currentAgg.totalAddToCartCount,
        totalAddToCartCountChange: calculatePercentageChange(
          currentAgg.totalAddToCartCount,
          previousAgg.totalAddToCartCount
        ),
        totalPurchaseCount: currentAgg.totalPurchaseCount,
        totalPurchaseCountChange: calculatePercentageChange(
          currentAgg.totalPurchaseCount,
          previousAgg.totalPurchaseCount
        ),
        conversionRate: currentConversionRate,
        conversionRateChange: calculatePercentageChange(
          currentConversionRate,
          previousConversionRate
        ),
        createdAt: currentPeriodStart.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Pagination metadata
      const totalPages = Math.ceil(totalProducts / limit);
      const pagination = {
        page,
        limit,
        total: totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      res.status(200).json({
        data: {
          analytics,
          products: currentProducts || [],
          pagination,
        },
        status: "success",
      });
      return;
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res
        .status(500)
        .json({ error: true, message: "Failed to get shop analytics" });
      return;
    }
    res
      .status(500)
      .json({ error: true, message: "Failed to get shop analytics" });
  }
});

export default router;
