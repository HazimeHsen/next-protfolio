"use client";

import { ButtonHTMLAttributes } from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/utils/cn";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onAnimationEnd"
  > {
  containerClassName?: string;
  disabled?: boolean;
  variant?: "animated" | "solid";
  tone?: "primary" | "outline";
}

const animationProps: {
  initial: { "--x": string; scale: number };
  animate: { "--x": string; scale: number };
  whileTap: { scale: number };
  transition: Transition;
} = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
};

const Button = ({
  containerClassName,
  className,
  children,
  disabled,
  variant = "animated",
  tone = "primary",
  ...props
}: ButtonProps) => {
  const cutClipPath =
    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,9px 100%,0 100%)";

  if (variant === "solid") {
    const isOutline = tone === "outline";
    const solidToneClassName =
      isOutline
        ? "bg-white/10 text-white hover:bg-white/15"
        : "bg-primary text-black hover:bg-primary/85";

    return (
      <motion.div
        whileTap={!disabled ? animationProps.whileTap : undefined}
        className={cn(
          "group relative inline-flex w-fit items-center justify-center overflow-hidden px-6 py-2 font-semibold transition",
          solidToneClassName,
          containerClassName,
          {
            "opacity-50 cursor-not-allowed": disabled,
          }
        )}
        style={{ clipPath: cutClipPath, WebkitClipPath: cutClipPath }}>
        {isOutline && (
          <>
            <div
              className="pointer-events-none absolute inset-0 border border-white/35 group-hover:border-white/60"
              style={{ clipPath: cutClipPath, WebkitClipPath: cutClipPath }}
            />
            <div className="pointer-events-none absolute right-[-1px] bottom-[4px] h-px w-[13px] origin-right -rotate-45 bg-white/35 group-hover:bg-white/60" />
          </>
        )}
        <button
          className={cn("inline-flex items-center justify-center gap-2", className)}
          disabled={disabled}
          {...props}>
          {children}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      whileTap={!disabled ? animationProps.whileTap : undefined}
      transition={animationProps.transition}
      className={cn(
        "px-6 py-2 rounded-full w-full max-w-[200px] relative radial-gradient",
        containerClassName
      )}>
      <button
        className={cn("w-full", className, {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        disabled={disabled}
        {...props}>
        <span className="text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask">
          {children}
        </span>
        <span className="block absolute inset-0 rounded-full p-px linear-overlay" />
      </button>
    </motion.div>
  );
};

export default Button;
