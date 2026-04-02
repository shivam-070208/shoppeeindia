"use client";

import Container from "@/components/common/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StoreDealsPanel } from "@/modules/store/components/main/store-deals-panel";
import { StoreStatCard } from "@/modules/store/components/main/store-stat-card";
import { useStoreById } from "@/modules/store/hooks/use-store";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Loader2,
  ShoppingCart,
  Star,
  Tag,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StoreDetailPageProps = {
  storeId: string;
};

const StoreDetailPage = ({ storeId }: StoreDetailPageProps) => {
  const { data: store, isPending, isError } = useStoreById(storeId);

  if (!storeId?.trim()) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="rounded-lg border p-6 text-sm text-red-300">
          Invalid store id.
        </div>
      </Container>
    );
  }

  if (isPending) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="flex min-h-[280px] items-center justify-center rounded-xl border">
          <Loader2
            className="text-primary size-8 animate-spin"
            aria-label="Loading"
          />
        </div>
      </Container>
    );
  }

  if (isError || !store) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          This store could not be loaded. It may not exist or there was a
          network error.
        </div>
      </Container>
    );
  }

  const ratingLabel =
    store.stats.rating != null ? `${store.stats.rating.toFixed(1)}/5` : "—";

  return (
    <div className="bg-background pb-12">
      <Container maxWidth="max-w-7xl" className="space-y-10 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/stores">Stores</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{store.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="flex flex-col items-center text-center">
          <div
            className={cn(
              "relative mb-5 flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 shadow-lg sm:size-32",
              "border-[#FF7A1A]/40 bg-[#FF7A1A]/15",
            )}
          >
            {store.logoUrl ? (
              <Image
                src={store.logoUrl}
                alt={store.name}
                width={128}
                height={128}
                className="object-contain p-4"
                priority
              />
            ) : (
              <ShoppingCart className="size-14 text-[#FF7A1A]" aria-hidden />
            )}
          </div>
          <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {store.name}
          </h1>
          <p className="text-muted-foreground mb-4 max-w-xl text-sm leading-relaxed sm:text-base">
            Shop curated deals from this store. Offers update regularly—check
            back for new savings.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF7A1A]/35 bg-[#FF7A1A]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FF7A1A] uppercase">
            <BadgeCheck className="size-4 shrink-0" aria-hidden />
            verified authorized retailer
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StoreStatCard
            icon={Tag}
            label="Active Deals"
            value={String(store.stats.activeDeals)}
          />
          <StoreStatCard
            icon={Ticket}
            label="Vouchers Available"
            value={String(store.stats.vouchersAvailable)}
          />
          <StoreStatCard icon={Star} label="Store Rating" value={ratingLabel} />
        </div>

        <StoreDealsPanel storeId={store.id} categoryTabs={store.categories} />
      </Container>
    </div>
  );
};

export default StoreDetailPage;
