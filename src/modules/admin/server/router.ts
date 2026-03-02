import { createTRPCRouter } from "@/_trpc/init";
import { categoryRouter } from "../../category/server/router";
import { storeRouter } from "../../store/server/router";

export const adminRouters = createTRPCRouter({
  category: categoryRouter,
  store: storeRouter,
});
