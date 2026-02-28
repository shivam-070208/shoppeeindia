import { httpBatchLink } from "@trpc/client";
import { appRouter } from "./index";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const trpcServerClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
    }),
  ],
});
