"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import BlurFade from "../Animations/BlurFade";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { TransitionLink } from "./TransitionLink";

function HoverGlow({
  children,
  className,
  radius = 120,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--primary),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid auto-rows-fr grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  index,
  className,
  title,
  description,
  images,
  link,
}: {
  index: number;
  className?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  images: string[];
  link: string;
}) => {
  return (
    <BlurFade
      delay={index * 0.1}
      className={cn("h-full", className)}>
      <HoverGlow className="row-span-1 h-full rounded-[8px] p-[2px]">
        <TransitionLink
          className="radial-gradient relative flex h-full flex-col overflow-hidden rounded-[6px] border-2 border-zinc-800"
          href={link}>
          <div className="relative block h-[150px] min-h-[150px] w-full shrink-0 overflow-hidden bg-black md:h-[160px] md:min-h-[160px]">
            <Image
              alt={"image " + title}
              src={images[0]}
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 transition duration-200">
            <div className="mb-1 mt-2 font-sans font-bold text-neutral-200">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-300">
              {description}
            </div>
          </div>
        </TransitionLink>
      </HoverGlow>
    </BlurFade>
  );
};
