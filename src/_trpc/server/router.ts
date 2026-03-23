import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { adminRouters } from "@/modules/admin/server/router";
import { categoryRouter } from "@/modules/category/server/router";
import { dealRouter } from "@/modules/deal/server/router";
import { storeRouter } from "@/modules/store/server/router";

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
  category: categoryRouter,
  deal: dealRouter,
  store: storeRouter,
});

export type AppRouter = typeof appRouter;
