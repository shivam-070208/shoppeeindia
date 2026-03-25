import { useTRPC } from "@/_trpc/lib/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

type StoreListInput = {
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export const useStores = (params?: StoreListInput) => {
  const trpc = useTRPC();
  return useQuery(trpc.store.list.queryOptions(params ?? {}));
};

export const useUpdateStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.store.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.store.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey(),
        });
      },
    }),
  );
};

export const useCreateStore = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.store.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey(),
        });
      },
    }),
  );
};
