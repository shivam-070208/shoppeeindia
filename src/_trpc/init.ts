import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  /**
   * TODO:
   * ATTACH SESSION TO CONTEXT IF NEEDED
   */
  return {};
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const callerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
