"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide uppercase",
  {
    variants: {
      tone: {
        red: "bg-red-500/95 text-white",
        orange: "bg-orange-500/95 text-white",
        green: "bg-green-500/95 text-white",
        blue: "bg-blue-500/95 text-white",
        neutral: "bg-neutral-700/90 text-neutral-100",
      },
    },
    defaultVariants: {
      tone: "red",
    },
  },
);

const cardVariants = cva(
  "group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 shadow-lg",
  {
    variants: {
      size: {
        sm: "max-w-[270px]",
        md: "max-w-[320px]",
        lg: "max-w-[420px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type DealOfferCardProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;

  badgeText?: string;
  badgeTone?: NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

  kicker?: string; // e.g. "BEST BUY"
  rating?: number; // e.g. 4.7
  ratingCount?: number; // e.g. 320

  price: number;
  compareAtPrice?: number;
  currencySymbol?: string; // default "₹"

  ctaLabel: string;
  ctaHref?: string;
  onCta?: () => void;

  showFavorite?: boolean;
  isFavorite?: boolean;

  className?: string;
} & VariantProps<typeof cardVariants>;

export const DealOfferCard = React.forwardRef<
  HTMLDivElement,
  DealOfferCardProps
>(
  (
    {
      imageUrl,
      imageAlt,
      title,
      badgeText,
      badgeTone = "red",
      kicker,
      rating,
      ratingCount,
      price,
      compareAtPrice,
      currencySymbol = "₹",
      ctaLabel,
      ctaHref,
      onCta,
      showFavorite = false,
      isFavorite = false,
      size,
      className,
    },
    ref,
  ) => {
    const formattedPrice = new Intl.NumberFormat(undefined).format(price);
    const formattedCompareAt =
      typeof compareAtPrice === "number"
        ? new Intl.NumberFormat(undefined).format(compareAtPrice)
        : null;

    const ctaProps = {
      className:
        "w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500/90",
    } as const;

    return (
      <Card
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(cardVariants({ size }), className)}
      >
        <div className="relative h-44 w-full sm:h-48">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 270px, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {badgeText ? (
            <span className={cn(badgeVariants({ tone: badgeTone }))}>
              {badgeText}
            </span>
          ) : null}

          {showFavorite ? (
            <button
              type="button"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur transition-colors hover:bg-neutral-900/80"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-neutral-200",
                )}
              />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 p-4">
          {kicker || typeof rating === "number" ? (
            <div className="flex flex-wrap items-center gap-2">
              {kicker ? (
                <span className="text-xs font-semibold text-orange-400">
                  {kicker}
                </span>
              ) : null}

              {typeof rating === "number" ? (
                <span className="text-xs font-semibold text-neutral-100">
                  ★ {rating.toFixed(1)}
                  {typeof ratingCount === "number" ? ` (${ratingCount})` : ""}
                </span>
              ) : null}
            </div>
          ) : null}

          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-50">
            {title}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white">
              {currencySymbol}
              {formattedPrice}
            </span>

            {formattedCompareAt ? (
              <span className="text-xs font-medium text-neutral-400 line-through">
                {currencySymbol}
                {formattedCompareAt}
              </span>
            ) : null}
          </div>

          {ctaHref ? (
            <Button asChild {...ctaProps}>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              {...ctaProps}
              onClick={onCta}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </Card>
    );
  },
);

DealOfferCard.displayName = "DealOfferCard";
