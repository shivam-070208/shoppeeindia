"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  EntityTableFooter,
  EntityTableHeader,
  useEntityContextValues,
} from "@/components/common/entity-layout";
import { useDeleteDeal, useListDeals } from "@/modules/deal/hooks/use-deal";
import { Deal } from "../../types/deal";
import ProductCard from "./product-card";

const DealsGrid = () => {
  const { search } = useEntityContextValues();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const resetPage = useCallback(() => {
    if (search.trim() != "") setPage(1);
  }, [search]);

  useEffect(() => {
    resetPage();
  }, [resetPage]);
  const { data, isPending, isError } = useListDeals({
    searchQuery: search,
    page,
    limit,
  });

  const deleteMutation = useDeleteDeal();

  const paged = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <EntityTableHeader
        searchPlaceHolder="Search deals by store or category..."
        sortOptions={[
          { value: "createdAt", label: "Created" },
          { value: "dealPrice", label: "Deal price" },
          { value: "name", label: "Name" },
        ]}
      />

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
              <div className="mb-4 grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 xl:grid-cols-3">
                {paged.map((row) => (
                  <ProductCard
                    key={row.id}
                    deal={row}
                    onDelete={(id) => deleteMutation.mutate({ id: id })}
                    deleteLoading={deleteMutation.isPending}
                  />
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
    </>
  );
};

export default DealsGrid;
