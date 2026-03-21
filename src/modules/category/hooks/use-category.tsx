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
  return useSuspenseQuery(trpc.admin.category.list.queryOptions(params ?? {}));
};

export const useCreateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.category.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.category.list.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.category.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.category.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.category.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.category.list.queryKey(),
        });
      },
    }),
  );
};
