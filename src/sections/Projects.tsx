import React from "react";
import { useInView } from "react-intersection-observer";
import Macbook from "@/components/3d/Laptop/Mackbook";
import Phone from "@/components/3d/Phone";
import HeroBg from "@/components/Animations/HeroBg";
import { TransitionLink } from "@/components/common/TransitionLink";
import { projects } from "@/data";
import { FaArrowRight } from "react-icons/fa";
import Divider from "@/components/common/Divider";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import BlurFade from "@/components/Animations/BlurFade";

interface ProjectData {
  title: string;
  description: string;
  link: string;
  type: "phone" | "laptop";
  textures: string[];
}

interface ProjectCardProps {
  data: ProjectData;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ data, index }) => {
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col-reverse items-center justify-between md:h-[100vh] w-screen z-50 relative ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}>
      <div className="flex flex-col gap-4 px-4 md:px-10 md:max-w-[550px]">
        <div className="space-y-5">
          <BlurFade inView={inView} className="flex items-center gap-4">
            <Divider
              className=""
              lineWidth="80px"
              lineHeight="2px"
              notchWidth="60px"
              notchHeight="8px"
              collapseDelay={200}
              collapsed={false}
            />
            <div className="text-primary font-semibold">0{index + 1}</div>
          </BlurFade>
          <BlurFade
            inView={inView}
            delay={0.1}
            className="text-2xl md:text-3xl font-bold mb-2">
            {data.title}
          </BlurFade>
          <BlurFade inView={inView} delay={0.2} className="text-gray-300">
            {data.description}
          </BlurFade>
        </div>
        <BlurFade inView={inView} delay={0.3}>
          <motion.div
            className="w-fit link bg-primary text-black font-semibold hover:bg-primary/80 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}>
            <TransitionLink
              href={"/projects"}
              target="_blank"
              className="flex items-center gap-2 justify-center px-4 py-2"
              rel="noopener noreferrer">
              <span>View More</span>
              <FaArrowRight />
            </TransitionLink>
          </motion.div>
        </BlurFade>
      </div>

      <div className="md:h-full w-full md:w-[60%]">
        {data.type === "laptop" ? (
          <Macbook texture={data.textures[0]} />
        ) : (
          <Phone
            key={`phone-${index}`}
            isInView={inView}
            textures={data.textures}
          />
        )}
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-10 relative z-50">
      <HeroBg
        className="absolute inset-0 z-0"
        quantity={100}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />

      <ProjectCard
        index={0}
        data={{
          ...projects[0],
          type: "laptop",
          textures: [...projects[0].images],
        }}
      />
      <ProjectCard
        index={1}
        data={{
          ...projects[1],
          type: "laptop",
          textures: [...projects[1].images],
        }}
      />
      <ProjectCard
        index={2}
        data={{
          ...projects[3],
          type: "laptop",
          textures: [...projects[3].images],
        }}
      />
    </section>
  );
};

export default Projects;
