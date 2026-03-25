"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadCrumbLinksProps {
  className?: string;
}

const BreadCrumbLinks: React.FC<BreadCrumbLinksProps> = ({
  className = "",
}) => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbPaths = pathSegments.map(
    (seg, i) => "/" + pathSegments.slice(0, i + 1).join("/"),
  );

  if (pathSegments.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {pathSegments.map((seg, i) => {
          const builtPath = breadcrumbPaths[i];
          const isLast = i === pathSegments.length - 1;

          const label = seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <React.Fragment key={builtPath}>
              <BreadcrumbItem>
                {isLast ? (
                  <span className="text-foreground">{label}</span>
                ) : (
                  <Link
                    href={builtPath === "/admin" ? "#" : builtPath}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export { BreadCrumbLinks };
