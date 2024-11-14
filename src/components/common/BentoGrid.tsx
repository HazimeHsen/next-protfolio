import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "../Animations/BlurFade";
import { useInView } from "react-intersection-observer";
import { TransitionLink } from "./TransitionLink";

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
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
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
      className={cn(
        "row-span-1 rounded-xl shadow-none p-4 relative border-white/[0.2] border-2 justify-between flex flex-col space-y-4",
        className
      )}>
      <TransitionLink className="radial-gradient relative" href={link}>
        <div className="flex flex-1 w-full relative overflow-hidden h-[165px] rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800">
          <Image
            alt={"image " + title}
            src={images[0]}
            fill
            quality={100}
            className="object-cover"
          />
        </div>
        <div className="transition duration-200">
          <div className="font-sans font-bold text-neutral-200 mb-1 mt-2">
            {title}
          </div>
          <div className="font-sans font-normal text-xs text-neutral-300">
            {description}
          </div>
        </div>
      </TransitionLink>
    </BlurFade>
  );
};
