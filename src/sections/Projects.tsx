import React from "react";
import { useInView } from "react-intersection-observer";
import Macbook from "@/components/Laptop/Mackbook";
import Phone from "@/components/Phone";
import HeroBg from "@/components/HeroBg";

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
      className={`flex items-center justify-around h-screen w-screen z-10 px-10 ${
        isEven ? "flex-row" : "flex-row-reverse"
      }`}>
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
          <p className="text-gray-400">{data.description}</p>
        </div>
        <a
          href={data.link}
          className="inline-flex items-center justify-center px-4 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-600 transition"
          target="_blank"
          rel="noopener noreferrer">
          View project →
        </a>
      </div>

      <div className="h-full w-3/5">
        {data.type === "laptop" ? (
          <Macbook key={`macbook-${index}`} texture={data.textures[0]} />
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
          title: "MacBook Pro",
          description: "This is a powerful laptop designed for professionals.",
          link: "/spr-lesson-builder-dark-large.jpg",
          type: "laptop",
          textures: ["/projects/mashabeat/mashabeat.jpeg"],
        }}
      />
      <ProjectCard
        index={1}
        data={{
          title: "iPhone 12",
          description:
            "The latest smartphone from Apple with advanced features.",
          link: "/spr-lesson-builder-dark-large.jpg",
          type: "laptop",
          textures: ["/projects/hebbosites/hebbosites.jpeg"],
        }}
      />
      <ProjectCard
        index={2}
        data={{
          title: "iPhone 12",
          description:
            "The latest smartphone from Apple with advanced features.",
          link: "/spr-lesson-builder-dark-large.jpg",
          type: "laptop",
          textures: ["/projects/mibio.bio/mibio.bio.jpeg"],
        }}
      />
    </section>
  );
};

export default Projects;
