"use client";
import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/entity-layout";
import StoresGrid from "@/modules/store/components/admin/store-grid";

const MangeStore: React.FC = () => {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader
          actionLayoutId="admin-add-new-store-model"
          actionLabel="Create"
          actionHref="/admin/stores/new"
        >
          <EntityHeaderContent
            heading="Stores"
            subheading="Manage store directory, branding, and cleanup. Use search + sort to move fast."
          />
        </EntityHeader>

        <StoresGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
};

export default MangeStore;
