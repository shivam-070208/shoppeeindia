import { createTRPCRouter } from "@/_trpc/init";
import { categoryRouter } from "../../category/server/router";
import { dealRouter } from "../../deal/server/router";
import { storeRouter } from "../../store/server/router";

export const adminRouters = createTRPCRouter({
  category: categoryRouter,
  deal: dealRouter,
  store: storeRouter,
});
