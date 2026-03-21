"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

const AdminNavbar = () => {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbPaths = pathSegments.map(
    (seg, i) => "/" + pathSegments.slice(0, i + 1).join("/"),
  );

  return (
    <nav className="bg-secondary flex h-14 w-full items-center border-b px-4 py-4">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 cursor-pointer md:hidden"
        onClick={() => setOpen((prev: boolean) => !prev)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((seg, i) => {
            const builtPath = breadcrumbPaths[i];
            const isLast = i === pathSegments.length - 1;

            const label = seg
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <React.Fragment key={builtPath}>
                <BreadcrumbItem>
                  {isLast ? (
                    <span className="text-foreground">{label}</span>
                  ) : (
                    <Link
                      href={builtPath == "/admin" ? "#" : builtPath}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {label}
                    </Link>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default AdminNavbar;
