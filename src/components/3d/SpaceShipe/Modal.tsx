import { useRef, useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import gsap from "gsap";

interface ModalProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setShowSpaceShip: (value: boolean) => void;
  setLoadingProgress: (progress: number) => void;
}

const Modal: React.FC<ModalProps> = ({
  isLoading,
  setIsLoading,
  setShowSpaceShip,
  setLoadingProgress,
}) => {
  const fileUrl = "/3d/space_ship_wg-02/space_ship.gltf";
  const [progress, setProgress] = useState(0);

  // Load the model
  const gltf = useLoader(GLTFLoader, fileUrl, (loader) => {
    // Explicitly type the parameters for the onProgress handler
    (loader as any).onProgress = (
      event: ProgressEvent<EventTarget>,
      loaded: number,
      total: number
    ) => {
      const progress = (loaded / total) * 100;
      setProgress(progress);
      setLoadingProgress(progress);
    };
  });

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
    if (progress >= 100) {
      setIsLoading(false);
    }
  }, [progress, setIsLoading]);

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

export default Modal;
