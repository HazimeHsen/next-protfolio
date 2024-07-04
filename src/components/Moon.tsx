"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import moonTexture from "../../public/moon-texture.jpg";
import moonDisplacementMap from "../../public/moon-displacement.jpg";

const Moon = () => {
  const canvasRef = useRef(null);

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
      y: 0,
      x: 0,
      z: 0,
    }).to(mesh.scale, {
      y: 1,
      x: 1,
      z: 1,
      duration: 0.6,
    });

    gsap.to(mesh.position, {
      y: 0,
      scrollTrigger: {
        trigger: "#canvas",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(light.position, {
      y: 0,
      scrollTrigger: {
        trigger: "#canvas",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(mesh.scale, {
      y: 0,
      x: 0,
      z: 0,
      scrollTrigger: {
        trigger: "#canvas",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        console.log("Entered contact section");
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
        });
        gsap.to(mesh.position, {
          y: -1.6,
        });
        gsap.to(light.position, {
          y: 1000,
        });
      },
      onLeave: () => {
        console.log("Left contact section");
        gsap.to(mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
        });
        gsap.to(mesh.position, {
          y: 0,
        });
        gsap.to(light.position, {
          y: 0,
        });
      },
      onLeaveBack: () => {
        console.log("Left contact section (back)");
        gsap.to(mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
        });
        gsap.to(mesh.position, {
          y: 0,
        });
        gsap.to(light.position, {
          y: 0,
        });
      },
      onEnterBack: () => {
        console.log("Entered contact section (back)");
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
        });
        gsap.to(mesh.position, {
          y: -1.6,
        });
        gsap.to(light.position, {
          y: 1000,
        });
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
  }, []);

  return <canvas ref={canvasRef} id="canvas" />;
};

export default Moon;
    //   ScrollTrigger.create({
    //     trigger: experienceSection,
    //     start: "top bottom",
    //     end: "bottom top",
    //     onEnter: () => {
    //       console.log("Entered experience section");
    //       gsap.to(mesh.position, {
    //         x: 5,
    //       });
    //     },
    //     onLeave: () => {
    //       console.log("Left experience section");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onLeaveBack: () => {
    //       console.log("Left experience section (back)");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onEnterBack: () => {
    //       console.log("Left experience section (back)");
    //       gsap.to(mesh.position, {
    //         x: 5,
    //       });
    //     },
    //   });

    // if (experienceSection) {
    //   console.log("Experience section detected");

    //   ScrollTrigger.create({
    //     trigger: experienceSection,
    //     start: "top bottom",
    //     end: "bottom top",
    //     onEnter: () => {
    //       console.log("Entered experience section");
    //       gsap.to(mesh.position, {
    //         x: 5,
    //       });
    //     },
    //     onLeave: () => {
    //       console.log("Left experience section");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onLeaveBack: () => {
    //       console.log("Left experience section (back)");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onEnterBack: () => {
    //       console.log("Left experience section (back)");
    //       gsap.to(mesh.position, {
    //         x: 5,
    //       });
    //     },
    //   });

    //   ScrollTrigger.create({
    //     trigger: aboutSection,
    //     start: "top center",
    //     end: "bottom center",
    //     onEnter: () => {
    //       console.log("Entered about section");
    //       gsap.to(mesh.position, {
    //         x: -5,
    //       });
    //     },
    //     onLeave: () => {
    //       console.log("Left about section");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onLeaveBack: () => {
    //       console.log("Left about section (back)");
    //       gsap.to(mesh.position, {
    //         x: 0,
    //       });
    //     },
    //     onEnterBack: () => {
    //       console.log("Entered about section (back)");
    //       gsap.to(mesh.position, {
    //         x: -5,
    //       });
    //     },
    //   });