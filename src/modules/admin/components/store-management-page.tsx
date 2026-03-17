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
import Image from "next/image";
import React from "react";

type StoreRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

function formatDate(value: StoreRow["createdAt"]) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function StoresGrid() {
  const utils = trpc.useUtils();
  const { search } = useEntityContextValues();

  const listQuery = trpc.admin.store.list.useQuery();
  const updateMutation = trpc.admin.store.update.useMutation({
    onSuccess: async () => {
      await utils.admin.store.list.invalidate();
    },
  });
  const deleteMutation = trpc.admin.store.delete.useMutation({
    onSuccess: async () => {
      await utils.admin.store.list.invalidate();
    },
  });

  const [page, setPage] = React.useState(1);
  const limit = 9;

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftName, setDraftName] = React.useState("");
  const [draftLogoUrl, setDraftLogoUrl] = React.useState("");

  const rows = (listQuery.data ?? []) as StoreRow[];

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const hay = `${r.name} ${r.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search]);

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = filtered.slice((safePage - 1) * limit, safePage * limit);

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
    {
      id: "createdAt",
      header: "Created",
      accessor: (row: StoreRow) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: StoreRow) => {
        const isEditing = editingId === row.id;
        return (
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Store name"
                />
                <Input
                  value={draftLogoUrl}
                  onChange={(e) => setDraftLogoUrl(e.target.value)}
                  placeholder="Logo URL (https://...)"
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
                        logoUrl: draftLogoUrl.trim() || undefined,
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
                      setDraftLogoUrl("");
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
                    setDraftLogoUrl(row.logoUrl);
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
        searchPlaceHolder="Search stores by name or slug..."
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Created" },
        ]}
      />

      {listQuery.isLoading ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading stores...
        </div>
      ) : listQuery.isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load stores.
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

export default function StoreManagementPage() {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader actionLabel="Create Store" actionHref="/admin/stores/new">
          <EntityHeaderContent
            heading="Stores"
            subheading="Manage store directory, branding, and cleanup. Use search + sort to move fast."
          />
        </EntityHeader>

        <StoresGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
}
