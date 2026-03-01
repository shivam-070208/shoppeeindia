import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/_trpc/server/router";

export const trpc = createTRPCReact<AppRouter>({});
