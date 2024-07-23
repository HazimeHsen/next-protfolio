"use client";
import React, { MutableRefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { projects } from "@/data";

const ProjectsHero = () => {
  return (
    <section className="relative grid min-h-screen w-full place-content-center overflow-hidden">
      <h2 className="relative z-0 text-[13vw] font-black text-neutral-800">
        Projects<span className="text-indigo-500">{"</>"}</span>
      </h2>
      <Cards />
      <div
        className={"w-screen bottom-0 absolute h-32 z-30 pointer-events-none"}
        style={{
          background: `linear-gradient(transparent, #000)`,
        }}></div>{" "}
    </section>
  );
};

const Cards = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      {projects.flatMap((project) =>
        project.images.map((image, index) => (
          <Card
            key={`${project.id}-${index}`}
            containerRef={containerRef}
            src={image}
            alt={`${project.title} Image ${index + 1}`}
            rotate={`${Math.random() * 20 - 10}deg`}
            top={`${Math.random() * 80}%`}
            left={`${Math.random() * 80}%`}
            className="w-36 md:w-56"
          />
        ))
      )}
    </div>
  );
};

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}

const Card = ({
  containerRef,
  src,
  alt,
  top,
  left,
  rotate,
  className,
}: Props) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      let zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  return (
    <motion.img
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4",
        className
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      // Uncomment below and remove dragElastic to remove movement after release
      //   dragMomentum={false}
      dragElastic={0.65}
    />
  );
};

export default ProjectsHero;
