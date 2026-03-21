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
};

export const useListDeals = (params?: DealListInput) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.admin.deal.list.queryOptions(params ?? {}));
};

export const useCreateDeal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.deal.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.deal.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteDeal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.deal.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.deal.list.queryKey(),
        });
      },
    }),
  );
};
