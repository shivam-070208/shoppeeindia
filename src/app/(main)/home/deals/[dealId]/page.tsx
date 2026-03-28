interface Props {
  params: Promise<{
    dealId: string;
  }>;
}
const page = async ({ params }: Props) => {
  const { dealId } = await params;
  return <div>Deal ID: {dealId}</div>;
};

export default page;
