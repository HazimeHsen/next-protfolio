import React from "react";
import ProjectsHero from "@/components/ProjectsPage/Hero";
import Navbar from "@/components/common/Navbar";
import ProjectsGrid from "@/components/ProjectsPage/ProjectsGrid";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
import { projectsWithSlug } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Website & Next.js Projects",
  description:
    "Browse website and Next.js case studies by Hussein Hazime, including e-commerce, licensing, NFC profile, and dashboard products.",
  alternates: {
    canonical: "/projects",
  },
  keywords: [
    "projects portfolio",
    "web development case studies",
    "Next.js projects",
    "React projects",
    "website developer portfolio",
    "software developer portfolio",
    "full-stack case studies",
  ],
  openGraph: {
    title: "Website & Next.js Projects | Hussein Hazime",
    description:
      "Browse website and Next.js case studies by Hussein Hazime, including e-commerce, licensing, NFC profile, and dashboard products.",
    url: "/projects",
    type: "website",
  },
};

const ProjectsPage = () => {
  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hussein Hazime Projects",
    itemListElement: projectsWithSlug.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: absoluteUrl(`/projects/${project.slug}`),
    })),
  };

  return (
    <section>
      <Navbar animate />
      <ProjectsHero />
      <ProjectsGrid />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
    </section>
  );
};

export default ProjectsPage;
