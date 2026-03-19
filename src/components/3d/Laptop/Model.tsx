import React, { useRef, useEffect, useState, useMemo } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface MacbookModelProps {
  isInView: boolean;
  texture: string;
  livePreviewUrl?: string;
}

const LIVE_PREVIEW_WIDTH = 1280;
const LIVE_PREVIEW_HEIGHT = 800;
const LIVE_PREVIEW_EDGE = 18;
const LIVE_PREVIEW_DISTANCE_FACTOR = 1.38;
const LIVE_PREVIEW_Z_OFFSET = 0.00012;

const MacbookModel: React.FC<MacbookModelProps> = ({
  isInView,
  texture,
  livePreviewUrl,
}) => {
  const { scene: originalScene } = useGLTF("/3d/macbook-pro.glb");
  const [isLoaded, setIsLoaded] = useState(false);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(
    null
  );
  const [screenMesh, setScreenMesh] = useState<THREE.Mesh | null>(null);
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const laptopRef = useRef<THREE.Group>(null);
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1f2329,
        emissive: 0x040506,
        emissiveIntensity: 0.08,
        metalness: 0.42,
        roughness: 0.42,
        side: THREE.DoubleSide,
      }),
    []
  );
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x353a42,
        emissive: 0x050608,
        emissiveIntensity: 0.08,
        metalness: 0.34,
        roughness: 0.38,
        side: THREE.DoubleSide,
      }),
    []
  );
  const logoMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd6dbe4,
        emissive: 0x0a0b0d,
        emissiveIntensity: 0.05,
        metalness: 0.3,
        roughness: 0.28,
        side: THREE.DoubleSide,
      }),
    []
  );

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
    if (livePreviewUrl) {
      setScreenTexture(null);
      setIsLoaded(true);
      return;
    }

    textureLoader.current.load(texture, (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.flipY = false;
      loadedTexture.generateMipmaps = true;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.anisotropy = 16;
      loadedTexture.needsUpdate = true;
      setScreenTexture(loadedTexture);
      setIsLoaded(true);
    });
  }, [texture, livePreviewUrl]);

  useEffect(() => {
    if (isLoaded) {
      const screenMaterial = livePreviewUrl
        ? new THREE.MeshStandardMaterial({
            color: 0x0b0d12,
            metalness: 0.05,
            roughness: 0.82,
          })
        : screenTexture
          ? new THREE.MeshBasicMaterial({
              map: screenTexture,
              transparent: false,
              opacity: 1,
              toneMapped: false,
            })
          : null;

      if (!screenMaterial) {
        return;
      }

      const detectedScreenMesh = scene.getObjectByName("Screen");
      if (detectedScreenMesh instanceof THREE.Mesh) {
        setScreenMesh(detectedScreenMesh);
      }

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          switch (child.name) {
            case "Screen":
              child.material = screenMaterial;
              break;
            case "Keyboard":
            case "Body":
            case "Touchbar":
              child.material = bodyMaterial;
              break;
            case "Frame":
              child.material = frameMaterial;
              break;
            case "Logo":
              child.material = logoMaterial;
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

      return () => {
        screenMaterial.dispose();
      };
    }
  }, [
    scene,
    screenTexture,
    isLoaded,
    isInView,
    bodyMaterial,
    frameMaterial,
    logoMaterial,
    livePreviewUrl,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setScale([1.26, 1.26, 1.26]);
        setPosition([0, 0, 0]);
      } else if (width >= 768) {
        setScale([1.12, 1.12, 1.12]);
        setPosition([0, 0, 0]);
      } else {
        setScale([1.24, 1.24, 1.24]);
        setPosition([0, -0.24, 0]);
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
    if (isInView && isLoaded && laptopRef.current && !livePreviewUrl) {
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
    <group scale={scale} position={position} ref={laptopRef}>
      <primitive object={scene} />

      {livePreviewUrl && screenMesh
        ? createPortal(
            <Html
              transform
              position={[0, 0, LIVE_PREVIEW_Z_OFFSET]}
              distanceFactor={LIVE_PREVIEW_DISTANCE_FACTOR}
              pointerEvents="auto"
              zIndexRange={[20, 0]}>
              <div
                className="overflow-hidden rounded-[24px] bg-black"
                style={{
                  width: LIVE_PREVIEW_WIDTH,
                  height: LIVE_PREVIEW_HEIGHT,
                  padding: LIVE_PREVIEW_EDGE,
                  pointerEvents: "auto",
                  boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.22)",
                }}>
                <div className="h-full w-full overflow-hidden rounded-[14px] bg-black">
                  <iframe
                    src={livePreviewUrl}
                    title="Live project preview"
                    className="h-full w-full border-0 bg-black"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              </div>
            </Html>,
            screenMesh
          )
        : null}
    </group>
  ) : null;
};

export default MacbookModel;
