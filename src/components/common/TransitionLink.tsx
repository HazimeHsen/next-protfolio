"use client";
import Link, { LinkProps } from "next/link";
import React, { Ref, Reference } from "react";
import { useRouter } from "next/navigation";

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

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const body = document.querySelector("body");

    body?.classList.add("page-transition");

    await sleep(500);
    router.push(href as string);
    await sleep(500);

    body?.classList.remove("page-transition");
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
