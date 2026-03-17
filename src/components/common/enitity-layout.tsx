"use client";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import React, { createContext, useContext } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { SubHeading } from "../ui/sub-heading";
import { Heading } from "../ui/heading";

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
    }
  | {
      children: React.ReactNode;
      className?: string;
      isPending?: never;
      actionLabel?: string;
      action?: never;
      actionHref: string;
    };

const EntityHeader = ({
  children,
  className = "",
  actionLabel,
  action,
  isPending,
  actionHref,
}: EntityHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      className,
    )}
  >
    <div>{children}</div>
    {!!actionLabel && !action && actionHref && (
      <Link href={actionHref} className="text-primary hover:opacity-80">
        {actionLabel}
      </Link>
    )}
    {!!actionLabel && action && (
      <Button
        onClick={action}
        variant={"outline"}
        disabled={isPending}
        className="flex font-medium hover:opacity-80"
      >
        <PlusIcon className="inline" /> {actionLabel}
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
/* eslint-disable */

function EntityTable<T extends Record<string, any>>({
  data,
  columns,
  className = "",
}: EntityTableProps<T>) {
  const { sortKey } = useEntityContextValues();
  const [sortedData, setSortedData] = React.useState(data);
  React.useEffect(() => {
    let filtered = [...data];
    if (sortKey) {
      const col = columns.find((c) => c.id === sortKey);
      if (col) {
        filtered = [...filtered].sort((a, b) => {
          let aValue = col.accessor(a);
          let bValue = col.accessor(b);
          if (typeof aValue == "object") {
            aValue = a[sortKey];
          }
          if (typeof bValue == "object") {
            bValue = b[sortKey];
          }
          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
          }
          return 0;
        });
      }
    }
    setSortedData(filtered);
  }, [sortKey, data, columns]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {sortedData.length === 0 ? (
        <div className="bg-muted text-muted-foreground col-span-full rounded border py-4 text-center">
          No results found.
        </div>
      ) : (
        sortedData.map((row, index) => (
          <motion.div
            animate={{ filter: "blur(0px)" }}
            initial={{ filter: "blur(10px)" }}
            transition={{ duration: 0.2 }}
            layoutId={row.id ?? `entity-${index}`}
            key={row.id ?? index}
          >
            <Card className="gap-0">
              <CardHeader className="border-none">
                <CardTitle className="text-sm">
                  {columns.find(
                    (col) => col.id === "name" || col.id === "title",
                  )?.accessor
                    ? columns
                        .find((col) => col.id === "name" || col.id === "title")!
                        .accessor(row)
                    : row.name || row.title || "Untitled"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-1 text-xs">
                {columns
                  .filter((col) => col.id !== "name" && col.id !== "title")
                  .map((col) => (
                    <div key={col.id}>
                      <span className="font-medium">{col.header}:</span>{" "}
                      <span>
                        {col.accessor ? col.accessor(row) : (row[col.id] ?? "")}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
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
  return (
    <div
      className={cn(
        "mt-4 flex w-full items-center justify-between gap-4",
        className,
      )}
    >
      <div className="text-muted-foreground text-sm">
        Showing {(pagination.page - 1) * pagination.limit + 1} to +{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} results{" "}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => pagination.onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeftIcon className="h-16 w-16" />
        </Button>
        <Button
          variant="outline"
          onClick={() => pagination.onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          <ChevronRightIcon className="h-16 w-16" />
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
