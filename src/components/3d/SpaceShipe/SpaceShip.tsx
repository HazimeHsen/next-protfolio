import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import gsap from "gsap";
import { Html, useProgress } from "@react-three/drei";

interface ModalProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setShowSpaceShip: (value: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  isLoading,
  setIsLoading,
  setShowSpaceShip,
}) => {
  const fileUrl = "/3d/space_ship_wg-02/space_ship.gltf";
  const gltf = useLoader(GLTFLoader, fileUrl);
  const meshRef = useRef<THREE.Object3D>(null);

  const bbox = new THREE.Box3().setFromObject(gltf.scene);
  const modelSize = new THREE.Vector3();
  bbox.getSize(modelSize);

  const scale = 0.2;
  gltf.scene.scale.set(scale, scale, scale);

  const center = new THREE.Vector3();
  bbox.getCenter(center);
  gltf.scene.position.sub(center);

  useEffect(() => {
    setIsLoading(false);
  }, [gltf, setIsLoading]);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: 0 });

    tl.to(meshRef.current!.rotation, {
      y: THREE.MathUtils.degToRad(0),
      x: THREE.MathUtils.degToRad(0),
      duration: 0.3,
      delay: 0.4,
    })
      .to(meshRef.current!.rotation, {
        y: THREE.MathUtils.degToRad(10),
        x: -THREE.MathUtils.degToRad(15),
        duration: 0.5,
      })
      .to(meshRef.current!.rotation, {
        y: THREE.MathUtils.degToRad(10),
        x: -THREE.MathUtils.degToRad(8),
        duration: 0.5,
      })
      .to(meshRef.current!.rotation, {
        y: 0,
        x: 0,
        duration: 1.2,
      })
      .to(meshRef.current!.rotation, {
        y: -THREE.MathUtils.degToRad(10),
        x: -THREE.MathUtils.degToRad(2),
        duration: 1,
      })
      .to(meshRef.current!.rotation, {
        y: THREE.MathUtils.degToRad(12),
        x: THREE.MathUtils.degToRad(2),
        duration: 0.5,
      })
      .to(meshRef.current!.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.8,
        delay: 0.2,
        onComplete: () => setShowSpaceShip(false),
      })
      .to(meshRef.current!.rotation, {
        y: 0,
        x: 0,
      });

    return () => {
      tl.kill();
    };
  }, []);

  return <primitive object={gltf.scene} ref={meshRef} />;
};

interface SpaceShipProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setShowSpaceShip: (value: boolean) => void;
}

const SpaceShip: React.FC<SpaceShipProps> = ({
  isLoading,
  setIsLoading,
  setShowSpaceShip,
}) => {
  return (
    <Canvas
      className="z-[50]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}>
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 0]} />
      <Suspense fallback={<Loader />}>
        <Modal
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setShowSpaceShip={setShowSpaceShip}
        />
      </Suspense>
    </Canvas>
  );
};

export default SpaceShip;

const Loader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <ProgressBar completed={progress} />
    </Html>
  );
};

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0;
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = ({
  colour,
  percentage,
}: {
  colour: string;
  percentage: number;
}) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100;
  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""}
      strokeWidth={"1rem"}
      strokeDasharray={circ}
      strokeLinecap="round"
      strokeDashoffset={percentage ? strokePct : 0}></circle>
  );
};

const Text = ({ percentage }: { percentage: number }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.5em"}
      fill="white"
      fontWeight="bold">
      {percentage.toFixed(0)}%
    </text>
  );
};

const ProgressBar: React.FC<{ completed: number }> = ({ completed }) => {
  const pct = cleanPercentage(completed);
  return (
    <div className="relative flex items-center scale-50 justify-center">
      <svg width={200} height={200}>
        <g transform={`rotate(-90 ${"100 100"})`}>
          <Circle colour="cyan" percentage={pct} />
        </g>
        <Text percentage={pct} />
      </svg>
    </div>
  );
};
