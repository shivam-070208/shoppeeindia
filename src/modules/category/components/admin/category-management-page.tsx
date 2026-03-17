"use client";

import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityTable,
  EntityTableFooter,
  EntityTableHeader,
  EntityWrapper,
  useEntityContextValues,
} from "@/components/common/enitity-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/_trpc/lib/client";
import React from "react";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: string | Date;
};

function formatDate(value: CategoryRow["createdAt"]) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function CategoriesGrid() {
  const utils = trpc.useUtils();
  const { search } = useEntityContextValues();

  const listQuery = trpc.admin.category.list.useQuery();
  const updateMutation = trpc.admin.category.update.useMutation({
    onSuccess: async () => {
      await utils.admin.category.list.invalidate();
    },
  });
  const deleteMutation = trpc.admin.category.delete.useMutation({
    onSuccess: async () => {
      await utils.admin.category.list.invalidate();
    },
  });

  const [page, setPage] = React.useState(1);
  const limit = 12;

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftName, setDraftName] = React.useState("");

  const rows = (listQuery.data ?? []) as CategoryRow[];

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const hay = `${r.name} ${r.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search]);

  React.useEffect(() => setPage(1), [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = filtered.slice((safePage - 1) * limit, safePage * limit);

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
      id: "createdAt",
      header: "Created",
      accessor: (row: CategoryRow) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: CategoryRow) => {
        const isEditing = editingId === row.id;
        return (
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Category name"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        id: row.id,
                        name: draftName.trim(),
                      })
                    }
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setEditingId(null);
                      setDraftName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingId(row.id);
                    setDraftName(row.name);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className={cn("flex-1", "text-red-400 hover:text-red-300")}
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate({ id: row.id })}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        );
      },
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

      {listQuery.isLoading ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading categories...
        </div>
      ) : listQuery.isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load categories.
        </div>
      ) : (
        <>
          <EntityTable data={paged} columns={columns} />
          <EntityTableFooter
            pagination={{
              page: safePage,
              totalPages,
              total,
              limit,
              onPageChange: (p) => setPage(p),
            }}
          />
        </>
      )}
    </>
  );
}

export default function CategoryManagementPage() {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader
          actionLabel="Create Category"
          actionHref="/admin/categories/new"
        >
          <EntityHeaderContent
            heading="Categories"
            subheading="Manage category structure and keep naming consistent across the catalog."
          />
        </EntityHeader>

        <CategoriesGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
}
