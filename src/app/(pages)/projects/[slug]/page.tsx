import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { Container } from "@/components/common/Container";
import { getProjectBySlug, projectsWithSlug } from "@/lib/projects";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import ProjectImageSlider from "@/components/ProjectsPage/ProjectImageSlider";
import { FaArrowLeft } from "react-icons/fa";
import ProjectDetailCtas from "@/components/ProjectsPage/ProjectDetailCtas";

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
  const thirdParties = project.thirdParties.filter(Boolean);
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
        <article className="mx-auto max-w-6xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <FaArrowLeft className="text-xs" />
            Back to all projects
          </Link>

          <header className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                Project Case Study
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-6 text-base leading-8 text-zinc-300 md:text-lg">
                {project.description}
              </p>

              {project.highlights?.length ? (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Key Outcomes
                  </h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 p-4">
                  <dt className="text-xs uppercase tracking-wider text-zinc-400">
                    Timeline
                  </dt>
                  <dd className="mt-2 text-sm text-zinc-100">
                    {project.duration}
                  </dd>
                </div>
                <div className="rounded-xl border border-zinc-800 p-4">
                  <dt className="text-xs uppercase tracking-wider text-zinc-400">
                    Project Period
                  </dt>
                  <dd className="mt-2 text-sm text-zinc-100">
                    {project.subtitle}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">
                    {tech}
                  </span>
                ))}
              </div>

              {thirdParties.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Third-Party Services
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {thirdParties.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <ProjectDetailCtas liveLink={project.link} />
            </div>

            <ProjectImageSlider
              images={project.images}
              title={project.title}
            />
          </header>
        </article>
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
