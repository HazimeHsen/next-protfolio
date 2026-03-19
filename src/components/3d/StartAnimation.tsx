"use client";
import React, { useEffect, useRef, useState } from "react";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
  LoadingManager,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasCompletedIntroRef = useRef(false);
  const hasStartedOutroRef = useRef(false);
  const hasStartedIntroRef = useRef(false);
  const playOutroRef = useRef<(() => void) | null>(null);
  const finishIntroRef = useRef<(() => void) | null>(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      finishIntroRef.current?.();
    }, 12000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!rootRef.current || !canvasRef.current) return;

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
    scene.fog = new Fog(0x03050b, 0, 100);

    let cameraRotationProxyX = 3.14159;
    let cameraRotationProxyY = 0;

    const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
    camera.rotation.y = cameraRotationProxyX;
    camera.rotation.z = cameraRotationProxyY;

    const c = new Group();
    c.add(camera);
    scene.add(c);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(ww, wh),
      1.5,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;

    const composer = new EffectComposer(renderer);
    composer.setSize(ww, wh);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const tunnelRadius = 4;
    const loadingManager = new LoadingManager();
    const textureLoader = new TextureLoader(loadingManager);
    const gltfLoader = new GLTFLoader(loadingManager);

    const clock = new THREE.Clock();
    clock.start();

    const frenetFrames = path.computeFrenetFrames(300, false);
    const shipGroup = new Group();
    const shipOrientationGroup = new Group();
    const shipOffset = new Vector3();
    const shipProgressPoint = new Vector3();
    const shipLookAheadPoint = new Vector3();
    const shipPosition = new Vector3();
    const shipLookDirection = new Vector3();
    const shipNormal = new Vector3();
    const shipBinormal = new Vector3();
    const shipBinormalOffset = new Vector3();
    const cameraForward = new Vector3();
    const shipLookTarget = new Vector3();
    const shipMobileScale = 0.12;
    const shipDesktopScale = 0.16;

    scene.add(shipGroup);
    shipGroup.add(shipOrientationGroup);

    let texturesReady = false;
    let gltfAttempted = false;
    let introStartScheduled = false;
    let isReady = false;

    const texture = textureLoader.load("/3d/start-sphere/space-tunnel-texture.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 2);

    const mapHeight = textureLoader.load("/3d/start-sphere/space-tunnel-bump.png");
    mapHeight.anisotropy = renderer.capabilities.getMaxAnisotropy();
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.repeat.set(15, 2);

    const material = new MeshPhongMaterial({
      side: THREE.BackSide,
      color: 0x8eb8ff,
      map: texture,
      transparent: true,
      opacity: 1,
      shininess: 4,
      bumpMap: mapHeight,
      bumpScale: -0.01,
      specular: 0x0d1420,
      emissive: 0x02050c,
      emissiveIntensity: 0.18,
    });

    const tubeGeometry = new TubeGeometry(path, 300, tunnelRadius, 32, false);
    const tube = new THREE.Mesh(tubeGeometry, material);
    scene.add(tube);

    const innerTubeGeometry = new TubeGeometry(
      path, 150, tunnelRadius - 0.6, 32, false
    );
    const geo = new EdgesGeometry(innerTubeGeometry);
    const mat = new LineBasicMaterial({
      linewidth: 2,
      opacity: 0.14,
      color: 0x8ea7d6,
      transparent: true,
    });
    const wireframe = new LineSegments(geo, mat);
    scene.add(wireframe);

    const light = new PointLight(0xffffff, 0.35, 4, 0);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    let shipModel: THREE.Object3D | null = null;

    const shipState = {
      reveal: 0,
      boost: 0,
      entry: 0,
      tilt: 0,
    };

    // outroProgress drives the camera zoom — tweened directly by GSAP
    // so the render loop reads it each frame and gets the exact position
    const outroState = { progress: 0 };

    const setShipOpacity = (opacity: number) => {
      if (!shipModel) return;
      shipModel.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((m) => {
          m.transparent = true;
          m.opacity = opacity;
          m.depthWrite = opacity > 0.2;
          m.needsUpdate = true;
        });
      });
    };

    const finishIntro = () => {
      if (hasCompletedIntroRef.current) return;
      hasCompletedIntroRef.current = true;
      setIsLoading(false);
      onFadeOutComplete();
    };
    finishIntroRef.current = finishIntro;

    // ── Outro ─────────────────────────────────────────────────────────────────
    // Triggered the frame tunnelProgress crosses 0.91 so it is perfectly
    // parallel with shipExitProgress starting to rise.
    //
    // Timeline:
    //  t=0.00  outroState.progress starts tweening 0→1 with power3.in
    //          → render loop reads this and pushes cameraTargetPercentage
    //            forward aggressively, producing a visible warp/zoom-in
    //  t=0.25  canvas starts fading — zoom has been visible for 0.25 s already
    //  t=0.55  canvas fully black → finishIntro fires
    const playOutro = () => {
      if (hasStartedOutroRef.current) return;
      hasStartedOutroRef.current = true;

      // Snapshot the camera position at the moment outro starts
      const outroStartPercent = cameraTargetPercentage;

      const tl = gsap.timeline({ onComplete: finishIntro });

      // Drive cameraTargetPercentage from current → 1.5
      // (well past the end of the path — gives real warp sensation)
      // Using a plain object so the render loop can read it every frame
      const camProxy = { value: outroStartPercent };
      tl.to(camProxy, {
        value: Math.min(outroStartPercent + 0.18, 0.999),
        duration: 0.55,
        ease: "power3.in",  // accelerating rush into the tunnel
        onUpdate: () => {
          cameraTargetPercentage = camProxy.value;
        },
      }, 0);

      // FOV punch: widen field of view to sell the speed sensation
      tl.to(camera, {
        fov: 75,            // from 45 → 75 (feels like warping)
        duration: 0.55,
        ease: "power3.in",
        onUpdate: () => { camera.updateProjectionMatrix(); },
      }, 0);

      // Canvas fade starts AFTER zoom has been playing for 0.25 s
      // so the viewer clearly sees the rush before it goes black
      tl.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
      }, 0.25);
    };
    playOutroRef.current = playOutro;

    const checkAndTriggerReady = () => {
      if (!texturesReady || !gltfAttempted) return;
      if (hasStartedOutroRef.current || hasCompletedIntroRef.current) return;
      isReady = true;
      setIsLoading(false);
      updateCameraPercentage(0);
      gsap.set(rootRef.current, { autoAlpha: 1 });
    };

    loadingManager.onLoad = () => {
      texturesReady = true;
      checkAndTriggerReady();
    };

    const managerFallback = window.setTimeout(() => {
      if (!texturesReady) {
        texturesReady = true;
        checkAndTriggerReady();
      }
    }, 3000);

    gltfLoader.load(
      "/3d/space_ship_wg-02/space_ship.gltf",
      (gltf) => {
        shipModel = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(shipModel);
        const center = bbox.getCenter(new Vector3());
        shipModel.position.sub(center);
        shipModel.rotation.x = THREE.MathUtils.degToRad(-8);
        shipModel.rotation.y = Math.PI;
        shipModel.rotation.z = THREE.MathUtils.degToRad(8);
        setShipOpacity(0);
        shipOrientationGroup.add(shipModel);
        gltfAttempted = true;
        checkAndTriggerReady();
      },
      undefined,
      () => {
        shipModel = null;
        gltfAttempted = true;
        checkAndTriggerReady();
      }
    );

    const getFrameVectors = (progress: number) => {
      const normalized = THREE.MathUtils.euclideanModulo(progress, 1);
      const frameIndexFloat = normalized * frenetFrames.tangents.length;
      const frameIndex =
        Math.floor(frameIndexFloat) % frenetFrames.tangents.length;
      const nextFrameIndex =
        (frameIndex + 1) % frenetFrames.tangents.length;
      const frameAlpha = frameIndexFloat - frameIndex;
      shipNormal
        .copy(frenetFrames.normals[frameIndex])
        .lerp(frenetFrames.normals[nextFrameIndex], frameAlpha)
        .normalize();
      shipBinormal
        .copy(frenetFrames.binormals[frameIndex])
        .lerp(frenetFrames.binormals[nextFrameIndex], frameAlpha)
        .normalize();
    };

    const updateCameraPercentage = (percentage: number) => {
      const clamped = THREE.MathUtils.clamp(percentage, 0, 0.999);
      const p1 = path.getPointAt(clamped);
      const p2 = path.getPointAt(Math.min(clamped + 0.03, 0.999));
      c.position.set(p1.x, p1.y, p1.z);
      c.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    };

    updateCameraPercentage(0);

    let cameraTargetPercentage = 0;
    let currentCameraPercentage = 0;
    const tubePerc = { percent: 0 };

    const introTween = gsap.to(tubePerc, {
      percent: 0.96,
      duration: 5,
      ease: "linear",
      paused: true,
      onUpdate: () => { cameraTargetPercentage = tubePerc.percent; },
    });

    const startIntro = () => {
      if (
        hasStartedIntroRef.current ||
        hasStartedOutroRef.current ||
        hasCompletedIntroRef.current
      ) return;
      hasStartedIntroRef.current = true;

      gsap.set(shipState, { reveal: 0, boost: 0, entry: 0, tilt: 0 });
      introTween.play(0);

      gsap.to(shipState, {
        reveal: 1,
        duration: 0.45,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.to(shipState, {
        boost: 1,
        duration: 1.6,
        delay: 0.5,
        ease: "expo.out",
      });

      gsap.to(shipState, {
        entry: 1,
        duration: 1.3,
        delay: 0.5,
        ease: "power4.out",
      });

      gsap.to(shipState, {
        tilt: 1,
        duration: 0.55,
        delay: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(shipState, {
            tilt: 0,
            duration: 0.9,
            ease: "power3.inOut",
          });
        },
      });
    };

    const scheduleIntroStart = () => {
      if (introStartScheduled || hasCompletedIntroRef.current) return;
      introStartScheduled = true;

      const loader = loaderRef.current;
      if (!loader) {
        setShowLoader(false);
        startIntro();
        return;
      }
      gsap.to(loader, {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => {
          setShowLoader(false);
          startIntro();
        },
      });
    };

    let frameId = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);

      if (!isReady) {
        composer.render();
        return;
      }

      scheduleIntroStart();

      const elapsed = clock.getElapsedTime();

      // During outro the camera is driven by the GSAP tween in playOutro,
      // not by introTween — so we only copy tubePerc when intro is still running
      if (!hasStartedOutroRef.current) {
        currentCameraPercentage = cameraTargetPercentage;
      } else {
        // Outro: cameraTargetPercentage is already being pushed by the tween
        // in playOutro via camProxy — just clamp and apply
        currentCameraPercentage = THREE.MathUtils.clamp(
          cameraTargetPercentage, 0, 0.999
        );
      }

      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      const tunnelProgress = THREE.MathUtils.clamp(
        currentCameraPercentage / 0.96, 0, 1
      );

      // ── Fire outro the exact frame ship exit fade begins ─────────────────
      if (tunnelProgress >= 0.91 && !hasStartedOutroRef.current) {
        playOutro();
      }

      const orbitPhase = elapsed * 2.4 + tunnelProgress * Math.PI * 1.75;

      const shipPathOffset = THREE.MathUtils.lerp(0.24, 0.045, shipState.boost);
      const shipProgress = Math.min(currentCameraPercentage + shipPathOffset, 0.985);
      const shipLookAhead = Math.min(shipProgress + 0.015, 0.995);

      const shipExitProgress = THREE.MathUtils.smoothstep(
        tunnelProgress, 0.91, 0.96
      );
      const radialDistance =
        tunnelRadius * 0.26 * (1 - shipExitProgress * 0.92);

      const shipScaleBase =
        window.innerWidth < 768 ? shipMobileScale : shipDesktopScale;

      // Ship opacity owned entirely by entry reveal + exit fade
      const shipOpacity =
        shipState.reveal * THREE.MathUtils.lerp(1, 0, shipExitProgress);

      const shipScale =
        shipScaleBase *
        THREE.MathUtils.lerp(0.05, 1.0, shipState.boost) *
        THREE.MathUtils.lerp(0.0,  1.0, shipState.reveal) *
        THREE.MathUtils.lerp(1.28, 0.86, tunnelProgress) *
        THREE.MathUtils.lerp(0.96, 1.04, (Math.sin(orbitPhase) + 1) / 2) *
        THREE.MathUtils.lerp(1.0,  0.015, shipExitProgress);

      getFrameVectors(shipProgress);
      path.getPointAt(shipProgress, shipProgressPoint);
      path.getPointAt(shipLookAhead, shipLookAheadPoint);

      shipOffset
        .copy(shipNormal)
        .multiplyScalar(Math.cos(orbitPhase) * radialDistance)
        .add(
          shipBinormalOffset
            .copy(shipBinormal)
            .multiplyScalar(Math.sin(orbitPhase) * radialDistance * 0.58)
        );
      shipPosition.copy(shipProgressPoint).add(shipOffset);

      camera.getWorldDirection(cameraForward);

      const spawnPoint = new Vector3()
        .copy(c.position)
        .addScaledVector(cameraForward, 16)
        .addScaledVector(shipBinormal, tunnelRadius * 6.5)
        .addScaledVector(shipNormal,  -tunnelRadius * 4.0);

      shipPosition.lerpVectors(spawnPoint, shipPosition, shipState.entry);

      shipLookDirection.copy(shipLookAheadPoint).sub(shipPosition).normalize();
      shipGroup.position.copy(shipPosition);
      shipLookTarget.copy(shipPosition).add(shipLookDirection);
      shipOrientationGroup.lookAt(shipLookTarget);
      shipOrientationGroup.rotateY(Math.PI);
      shipOrientationGroup.rotateX(
        THREE.MathUtils.degToRad(-6) + Math.sin(elapsed * 2.2) * 0.08
      );

      const bankRoll =
        Math.cos(orbitPhase) * 0.18 +
        THREE.MathUtils.degToRad(6) +
        shipState.tilt * THREE.MathUtils.degToRad(35);

      shipOrientationGroup.rotateZ(bankRoll);
      shipOrientationGroup.rotateX(
        shipState.tilt * THREE.MathUtils.degToRad(-18)
      );

      shipOrientationGroup.scale.setScalar(shipScale);
      setShipOpacity(shipOpacity);

      updateCameraPercentage(currentCameraPercentage);
      composer.render();
    };

    render();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(managerFallback);
      playOutroRef.current = null;
      finishIntroRef.current = null;
      introTween.kill();
      gsap.killTweensOf(shipState);
      gsap.killTweensOf(outroState);
      if (frameId) cancelAnimationFrame(frameId);
      scene.remove(tube);
      scene.remove(wireframe);
      scene.remove(light);
      scene.remove(ambientLight);
      scene.remove(shipGroup);
      shipOrientationGroup.clear();
      if (shipModel) {
        shipModel.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry?.dispose();
          const m = child.material;
          if (Array.isArray(m)) m.forEach((i) => i.dispose());
          else m?.dispose();
        });
      }
      tubeGeometry.dispose();
      innerTubeGeometry.dispose();
      geo.dispose();
      mat.dispose();
      material.dispose();
      texture.dispose();
      mapHeight.dispose();
      composer.dispose();
      renderer.dispose();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [onFadeOutComplete, setIsLoading]);

  return (
    <>
      {showLoader && (
        <div ref={loaderRef} className="fixed inset-0 z-20 bg-black">
          <LoadingPage />
        </div>
      )}
      <div ref={rootRef} className="fixed inset-0 z-10 opacity-0">
        <canvas
          ref={canvasRef}
          className="experience absolute inset-0 h-screen w-full"
        />
        <div className="scrollTarget absolute top-0 z-0 w-24"></div>
      </div>
    </>
  );
};

export default ThreeScene;