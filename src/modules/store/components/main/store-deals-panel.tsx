"use client";

import { EntityTableFooter } from "@/components/common/entity-layout";
import { ProductCard } from "@/modules/deal/components/main/product-card";
import { useListDealsQuery } from "@/modules/deal/hooks/use-deal";
import type { Deal } from "@/modules/deal/types/deal";
import { cn } from "@/lib/utils";
import { Loader2, Ticket, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export type StoreDealTab =
  | { kind: "flash" }
  | { kind: "category"; categoryId: string }
  | { kind: "vouchers" };

type StoreDealsPanelProps = {
  storeId: string;
  categoryTabs: { id: string; name: string; slug: string }[];
  className?: string;
};

const LIMIT = 9;

const StoreDealsPanel = ({
  storeId,
  categoryTabs,
  className,
}: StoreDealsPanelProps) => {
  const [tab, setTab] = useState<StoreDealTab>({ kind: "flash" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [tab, storeId]);

  const listParams = useMemo(() => {
    if (tab.kind === "flash") {
      return {
        store: [storeId] as string[],
        flashSaleOnly: true,
        page,
        limit: LIMIT,
        searchQuery: "",
      };
    }
    if (tab.kind === "category") {
      return {
        store: [storeId] as string[],
        category: tab.categoryId,
        page,
        limit: LIMIT,
        searchQuery: "",
      };
    }
    return {
      store: [storeId] as string[],
      page,
      limit: LIMIT,
      searchQuery: "",
    };
  }, [tab, storeId, page]);

  const dealsEnabled = tab.kind !== "vouchers";

  const { data, isPending, isError } = useListDealsQuery(listParams, {
    enabled: dealsEnabled && Boolean(storeId),
  });

  const dealsData = tab.kind === "vouchers" ? undefined : data;
  const items = (dealsData?.items ?? []) as unknown as Deal[];
  const totalPages = dealsData?.totalPages ?? 1;
  const total = dealsData?.total ?? 0;

  const setTabFlash = useCallback(() => setTab({ kind: "flash" }), []);
  const setTabVouchers = useCallback(() => setTab({ kind: "vouchers" }), []);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="border-border flex gap-1 overflow-x-auto border-b pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button
          type="button"
          variant={tab.kind === "flash" ? "secondary" : "ghost"}
          onClick={setTabFlash}
          className={cn(
            "shrink-0 rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            tab.kind === "flash"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <Zap className="size-4" aria-hidden />
            Flash Sale
          </span>
        </Button>
        {categoryTabs.map((c) => (
          <Button
            key={c.id}
            type="button"
            variant={
              tab.kind === "category" && tab.categoryId === c.id
                ? "secondary"
                : "ghost"
            }
            onClick={() => setTab({ kind: "category", categoryId: c.id })}
            className={cn(
              "shrink-0 rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab.kind === "category" && tab.categoryId === c.id
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {c.name}
          </Button>
        ))}
        <Button
          type="button"
          variant={tab.kind === "vouchers" ? "secondary" : "ghost"}
          onClick={setTabVouchers}
          className={cn(
            "shrink-0 rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            tab.kind === "vouchers"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <Ticket className="size-4" aria-hidden />
            Vouchers
          </span>
        </Button>
      </div>

      {tab.kind === "vouchers" ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
          No vouchers are available for this store yet.
        </div>
      ) : isPending ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border">
          <Loader2
            className="text-primary size-8 animate-spin"
            aria-label="Loading"
          />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load deals.
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
          No deals in this section yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((deal) => (
              <ProductCard key={deal.id} deal={deal} />
            ))}
          </div>
          <EntityTableFooter
            pagination={{
              page,
              totalPages,
              total,
              limit: LIMIT,
              onPageChange: setPage,
            }}
          />
        </>
      )}
    </div>
  );
};

export { StoreDealsPanel };
