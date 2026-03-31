import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure, baseProcedure } from "@/_trpc/procedure";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/slugify";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

function computeDiscountPercent(originalPrice: number, dealPrice: number) {
  if (originalPrice <= 0) return 0;
  const raw = ((originalPrice - dealPrice) / originalPrice) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export const dealRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        searchQuery: z.string().default(""),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(10),
        category: z.string().nullable().optional(),
        store: z.array(z.string()).optional().default([]),
        maxPrice: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const {
          searchQuery,
          page,
          limit,
          category,
          store: storeFilter,
          maxPrice,
        } = input;
        const trimmedQuery = searchQuery.trim();

        const andFilters = [];

        if (typeof category === "string" && category.length > 0) {
          andFilters.push({ categoryId: category });
        }

        if (
          storeFilter &&
          Array.isArray(storeFilter) &&
          storeFilter.length > 0
        ) {
          andFilters.push({ storeId: { in: storeFilter } });
        }

        if (typeof maxPrice === "number" && !isNaN(maxPrice)) {
          andFilters.push({ dealPrice: { lte: maxPrice } });
        }

        const orFilter = {
          OR: [
            {
              name: {
                contains: trimmedQuery,
                mode: QueryMode.insensitive,
              },
            },
            {
              store: {
                is: {
                  name: {
                    contains: trimmedQuery,
                    mode: QueryMode.insensitive,
                  },
                },
              },
            },
            {
              category: {
                is: {
                  name: {
                    contains: trimmedQuery,
                    mode: QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        };

        const where =
          trimmedQuery.length > 0
            ? { AND: [orFilter, ...andFilters] }
            : andFilters.length > 0
              ? { AND: andFilters }
              : {};

        const [total, items] = await Promise.all([
          prisma.deal.count({ where }),
          prisma.deal.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
              store: {
                select: { id: true, name: true, slug: true, logoUrl: true },
              },
              category: { select: { id: true, name: true, slug: true } },
            },
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);

        return {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list deals",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
  byId: baseProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const item = await prisma.deal.findUnique({
          where: { id: input.id },
          include: {
            store: {
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
            category: { select: { id: true, name: true, slug: true } },
          },
        });

        if (!item) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }

        return item;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch deal",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
  related: baseProcedure
    .input(
      z.object({
        dealId: z.string().min(1),
        categoryId: z.string().optional(),
        storeId: z.string().optional(),
        limit: z.number().int().min(1).max(12).default(4),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { dealId, categoryId, storeId, limit } = input;
        const relatedWhere =
          categoryId || storeId
            ? {
                id: { not: dealId },
                OR: [
                  ...(categoryId ? [{ categoryId }] : []),
                  ...(storeId ? [{ storeId }] : []),
                ],
              }
            : {
                id: { not: dealId },
              };

        const relatedItems = await prisma.deal.findMany({
          where: relatedWhere,
          orderBy: { createdAt: "desc" },
          include: {
            store: {
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
            category: { select: { id: true, name: true, slug: true } },
          },
          take: limit,
        });

        if (relatedItems.length >= limit) {
          return relatedItems;
        }

        const usedIds = new Set<string>([
          dealId,
          ...relatedItems.map((d) => d.id),
        ]);
        const fallbackItems = await prisma.deal.findMany({
          where: {
            id: { notIn: Array.from(usedIds) },
          },
          orderBy: { createdAt: "desc" },
          include: {
            store: {
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
            category: { select: { id: true, name: true, slug: true } },
          },
          take: limit - relatedItems.length,
        });

        return [...relatedItems, ...fallbackItems];
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list related deals",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().url(),
        originalPrice: z.number().int().positive(),
        dealPrice: z.number().int().positive(),
        affiliateUrl: z.string().url(),
        storeId: z.string().min(1),
        categoryId: z.string().min(1),
        expiryDate: z.coerce.date(),
        specs: z.record(z.string(), z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.dealPrice > input.originalPrice) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Deal price cannot be greater than original price",
          });
        }

        const [store, category] = await Promise.all([
          prisma.store.findUnique({
            where: { id: input.storeId },
            select: { name: true },
          }),
          prisma.category.findUnique({
            where: { id: input.categoryId },
            select: { name: true },
          }),
        ]);

        if (!store || !category) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid store or category",
          });
        }

        const slug = slugify(
          `${store.name}-${category.name}-${input.name}-${Date.now()}`,
        );
        const discountPercent = computeDiscountPercent(
          input.originalPrice,
          input.dealPrice,
        );

        return await prisma.deal.create({
          data: {
            name: input.name,
            description: input.description,
            slug,
            imageUrl: input.imageUrl,
            originalPrice: input.originalPrice,
            dealPrice: input.dealPrice,
            discountPercent,
            affiliateUrl: input.affiliateUrl,
            storeId: input.storeId,
            categoryId: input.categoryId,
            createdBy: ctx.admin.id,
            expiryDate: input.expiryDate,
            specs: input.specs ?? null,
          },
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deal",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        originalPrice: z.number().int().positive(),
        dealPrice: z.number().int().positive(),
        affiliateUrl: z.string().url(),
        expiryDate: z.coerce.date(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        if (input.dealPrice > input.originalPrice) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Deal price cannot be greater than original price",
          });
        }

        const discountPercent = computeDiscountPercent(
          input.originalPrice,
          input.dealPrice,
        );

        const existing = await prisma.deal.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }

        const updatedDeal = await prisma.deal.update({
          where: { id: input.id },
          data: {
            originalPrice: input.originalPrice,
            dealPrice: input.dealPrice,
            discountPercent,
            affiliateUrl: input.affiliateUrl,
            expiryDate: input.expiryDate,
          },
        });
        return updatedDeal;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update deal",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const existing = await prisma.deal.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }
        return await prisma.deal.delete({ where: { id: input.id } });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete deal",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
});
