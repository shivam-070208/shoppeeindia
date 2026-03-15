import React from "react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Container from "./container";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";

const links = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Deals", href: "/deals" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
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
          <ProfileDropdown />
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
