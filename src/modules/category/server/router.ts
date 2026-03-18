import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z
        .object({
          searchQuery: z.string().optional(),
          page: z.number().int().min(1).optional(),
          limit: z.number().int().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { searchQuery = "", page = 1, limit = 20 } = input ?? {};

      const where =
        searchQuery && searchQuery.trim() !== ""
          ? {
              OR: [
                {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
                {
                  slug: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {};

      const [total, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);
      return {
        items: categories,
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
      }),
    )
    .mutation(async ({ input }) => {
      const { name } = input;
      const isCategory = await prisma.category.findFirst({
        where: { name },
      });
      if (isCategory) {
        throw new TRPCError({
          message: "category with same name already exists",
          code: "CONFLICT",
        });
      }
      const category = await prisma.category.create({
        data: {
          name,
          slug: slugify(name),
        },
      });
      return category;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, name } = input;
      const isCategory = await prisma.category.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });
      if (isCategory) {
        throw new TRPCError({
          message: "category with same name already exists",
          code: "CONFLICT",
        });
      }
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug: slugify(name),
        },
      });
      if (!updatedCategory) {
        throw new TRPCError({
          message: "Category not found",
          code: "NOT_FOUND",
        });
      }
      return updatedCategory;
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const deletedCategory = await prisma.category.delete({
        where: { id },
      });
      return deletedCategory;
    }),
});
