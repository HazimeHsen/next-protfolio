import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useInView } from "react-intersection-observer";
import MacbookModel from "./Model";
import { cn } from "@/utils/cn";

interface MacbookProps {
  texture: string;
  className?: string;
  livePreviewUrl?: string;
}

const Macbook: React.FC<MacbookProps> = ({
  texture,
  className,
  livePreviewUrl,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className={cn("laptop", className)}>
      <Canvas
        className="z-50"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight color={0xffffff} intensity={0.62} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0x070707}
          intensity={0.18}
        />
        <directionalLight
          position={[-4.4, 3.6, 3.4]}
          color={0xffffff}
          intensity={1.05}
        />
        <directionalLight
          position={[3.4, 1.6, 3]}
          color={0xf5f7fb}
          intensity={0.82}
        />
        <directionalLight
          position={[-2.4, 1.6, -2]}
          color={0xc8d1de}
          intensity={0.42}
        />
        <Suspense fallback={null}>
          <MacbookModel
            texture={texture}
            isInView={inView}
            livePreviewUrl={livePreviewUrl}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Macbook;
