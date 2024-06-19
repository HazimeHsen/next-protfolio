"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import moonTexture from "../../public/moon-texture.jpg";
import moonDisplacementMap from "../../public/moon-displacement.jpg";

const Moon = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(moonTexture.src);
    const displacementMap = textureLoader.load(moonDisplacementMap.src);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: texture,
      displacementMap: displacementMap,
      displacementScale: 0.05,
      bumpMap: displacementMap,
      bumpScale: 0.04,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let w;
    if (window.innerWidth < 800) {
      w = window.innerWidth;
    } else {
      w = window.innerWidth / 2;
    }
    let h = window.innerHeight;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 500, 1000);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(25, w / h, 0.1, 1000);
    camera.position.z = 18;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    renderer.setSize(w, h);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;

    window.addEventListener("resize", () => {
      if (window.innerWidth < 800) {
        w = window.innerWidth;
      } else {
        w = window.innerWidth / 2;
      }
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    const loop = () => {
      mesh.rotation.y -= 0.002;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      // Clean up resources
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas"></canvas>;
};

export default Moon;
