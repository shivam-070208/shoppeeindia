"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StoreStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

const StoreStatCard = ({
  icon: Icon,
  label,
  value,
  className,
}: StoreStatCardProps) => {
  return (
    <div
      className={cn(
        "border-border bg-muted/30 flex flex-col gap-2 rounded-xl border px-4 py-4",
        className,
      )}
    >
      <div className="text-primary flex items-center gap-2">
        <Icon className="size-5 shrink-0" aria-hidden />
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      <p className="text-foreground text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
};

export { StoreStatCard };
