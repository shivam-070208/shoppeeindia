import { getServerAdminFlags } from "@/lib/auth-utils";
import AdminSidebar from "@/modules/admin/components/sidebar";
import { forbidden } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isSuperAdmin } = await getServerAdminFlags();
  if (!isAdmin) {
    forbidden();
  }
  return (
    <AdminSidebar isSuperAdmin={isSuperAdmin}>
      <main className="flex-1 p-4">{children}</main>
    </AdminSidebar>
  );
}
