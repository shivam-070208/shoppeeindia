import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { ExternalLink, Star, Store } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import { formatMoney } from "@/utils/format-money";
import { Deal } from "../../types/deal";

const ProductCard = ({ deal }: { deal: Deal }) => {
  return (
    <Card
      className={cn(
        "border-border relative flex min-h-[430px] flex-col justify-between overflow-hidden border bg-transparent pt-0 shadow transition-shadow",
      )}
    >
      <CardHeader className="p-0">
        {deal.expiryDate && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-accent text-destructive-foreground rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow">
              LTD TIME
            </span>
          </div>
        )}
        <div className="border-border relative aspect-4/3 w-full">
          {deal.imageUrl && (
            <Image
              src={deal.imageUrl}
              alt={deal.name ? deal.name : `Deal ${deal.id}`}
              fill
              sizes="100vw"
              className="w-full object-cover"
              style={{ objectPosition: "center", width: "100%" }}
              priority
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-2 px-4 py-3">
        <div className="mb-1 flex items-center gap-2">
          {deal.store?.logoUrl ? (
            <span className="flex items-center">
              <Image
                src={deal.store.logoUrl}
                alt={deal.store.name}
                width={20}
                height={20}
                className="rounded-full bg-white object-contain"
              />
            </span>
          ) : (
            <Store className="text-primary" size={20} strokeWidth={2} />
          )}
          <span className="text-primary text-[0.75rem] font-extrabold tracking-tight uppercase">
            {deal.store?.name || "Unknown Store"}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-yellow-400">
            <Star
              className="inline-block"
              size={16}
              fill="currentColor"
              stroke="none"
            />
            4.7
            <span className="text-muted-foreground ml-1 font-normal">
              (320)
            </span>
          </span>
        </div>
        <CardTitle className="text-card-foreground mb-1 text-lg leading-tight font-semibold">
          {deal.name || "Deal Title"}
        </CardTitle>
        <CardDescription className="text-muted-foreground mb-2 truncate text-sm">
          {deal.description ? deal.description : "No description available."}
        </CardDescription>
        <div className="flex flex-wrap justify-between">
          <div className="flex gap-1">
            <span className="text-card-foreground text-sm leading-tight font-extrabold">
              {formatMoney(deal.dealPrice)}
            </span>
            <span className="text-muted-foreground text-xs font-medium line-through">
              {formatMoney(deal.originalPrice)}
            </span>
          </div>
          {deal.discountPercent > 0 && (
            <span className="bg-accent text-accent-foreground ml-2 rounded-full px-2 py-[2px] text-xs font-bold">
              -{deal.discountPercent}%
            </span>
          )}
        </div>
        <div className="mt-4 flex w-full items-center justify-between gap-2">
          <Link
            href={`/home/deals/${deal.id}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center rounded-full py-2 text-center text-base font-semibold"
          >
            View Deal
            <ExternalLink className="ml-2 h-5 w-5" strokeWidth={2} />
          </Link>
        </div>
        <div className="text-muted-foreground mt-2 flex justify-between text-xs">
          {deal.expiryDate && (
            <span>Expires: {formatDate(String(deal.expiryDate))}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ProductCard };
