"use client";

import React from "react";
import { Spotlight } from "@/components/Animations/Spotlight";
import StarBg from "@/components/Animations/StarBg";
import BlurFade from "@/components/Animations/BlurFade";
import { heroContent } from "@/data";
import { TransitionLink } from "@/components/common/TransitionLink";
import Button from "@/components/common/Button";
import { FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = () => {
  const cutClipPath =
    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,9px 100%,0 100%)";

  return (
    <section
      id="home"
      className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative"
    >
      <Spotlight
        className="-top-20 -left-10 md:left-60 md:-top-10"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <BlurFade
          delay={0}
          className="text-center"
        >
          <h1 className="whitespace-pre-line text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            {heroContent.title}
          </h1>
        </BlurFade>
        <BlurFade
          delay={0.2}
          className="mt-4 font-normal text-base text-neutral-300 max-w-3xl text-center mx-auto"
        >
          {heroContent.description}
        </BlurFade>
        <BlurFade
          delay={0.35}
          className="mt-8 mb-1 flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.div
            className="w-full sm:w-fit bg-primary text-black font-semibold hover:bg-primary/80 transition"
            whileTap={{ scale: 0.95 }}
            style={{ clipPath: cutClipPath, WebkitClipPath: cutClipPath }}
          >
            <TransitionLink
              href="/projects"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 sm:w-auto"
            >
              Check All Projects
              <FaChevronRight className="text-xs" />
            </TransitionLink>
          </motion.div>
          <Button
            variant="solid"
            tone="outline"
            containerClassName="w-full sm:w-fit px-6 py-3"
            className="w-full justify-center"
            onClick={() =>
              window.open("/Hussein_hazime.pdf", "_blank", "noopener,noreferrer")
            }
          >
            Open CV
            <FaChevronRight className="text-xs" />
          </Button>
        </BlurFade>
        <p className="sr-only">
          Full-stack software developer, website developer, and Next.js
          developer available for freelance and product-focused projects.
        </p>
      </div>
      <StarBg
        className="absolute inset-0 z-50 pointer-events-none"
        quantity={160}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
    </section>
  );
};

export default Hero;
