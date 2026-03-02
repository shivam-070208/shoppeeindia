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

type AuthLayoutProps = {
  children: React.ReactNode;
  authType: "login" | "signup";
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authType }) => {
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
          <CardTitle>
            {authType === "login" ? "Welcome Back" : "Create Your Account"}
          </CardTitle>
          <CardDescription>
            {authType === "login"
              ? "Please enter your credentials to log in to your account."
              : "Fill in the details below to create a new account."}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
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
