"use client";
import Link, { LinkProps } from "next/link";
import React, { Reference } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  ref?: Reference;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  target,
  rel,
  ref,
  ...props
}) => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (currentPath !== href) {
      const body = document.querySelector("body");

      body?.classList.add("page-transition");

      await sleep(800);
      router.push(href as string);
      await sleep(800);

      body?.classList.remove("page-transition");
    } else {
      router.push(href as string);
    }
  };

  return (
    <Link
      {...props}
      href={href}
      onClick={handleTransition}
      className={className}
      target={target}
      rel={rel}>
      {children}
    </Link>
  );
};
