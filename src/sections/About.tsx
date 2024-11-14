"use client";
import { Container } from "@/components/common/Container";
import StarBg from "@/components/Animations/StarBg";
import BoxReveal from "@/components/Animations/box-reveal";
import Image from "next/image";
import Divider from "@/components/common/Divider";
import { aboutContent } from "@/data";

export default function About() {
  return (
    <Container>
      <section
        id="about"
        className="relative h-full w-full py-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between overflow-hidden space-y-8 lg:space-y-0 lg:space-x-8"
      >
        <StarBg
          className="absolute inset-0"
          quantity={100}
          ease={100}
          size={0.4}
          staticity={40}
          color={"#ffffff"}
        />
        <div className="flex-1 max-w-xl">
          <BoxReveal>
            <div className="flex items-center gap-4 mb-5">
              <Divider
                className=""
                lineWidth="80px"
                lineHeight="2px"
                notchWidth="60px"
                notchHeight="8px"
                collapseDelay={200}
                collapsed={false}
              />
              <span className="font-semibold text-primary">
                {aboutContent.sectionTitle}
              </span>
            </div>
          </BoxReveal>
          <BoxReveal className="mb-4" duration={0.5} delay={0.1}>
            <h1 className="text-2xl md:text-4xl font-semibold">
              {aboutContent.title}
            </h1>
          </BoxReveal>
          <BoxReveal
            className="md:text-base text-sm mb-4"
            duration={0.5}
            delay={0.2}
          >
            <p>{aboutContent.intro}</p>
          </BoxReveal>
          <BoxReveal
            className="md:text-base text-sm mb-4"
            duration={0.5}
            delay={0.3}
          >
            <p>{aboutContent.hobbies}</p>
          </BoxReveal>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="flex items-start flex-col gap-6">
            <BoxReveal duration={0.5} delay={0.4}>
              <Image
                quality={100}
                src={"/personal/me.jpg"}
                alt="Hussein Hazime"
                width={300}
                height={500}
                className="md:w-[300px] w-full"
              />
            </BoxReveal>
          </div>
        </div>
      </section>
    </Container>
  );
}
