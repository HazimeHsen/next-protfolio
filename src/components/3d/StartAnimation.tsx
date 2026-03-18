"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import {
  CatmullRomCurve3,
  TubeGeometry,
  MeshPhongMaterial,
  Vector3,
  Group,
  PointLight,
  LineBasicMaterial,
  EdgesGeometry,
  LineSegments,
  Fog,
  TextureLoader,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpaceShip from "./SpaceShipe/SpaceShip";

const points = [
  [10, 89, 0],
  [50, 88, 10],
  [76, 139, 20],
  [126, 141, 12],
  [150, 112, 8],
  [157, 73, 0],
  [180, 44, 5],
  [207, 35, 10],
  [232, 36, 0],
].map(([x, y, z]) => new Vector3(x, y, z));

const path = new CatmullRomCurve3(points);
path.tension = 0.5;

interface ThreeSceneProps {
  onFadeOutComplete: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  onFadeOutComplete,
  isLoading,
  setIsLoading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSpaceShip, setShowSpaceShip] = useState(true);
  const isLoadingRef = useRef(isLoading);
  const hasCompletedIntroRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (hasCompletedIntroRef.current) return;
      hasCompletedIntroRef.current = true;
      setIsLoading(false);
      setShowSpaceShip(false);
      onFadeOutComplete();
    }, 12000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onFadeOutComplete, setIsLoading]);

  useEffect(() => {
    if (!canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(ww, wh);

    const scene = new THREE.Scene();
    scene.fog = new Fog(0x141414, 0, 100);

    let cameraRotationProxyX = 3.14159;
    let cameraRotationProxyY = 0;

    const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
    camera.rotation.y = cameraRotationProxyX;
    camera.rotation.z = cameraRotationProxyY;

    const c = new Group();
    c.position.z = 400;
    c.add(camera);
    scene.add(c);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;

    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(
      "/3d/start-sphere/3d_space_5.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(15, 2);

    const mapHeight = textureLoader.load(
      "/3d/start-sphere/waveform-bump3.jpg"
    );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.offset.set(0, 0);
    mapHeight.repeat.set(15, 2);

    const material = new MeshPhongMaterial({
      side: THREE.BackSide,
      map: texture,
      shininess: 20,
      bumpMap: mapHeight,
      bumpScale: -0.03,
      specular: 0x000000,
    });

    const tubeGeometry = new TubeGeometry(path, 300, 4, 32, false);
    const tube = new THREE.Mesh(tubeGeometry, material);
    scene.add(tube);

    const innerTubeGeometry = new TubeGeometry(path, 150, 3.4, 32, false);
    const geo = new EdgesGeometry(innerTubeGeometry);
    const mat = new LineBasicMaterial({
      linewidth: 2,
      opacity: 0.2,
      transparent: true,
    });
    const wireframe = new LineSegments(geo, mat);
    scene.add(wireframe);

    const light = new PointLight(0xffffff, 0.35, 4, 0);
    light.castShadow = true;
    scene.add(light);

    const updateCameraPercentage = (percentage: number) => {
      const p1 = path.getPointAt(percentage % 1);
      const p2 = path.getPointAt((percentage + 0.03) % 1);

      c.position.set(p1.x, p1.y, p1.z);
      c.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    };

    let cameraTargetPercentage = 0;
    let currentCameraPercentage = 0;

    const tubePerc = { percent: 0 };

    const introTween = gsap.to(tubePerc, {
      percent: 0.96,
      duration: 5,
      ease: "linear",
      onUpdate: () => {
        cameraTargetPercentage = tubePerc.percent;
      },
      onComplete: () => {
        if (hasCompletedIntroRef.current) return;
        hasCompletedIntroRef.current = true;
        gsap.to(canvasRef.current, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: onFadeOutComplete,
        });
      },
    });

    let frameId = 0;
    const render = () => {
      if (isLoadingRef.current) {
        frameId = requestAnimationFrame(render);
        return;
      }
      currentCameraPercentage = cameraTargetPercentage;
      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      updateCameraPercentage(currentCameraPercentage);
      composer.render();
      frameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      introTween.kill();
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      scene.remove(tube);
      scene.remove(wireframe);
      scene.remove(light);
      tubeGeometry.dispose();
      innerTubeGeometry.dispose();
      geo.dispose();
      mat.dispose();
      material.dispose();
      texture.dispose();
      mapHeight.dispose();
      composer.dispose();
      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [onFadeOutComplete]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`experience fixed top-0 left-0 w-full h-screen z-10 transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="scrollTarget absolute w-24 top-0 z-0"></div>
      {showSpaceShip && (
        <SpaceShip
          setShowSpaceShip={setShowSpaceShip}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default ThreeScene;
