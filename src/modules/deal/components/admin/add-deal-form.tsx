"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useCreateDeal } from "@/modules/deal/hooks/use-deal";
import { useStores } from "@/modules/store/hooks/use-store";
import { useListCategories } from "@/modules/category/hooks/use-category";
import { Textarea } from "@/components/ui/textarea";

type StoreAndCategorySelectsProps = {
  storeId: string;
  setStoreId: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
};

const StoreAndCategorySelects: React.FC<StoreAndCategorySelectsProps> = ({
  storeId,
  setStoreId,
  categoryId,
  setCategoryId,
}) => {
  const storesQuery = useStores({
    searchQuery: "",
    page: 0,
    limit: 100,
  });
  const categoriesQuery = useListCategories({
    searchQuery: "",
    page: 1,
    limit: 100,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Store</Label>
        <Select value={storeId} onValueChange={setStoreId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select store" />
          </SelectTrigger>
          <SelectContent>
            {(storesQuery.data?.stores ?? []).map(
              (s: { id: string; name: string }) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {(categoriesQuery.data?.items ?? []).map(
              (c: { id: string; name: string }) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const AddDealForm: React.FC = () => {
  const router = useRouter();
  const createMutation = useCreateDeal();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [storeId, setStoreId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isBusy = isUploading || createMutation.isPending;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    if (!storeId || !categoryId) return;

    const orig = Number(originalPrice);
    const deal = Number(dealPrice);

    if (!Number.isFinite(orig) || !Number.isFinite(deal)) return;
    if (!Number.isInteger(orig) || !Number.isInteger(deal)) return;
    if (orig <= 0 || deal <= 0) return;
    if (!affiliateUrl.trim()) return;
    if (!expiryDate) return;
    if (!name.trim()) return;
    if (!description.trim()) return;

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

      createMutation.mutate(
        {
          name: name.trim(),
          description: description.trim(),
          storeId,
          categoryId,
          imageUrl: data.url,
          originalPrice: orig,
          dealPrice: deal,
          affiliateUrl: affiliateUrl.trim(),
          expiryDate,
        },
        {
          onSuccess: async () => {
            router.push("/admin/deals");
          },
        },
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-neutral-950/30">
      <CardHeader>
        <CardTitle className="text-base">Deal details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter deal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter deal description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="text-muted-foreground rounded border border-neutral-800 bg-neutral-950/20 p-3 text-sm">
                  Loading stores...
                </div>
                <div className="text-muted-foreground rounded border border-neutral-800 bg-neutral-950/20 p-3 text-sm">
                  Loading categories...
                </div>
              </div>
            }
          >
            <StoreAndCategorySelects
              storeId={storeId}
              setStoreId={setStoreId}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </Suspense>

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
            <motion.div layoutId="admin-add-new-deal-model">
              <Button type="submit" variant="outline" disabled={isBusy}>
                {isUploading
                  ? "Uploading..."
                  : createMutation.isPending
                    ? "Creating..."
                    : "Create"}
              </Button>
            </motion.div>
          </div>

          {createMutation.isError && (
            <div className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-200">
              Failed to create deal.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDealForm;
