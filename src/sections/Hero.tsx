import React from "react";
import { Spotlight } from "@/components/Spotlight";
import HeroBg from "@/components/HeroBg";

const Hero = () => {
  return (
    <div className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Hussein Hazime <br /> Full-Stack Developer
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Hey there! I&apos;m Hussein Hazime, a passionate full-stack web
          developer with expertise in React.js, Node.js, and MongoDB. I enjoy
          crafting intuitive UI/UX designs and optimizing user experiences.
        </p>
      </div>
      <HeroBg
        className="absolute inset-0 z-50"
        quantity={160}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
    </div>
  );
};

export default Hero;
