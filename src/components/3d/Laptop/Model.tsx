import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface MacbookModelProps {
  isInView: boolean;
  texture: string;
}

const MacbookModel: React.FC<MacbookModelProps> = ({ isInView, texture }) => {
  const { scene: originalScene } = useGLTF("/3d/macbook-pro.glb");
  const [isLoaded, setIsLoaded] = useState(false);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(
    null
  );
  const [scale, setScale] = useState([1, 1, 1]);
  const [position, setPosition] = useState([0, 0, 0]); // State to manage position
  const laptopRef = useRef<THREE.Group>(null);

  const scene = useMemo(() => {
    const clone = originalScene.clone();
    clone.rotateX(0.05);
    const keyboardMesh = clone.getObjectByName("Keyboard") as THREE.Mesh;
    if (keyboardMesh) {
      keyboardMesh.scale.set(1, 1, 0.85);
    }
    return clone;
  }, [originalScene]);

  const textureLoader = useRef(new THREE.TextureLoader());

  useEffect(() => {
    textureLoader.current.load(texture, (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.flipY = false;
      setScreenTexture(loadedTexture);
      setIsLoaded(true);
    });
  }, [texture]);

  useEffect(() => {
    if (isLoaded && screenTexture) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          switch (child.name) {
            case "Screen":
              child.material = new THREE.MeshBasicMaterial({
                map: screenTexture,
              });
              break;
            case "Keyboard":
            case "Body":
            case "Touchbar":
            case "Frame":
              child.material = new THREE.MeshPhongMaterial({
                color: 0x1f2025,
                side: THREE.DoubleSide,
              });
              break;
            case "Logo":
              child.material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
              });
              break;
            default:
              break;
          }
        }
      });

      if (!isInView) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === "Screen" || child.name === "Frame") {
              child.rotation.x = Math.PI / 2;
            }
          }
        });
      }
    }
  }, [scene, screenTexture, isLoaded, isInView]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setScale([1.25, 1.25, 1.25]);
        setPosition([0, 0, 0]); 
      } else if (width >= 768) {
        setScale([1.1, 1.1, 1.1]);
        setPosition([0, 0, 0]); 
      } else {
        setScale([1.28, 1.28, 1.28]);
        setPosition([0, -0.5, 0]);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isInView && isLoaded) {
      const frameMesh = scene.getObjectByName("Frame") as THREE.Mesh;
      const screenMesh = scene.getObjectByName("Screen") as THREE.Mesh;

      if (frameMesh && screenMesh) {
        gsap.to(frameMesh.rotation, {
          x: 0,
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.to(screenMesh.rotation, {
          x: 0,
          duration: 0,
          ease: "power2.inOut",
        });
      }
    }
  }, [isInView, isLoaded, scene]);

  useFrame(({ mouse }) => {
    if (isInView && isLoaded && laptopRef.current) {
      const { x, y } = mouse;
      gsap.to(laptopRef.current.rotation, {
        y: (x * Math.PI) / 30,
        x: -(y * Math.PI) / 30 + 0.05,
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
  });

  return isLoaded ? (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      ref={laptopRef}
    />
  ) : null;
};

export default MacbookModel;
