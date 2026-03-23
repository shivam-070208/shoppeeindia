import { createTRPCRouter } from "@/_trpc/init";
import { superadminProcedure } from "@/_trpc/procedure/superadmin-procedure";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

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
      try {
        const { searchQuery = "", page = 1, limit = 25 } = input ?? {};
        const currentUserId = ctx.session.user.id;

        const baseWhere = searchQuery
          ? {
              user: {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: QueryMode.insensitive,
                    },
                  },
                  {
                    email: {
                      contains: searchQuery,
                      mode: QueryMode.insensitive,
                    },
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list admins",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
  create: superadminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.$transaction(async (tx) => {
          const existingUser = await tx.user.findUnique({
            where: { email: input.email },
          });
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
              cause: "A user with this email is already registered.",
            });
          }

          const userId = randomUUID();
          const user = await tx.user.create({
            data: {
              id: userId,
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
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create admin",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
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
      try {
        const admin = await prisma.admin.findUnique({
          where: { id },
        });
        if (!admin) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Admin not found",
          });
        }
        if (email !== undefined) {
          const existingUser = await prisma.user.findFirst({
            where: {
              email,
              id: { not: admin.userId },
            },
          });
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User with this email already exists",
            });
          }
        }
        if (name !== undefined || email !== undefined) {
          await prisma.user.update({
            where: { id: admin.userId },
            data: {
              ...(name !== undefined ? { name } : {}),
              ...(email !== undefined ? { email } : {}),
            },
          });
        }
        const updatedAdmin = await prisma.admin.update({
          where: { id },
          data: {},
        });
        return updatedAdmin;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update admin",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
  delete: superadminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const existing = await prisma.admin.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Admin not found",
          });
        }
        return await prisma.admin.delete({
          where: { id: input.id },
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete admin",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
});
