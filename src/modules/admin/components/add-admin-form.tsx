"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateAdmin } from "@/modules/admin/hooks/use-admin";
import { motion } from "motion/react";

const AddAdminForm: React.FC = () => {
  const router = useRouter();
  const {
    mutateAsync: createAdmin,
    isPending,
    isError,
    error,
  } = useCreateAdmin();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;
    await createAdmin(
      { name: trimmedName, email: trimmedEmail },
      {
        onSuccess: () => {
          router.push("/super-admin/admins");
        },
      },
    );
  };

  return (
    <Card className="bg-neutral-950/30">
      <CardHeader>
        <CardTitle className="text-base">Admin details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. name@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href="/admin/admins">
              <Button type="button" variant="ghost" className="cursor-pointer">
                Cancel
              </Button>
            </Link>
            <motion.div layoutId="admin-add-new-admin-model">
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
              {error.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAdminForm;
