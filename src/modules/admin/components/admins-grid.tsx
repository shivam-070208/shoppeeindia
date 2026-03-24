"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { useListAdmins, useDeleteAdmin } from "@/modules/admin/hooks/use-admin";
import Link from "next/link";
import {
  EntityTableFooter,
  EntityTableHeader,
  useEntityContextValues,
} from "@/components/common/entity-layout";
import { formatDate } from "@/lib/utils";

function stringToInitials(str?: string | null) {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? "";
  return words[0][0]?.toUpperCase() + (words[1]?.[0]?.toUpperCase() ?? "");
}

const AdminsGrid: React.FC = () => {
  const { search } = useEntityContextValues();
  const [page, setPage] = useState(1);

  const limit = 12;
  const { data, isLoading, isError } = useListAdmins({
    searchQuery: search,
    page,
    limit,
  });
  const deleteMutation = useDeleteAdmin();

  return (
    <>
      <EntityTableHeader
        searchPlaceHolder="Search admins by name or email..."
        sortOptions={[
          { value: "createdAt", label: "Created" },
          { value: "name", label: "Name" },
          { value: "email", label: "Email" },
        ]}
      />

      {isLoading ? (
        <div className="flex w-full justify-center py-12">
          <span>Loading admins...</span>
        </div>
      ) : isError ? (
        <div className="rounded border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-200">
          Failed to load admins.
        </div>
      ) : (
        <>
          {(data?.items?.length ?? 0) === 0 ? (
            <div className="flex w-full flex-col items-center py-16">
              <p className="text-muted-foreground text-lg">No admins found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.items.map((admin) => (
                  <Card
                    key={admin.id}
                    className="flex flex-col shadow-md transition-shadow hover:shadow-xl"
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={admin.user?.image ?? undefined} />
                        <AvatarFallback>
                          {stringToInitials(admin.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {admin.user?.name}
                        </CardTitle>
                        <CardDescription>{admin.user?.email}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-1 flex flex-1 flex-col gap-2">
                      <div className="flex-1" />
                      <div className="flex gap-2">
                        <Link href={`/super-admin/admins/${admin.id}`}>
                          <Button
                            variant="secondary"
                            className="flex-1 justify-center rounded-full py-2 text-base font-semibold"
                          >
                            Manage
                            <ExternalLink
                              className="ml-2 h-4 w-4"
                              strokeWidth={2}
                            />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="ml-1 flex items-center justify-center rounded-full border border-red-400 p-2 text-red-400 transition-colors hover:bg-red-500/10"
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            deleteMutation.mutate({ id: admin.id })
                          }
                          title="Delete admin"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="mt-2 flex justify-between gap-2 text-xs text-neutral-400">
                        <span>Created: {formatDate(admin.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <EntityTableFooter
                pagination={{
                  page,
                  totalPages: data?.totalPages ?? 1,
                  total: data?.total ?? 0,
                  limit,
                  onPageChange: setPage,
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AdminsGrid;
