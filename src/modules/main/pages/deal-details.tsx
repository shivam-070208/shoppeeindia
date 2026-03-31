"use client";

import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/utils";
import { ProductCard } from "@/modules/deal/components/main/product-card";
import { useDealById, useRelatedDeals } from "@/modules/deal/hooks/use-deal";
import { Deal } from "@/modules/deal/types/deal";
import { formatMoney } from "@/utils/format-money";
import { Clock3, ExternalLink, Loader2, Store, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getTimeLeft = (expiryDate: string | Date) => {
  const target = new Date(expiryDate).getTime();
  if (Number.isNaN(target)) return "Invalid date";
  const diff = target - Date.now();
  if (diff <= 0) return "Deal expired";

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

const getSpecEntries = (specs: unknown) => {
  if (!specs || typeof specs !== "object") return [];
  return Object.entries(specs).filter(
    ([key, value]) =>
      key.trim().length > 0 &&
      typeof value === "string" &&
      value.trim().length > 0,
  );
};

const DealDetailsPage = ({ dealId }: { dealId: string }) => {
  const { data: deal, isPending, isError } = useDealById(dealId);
  const { data: relatedDeals, isPending: isRelatedPending } = useRelatedDeals({
    dealId,
    categoryId: deal?.categoryId,
    storeId: deal?.storeId,
    limit: 8,
  });

  if (!dealId?.trim()) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="rounded-lg border p-6 text-sm text-red-300">
          Invalid deal id.
        </div>
      </Container>
    );
  }

  if (isPending) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border">
          <Loader2 className="text-primary h-7 w-7 animate-spin" />
        </div>
      </Container>
    );
  }

  if (isError || !deal) {
    return (
      <Container maxWidth="max-w-7xl" className="py-10">
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load deal details.
        </div>
      </Container>
    );
  }

  const specs = getSpecEntries((deal as { specs?: unknown }).specs);
  const normalizedRelatedDeals = (relatedDeals ?? []) as unknown as Deal[];

  return (
    <div className="py-6">
      <Container maxWidth="max-w-7xl" className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/deals">Deals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{deal.name || "Deal Details"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border bg-black/20">
              <div className="absolute top-4 left-4 z-10 rounded-full bg-[#FF7A1A] px-3 py-1 text-xs font-bold text-black uppercase">
                {deal.discountPercent > 0
                  ? `${deal.discountPercent}% off limited deal`
                  : "Limited deal"}
              </div>
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={deal.imageUrl}
                  alt={deal.name || `Deal ${deal.id}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border p-5">
            <Heading as="h2" className="text-2xl leading-tight">
              {deal.name}
            </Heading>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Store className="h-4 w-4" />
              <span>Sold by {deal.store?.name ?? "Unknown Store"}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {formatMoney(deal.dealPrice)}
                </span>
                <span className="text-muted-foreground pb-1 text-sm line-through">
                  {formatMoney(deal.originalPrice)}
                </span>
              </div>
              <div className="text-primary flex items-center gap-2 text-sm">
                <Clock3 className="h-4 w-4" />
                <span>{getTimeLeft(deal.expiryDate)}</span>
              </div>
            </div>

            <Button asChild className="w-full rounded-full py-6 text-base">
              <a
                href={deal.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get This Deal
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <div className="text-muted-foreground space-y-2 border-t pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span>Category</span>
                <span className="text-foreground flex items-center gap-1 font-medium">
                  <Tag className="h-4 w-4" />
                  {deal.category?.name ?? "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Store</span>
                <span className="text-foreground font-medium">
                  {deal.store.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Expires On</span>
                <span className="text-foreground font-medium">
                  {formatDate(String(deal.expiryDate))}
                </span>
              </div>
              {specs.length > 0 &&
                specs.slice(0, 3).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>{key}</span>
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <Heading as="h4">Product Description</Heading>
          <p className="text-muted-foreground text-sm leading-7">
            {deal.description || "No product description available."}
          </p>
          {specs.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {specs.map(([key, value]) => (
                <div
                  key={key}
                  className="text-muted-foreground flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <span className="text-foreground font-medium">{key}</span>
                  <span className="truncate">{value}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Heading as="h4">Related Deals</Heading>
            <Link
              href="/home/deals"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {isRelatedPending ? (
            <div className="flex min-h-[140px] items-center justify-center rounded-lg border">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          ) : (relatedDeals?.length ?? 0) === 0 ? (
            <div className="text-muted-foreground rounded-lg border p-6 text-sm">
              No related deals found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {normalizedRelatedDeals.map((item) => (
                <ProductCard key={item.id} deal={item} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
};

export default DealDetailsPage;
