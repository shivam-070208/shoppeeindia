"use client";

import { useListDeals } from "@/modules/deal/hooks/use-deal";
import {
  EntityTableFooter,
  useEntityContextValues,
} from "@/components/common/entity-layout";
import { useDealFilterContextValues } from "@/modules/main/components/deal-filter";
import React, { useState, useCallback, useEffect } from "react";
import { ProductCard } from "./product-card";
import { Deal } from "../../types/deal";

const DealsGrid = () => {
  const { search } = useEntityContextValues();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const { category, store, maxPrice } = useDealFilterContextValues();
  const resetPage = useCallback(() => {
    setPage(1);
  }, []);
  useEffect(() => {
    resetPage();
  }, [search, category, store, maxPrice, resetPage]);
  const {
    data: dealsData,
    isPending,
    isError,
  } = useListDeals({
    searchQuery: search,
    page,
    limit,
    category: category || undefined,
    store: store && store.length > 0 ? store : undefined,
    maxPrice: maxPrice !== undefined ? maxPrice : undefined,
  });
  const paged = dealsData?.items ?? [];
  const total = dealsData?.total ?? 0;
  const totalPages = dealsData?.totalPages ?? 1;
  return (
    <div className="w-full">
      {isPending ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading deals...
        </div>
      ) : isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load deals.
        </div>
      ) : (
        <>
          {paged.length === 0 ? (
            <div className="my-6 flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/70 shadow-inner">
              <span className="mb-2 text-2xl font-bold text-neutral-300">
                No deals found
              </span>
              <span className="text-neutral-500">
                There are currently no deals to display.
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {paged.map((deal: Deal) => (
                  <ProductCard deal={deal} key={deal.id} />
                ))}
              </div>
              <EntityTableFooter
                pagination={{
                  page,
                  totalPages,
                  total,
                  limit,
                  onPageChange: setPage,
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
export default DealsGrid;
