"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useCreateStore } from "@/modules/store/hooks/use-store";
import { motion } from "motion/react";
const AddStoreForm: React.FC = () => {
  const router = useRouter();
  const createMutation = useCreateStore();

  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const isBusy = isUploading || createMutation.isPending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) return;
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch("/api/upload/store-logo", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("Upload failed");

      createMutation.mutate(
        {
          name: trimmed,
          logoUrl: data.url,
        },
        {
          onSuccess: async () => {
            router.push("/admin/stores");
          },
        },
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="bg-neutral-950/30">
      <CardHeader>
        <CardTitle className="text-base">Store details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Amazon"
              minLength={2}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-neutral-400">
              Tip: keep it short and recognizable. Slug will be generated
              automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-neutral-400">
              PNG/WebP recommended. Square logos look best in cards.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href="/admin/stores">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <motion.div layoutId={"admin-add-new-store-model"}>
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
              Failed to create store.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStoreForm;
