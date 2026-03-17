import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return categories;
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
