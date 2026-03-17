"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubHeading } from "@/components/ui/sub-heading";
import { trpc } from "@/_trpc/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const storesQuery = trpc.admin.store.list.useQuery();
  const categoriesQuery = trpc.admin.category.list.useQuery();

  const createMutation = trpc.admin.deal.create.useMutation({
    onSuccess: async () => {
      await utils.admin.deal.list.invalidate();
      router.push("/admin/deals");
    },
  });

  const [storeId, setStoreId] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [originalPrice, setOriginalPrice] = React.useState("");
  const [dealPrice, setDealPrice] = React.useState("");
  const [affiliateUrl, setAffiliateUrl] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const isBusy = isUploading || createMutation.isPending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    const orig = Number(originalPrice);
    const deal = Number(dealPrice);
    if (!Number.isFinite(orig) || !Number.isFinite(deal)) return;
    if (!storeId || !categoryId) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload/deal-image", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("Upload failed");

      createMutation.mutate({
        storeId,
        categoryId,
        imageUrl: data.url,
        originalPrice: orig,
        dealPrice: deal,
        affiliateUrl: affiliateUrl.trim(),
        expiryDate,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-2 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Heading as="h2">Create deal</Heading>
          <SubHeading className="text-muted-foreground">
            Upload an image, attach store + category, set pricing and expiry.
          </SubHeading>
        </div>
        <Link href="/admin/deals" className="text-primary hover:opacity-80">
          Back to deals
        </Link>
      </div>

      <Card className="bg-neutral-950/30">
        <CardHeader>
          <CardTitle className="text-base">Deal details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Store</Label>
                <Select value={storeId} onValueChange={setStoreId}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        storesQuery.isLoading
                          ? "Loading stores..."
                          : "Select store"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(storesQuery.data ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        categoriesQuery.isLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoriesQuery.data ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original price</Label>
                <Input
                  id="originalPrice"
                  inputMode="numeric"
                  placeholder="e.g. 1999"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealPrice">Deal price</Label>
                <Input
                  id="dealPrice"
                  inputMode="numeric"
                  placeholder="e.g. 999"
                  value={dealPrice}
                  onChange={(e) => setDealPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliateUrl">Affiliate URL</Label>
              <Input
                id="affiliateUrl"
                placeholder="https://..."
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
                <p className="text-xs text-neutral-400">
                  Deals past this date can be cleaned up later.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-neutral-400">
                  WebP/PNG recommended for fast loading.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Link href="/admin/deals">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="outline" disabled={isBusy}>
                {isUploading
                  ? "Uploading..."
                  : createMutation.isPending
                    ? "Creating..."
                    : "Create"}
              </Button>
            </div>

            {createMutation.isError && (
              <div className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-200">
                Failed to create deal.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
