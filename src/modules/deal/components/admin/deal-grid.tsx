"use client";

import {
  EntityTableFooter,
  EntityTableHeader,
  useEntityContextValues,
} from "@/components/common/enitity-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import { useDeleteDeal, useListDeals } from "@/modules/deal/hooks/use-deal";

type DealRow = {
  id: string;
  name?: string;
  description?: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  affiliateUrl: string;
  expiryDate: string | Date;
  createdAt: string | Date;
  storeId: string;
  categoryId: string;
  store?: { id: string; name: string; slug: string; logoUrl: string };
  category?: { id: string; name: string; slug: string };
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);

const DealsGrid = () => {
  const { search } = useEntityContextValues();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

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
              <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {paged.map((row: DealRow) => (
                  <Card
                    key={row.id}
                    className={cn(
                      "relative flex min-h-[410px] flex-col justify-between overflow-hidden border border-neutral-800 bg-neutral-900 transition-shadow",
                    )}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      {row.expiryDate && (
                        <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow">
                          LTD TIME
                        </span>
                      )}
                    </div>
                    <CardContent className="flex flex-col p-0 pb-0">
                      <div className="relative aspect-[4/3] w-full border-b border-neutral-700 bg-neutral-800">
                        {row.imageUrl && (
                          <Image
                            src={row.imageUrl}
                            alt={row.name ? row.name : `Deal ${row.id}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            style={{ objectPosition: "center" }}
                            priority
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 bg-neutral-900 px-4 py-3">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="mr-2 text-[0.75rem] font-extrabold tracking-tight text-red-400 uppercase">
                            {row.store?.name || "Best Buy"}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-yellow-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="inline-block"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15.27L16.18 18l-1.63-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.45 3.73L3.82 18z" />
                            </svg>
                            4.7{" "}
                            <span className="font-normal text-neutral-400">
                              (320)
                            </span>
                          </span>
                        </div>
                        <div className="mb-1 text-lg leading-tight font-semibold text-white">
                          {row.name || "Deal Title"}
                        </div>
                        <div className="mb-2 truncate text-sm text-neutral-300">
                          {row.description
                            ? row.description
                            : "No description available."}
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl leading-tight font-extrabold text-white">
                            {formatMoney(row.dealPrice)}
                          </span>
                          <span className="text-base font-medium text-neutral-400 line-through">
                            {formatMoney(row.originalPrice)}
                          </span>
                        </div>
                        <div className="mt-4 flex w-full items-center justify-between gap-2">
                          <Link
                            href={`/admin/deals/${row.id}`}
                            passHref
                            legacyBehavior
                          >
                            <Button
                              asChild
                              className="flex-1 justify-center rounded-full bg-red-500 py-2 text-base font-semibold text-white hover:bg-red-600"
                            >
                              <a target="_blank" rel="noopener noreferrer">
                                Manage Deal
                                <ExternalLink
                                  className="ml-2 h-5 w-5"
                                  strokeWidth={2}
                                />
                              </a>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            className={cn(
                              "ml-2 flex items-center justify-center rounded-full p-2",
                              "border border-red-400 text-red-400 transition-colors hover:bg-red-500/10",
                            )}
                            disabled={deleteMutation.isPending}
                            onClick={() =>
                              deleteMutation.mutate({ id: row.id })
                            }
                            title="Delete deal"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="mt-2 flex justify-between gap-2 text-xs text-neutral-400">
                          <span>
                            Created: {formatDate(String(row.createdAt))}
                          </span>
                          {row.expiryDate && (
                            <span>
                              Expires: {formatDate(String(row.expiryDate))}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
