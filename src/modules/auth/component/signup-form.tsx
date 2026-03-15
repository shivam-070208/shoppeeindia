"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, MailIcon, LockIcon, UserIcon } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
};

const SignupForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignupFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignupFormInputs) => {
    const redirect = searchParams.get("redirect") || "/";

    const { error } = await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: redirect,
      },
      {
        onError: (ctx) => {
          const message =
            ctx.error?.message || "Unable to sign up. Please try again.";
          form.setError("email", { type: "manual", message });
        },
      },
    );

    if (!error) {
      router.push(redirect);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name">Name</Label>
              <FormControl>
                <InputWithIcon
                  id="name"
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="name"
                  placeholder="Your name"
                  icon={<UserIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <FormControl>
                <InputWithIcon
                  id="email"
                  type="email"
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="email"
                  placeholder="you@example.com"
                  icon={<MailIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">Password</Label>
              <FormControl>
                <InputWithIcon
                  id="password"
                  type="password"
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Password"
                  icon={<LockIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="btn-glow w-full cursor-pointer rounded-full py-6 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign up"} <ArrowRight />
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
