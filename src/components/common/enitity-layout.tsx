"use client";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { createContext, useContext } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { SubHeading } from "../ui/sub-heading";
import { Heading } from "../ui/heading";
import { motion } from "motion/react";
interface EntityContextType {
  sortKey: string;
  setSortKey: (key: string) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const EntityContext = createContext<EntityContextType | null>(null);

const useEntityContextValues = (): EntityContextType => {
  const context = useContext(EntityContext);
  if (!context)
    throw new Error(
      "Entity Context must used with in Provider--->EntityContentProvider",
    );
  return context;
};

const EntityContentProvider = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [sortKey, setSortKey] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  return (
    <EntityContext.Provider value={{ sortKey, setSortKey, search, setSearch }}>
      <div className={cn("flex flex-1 flex-col gap-4", className)}>
        {children}
      </div>
    </EntityContext.Provider>
  );
};

const EntityWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-1 flex-col gap-6 p-6 sm:p-10", className)}>
    {children}
  </div>
);

type EntityHeaderProps =
  | {
      children: React.ReactNode;
      className?: string;
      actionLabel?: string;
      action: () => void;
      isPending?: boolean;
      actionHref?: never;
      actionLayoutId?: string;
    }
  | {
      children: React.ReactNode;
      className?: string;
      isPending?: never;
      actionLabel?: string;
      action?: never;
      actionHref?: string;
      actionLayoutId?: string;
    };

const EntityHeader = ({
  children,
  className = "",
  actionLabel,
  action,
  isPending,
  actionHref,
  actionLayoutId,
}: EntityHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      className,
    )}
  >
    <div>{children}</div>

    {!!actionLabel && !action && actionHref && (
      <Link
        href={actionHref}
        className="text-foreground btn-glow bg-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
      >
        <PlusIcon className="inline" />
        <motion.span layoutId={actionLayoutId}>{actionLabel}</motion.span>
      </Link>
    )}
    {!!actionLabel && action && (
      <Button
        onClick={action}
        disabled={isPending}
        className="text-foreground btn-glow bg-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
      >
        <PlusIcon className="inline" />{" "}
        <motion.span layoutId={actionLayoutId}>{actionLabel}</motion.span>
      </Button>
    )}
  </div>
);

const EntityHeaderContent = ({
  heading,
  subheading,
}: {
  heading: React.ReactNode;
  subheading?: React.ReactNode;
}) => (
  <div>
    <Heading as="h2">{heading}</Heading>
    {subheading && (
      <SubHeading className="text-muted-foreground">{subheading}</SubHeading>
    )}
  </div>
);

type Column<T> = {
  id: string;
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  className?: string;
};

type EntityTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
};

function EntityTable<T>({
  data,
  columns,
  className = "",
}: EntityTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-md border bg-neutral-900/70 p-0 ${className}`}
    >
      <table className="min-w-full divide-y divide-neutral-800 text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`px-8 py-4 text-left font-semibold tracking-wider text-neutral-400 uppercase ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-neutral-400"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={`bg-secondary border-b border-neutral-800`}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`px-8 py-4 align-middle ${col.className ?? ""}`}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

type EntityTableHeaderProps<T> = {
  searchPlaceHolder?: string;
  sortOptions: (T & { value: string; label: string })[];
};

function EntityTableHeader<T>({
  searchPlaceHolder,
  sortOptions,
}: EntityTableHeaderProps<T>) {
  const { sortKey, setSortKey, setSearch } = useEntityContextValues();
  const [localSearch, setLocalSearch] = React.useState("");

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearch(val);
    }, 1000);
  };
  return (
    <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
      {searchPlaceHolder && (
        <Input
          type="text"
          className="sm:w-100"
          value={localSearch}
          placeholder={searchPlaceHolder}
          onChange={onSearchChange}
        />
      )}
      <Select value={sortKey} onValueChange={(value) => setSortKey(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Sort Option" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type EntityTableFooterProps = {
  className?: string;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
};

function EntityTableFooter({
  className = "",
  pagination,
}: EntityTableFooterProps) {
  const { page, totalPages, total, limit, onPageChange } = pagination;

  if (totalPages <= 1 && total <= limit) return null;

  return (
    <div
      className={`footer flex w-full flex-col items-center justify-between gap-2 sm:flex-row ${className}`}
    >
      <span className="text-muted-foreground text-xs select-none">
        Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
        {total}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium tabular-nums">
          Page {page}/{totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export {
  useEntityContextValues,
  EntityContentProvider,
  EntityWrapper,
  EntityHeader,
  EntityHeaderContent,
  EntityTable,
  EntityTableHeader,
  EntityTableFooter,
};
