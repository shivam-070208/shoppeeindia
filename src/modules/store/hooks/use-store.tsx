import { useTRPC } from "@/_trpc/lib/client";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";

type StoreListInput = {
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export const useStores = (params?: StoreListInput) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.admin.store.list.queryOptions(params ?? {}));
};

export const useUpdateStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.store.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.store.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.store.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.store.list.queryKey(),
        });
      },
    }),
  );
};

export const useCreateStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.admin.store.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.store.list.queryKey(),
        });
      },
    }),
  );
};
