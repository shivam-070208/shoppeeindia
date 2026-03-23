import { createTRPCRouter } from "@/_trpc/init";
import { superadminProcedure } from "@/_trpc/procedure/superadmin-procedure";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";

export const adminRouters = createTRPCRouter({
  list: superadminProcedure
    .input(
      z
        .object({
          searchQuery: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          limit: z.number().int().min(1).max(100).optional().default(25),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const { searchQuery = "", page = 1, limit = 25 } = input ?? {};
      const currentUserId = ctx.session.user.id;

      const baseWhere = searchQuery
        ? {
            user: {
              OR: [
                {
                  name: { contains: searchQuery, mode: QueryMode.insensitive },
                },
                {
                  email: { contains: searchQuery, mode: QueryMode.insensitive },
                },
              ],
            },
          }
        : {};

      const where = {
        ...baseWhere,
        userId: { not: currentUserId },
      };

      const [items, total] = await Promise.all([
        prisma.admin.findMany({
          where,
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.admin.count({
          where,
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
  create: superadminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: input.name,
            email: input.email,
          },
        });
        return tx.admin.create({
          data: {
            userId: user.id,
          },
        });
      });
    }),
  update: superadminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, name, email } = input;
      const admin = await prisma.admin.update({
        where: { id },
        data: {},
      });
      if (name !== undefined || email !== undefined) {
        await prisma.user.update({
          where: { id: admin.userId },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
          },
        });
      }
      return admin;
    }),
  delete: superadminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.admin.delete({
        where: { id: input.id },
      });
    }),
});
