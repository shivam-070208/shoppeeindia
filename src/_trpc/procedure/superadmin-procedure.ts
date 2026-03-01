import { adminProtectedProcedure } from "./admin-procedure";
import { TRPCError } from "@trpc/server";

export const superadminProcedure = adminProtectedProcedure.use(
  async ({ ctx, next }) => {
    const admin = ctx.admin;
    if (!admin.isSuperAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "you are not authorized to access this resource",
      });
    }
    return next({ ctx: { ...ctx } });
  },
);
