"use client";
import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import DealsGrid from "@/modules/deal/components/admin/deal-grid";

const ManageDeals: React.FC = () => {
  return (
    <EntityContentProvider>
      <EntityWrapper>
        <EntityHeader
          actionLayoutId="admin-add-new-deal-model"
          actionLabel="Create"
          actionHref="/admin/deals/new"
        >
          <EntityHeaderContent
            heading="Deals"
            subheading="Manage All deals, branding, and cleanup. Use search + sort to move fast."
          />
        </EntityHeader>

        <DealsGrid />
      </EntityWrapper>
    </EntityContentProvider>
  );
};

export default ManageDeals;
