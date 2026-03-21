import {
  EntityHeader,
  EntityHeaderContent,
  EntityWrapper,
} from "@/components/common/enitity-layout";
import AddCategoryForm from "@/modules/category/components/admin/add-category-form";

const AddNewCategory = () => {
  return (
    <EntityWrapper>
      <EntityHeader>
        <EntityHeaderContent
          heading="Categories"
          subheading="Manage category structure and keep naming consistent across the catalog."
        />
      </EntityHeader>
      <AddCategoryForm />
    </EntityWrapper>
  );
};

export default AddNewCategory;
