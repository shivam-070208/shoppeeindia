import { createTRPCRouter } from "@/_trpc/init";
import { adminProtectedProcedure } from "@/_trpc/procedure/admin-procedure";
import { slugify } from "@/utils/slugify";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const storeRouter = createTRPCRouter({
  list: adminProtectedProcedure.query(async () => {
    return prisma.store.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  update: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
      }),
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);

      return prisma.store.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug,
        },
      });
    }),

  delete: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.store.delete({
        where: { id: input.id },
      });
    }),
});
