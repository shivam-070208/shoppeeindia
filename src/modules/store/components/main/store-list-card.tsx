"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Store } from "lucide-react";

export type StoreListCardItem = {
  id: string;
  name: string;
  logoUrl: string;
  slug: string;
  _count?: { deals: number };
};

type StoreListCardProps = {
  store: StoreListCardItem;
  className?: string;
};

const StoreListCard = ({ store, className }: StoreListCardProps) => {
  const dealCount = store._count?.deals ?? 0;

  return (
    <Link
      href={`/stores/${store.id}`}
      className={cn("block h-full", className)}
    >
      <Card
        className={cn(
          "border-border hover:border-primary/40 bg-card/40 h-full flex-col justify-between gap-0 overflow-hidden border transition-colors",
        )}
      >
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-primary/15 relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border">
            {store.logoUrl ? (
              <Image
                src={store.logoUrl}
                alt={store.name}
                width={64}
                height={64}
                className="object-contain p-2"
              />
            ) : (
              <Store className="text-primary size-8" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg leading-tight">
              {store.name}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1 text-xs">
              <ShoppingBag className="size-3.5 shrink-0" aria-hidden />
              <span>
                {dealCount === 0
                  ? "No deals yet"
                  : `${dealCount} deal${dealCount === 1 ? "" : "s"}`}
              </span>
            </CardDescription>
          </div>
          <ChevronRight className="text-muted-foreground size-5 shrink-0" />
        </CardHeader>
        <CardContent className="text-muted-foreground pt-0 text-xs">
          View store profile and active offers
        </CardContent>
      </Card>
    </Link>
  );
};

export { StoreListCard };
