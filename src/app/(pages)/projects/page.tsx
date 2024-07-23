import React from "react";
import { projects } from "@/data";
import ProjectsHero from "@/components/ProjectsPage/Hero";
import Navbar from "@/components/common/Navbar";
import ProjectsGrid from "@/components/ProjectsPage/ProjectsGrid";

const ProjectsPage = () => {
  return (
    <section id="projects">
      <ProjectsHero />
      <ProjectsGrid />
    </section>
  );
};

export default ProjectsPage;
