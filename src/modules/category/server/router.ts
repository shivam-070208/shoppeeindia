import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure, baseProcedure } from "@/_trpc/procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  list: baseProcedure
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
      try {
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list categories",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { name } = input;
        const isCategory = await prisma.category.findFirst({
          where: { name },
        });
        if (isCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "category with same name already exists",
          });
        }
        const category = await prisma.category.create({
          data: {
            name,
            slug: slugify(name),
          },
        });
        return category;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, name } = input;
        const existingCategory = await prisma.category.findUnique({
          where: { id },
        });
        if (!existingCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }
        const isCategory = await prisma.category.findFirst({
          where: {
            name,
            NOT: { id },
          },
        });
        if (isCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "category with same name already exists",
          });
        }
        const updatedCategory = await prisma.category.update({
          where: { id },
          data: {
            name,
            slug: slugify(name),
          },
        });
        return updatedCategory;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id } = input;
        // Check existence first for proper 404
        const existing = await prisma.category.findUnique({
          where: { id },
        });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }
        const deletedCategory = await prisma.category.delete({
          where: { id },
        });
        return deletedCategory;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
});
