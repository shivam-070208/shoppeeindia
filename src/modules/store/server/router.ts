import { createTRPCRouter } from "@/_trpc/init";
import { adminProcedure } from "@/_trpc/procedure/admin-procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const storeRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return prisma.store.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        logoUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);
      return prisma.store.create({
        data: {
          name: input.name,
          slug,
          logoUrl: input.logoUrl,
        },
      });
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
      const slug = slugify(input.name);

      return prisma.store.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug,
          ...(input.logoUrl ? { logoUrl: input.logoUrl } : {}),
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.store.delete({
        where: { id: input.id },
      });
    }),
});
