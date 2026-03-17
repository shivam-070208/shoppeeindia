import { cn } from "@/lib/utils";
import React from "react";

interface SubHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}

const subHeadingBaseStyles: Record<string, string> = {
  h3: "text-lg font-medium tracking-tight",
  h4: "text-base font-medium tracking-tight",
  h5: "text-sm font-medium tracking-tight",
  h6: "text-xs font-medium tracking-tight",
};

const SubHeading = React.forwardRef<HTMLHeadingElement, SubHeadingProps>(
  ({ as = "h3", className, children, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        className={cn(
          subHeadingBaseStyles[as],
          "text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

SubHeading.displayName = "SubHeading";

export { SubHeading };
