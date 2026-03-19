import GridPattern from "@/components/Animations/AnimatedGridPattern";
import NumberTicker from "@/components/Animations/NumberTicker";
import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { highlightsContent } from "@/data";

interface HighlightCardProps {
  nb: number;
  title: string;
  delay: number;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ nb, title, delay }) => {
  const radius = 140;
  const [showBorderGlow, setShowBorderGlow] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };

  const handleBorderGlowMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      className="group/highlight w-full max-w-[32rem] rounded-lg p-[2px] transition duration-300"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      onMouseMove={handleBorderGlowMove}
      onMouseEnter={() => setShowBorderGlow(true)}
      onMouseLeave={() => setShowBorderGlow(false)}
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${showBorderGlow ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            rgba(0,229,255,0.95),
            transparent 80%
          )
        `,
      }}>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-800 group-hover/highlight:border-transparent radial-gradient p-10 md:shadow-xl transition duration-300">
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
            "pointer-events-none",
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
      </div>
    </motion.div>
  );
};

const Highlights: React.FC = () => {

  return (
    <section
      id="highlights"
      className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 md:px-20 lg:px-32 py-10 place-items-center">
      {highlightsContent.map((highlight, index) => (
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
