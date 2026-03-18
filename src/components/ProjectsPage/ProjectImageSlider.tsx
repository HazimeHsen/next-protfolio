"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

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

const ProjectImageSlider = ({ images, title }: ProjectImageSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const totalImages = images.length;
  const hasImages = totalImages > 0;
  const hasMultipleImages = totalImages > 1;

  const goToPrevious = useCallback(() => {
    if (!totalImages) {
      return;
    }

    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const goToNext = useCallback(() => {
    if (!totalImages) {
      return;
    }

    setDirection(1);
    setActiveIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const goToIndex = useCallback(
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

  useEffect(() => {
    if (!hasImages) {
      return;
    }

    if (activeIndex > totalImages - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, hasImages, totalImages]);

  useEffect(() => {
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
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
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
                className="object-contain p-2 sm:p-3"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {hasMultipleImages ? (
          <>
            <div className="absolute right-3 top-3 rounded-full border border-zinc-700 bg-black/70 px-2 py-1 text-[10px] font-semibold text-zinc-200">
              {activeIndex + 1}/{images.length}
            </div>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous project image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-black/75 p-2 text-zinc-100 transition hover:border-zinc-500">
              <FaChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next project image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-black/75 p-2 text-zinc-100 transition hover:border-zinc-500">
              <FaChevronRight size={12} />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex justify-center gap-1">
          {images.map((image, index) => (
            <button
              key={`${image}-dot`}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`Go to image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index ? "w-6 bg-primary" : "w-2 bg-zinc-600 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      ) : null}

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto rounded-lg border border-zinc-800/70 bg-black/45 p-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition sm:h-20 sm:w-32 ${
                activeIndex === index
                  ? "border-primary ring-1 ring-primary/60"
                  : "border-zinc-700 hover:border-zinc-500"
              }`}>
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                quality={80}
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProjectImageSlider;
