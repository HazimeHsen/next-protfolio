import React from "react";
import { useInView } from "react-intersection-observer";
import Macbook from "@/components/3d/Laptop/Mackbook";
import Phone from "@/components/3d/Phone";
import StarBg from "@/components/Animations/StarBg";
import { TransitionLink } from "@/components/common/TransitionLink";
import { projectsWithSlug } from "@/lib/projects";
import { FaArrowRight } from "react-icons/fa";
import Divider from "@/components/common/Divider";
import { motion } from "framer-motion";
import BlurFade from "@/components/Animations/BlurFade";

interface ProjectData {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: "phone" | "laptop";
  textures: string[];
}

interface ProjectCardProps {
  data: ProjectData;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ data, index }) => {
  const cutClipPath =
    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,9px 100%,0 100%)";
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className={`mx-auto flex w-full max-w-[1600px] flex-col-reverse items-center justify-between py-4 md:min-h-[58vh] md:py-6 z-50 relative ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}>
      <div className="flex flex-col gap-4 px-3 sm:px-6 md:px-12 lg:px-16 xl:px-20 md:max-w-[620px]">
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
            className="w-fit bg-primary text-black font-semibold hover:bg-primary/80 transition"
            whileTap={{ scale: 0.95 }}
            style={{ clipPath: cutClipPath, WebkitClipPath: cutClipPath }}>
            <TransitionLink
              href={`/projects/${data.slug}`}
              className="flex items-center gap-2 justify-center px-4 py-2">
              <span>View Case Study</span>
              <FaArrowRight />
            </TransitionLink>
          </motion.div>
        </BlurFade>
      </div>

      <div className="w-full md:w-[58%]">
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
  const featuredProjects = projectsWithSlug.slice(0, 3);

  return (
    <section
      id="projects"
      className="relative z-50 py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <StarBg
        className="absolute inset-0 z-0"
        quantity={100}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />

      {featuredProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          index={index}
          data={{
            ...project,
            type: project.type as "phone" | "laptop",
            textures: [...project.images],
          }}
        />
      ))}
    </section>
  );
};

export default Projects;
