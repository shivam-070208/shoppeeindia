import { BreadCrumbLinks } from "@/components/common/bread-crumb-links";
import Container from "@/components/common/container";
import {
  EntityContentProvider,
  EntityHeader,
  EntityHeaderContent,
  EntityTableHeader,
  EntityWrapper,
} from "@/components/common/entity-layout";
import {
  DealFilterProvider,
  DealFilterSidebar,
} from "../components/deal-filter";
const Deals = () => {
  return (
    <div className="pt-4">
      <Container maxWidth="max-w-7xl">
        <EntityContentProvider>
          <EntityWrapper className="p-0">
            <EntityHeader>
              <BreadCrumbLinks />
              <EntityHeaderContent
                heading="Top Deals for You"
                subheading="We've handpicked the hottest offers from top retailers to help you save more today."
              />
            </EntityHeader>
            <EntityTableHeader searchPlaceHolder="Search deals by name,store or category..." />
            <DealFilterProvider>
              <div className="grid w-full grid-cols-4">
                <DealFilterSidebar />
              </div>
            </DealFilterProvider>
          </EntityWrapper>
        </EntityContentProvider>
      </Container>
    </div>
  );
};

export default Deals;
