"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateCategory } from "@/modules/category/hooks/use-category";
import { motion } from "motion/react";
const AddCategoryForm: React.FC = () => {
  const router = useRouter();
  const {
    mutateAsync: createCategory,
    isPending,
    isError,
  } = useCreateCategory();
  const [name, setName] = React.useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    createCategory(
      { name: trimmed },
      {
        onSuccess: () => {
          router.push("/admin/categories");
        },
      },
    );
  };

  return (
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
              <Button type="button" variant="ghost" className="cursor-pointer">
                Cancel
              </Button>
            </Link>
            <motion.div layoutId="admin-add-new-category-model">
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </motion.div>
          </div>

          {isError && (
            <div className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-200">
              Failed to create category.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
