import {
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import AddStoreForm from "@/modules/store/components/admin/add-store-form";

const AddNewStore = () => {
  return (
    <EntityWrapper>
      <EntityHeader>
        <EntityHeaderContent
          heading="Stores"
          subheading="Add and manage stores so you can assign them to deals and products."
        />
      </EntityHeader>
      <AddStoreForm />
    </EntityWrapper>
  );
};

export default AddNewStore;
