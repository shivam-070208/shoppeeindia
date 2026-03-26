"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { BreadCrumbLinks } from "@/components/common/bread-crumb-links";

const AdminNavbar = () => {
  const { open, setOpen } = useSidebar();

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

      <BreadCrumbLinks />
    </nav>
  );
};

export default AdminNavbar;
