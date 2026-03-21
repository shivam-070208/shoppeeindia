"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCProvider } from "../lib/client";
import React, { useState } from "react";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../server/router";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: BASE_URL ? `${BASE_URL}/api/trpc` : "/api/trpc",
    }),
  ],
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
