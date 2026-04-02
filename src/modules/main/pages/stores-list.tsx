"use client";

import Container from "@/components/common/container";
import { Heading } from "@/components/ui/heading";
import { StoreListCard } from "@/modules/store/components/main/store-list-card";
import { useStores } from "@/modules/store/hooks/use-store";
import { Loader2 } from "lucide-react";

const StoresListPage = () => {
  const { data, isPending, isError } = useStores({
    searchQuery: "",
    page: 0,
    limit: 100,
  });

  const stores = data?.stores ?? [];

  return (
    <div className="py-8">
      <Container maxWidth="max-w-7xl" className="space-y-8">
        <div className="space-y-2">
          <Heading as="h1" className="text-3xl">
            Stores
          </Heading>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Browse partner stores and jump into curated deals from each
            retailer.
          </p>
        </div>

        {isPending ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-xl border">
            <Loader2
              className="text-primary size-8 animate-spin"
              aria-label="Loading stores"
            />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
            Failed to load stores. Please try again later.
          </div>
        ) : stores.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
            No stores are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreListCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default StoresListPage;
