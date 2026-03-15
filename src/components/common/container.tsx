import React, { forwardRef, ElementType } from "react";
import clsx from "clsx";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  maxWidth?: string;
  padded?: boolean;
  center?: boolean;
  children: React.ReactNode;
}

const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    {
      children,
      className,
      as: Component = "div",
      maxWidth = "max-w-5xl",
      padded = true,
      center = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          "w-full",
          maxWidth,
          {
            "mx-auto": center,
            "px-4": padded,
          },
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";

export default Container;
