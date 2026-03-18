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
      <Canvas className="z-50">
        <ambientLight color={0xffffff} intensity={0.8} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0x070707}
          intensity={0.26}
        />
        <directionalLight
          position={[-5, 3, 2]}
          color={0xffffff}
          intensity={1.5}
        />
        <directionalLight
          position={[3, 1.2, 2.4]}
          color={0xe6e6e6}
          intensity={1.18}
        />
        <directionalLight
          position={[-2.6, 1.4, -2.2]}
          color={0xd4d7de}
          intensity={0.72}
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
