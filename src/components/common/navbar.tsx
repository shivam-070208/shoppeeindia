import React from "react";
import Logo from "./logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Container from "./container";
import ProfileDropdown from "./profile-dropdown";
import { getServerAdminFlags } from "@/lib/auth-utils";

const links = [
  { name: "Home", href: "/" },
  { name: "Deals", href: "/home/deals" },
  { name: "Store", href: "/stores" },
  { name: "Coupons", href: "/home/coupons" },
];

const Navbar = async () => {
  const { isAdmin } = await getServerAdminFlags();

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 py-3 backdrop-blur-md">
      <Container maxWidth="max-w-7xl" className="flex justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <NavigationMenu className="hidden flex-1 justify-center md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  active={undefined}
                >
                  {link.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <ProfileDropdown isAdmin={isAdmin} />
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
