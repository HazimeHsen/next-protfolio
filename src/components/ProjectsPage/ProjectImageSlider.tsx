"use client";

import * as React from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

interface ProjectImageSliderProps {
  images: string[];
  title: string;
}

const SWIPE_THRESHOLD = 45;

const getNavigationDirection = (from: number, to: number, total: number) => {
  const forward = (to - from + total) % total;
  const backward = (from - to + total) % total;
  return forward <= backward ? 1 : -1;
};

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
      className={`overflow-hidden ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

const ProjectImageSlider = ({ images, title }: ProjectImageSliderProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [pointerStartX, setPointerStartX] = React.useState<number | null>(null);
  const totalImages = images.length;
  const hasImages = totalImages > 0;
  const hasMultipleImages = totalImages > 1;

  const goToPrevious = React.useCallback(() => {
    if (!totalImages) {
      return;
    }

    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const goToNext = React.useCallback(() => {
    if (!totalImages) {
      return;
    }

    setDirection(1);
    setActiveIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const goToIndex = React.useCallback(
    (nextIndex: number) => {
      if (!totalImages) {
        return;
      }

      const normalized =
        ((nextIndex % totalImages) + totalImages) % totalImages;

      setActiveIndex((current) => {
        if (current === normalized) {
          return current;
        }

        setDirection(getNavigationDirection(current, normalized, totalImages));
        return normalized;
      });
    },
    [totalImages]
  );

  React.useEffect(() => {
    if (!hasImages) {
      return;
    }

    if (activeIndex > totalImages - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, hasImages, totalImages]);

  React.useEffect(() => {
    if (!hasMultipleImages) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, hasMultipleImages]);

  if (!hasImages) {
    return null;
  }

  const activeImage = images[activeIndex] ?? images[0];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -70 : 70, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-3"
    >
      <HoverGlow className="rounded-md p-[2px]">
        <div className="group radial-gradient relative overflow-hidden rounded-[6px] border-2 border-zinc-800 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition duration-300">
          <div
            className="relative aspect-[16/10] select-none touch-pan-y sm:aspect-video"
            onPointerDown={(event) => {
              if (!hasMultipleImages) {
                return;
              }

              setPointerStartX(event.clientX);
            }}
            onPointerUp={(event) => {
              if (!hasMultipleImages || pointerStartX === null) {
                return;
              }

              const delta = event.clientX - pointerStartX;
              setPointerStartX(null);

              if (Math.abs(delta) < SWIPE_THRESHOLD) {
                return;
              }

              if (delta > 0) {
                goToPrevious();
              } else {
                goToNext();
              }
            }}
            onPointerCancel={() => setPointerStartX(null)}
            onPointerLeave={() => setPointerStartX(null)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeImage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0">
                <Image
                  src={activeImage}
                  alt={`${title} preview ${activeIndex + 1}`}
                  fill
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-2 transition duration-500 group-hover:scale-[1.015] sm:p-3"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-24 bg-primary/10 blur-3xl transition duration-300 group-hover:opacity-80" />
          </div>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous project image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-black/75 p-2 text-zinc-100 transition hover:scale-105 hover:border-primary/45">
                <FaChevronLeft size={12} />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next project image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-black/75 p-2 text-zinc-100 transition hover:scale-105 hover:border-primary/45">
                <FaChevronRight size={12} />
              </button>
            </>
          ) : null}
        </div>
      </HoverGlow>

      {hasMultipleImages ? (
        <HoverGlow className="rounded-md p-[2px]" radius={100}>
          <div className="radial-gradient flex items-stretch gap-2 overflow-x-auto rounded-[6px] border-2 border-zinc-800 bg-black p-2">
            {images.map((image, index) => (
              <HoverGlow
                key={image}
                className="self-stretch rounded-md p-[2px]"
                radius={75}>
                <button
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative block h-full min-h-16 w-24 shrink-0 overflow-hidden rounded-[6px] border-2 transition duration-300 sm:min-h-20 sm:w-32 ${
                    activeIndex === index
                      ? "border-primary ring-1 ring-primary/60"
                      : "border-zinc-800 hover:border-primary/35"
                  }`}>
                  <Image
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    fill
                    quality={80}
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-cover object-top transition duration-300 hover:scale-105"
                  />
                </button>
              </HoverGlow>
            ))}
          </div>
        </HoverGlow>
      ) : null}
    </motion.div>
  );
};

export default ProjectImageSlider;
