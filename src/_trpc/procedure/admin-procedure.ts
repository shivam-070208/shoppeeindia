import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "./protected-procedure";
import { prisma } from "@/lib/db";
export const adminProtectedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const session = ctx.session;
    const admin = await prisma.admin.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    if (!admin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "you are not authorized to access this resource",
      });
    }

    return next({ ctx: { ...ctx, admin } });
  },
);

// Alias to match naming used across routers/components.
export const adminProcedure = adminProtectedProcedure;
