import { getServerAdminFlags } from "@/lib/auth-utils";
import AdminNavbar from "@/modules/admin/components/navbar";
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
      <div className="flex flex-1 flex-col gap-2">
        <AdminNavbar />

        <main className="flex-1 p-4">{children}</main>
      </div>
    </AdminSidebar>
  );
}
