import React from "react";
import {
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import AddAdminForm from "../components/add-admin-form";

const AddNewAdmin = () => {
  return (
    <EntityWrapper>
      <EntityHeader>
        <EntityHeaderContent
          heading="Add New Admin"
          subheading="Create a new admin by providing their user information and role."
        />
      </EntityHeader>
      <AddAdminForm />
    </EntityWrapper>
  );
};

export default AddNewAdmin;
