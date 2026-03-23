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
          heading="Deals"
          subheading="Add a new deal by uploading an image, assigning store + category, and setting prices."
        />
      </EntityHeader>
      <AddAdminForm />
    </EntityWrapper>
  );
};

export default AddNewAdmin;
