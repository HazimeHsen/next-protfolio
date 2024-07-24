import React from "react";
import { Spotlight } from "@/components/Animations/Spotlight";
import HeroBg from "@/components/Animations/HeroBg";
import BlurFade from "@/components/Animations/BlurFade";

const Hero = () => {
  return (
    <section
      id="home"
      className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <BlurFade
          delay={0}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Hussein Hazime <br /> Full-Stack Developer
        </BlurFade>
        <BlurFade
          delay={0.2}
          className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Hey there! I&apos;m Hussein Hazime, a creative and dedicated
          full-stack developer. I specialize in building dynamic and responsive
          web applications using React.js, Node.js, and MongoDB. Let&apos;s
          create something amazing together!
        </BlurFade>
      </div>
      <HeroBg
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
