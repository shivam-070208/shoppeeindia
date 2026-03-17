import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
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
  list: adminProcedure.query(async () => {
    return prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { id: true, name: true, slug: true, logoUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
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
