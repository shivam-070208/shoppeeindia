import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const storeRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        searchQuery: z.string().default(""),
        page: z.number().int().default(0),
        limit: z.number().int().default(10),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { searchQuery, page, limit } = input;

        const [stores, total] = await Promise.all([
          prisma.store.findMany({
            where: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            orderBy: { createdAt: "desc" },
            skip: page * limit,
            take: limit,
          }),
          prisma.store.count({
            where: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          }),
        ]);

        return {
          stores,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list stores",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        logoUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const slug = slugify(input.name);

        const existingStore = await prisma.store.findFirst({
          where: { OR: [{ name: input.name }, { slug }] },
        });
        if (existingStore) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A store with the same name or slug already exists",
          });
        }

        return await prisma.store.create({
          data: {
            name: input.name,
            slug,
            logoUrl: input.logoUrl,
          },
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create store",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        logoUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const slug = slugify(input.name);
        const store = await prisma.store.findUnique({
          where: { id: input.id },
        });
        if (!store) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Store not found",
          });
        }
        const existingStore = await prisma.store.findFirst({
          where: {
            OR: [{ name: input.name }, { slug }],
            NOT: { id: input.id },
          },
        });
        if (existingStore) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A store with the same name or slug already exists",
          });
        }

        const updatedStore = await prisma.store.update({
          where: { id: input.id },
          data: {
            name: input.name,
            slug,
            ...(input.logoUrl ? { logoUrl: input.logoUrl } : {}),
          },
        });

        return updatedStore;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update store",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const existing = await prisma.store.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Store not found",
          });
        }
        return await prisma.store.delete({
          where: { id: input.id },
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete store",
          cause: err instanceof Error ? err.message : undefined,
        });
      }
    }),
});

export type StoreRouter = typeof storeRouter;
