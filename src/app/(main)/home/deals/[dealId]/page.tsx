import DealDetailsPage from "@/modules/main/pages/deal-details";

interface Props {
  params: Promise<{
    dealId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { dealId } = await params;
  return <DealDetailsPage dealId={dealId} />;
};

export default Page;
