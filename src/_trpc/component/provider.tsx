"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../lib/client";
import React, { useState } from "react";
import { httpBatchLink } from "@trpc/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${BASE_URL}/api/trpc`,
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCProvider;
