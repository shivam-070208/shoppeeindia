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
  { name: "Deals", href: "/deals" },
  { name: "Coupons", href: "/coupons" },
  { name: "Contact", href: "/store" },
];

const Navbar = async () => {
  const { isAdmin } = await getServerAdminFlags();

  return (
    <nav className="w-full border-b-2 py-3">
      <Container maxWidth="max-w-7xl flex justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <NavigationMenu className="hidden flex-1 justify-center md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  href={link.href}
                  className="hover:text-primary focus:text-primary data-[active=true]:text-primary px-4 py-2 text-sm font-medium transition-colors"
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
