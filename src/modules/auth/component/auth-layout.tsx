"use client";
import React from "react";
import Container from "@/components/common/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LogoIcon from "@/components/common/logo-icon";
import { ORGANISATION_NAME } from "@/config/contants";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type AuthLayoutProps = {
  children: React.ReactNode;
  authType: "login" | "signup";
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authType }) => {
  const searchParams = useSearchParams();

  const handleGoogleAuth = async () => {
    const redirect = searchParams.get("redirect") || "/";

    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirect,
    });
  };

  return (
    <Container
      maxWidth="max-w-2xl"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 py-6"
    >
      <div className="flex flex-col items-center-safe gap-2">
        <LogoIcon />
        <p className="text-shadow-muted-foreground/20 text-2xl font-bold text-shadow-sm">
          {ORGANISATION_NAME}
        </p>
      </div>
      <Card className="bg-card-secondary w-full max-w-md rounded-3xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            {authType === "login" ? "Welcome Back" : "Create Your Account"}
          </CardTitle>
          <CardDescription>
            {authType === "login"
              ? "Please enter your credentials to log in to your account."
              : "Fill in the details below to create a new account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}

          <div className="relative mt-12 flex items-center justify-center">
            <div className="bg-muted-foreground/40 absolute top-1/2 z-0 h-[0.8px] w-full" />
            <span className="text-muted-foreground bg-card-secondary static z-1 mx-2 p-2 text-sm">
              or continue with
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full py-6 font-medium"
            onClick={handleGoogleAuth}
          >
            <FcGoogle />
            <span>Continue with Google</span>
          </Button>
        </CardContent>
      </Card>
      <div>
        {authType === "login" ? (
          <p>
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </Container>
  );
};

export default AuthLayout;
