"use client";
import {
  EntityTableFooter,
  EntityTableHeader,
  useEntityContextValues,
  EntityTable,
} from "@/components/common/entity-layout";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import React, { useState } from "react";
import {
  useListCategories,
  useDeleteCategory,
} from "@/modules/category/hooks/use-category";
import { Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

const CategoriesGrid = () => {
  const { search } = useEntityContextValues?.() ?? { search: "" };
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data, isLoading, isError } = useListCategories({
    searchQuery: search,
    page,
    limit,
  });

  const deleteMutation = useDeleteCategory();

  const paged = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: (row: CategoryRow) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-neutral-100">
            {row.name}
          </div>
          <div className="truncate text-xs text-neutral-400">{row.slug}</div>
        </div>
      ),
    },
    {
      id: "slug",
      header: "Slug",
      accessor: (row: CategoryRow) => (
        <div className="truncate text-xs text-neutral-300">{row.slug}</div>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      accessor: (row: CategoryRow) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: CategoryRow) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/categories/${row.id}`}
            className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-neutral-800"
            title="View Category"
          >
            <ArrowUpRight className="h-5 w-5 text-neutral-400" />
          </Link>
          <Button
            variant="ghost"
            className={cn(
              "inline-flex items-center justify-center rounded-sm p-1",
              "text-red-400 hover:text-red-300",
            )}
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(
                { id: row.id },
                {
                  onSuccess: () => {
                    // No editing state to clear now
                  },
                },
              )
            }
            title="Delete"
          >
            <Trash2 className="h-5 w-5 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <EntityTableHeader
        searchPlaceHolder="Search categories by name or slug..."
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Created" },
        ]}
      />

      {isLoading ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading categories...
        </div>
      ) : isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load categories.
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

export default CategoriesGrid;
