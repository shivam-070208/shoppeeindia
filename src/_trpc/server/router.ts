import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { adminRouters } from "@/modules/admin/server/router";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string().default(""),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  admin: adminRouters,
});

export type AppRouter = typeof appRouter;
