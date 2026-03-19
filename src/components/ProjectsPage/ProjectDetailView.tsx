"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import BlurFade from "@/components/Animations/BlurFade";
import Divider from "@/components/common/Divider";
import { TransitionLink } from "@/components/common/TransitionLink";
import ProjectDetailCtas from "@/components/ProjectsPage/ProjectDetailCtas";
import ProjectImageSlider from "@/components/ProjectsPage/ProjectImageSlider";
import type { ProjectWithSlug } from "@/lib/projects";

interface ProjectDetailViewProps {
  project: ProjectWithSlug;
  projectIndex: number;
}

const detailCardClassName =
  "radial-gradient relative h-full rounded-[6px] border-2 border-zinc-800 px-4 py-3 transition duration-300";

function HoverGlow({
  children,
  className,
  radius = 120,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--primary),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`overflow-hidden ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

const ProjectDetailView = ({
  project,
  projectIndex,
}: ProjectDetailViewProps) => {
  const thirdParties = project.thirdParties.filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl">
      <BlurFade>
        <TransitionLink
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <FaChevronLeft className="text-[10px]" />
          Back to all projects
        </TransitionLink>
      </BlurFade>

      <header className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
        <div className="space-y-6">
          <BlurFade className="flex items-center gap-4">
            <Divider
              lineWidth="90px"
              lineHeight="2px"
              notchWidth="56px"
              notchHeight="8px"
              collapseDelay={200}
              collapsed={false}
            />
            <span className="text-sm font-semibold text-primary">
              0{projectIndex + 1}
            </span>
          </BlurFade>

          <BlurFade delay={0.08}>
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
              Project Case Study
            </p>
          </BlurFade>

          <BlurFade delay={0.14}>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl xl:text-6xl">
              {project.title}
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              {project.description}
            </p>
          </BlurFade>

          {project.highlights?.length ? (
            <BlurFade delay={0.26}>
              <HoverGlow className="rounded-[8px] p-[2px]">
                <div className={`${detailCardClassName} radial-gradient`}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    Key Outcomes
                  </h2>

                  <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-zinc-200 marker:text-primary">
                    {project.highlights.map((highlight, index) => (
                      <motion.li
                        key={highlight}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          delay: 0.08 * index,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="pl-1"
                      >
                        {highlight}
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </HoverGlow>
            </BlurFade>
          ) : null}

          <BlurFade delay={0.32}>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    delay: 0.03 * index,
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  <HoverGlow className="rounded-full p-[2px]" radius={90}>
                    <span className="block rounded-full border-2 border-zinc-800 bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200 transition duration-300 hover:text-white">
                      {tech}
                    </span>
                  </HoverGlow>
                </motion.div>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.38}>
            <ProjectDetailCtas liveLink={project.link} />
          </BlurFade>
        </div>

        <BlurFade delay={0.18} className="lg:sticky lg:top-28">
          <ProjectImageSlider images={project.images} title={project.title} />
        </BlurFade>
      </header>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <BlurFade delay={0.12}>
          <HoverGlow className="h-full rounded-[8px] p-[2px]">
            <div className={`${detailCardClassName} h-full`}>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Build Stack
              </p>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Built with {project.technologies.join(", ")} to deliver a polished,
                production-ready experience aligned with the rest of the portfolio.
              </p>
            </div>
          </HoverGlow>
        </BlurFade>

        {thirdParties.length > 0 ? (
          <BlurFade delay={0.2}>
            <HoverGlow className="h-full rounded-[8px] p-[2px]">
              <div className={`${detailCardClassName} h-full`}>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Integrations
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {thirdParties.map((service, index) => (
                    <motion.div
                      key={service}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        delay: 0.04 * index,
                        duration: 0.22,
                        ease: "easeOut",
                      }}
                    >
                      <HoverGlow className="rounded-full p-[2px]" radius={90}>
                        <span className="block rounded-full border-2 border-zinc-800 bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200 transition duration-300">
                          {service}
                        </span>
                      </HoverGlow>
                    </motion.div>
                  ))}
                </div>
              </div>
            </HoverGlow>
          </BlurFade>
        ) : null}
      </section>
    </article>
  );
};

export default ProjectDetailView;
