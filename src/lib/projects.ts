import { projects } from "@/data";

const slugFromId = (id: string) =>
  id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const projectsWithSlug = projects.map((project) => ({
  ...project,
  slug: slugFromId(project.id),
}));

export type ProjectWithSlug = (typeof projectsWithSlug)[number];

export const getProjectBySlug = (slug: string) =>
  projectsWithSlug.find((project) => project.slug === slug);
