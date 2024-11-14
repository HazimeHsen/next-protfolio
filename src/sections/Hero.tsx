"use client";

import React from "react";
import { Spotlight } from "@/components/Animations/Spotlight";
import StarBg from "@/components/Animations/StarBg";
import BlurFade from "@/components/Animations/BlurFade";
import { heroContent } from "@/data";

const Hero = () => {
  return (
    <section
      id="home"
      className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden"
    >
      <Spotlight
        className="-top-20 -left-10 md:left-60 md:-top-10"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <BlurFade
          delay={0}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          {heroContent.title}
        </BlurFade>
        <BlurFade
          delay={0.2}
          className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto"
        >
          {heroContent.description}
        </BlurFade>
      </div>
      <StarBg
        className="absolute inset-0 z-50"
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
