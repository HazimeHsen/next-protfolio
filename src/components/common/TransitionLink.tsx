"use client";
import Link, { LinkProps } from "next/link";
import React, { Reference, useEffect, useRef } from "react";
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

const EXIT_DURATION_MS = 450;

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
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    document.body.classList.remove("page-transition");
    isTransitioningRef.current = false;
  }, [currentPath]);

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target === "_blank"
    ) {
      return;
    }

    e.preventDefault();

    if (currentPath === href) {
      router.push(href as string);
      return;
    }

    if (isTransitioningRef.current) {
      return;
    }

    const body = document.body;

    isTransitioningRef.current = true;
    body.classList.add("page-transition");

    await sleep(EXIT_DURATION_MS);
    router.push(href as string);
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
