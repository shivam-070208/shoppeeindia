"use client";
import {
  EntityTableFooter,
  EntityTableHeader,
  useEntityContextValues,
  EntityTable,
} from "@/components/common/enitity-layout";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useStores, useDeleteStore } from "../../hooks/use-store";
import Link from "next/link";
import { Trash2, ArrowUpRight } from "lucide-react";

type StoreRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  createdAt: string;
};

const StoresGrid = () => {
  const { search } = useEntityContextValues();
  const [page, setPage] = useState(0);
  const [limit] = useState(10);

  const { data, isPending, isError } = useStores({
    searchQuery: search,
    page,
    limit,
  });

  const deleteMutation = useDeleteStore();

  const paged = data?.stores ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  console.log(data);
  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: (row: StoreRow) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted relative h-9 w-9 overflow-hidden rounded-md border">
            {!!row.logoUrl && (
              <Image
                src={row.logoUrl}
                alt={row.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-neutral-100">
              {row.name}
            </div>
            <div className="truncate text-xs text-neutral-400">{row.slug}</div>
          </div>
        </div>
      ),
    },
    // --- New Slug Column ---
    {
      id: "slug",
      header: "Slug",
      accessor: (row: StoreRow) => (
        <div className="truncate text-xs text-neutral-300">{row.slug}</div>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      accessor: (row: StoreRow) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: StoreRow) => {
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/stores/${row.id}`}
              className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-neutral-800"
              title="View Store"
            >
              <ArrowUpRight className="h-5 w-5 text-neutral-400" />
            </Link>
            <Button
              variant="outline"
              className="inline-flex cursor-pointer items-center justify-center rounded-sm p-1"
              title="Delete Store"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate({ id: row.id })}
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <EntityTableHeader
        searchPlaceHolder="Search stores by name or slug..."
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Created" },
        ]}
      />

      {isPending ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading stores...
        </div>
      ) : isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load stores.
        </div>
      ) : (
        <>
          <EntityTable data={paged} columns={columns} />
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
  );
};

export default StoresGrid;
