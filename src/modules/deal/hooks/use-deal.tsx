"use client";

import { useTRPC } from "@/_trpc/lib/client";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";

type DealListInput = {
  searchQuery?: string;
  page?: number;
  limit?: number;
  category?: string | null;
  store?: string[];
  maxPrice?: number;
};

export const useListDeals = (params?: DealListInput) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.deal.list.queryOptions(params ?? {}));
};

export const useCreateDeal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.deal.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.deal.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteDeal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.deal.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.deal.list.queryKey(),
        });
      },
    }),
  );
};
