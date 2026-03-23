"use client";

import { useTRPC } from "@/_trpc/lib/client";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type AdminListInput = {
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export const useListAdmins = (params?: AdminListInput) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.admin.list.queryOptions(params ?? {}));
};

export const useCreateAdmin = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.list.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateAdmin = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteAdmin = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.list.queryKey(),
        });
      },
    }),
  );
};
