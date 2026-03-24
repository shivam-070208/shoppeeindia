import React from "react";
import {
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/entity-layout";
import AddDealForm from "@/modules/deal/components/admin/add-deal-form";

const AddNewDeal = () => {
  return (
    <EntityWrapper>
      <EntityHeader>
        <EntityHeaderContent
          heading="Deals"
          subheading="Add a new deal by uploading an image, assigning store + category, and setting prices."
        />
      </EntityHeader>
      <AddDealForm />
    </EntityWrapper>
  );
};

export default AddNewDeal;
