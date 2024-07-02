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
  Clock,
  Fog,
  TextureLoader,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpaceShip from "./SpaceShip";
import LoadingPage from "./LoadingPage/LoadingPage";

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

const texts = ["Welcome", "TO", "My", "World"];

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
  const [currentText, setCurrentText] = useState(texts[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(ww, wh);

    const scene = new THREE.Scene();
    scene.fog = new Fog(0x141414, 0, 100);

    const clock = new Clock();

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
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/3d_space_5.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(15, 2);

    const mapHeight = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg"
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

    gsap.to(tubePerc, {
      percent: 0.96,
      duration: 5,
      ease: "linear",
      onUpdate: () => {
        cameraTargetPercentage = tubePerc.percent;
      },
      onComplete: () => {
        gsap.to(canvasRef.current, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: onFadeOutComplete,
        });
      },
    });

    const render = () => {
      if (isLoading) {
        requestAnimationFrame(render);
        return;
      }
      currentCameraPercentage = cameraTargetPercentage;
      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      updateCameraPercentage(currentCameraPercentage);
      composer.render();
      requestAnimationFrame(render);
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

    const textInterval = setInterval(() => {
      gsap.to(".fade-text", {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentText((prevText) => {
            const currentIndex = texts.indexOf(prevText);
            const nextIndex = (currentIndex + 1) % texts.length;
            return texts[nextIndex];
          });
          gsap.to(".fade-text", {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.inOut",
          });
        },
      });
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.remove(tube);
      scene.remove(wireframe);
      scene.remove(light);
      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      clearInterval(textInterval);
    };
  }, [onFadeOutComplete, isLoading]);

  return (
    <>
      {!isLoading && (
        <>
          <canvas
            ref={canvasRef}
            className="experience fixed top-0 left-0 w-full h-screen z-10"
          />
          <div className="scrollTarget absolute w-24 top-0 z-0"></div>
        </>
      )}
      <SpaceShip isLoading={isLoading} setIsLoading={setIsLoading} />
      {/* <div className="fixed z-20 top-0 left-0 h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center pointer-events-none">
          <h1 className="fade-text text-white text-4xl font-bold">
            {currentText}
          </h1>
        </div>
      </div> */}
    </>
  );
};

export default ThreeScene;
