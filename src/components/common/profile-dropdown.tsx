"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type User = {
  name?: string;
  email?: string | null;
  image?: string | null;
};

function InitialAvatar({ name, size }: { name?: string; size?: number }) {
  const letter =
    typeof name === "string" && name.trim().length > 0
      ? name.trim().charAt(0).toUpperCase()
      : "?";
  return (
    <span
      className={`bg-primary inline-flex items-center justify-center rounded-full font-semibold text-white select-none`}
      style={{
        width: size ?? 36,
        height: size ?? 36,
        fontSize: 18,
        userSelect: "none",
      }}
      aria-label="User initial"
    >
      {letter}
    </span>
  );
}

const UserAvatar = ({ user }: { user: User }) =>
  user.image ? (
    <Image
      src={user.image}
      alt={user.name || "User"}
      width={36}
      height={36}
      className="rounded-full object-cover"
    />
  ) : (
    <InitialAvatar name={user.name} size={36} />
  );

const ProfileDropdown = () => {
  const router = useRouter();
  const { data, isPending: isLoading } = authClient.useSession();

  if (isLoading) return null;

  if (!data?.user) {
    return (
      <>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="sm" className="btn-glow rounded-full p-4">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleProfile = () => router.push("/profile");

  const { user } = data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0">
          <UserAvatar user={{ ...user, name: user.name ?? undefined }} />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 px-2 py-2">
          <UserAvatar user={user} />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground text-xs">{user.email}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleProfile}>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
