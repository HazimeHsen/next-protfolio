"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import StarBg from "@/components/Animations/StarBg";
import { experiencesContent } from "@/data";
import { IconType } from "react-icons";

interface Experience {
  title: string;
  subtitle: string;
  date: string;
  icon: IconType;
  highlights?: string[];
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-10 relative">
      <StarBg
        className="absolute inset-0"
        quantity={100}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
      <div className="pl-7 sm:pl-0 before:ml-7 overflow-hidden space-y-8 w-full lg:max-w-5xl sm:mx-auto py-14 relative before:absolute before:inset-0 sm:before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[2px] -translate-x-1/2 overflow-hidden sm:block [mask-image:linear-gradient(to_bottom,transparent_0%,white_4%,white_96%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,white_4%,white_96%,transparent_100%)]">
          <div className="timeline-scan w-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-90" />
        </div>
        {experiencesContent.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>
    </section>
  );
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
}) => {
  const radius = 120;
  const entryDelay = 0.12;
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.85,
    rootMargin: "0px 0px -40px 0px",
  });
  const [showBorderGlow, setShowBorderGlow] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const backgroundGradient = useMotionTemplate`
    radial-gradient(
      ${showBorderGlow ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
      var(--primary),
      transparent 80%
    )
  `;

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const iconAnimation = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: entryDelay, duration: 0.14, ease: "easeOut" },
    },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: entryDelay,
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: entryDelay,
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleBorderGlowMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!showBorderGlow) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <>
      <div
        ref={ref}
        className={`relative sm:flex items-center text-black px-1 mb-3 ${
          index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
        }`}
      >
        <motion.div
          initial="hidden"
          animate={controls}
          variants={iconAnimation}
          className="flex absolute sm:mx-auto -ml-5 inset-0 ring-4 ring-zinc-800 hover:ring-primary/70 my-auto items-center transform -translate-y-1/2 justify-center w-10 h-10 rounded-full bg-slate-200 text-black shadow md:order-1 transition-all duration-300 hover:shadow-[0_0_16px_rgba(0,229,255,0.45)]"
        >
          <experience.icon />
        </motion.div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={index % 2 === 0 && !isMobile ? slideFromLeft : slideFromRight}
          onMouseMove={handleBorderGlowMove}
          onMouseEnter={() => setShowBorderGlow(true)}
          onMouseLeave={() => setShowBorderGlow(false)}
          style={{ background: backgroundGradient }}
          className="sm:w-[calc(50%-2.25rem)] ml-10 md:mr-0 mr-3 sm:ml-0 max-w-[28rem] p-[2px] rounded-md relative transition duration-300 group/experience"
        >
          <div className="radial-gradient border-zinc-800 border-2 rounded-[6px] px-4 py-2 relative h-full">
            {index % 2 === 0 ? (
              <div className="absolute right-[100%] sm:!-right-4 top-1/2 -translate-y-1/2 z-[2]">
                <div className="arrow-left"></div>
              </div>
            ) : (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-[2]">
                <div className="arrow-right"></div>
              </div>
            )}
            <div className="relative z-[2]">
              <time className="text-zinc-300 text-xs md:w-28">
                {experience.date}
              </time>
            </div>
            <div className="text-zinc-500 flex flex-col">
              <span className="text-white font-semibold">
                {experience.subtitle}
              </span>
              <span className="text-xs">{experience.title}</span>
            </div>
            {experience.highlights?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px] text-zinc-300">
                {experience.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ExperienceSection;