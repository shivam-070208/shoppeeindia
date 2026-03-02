import { getServerSession } from "@/lib/auth-utils";
import { baseProcedure } from "../init";
import { TRPCError } from "@trpc/server";

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await getServerSession();

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "you are not authorized to access this resource",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});
