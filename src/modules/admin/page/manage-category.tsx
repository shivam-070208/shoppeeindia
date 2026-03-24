import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/entity-layout";
import CategoriesGrid from "@/modules/category/components/admin/category-grid";

const ManageCategory: React.FC = () => (
  <EntityContentProvider>
    <EntityWrapper>
      <EntityHeader
        actionLayoutId="admin-add-new-category-model"
        actionLabel="Create"
        actionHref="/admin/categories/new"
      >
        <EntityHeaderContent
          heading="Categories"
          subheading="Manage category structure and keep naming consistent across the catalog."
        />
      </EntityHeader>
      <CategoriesGrid />
    </EntityWrapper>
  </EntityContentProvider>
);

export default ManageCategory;
