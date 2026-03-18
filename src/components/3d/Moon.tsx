"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import moonTexture from "../../../public/3d/moon/moon-texture.jpg";
import moonDisplacementMap from "../../../public/3d/moon/moon-displacement.jpg";

const Moon = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isFirstContactEnterRef = useRef(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const modelLoader = new GLTFLoader();

    const moonGeometry = new THREE.SphereGeometry(3, 64, 64);
    const moonMap = textureLoader.load(moonTexture.src);
    const moonHeightMap = textureLoader.load(moonDisplacementMap.src);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: moonMap,
      displacementMap: moonHeightMap,
      displacementScale: 0.05,
      bumpMap: moonHeightMap,
      bumpScale: 0.04,
    });

    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.y = -1.6;
    moonMesh.scale.setScalar(0);
    scene.add(moonMesh);

    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, -1.25, 0);
    orbitGroup.rotation.x = THREE.MathUtils.degToRad(14);
    orbitGroup.rotation.z = THREE.MathUtils.degToRad(-10);
    orbitGroup.scale.setScalar(0);
    scene.add(orbitGroup);

    const shipAnchor = new THREE.Group();
    let currentOrbitRadius = window.innerWidth < 768 ? 4.8 : 5.85;
    let currentShipScale = window.innerWidth < 768 ? 0.05 : 0.065;
    shipAnchor.position.set(-currentOrbitRadius, 0.3, 0);
    orbitGroup.add(shipAnchor);

    const shipPivot = new THREE.Group();
    shipPivot.rotation.y = Math.PI / 2;
    shipPivot.rotation.z = THREE.MathUtils.degToRad(-8);
    shipPivot.scale.setScalar(currentShipScale);
    shipAnchor.add(shipPivot);

    let shipModel: THREE.Object3D | null = null;
    modelLoader.load(
      "/3d/space_ship_wg-02/space_ship.gltf",
      (gltf) => {
        shipModel = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(shipModel);
        const center = bbox.getCenter(new THREE.Vector3());
        shipModel.position.sub(center);
        shipModel.rotation.x = THREE.MathUtils.degToRad(-10);
        shipModel.rotation.y = THREE.MathUtils.degToRad(8);

        shipPivot.add(shipModel);
      },
      undefined,
      () => {
        shipModel = null;
      }
    );

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(0, 1000, 300);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x9ecbff, 1.5, 24);
    fillLight.position.set(8, -2, 8);
    scene.add(fillLight);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    const animateScene = (show: boolean, delay = 0) => {
      gsap.to(moonMesh.scale, {
        x: show ? 1 : 0,
        y: show ? 1 : 0,
        z: show ? 1 : 0,
        duration: 0.8,
        delay,
      });
      gsap.to(moonMesh.position, {
        y: show ? -1.6 : 0,
        duration: 0.8,
        delay,
      });
      gsap.to(orbitGroup.scale, {
        x: show ? 1 : 0,
        y: show ? 1 : 0,
        z: show ? 1 : 0,
        duration: 0.8,
        delay,
      });
      gsap.to(keyLight.position, {
        y: show ? 1000 : 0,
        duration: 0.8,
        delay,
      });
      gsap.to(fillLight, {
        intensity: show ? 1.5 : 0,
        duration: 0.8,
        delay,
      });
    };

    const introTimeline = gsap.timeline({ repeat: 0 });
    introTimeline.add(() => animateScene(true, 0), 1.4);

    let frameId = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();

      const moonSpinSpeed = 0.0018;
      const shipOrbitSpeed = 0.68;
      const shipOrbitAngle = elapsed * -shipOrbitSpeed;
      const shipVerticalOffset = Math.sin(elapsed * 2.4) * 0.22;
      const shipDepthFactor = (Math.sin(shipOrbitAngle) + 1) / 2;
      const shipDepthScale = THREE.MathUtils.lerp(0.88, 1.12, shipDepthFactor);
      const shipBank = THREE.MathUtils.lerp(-0.18, 0.18, shipDepthFactor);

      moonMesh.rotation.y += moonSpinSpeed;
      orbitGroup.rotation.y = Math.sin(elapsed * 0.22) * 0.18;
      shipAnchor.position.x = Math.cos(shipOrbitAngle) * currentOrbitRadius;
      shipAnchor.position.z = Math.sin(shipOrbitAngle) * currentOrbitRadius * 0.86;
      shipAnchor.position.y = 0.3 + shipVerticalOffset + shipDepthFactor * 0.12;
      shipPivot.rotation.y = -shipOrbitAngle + Math.PI / 2;
      shipPivot.rotation.x = Math.sin(elapsed * 1.8) * 0.1 - shipBank * 0.2;
      shipPivot.rotation.z =
        THREE.MathUtils.degToRad(-8) + Math.cos(elapsed * 2) * 0.08 + shipBank;
      shipPivot.scale.setScalar(currentShipScale * shipDepthScale);

      if (shipModel) {
        shipModel.rotation.y =
          THREE.MathUtils.degToRad(8) + Math.sin(elapsed * 1.6) * 0.05;
        shipModel.position.z = THREE.MathUtils.lerp(-0.08, 0.12, shipDepthFactor);
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    const homeTrigger = ScrollTrigger.create({
      trigger: "#home",
      start: "bottom bottom",
      end: "bottom center",
      onEnter: () => animateScene(true),
      onLeave: () => animateScene(false),
      onEnterBack: () => animateScene(true),
    });

    const contactTrigger = ScrollTrigger.create({
      trigger: "#contact",
      start: "top 80%",
      end: "bottom bottom",
      onEnter: () => {
        const delay = isFirstContactEnterRef.current ? 1 : 0;
        animateScene(true, delay);
        isFirstContactEnterRef.current = false;
      },
      onLeaveBack: () => animateScene(false),
      onEnterBack: () => animateScene(true),
    });

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextOrbitRadius = width < 768 ? 4.8 : 5.85;
      const nextShipScale = width < 768 ? 0.05 : 0.065;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      currentOrbitRadius = nextOrbitRadius;
      currentShipScale = nextShipScale;
      shipAnchor.position.set(-nextOrbitRadius, 0.3, 0);
      shipPivot.scale.setScalar(nextShipScale);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      introTimeline.kill();
      homeTrigger.kill();
      contactTrigger.kill();
      controls.dispose();
      renderer.dispose();
      moonGeometry.dispose();
      moonMaterial.dispose();
      moonMap.dispose();
      moonHeightMap.dispose();
      if (shipModel) {
        shipModel.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry.dispose();

          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
            return;
          }

          child.material.dispose();
        });
      }
      scene.remove(moonMesh);
      scene.remove(orbitGroup);
      scene.remove(keyLight);
      scene.remove(fillLight);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas" />;
};

export default Moon;
