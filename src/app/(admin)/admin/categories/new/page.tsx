"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubHeading } from "@/components/ui/sub-heading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useCreateCategory } from "@/modules/category/hooks/use-category";

export default function Page() {
  const router = useRouter();
  const {
    mutateAsync: createCategory,
    isPending,
    isError,
  } = useCreateCategory();

  const [name, setName] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    createCategory(
      {
        name: trimmed,
      },
      {
        onSuccess: () => {
          router.push("/admin/categories");
        },
      },
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-2 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Heading as="h2">Create category</Heading>
          <SubHeading className="text-muted-foreground">
            Add a new category for organizing deals and product discovery.
          </SubHeading>
        </div>
        <Link
          href="/admin/categories"
          className="text-primary hover:opacity-80"
        >
          Back to categories
        </Link>
      </div>

      <Card className="bg-neutral-950/30">
        <CardHeader>
          <CardTitle className="text-base">Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Electronics"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-neutral-400">
                Tip: slug will be generated automatically.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Link href="/admin/categories">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </div>

            {isError && (
              <div className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-200">
                Failed to create category.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
