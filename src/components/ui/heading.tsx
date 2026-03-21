import { cn } from "@/lib/utils";
import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}

const headingBaseStyles: Record<string, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-medium tracking-tight",
  h6: "text-base font-medium tracking-tight",
};

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = "h2", className, children, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        className={cn(headingBaseStyles[as], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Heading.displayName = "Heading";

export { Heading };
