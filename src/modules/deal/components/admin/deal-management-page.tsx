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

type DealRow = {
  id: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  affiliateUrl: string;
  expiryDate: string | Date;
  createdAt: string | Date;
  store: { id: string; name: string; slug: string; logoUrl: string };
  category: { id: string; name: string; slug: string };
};

function formatDate(value: DealRow["createdAt"]) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined).format(value);
}

function DealsGrid() {
  const utils = trpc.useUtils();
  const { search } = useEntityContextValues();

  const listQuery = trpc.admin.deal.list.useQuery();
  const updateMutation = trpc.admin.deal.update.useMutation({
    onSuccess: async () => {
      await utils.admin.deal.list.invalidate();
    },
  });
  const deleteMutation = trpc.admin.deal.delete.useMutation({
    onSuccess: async () => {
      await utils.admin.deal.list.invalidate();
    },
  });

  const [page, setPage] = React.useState(1);
  const limit = 9;

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftOriginalPrice, setDraftOriginalPrice] = React.useState("");
  const [draftDealPrice, setDraftDealPrice] = React.useState("");
  const [draftAffiliateUrl, setDraftAffiliateUrl] = React.useState("");
  const [draftExpiryDate, setDraftExpiryDate] = React.useState("");

  const rows = (listQuery.data ?? []) as DealRow[];

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const hay =
        `${r.store.name} ${r.store.slug} ${r.category.name} ${r.category.slug}`.toLowerCase();
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
      id: "store",
      header: "Deal",
      accessor: (row: DealRow) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-md border">
            <Image
              src={row.imageUrl}
              alt={`${row.store.name} deal`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-neutral-100">
              {row.store.name} · {row.category.name}
            </div>
            <div className="truncate text-xs text-neutral-400">
              ₹{formatMoney(row.dealPrice)}{" "}
              <span className="line-through opacity-70">
                ₹{formatMoney(row.originalPrice)}
              </span>{" "}
              · {row.discountPercent}% off
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      accessor: (row: DealRow) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: DealRow) => {
        const isEditing = editingId === row.id;
        return (
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={draftOriginalPrice}
                    onChange={(e) => setDraftOriginalPrice(e.target.value)}
                    placeholder="Original price"
                  />
                  <Input
                    value={draftDealPrice}
                    onChange={(e) => setDraftDealPrice(e.target.value)}
                    placeholder="Deal price"
                  />
                </div>
                <Input
                  value={draftAffiliateUrl}
                  onChange={(e) => setDraftAffiliateUrl(e.target.value)}
                  placeholder="Affiliate URL (https://...)"
                />
                <Input
                  type="date"
                  value={draftExpiryDate}
                  onChange={(e) => setDraftExpiryDate(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={updateMutation.isPending}
                    onClick={() => {
                      const orig = Number(draftOriginalPrice);
                      const deal = Number(draftDealPrice);
                      if (!Number.isFinite(orig) || !Number.isFinite(deal))
                        return;
                      updateMutation.mutate({
                        id: row.id,
                        originalPrice: orig,
                        dealPrice: deal,
                        affiliateUrl: draftAffiliateUrl.trim(),
                        expiryDate: draftExpiryDate,
                      });
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setEditingId(null);
                      setDraftOriginalPrice("");
                      setDraftDealPrice("");
                      setDraftAffiliateUrl("");
                      setDraftExpiryDate("");
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
                    setDraftOriginalPrice(String(row.originalPrice));
                    setDraftDealPrice(String(row.dealPrice));
                    setDraftAffiliateUrl(row.affiliateUrl);
                    const d =
                      typeof row.expiryDate === "string"
                        ? new Date(row.expiryDate)
                        : row.expiryDate;
                    setDraftExpiryDate(
                      Number.isNaN(d.getTime())
                        ? ""
                        : d.toISOString().slice(0, 10),
                    );
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
        searchPlaceHolder="Search by store or category..."
        sortOptions={[
          { value: "createdAt", label: "Created" },
          { value: "dealPrice", label: "Deal price" },
          { value: "originalPrice", label: "Original price" },
        ]}
      />

      {listQuery.isLoading ? (
        <div className="text-muted-foreground rounded border bg-neutral-950/20 p-6 text-sm">
          Loading deals...
        </div>
      ) : listQuery.isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load deals.
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

export default function DealManagementPage() {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader actionLabel="Create Deal" actionHref="/admin/deals/new">
          <EntityHeaderContent
            heading="Deals"
            subheading="Create, update, and remove deals. Search by store/category and sort by price or date."
          />
        </EntityHeader>

        <DealsGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
}
