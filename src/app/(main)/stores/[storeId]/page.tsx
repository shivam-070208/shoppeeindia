import StoreDetailPage from "@/modules/main/pages/store-detail";

interface Props {
  params: Promise<{
    storeId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { storeId } = await params;
  return <StoreDetailPage storeId={storeId} />;
};

export default Page;
