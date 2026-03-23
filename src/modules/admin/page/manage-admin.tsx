import React from "react";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/entity-layout";
import AdminsGrid from "../components/admins-grid";

const ManageAdmins: React.FC = () => (
  <EntityContentProvider>
    <EntityWrapper>
      <EntityHeader
        actionLayoutId="admin-add-new-admin-modal"
        actionLabel="Create"
        actionHref="/super-admin/admins/new"
      >
        <EntityHeaderContent
          heading="Admins"
          subheading="Manage admin accounts and control access for your team."
        />
      </EntityHeader>
      <AdminsGrid />
    </EntityWrapper>
  </EntityContentProvider>
);

export default ManageAdmins;
