import GridPattern from "@/components/AnimatedGridPattern";
import NumberTicker from "@/components/NumberTicker";
import { cn } from "@/utils/cn";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface HighlightCardProps {
  nb: number;
  title: string;
  delay: number;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ nb, title, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  };

  return (
    <motion.div
      className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-800 radial-gradient p-10 md:shadow-xl"
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}>
      <div className="z-10 text-center">
        <p className="whitespace-pre-wrap text-4xl font-medium tracking-tighter text-white mb-2">
          <NumberTicker value={nb} />
        </p>
        <p className="whitespace-pre-wrap text-xl font-medium tracking-tighter text-white">
          {title}
        </p>
      </div>
      <GridPattern
        numSquares={10}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
    </motion.div>
  );
};

const Highlights: React.FC = () => {
  const highlightsData = [
    { nb: 1.5, title: "Years of Experience" },
    { nb: 25, title: "Projects Completed" },
    { nb: 15, title: "Happy Clients" },
  ];

  return (
    <section
      id="highlights"
      className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 md:px-20 lg:px-32 py-10 place-items-center">
      {highlightsData.map((highlight, index) => (
        <HighlightCard
          key={index}
          nb={highlight.nb}
          title={highlight.title}
          delay={index * 0.2}
        />
      ))}
    </section>
  );
};

export default Highlights;
