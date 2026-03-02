import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Container from "./container";
import Link from "next/link";

const links = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Deals", href: "/deals" },
  { name: "Contact", href: "/contact" },
];

const isLoggedIn = false;

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
          {!isLoggedIn ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="btn-glow rounded-full p-4">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
