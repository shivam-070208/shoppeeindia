"use client";
import Logo from "@/components/common/logo";
import LogoIcon from "@/components/common/logo-icon";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useMemo, useState } from "react";
import { LayoutDashboard, Shapes, Store, Tag, Users } from "lucide-react";
import ProfileDropdown from "@/components/common/profile-dropdown";
import Link from "next/link";

const AdminSidebar = ({
  isSuperAdmin = false,
  children,
}: {
  isSuperAdmin?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const links = useMemo(() => {
    const base = [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-5 w-5 text-orange-500" />,
      },
      {
        label: "Stores",
        href: "/admin/stores",
        icon: <Store className="h-5 w-5 text-orange-500" />,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: <Shapes className="h-5 w-5 text-orange-500" />,
      },
      {
        label: "Deals",
        href: "/admin/deals",
        icon: <Tag className="h-5 w-5 text-orange-500" />,
      },
    ];

    if (!isSuperAdmin) return base;

    return [
      base[0],
      base[1],
      {
        label: "Admins",
        href: "/super-admin/admins",
        icon: <Users className="h-5 w-5 text-orange-500" />,
      },
      base[2],
      base[3],
    ];
  }, [isSuperAdmin]);

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden overflow-y-auto md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="bg-secondary justify-between border-r">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3 px-1">
              <Link href={"/"} className="shrink-0">
                {open ? <Logo /> : <LogoIcon />}
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <SidebarLink
                  key={link.href}
                  link={link}
                  className="rounded-md px-2 text-neutral-200 hover:bg-neutral-900"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-2">
            <ProfileDropdown isAdmin />
          </div>
        </SidebarBody>
        {children}
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
