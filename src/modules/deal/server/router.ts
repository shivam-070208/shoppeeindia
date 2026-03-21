import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
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
  list: adminProcedure
    .input(
      z.object({
        searchQuery: z.string().default(""),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const { searchQuery, page, limit } = input;

      const trimmedQuery = searchQuery.trim();
      const where = {
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const slug = slugify(`${store.name}-${category.name}-${Date.now()}`);
      const discountPercent = computeDiscountPercent(
        input.originalPrice,
        input.dealPrice,
      );

      return prisma.deal.create({
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
        },
      });
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

      return prisma.deal.update({
        where: { id: input.id },
        data: {
          originalPrice: input.originalPrice,
          dealPrice: input.dealPrice,
          discountPercent,
          affiliateUrl: input.affiliateUrl,
          expiryDate: input.expiryDate,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return prisma.deal.delete({ where: { id: input.id } });
    }),
});
