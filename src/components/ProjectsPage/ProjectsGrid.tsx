"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "../common/BentoGrid";
import { projects } from "@/data";

export default function ProjectsGrid() {
  return (
    <BentoGrid className="max-w-4xl py-10 mx-auto px-5 lg:px-0">
      {projects.map((project, i) => (
        <BentoGridItem
          key={project.id}
          index={i}
          title={project.title}
          description={project.description}
          images={project.images}
          link={project.link}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
