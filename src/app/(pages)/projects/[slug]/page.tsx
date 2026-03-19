import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { Container } from "@/components/common/Container";
import { getProjectBySlug, projectsWithSlug } from "@/lib/projects";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import ProjectDetailView from "@/components/ProjectsPage/ProjectDetailView";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export const generateStaticParams = () =>
  projectsWithSlug.map((project) => ({ slug: project.slug }));

export const generateMetadata = ({ params }: ProjectPageProps): Metadata => {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${project.title} Case Study`;
  const description = project.description;
  const pathname = `/projects/${project.slug}`;
  const image = absoluteUrl(project.images[0]);

  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    keywords: [
      project.title,
      "project case study",
      ...project.technologies,
      ...project.thirdParties.filter(Boolean),
    ],
    openGraph: {
      title,
      description,
      url: pathname,
      type: "article",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const projectUrl = absoluteUrl(`/projects/${project.slug}`);
  const technologies = project.technologies.join(", ");
  const projectIndex = projectsWithSlug.findIndex(
    (entry) => entry.slug === project.slug
  );
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: [absoluteUrl(project.images[0])],
    creator: {
      "@type": "Person",
      name: siteConfig.ownerName,
    },
    keywords: technologies,
    mainEntityOfPage: projectUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: absoluteUrl("/projects"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <Navbar animate />
      <Container className="pt-28 pb-20">
        <ProjectDetailView project={project} projectIndex={projectIndex} />
      </Container>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
