"use client";

import { useTRPC } from "@/_trpc/lib/client";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";

type CategoryListInput = {
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export const useListCategories = (params?: CategoryListInput) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.category.list.queryOptions(params ?? {}));
};

export const useCreateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.category.list.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.category.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.category.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.category.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.category.list.queryKey(),
        });
      },
    }),
  );
};
