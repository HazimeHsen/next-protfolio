"use client";
import { Container } from "@/components/Container";
import HeroBg from "@/components/HeroBg";
import { OrbitingCirclesDemo } from "@/components/HeroCircleAnimation";
import BoxReveal from "@/components/box-reveal";
import Image from "next/image";

export default function About() {
  return (
    <Container>
      <section
        id="about"
        className="relative h-full w-full py-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between overflow-hidden space-y-8 lg:space-y-0 lg:space-x-8">
        <HeroBg
          className="absolute inset-0"
          quantity={100}
          ease={100}
          size={0.4}
          staticity={40}
          color={"#ffffff"}
        />
        <div className="flex-1 max-w-xl">
          <BoxReveal
            boxColor={"#5046e6"}
            className="mb-4"
            duration={0.5}
            delay={0.1}>
            <h1 className="text-2xl md:text-4xl font-semibold">Hi there</h1>
          </BoxReveal>
          <BoxReveal
            boxColor={"#5046e6"}
            className="md:text-base text-sm mb-4"
            duration={0.5}
            delay={0.2}>
            <p>
              I am Hussein Hazime. I live in Lebanon and work as a junior
              full-stack web developer as a freelancer. My projects include UX
              design, UI animations, and being comfortable with code allows me
              to rapidly prototype and validate experiences.
            </p>
          </BoxReveal>
          <BoxReveal
            className="md:text-base text-sm mb-4"
            boxColor={"#5046e6"}
            duration={0.5}
            delay={0.3}>
            <p>
              In my spare time, I enjoy playing video games, and watching
              football, especially supporting Real Madrid. I am always
              interested in new projects, so feel free to drop me a line.
            </p>
          </BoxReveal>
        </div>
        <BoxReveal boxColor={"#5046e6"} duration={0.5} delay={0.4}>
          <div className="flex-1 flex justify-center lg:justify-end">
            <Image
              quality={100}
              src={"/personal/me.jpg"}
              alt="Hussein Hazime"
              width={300}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </BoxReveal>
      </section>
    </Container>
  );
}
