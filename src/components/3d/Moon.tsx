"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import moonTexture from "../../../public/3d/moon/moon-texture.jpg";
import moonDisplacementMap from "../../../public/3d/moon/moon-displacement.jpg";

const Moon = () => {
  const canvasRef = useRef(null);
  const [isFirstEnter, setIsFirstEnter] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

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
    mesh.position.y = -1.6;
    mesh.scale.set(0, 0, 0);
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1000, 300);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    const animate = () => {
      mesh.rotation.y += 0.003;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    const tl = gsap.timeline({ repeat: 0 });

    tl.to(mesh.scale, {
      y: 1,
      x: 1,
      z: 1,
      duration: 0.8,
      delay: 1.4,
    });

    ScrollTrigger.create({
      trigger: "#home",
      start: "bottom bottom",
      end: "bottom center",
      onEnter: () => {
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
        });
        gsap.to(mesh.position, {
          y: -1.6,
          duration: 0.8,
        });
        gsap.to(light.position, {
          y: 1000,
          duration: 0.8,
        });
      },
      onLeave: () => {
        gsap.to(mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.8,
        });
        gsap.to(mesh.position, {
          y: 0,
          duration: 0.8,
        });
        gsap.to(light.position, {
          y: 0,
          duration: 0.8,
        });
      },
      onEnterBack: () => {
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
        });
        gsap.to(mesh.position, {
          y: -1.6,
          duration: 0.8,
        });
        gsap.to(light.position, {
          y: 1000,
          duration: 0.8,
        });
      },
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (isFirstEnter) {
          gsap
            .timeline()
            .to(mesh.scale, {
              x: 1,
              y: 1,
              z: 1,
              delay: 1,
              duration: 0.8,
            })
            .to(
              mesh.position,
              {
                y: -1.6,
                duration: 0.8,
              },
              "-=0.8"
            )
            .to(
              light.position,
              {
                y: 1000,
                duration: 0.8,
              },
              "-=0.8"
            );
          setIsFirstEnter(false);
        } else {
          gsap
            .timeline()
            .to(mesh.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.8,
            })
            .to(
              mesh.position,
              {
                y: -1.6,
                duration: 0.8,
              },
              "-=0.8"
            )
            .to(
              light.position,
              {
                y: 1000,
                duration: 0.8,
              },
              "-=0.8"
            );
        }
      },
      onLeave: () => {
        gsap
          .timeline()
          .to(mesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.8,
          })
          .to(
            mesh.position,
            {
              y: 0,
              duration: 0.8,
            },
            "-=0.8"
          )
          .to(
            light.position,
            {
              y: 0,
              duration: 0.8,
            },
            "-=0.8"
          );
      },
      onLeaveBack: () => {
        gsap
          .timeline()
          .to(mesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.8,
          })
          .to(
            mesh.position,
            {
              y: 0,
              duration: 0.8,
            },
            "-=0.8"
          )
          .to(
            light.position,
            {
              y: 0,
              duration: 0.8,
            },
            "-=0.8"
          );
      },
      onEnterBack: () => {
        gsap
          .timeline()
          .to(mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.8,
          })
          .to(
            mesh.position,
            {
              y: -1.6,
              duration: 0.8,
            },
            "-=0.8"
          )
          .to(
            light.position,
            {
              y: 1000,
              duration: 0.8,
            },
            "-=0.8"
          );
      },
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.remove(mesh);
      scene.remove(light);
      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, [isFirstEnter]);

  return <canvas ref={canvasRef} id="canvas" />;
};

export default Moon;
