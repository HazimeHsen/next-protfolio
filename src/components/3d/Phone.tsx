import React, { useRef, useEffect, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";

interface PhoneModelProps {
  isInView: boolean;
  textures: string[];
  position?: [number, number, number];
}

const PhoneModel: React.FC<PhoneModelProps> = ({
  isInView,
  textures,
  position = [0, 0, 0],
}) => {
  const { scene: scene1 } = useGLTF("/3d/iphone-11.glb"); // First instance of the model
  const { scene: scene2 } = useGLTF("/3d/iphone-11.glb"); // Second instance of the model

  const textureLoader = new THREE.TextureLoader();
  const screenTexture1 = textureLoader.load(textures[0]); // Texture for scene1
  screenTexture1.flipY = false;

  const screenTexture2 = textureLoader.load(textures[1]); // Texture for scene2
  screenTexture2.flipY = false;

  const screenMaterial1 = new THREE.MeshBasicMaterial({
    map: screenTexture1,
    transparent: true,
    opacity: 1,
  });

  const screenMaterial2 = new THREE.MeshBasicMaterial({
    map: screenTexture2,
    transparent: true,
    opacity: 1,
  });

  const lightGrayMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const darkGrayMaterial = new THREE.MeshPhongMaterial({
    color: 0x1f2025,
    side: THREE.DoubleSide,
  });

  useEffect(() => {
    scene1.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        switch (child.name) {
          case "Screen":
            child.material = screenMaterial1; // Apply texture 1 to scene1's screen
            break;
          case "Frame":
            child.material = darkGrayMaterial;
            break;
          case "Logo":
            child.material = lightGrayMaterial;
            break;
          default:
            break;
        }
      }
    });

    scene2.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        switch (child.name) {
          case "Screen":
            child.material = screenMaterial2; // Apply texture 2 to scene2's screen
            break;
          case "Frame":
            child.material = darkGrayMaterial;
            break;
          case "Logo":
            child.material = lightGrayMaterial;
            break;
          default:
            break;
        }
      }
    });
  }, [
    scene1,
    scene2,
    screenMaterial1,
    screenMaterial2,
    darkGrayMaterial,
    lightGrayMaterial,
  ]);

  const phoneRef = useRef<THREE.Group>(null!);
  useFrame(({ mouse }) => {
    if (isInView && phoneRef.current) {
      const { x, y } = mouse;
      gsap.to(phoneRef.current.rotation, {
        y: (x * Math.PI) / 16,
        x: -(y * Math.PI) / 16,
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
  });

  return (
    <group ref={phoneRef} position={position}>
      <primitive object={scene1} position={[-2, 0, 0]} scale={[2, 2, 2]} />
      {/* <primitive object={scene2} position={[2, 0, 0]} scale={[1.4, 1.4, 1.4]} /> */}
    </group>
  );
};

interface PhonePairProps {
  isInView: boolean;
  textures: string[];
}

const Phone: React.FC<PhonePairProps> = ({ isInView, textures }) => {
  return (
    <Canvas>
      <ambientLight color={0xffffff} intensity={1.2} />
      <directionalLight position={[-6, 2, 2]} color={0xffffff} intensity={2} />
      <directionalLight
        position={[0.5, 0, 0.866]}
        color={0xffffff}
        intensity={6}
      />
      <Suspense fallback={null}>
        <group>
          {/* First Phone */}
          <PhoneModel
            isInView={isInView}
            textures={textures}
            position={[-2, 0, 0]}
          />
          {/* Second Phone */}
        </group>
      </Suspense>
    </Canvas>
  );
};

export default Phone;
