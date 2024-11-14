import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useInView } from "react-intersection-observer";
import MacbookModel from "./Model";

interface MacbookProps {
  texture: string;
}

const Macbook: React.FC<MacbookProps> = ({ texture }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="laptop">
      <Canvas className="z-50">
        <ambientLight color={0xffffff} intensity={1.5} />
        <directionalLight
          position={[-6, 2, 2]}
          color={0xffffff}
          intensity={2}
        />
        <directionalLight
          position={[0.5, 0, 0.866]}
          color={0xffffff}
          intensity={6}
        />
        <Suspense fallback={null}>
          <MacbookModel texture={texture} isInView={inView} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Macbook;
