"use client";
import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import StoresGrid from "@/modules/store/components/admin/store-grid";

export default function StoreManagementPage() {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader actionLabel="Create Store" actionHref="/admin/stores/new">
          <EntityHeaderContent
            heading="Stores"
            subheading="Manage store directory, branding, and cleanup. Use search + sort to move fast."
          />
        </EntityHeader>

        <StoresGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
}
