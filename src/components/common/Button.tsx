import { HTMLAttributes } from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/utils/cn";

// Define props interface including custom props
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  containerClassName?: string;
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
  ...props
}: ButtonProps) => {
  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
      className={cn(
        "px-6 py-2 rounded-full w-full max-w-[200px] relative radial-gradient",
        containerClassName
      )}>
      <button className={cn("w-full", className)} {...props}>
        <span className="text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask">
          {children}
        </span>
        <span className="block absolute inset-0 rounded-full p-px linear-overlay" />
      </button>
    </motion.div>
  );
};

export default Button;
