import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import CategoriesGrid from "@/modules/category/components/admin/category-grid";

const CategoryManagementPage: React.FC = () => (
  <EntityContentProvider>
    <EntityWrapper>
      <EntityHeader
        actionLabel="Create Category"
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

export default CategoryManagementPage;
