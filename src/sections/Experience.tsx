"use client";
import React, { useEffect } from "react";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import HeroBg from "@/components/Animations/HeroBg";

interface Experience {
  title: string;
  subtitle: string;
  date: string;
  icon: JSX.Element;
  content: string;
}

const experiences: Experience[] = [
  {
    title: "Frontend Internship",
    subtitle: "SmartSoft Company",
    date: "Aug 2023 – Oct 2023",
    icon: <FaBriefcase size={16} />,
    content:
      "Developed web applications with React.js. Created a React, Material UI, and AgGrid web application. Collaborated using Git for version control.",
  },
  {
    title: "Fullstack Developer",
    subtitle: "HebboSites Company",
    date: "Aug 2023 – Oct 2023",
    icon: <FaBriefcase size={16} />,
    content:
      "Full-stack development with MongoDB, Next.js, React, Tailwind CSS, and Sanity.io. Specialized in responsive UI/UX design. Implemented RESTful APIs for seamless front-end to back-end communication.",
  },
  {
    title: "Freelancer",
    subtitle: "Self-employed",
    date: "May 2023 – Present",
    icon: <FaBriefcase size={16} />,
    content:
      "Full-stack web application development with Next.js, React, Tailwind CSS, and Node.js. Integrated MongoDB and Firebase for robust data management. Specialized in intuitive UI/UX designs.",
  },
];

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const lineAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="experience" className="py-10 relative">
      <HeroBg
        className="absolute inset-0"
        quantity={100}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
      <motion.div
        initial="hidden"
        animate={controls}
        variants={lineAnimation}
        transition={{ duration: 0.3 }}></motion.div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={lineAnimation}
        transition={{ duration: 0.3 }}
        className="pl-7 sm:pl-0 before:ml-7 overflow-hidden space-y-14 w-full lg:max-w-3xl sm:mx-auto py-20 relative before:absolute before:inset-0 sm:before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </motion.div>
    </section>
  );
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const iconAnimation = {
    hidden: { scale: 0.4 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const slideAnimation = {
    hidden: { opacity: 0, x: "-100px" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: "100px" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return (
    <>
      <div
        className={`relative sm:flex items-center text-black px-1 mb-3 ${
          index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
        }`}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={iconAnimation}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex absolute sm:mx-auto -ml-5 inset-0 ring-4 ring-zinc-800 my-auto items-center transform -translate-y-1/2 justify-center w-10 h-10 rounded-full bg-slate-200 text-black shadow md:order-1">
          {experience.icon}
        </motion.div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={
            index % 2 === 0 && !isMobile ? slideAnimation : slideFromRight
          }
          transition={{ duration: 0.5 }}
          className="radial-gradient border-zinc-800 border-2 sm:w-64 ml-10 md:mr-0 mr-3 sm:ml-0 md:w-80 px-4 py-2 rounded-md relative">
          {index % 2 === 0 ? (
            <div className="absolute right-[100%] sm:!-right-4 top-1/2 -translate-y-1/2">
              <div className="arrow-left"></div>
            </div>
          ) : (
            <div className="absolute -left-4 top-1/2 -translate-y-1/2">
              <div className="arrow-right"></div>
            </div>
          )}
          <div className="">
            <time className="text-zinc-300 text-xs md:w-28">
              {experience.date}
            </time>
          </div>
          <div className="text-zinc-500 flex flex-col">
            <span className="text-white font-semibold">
              {experience.subtitle}
            </span>{" "}
            <span className="text-xs">{experience.title}</span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ExperienceSection;
