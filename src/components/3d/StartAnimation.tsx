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

  // Hard safety net — if nothing works after 10s, just proceed
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      finishIntroRef.current?.();
    }, 10000);
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
    // ── Start at z=0 on the path, NOT z=400 ──────────────────────────────────
    c.position.set(10, 89, 0);
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

    // Clock always running from mount
    const clock = new THREE.Clock();
    clock.start();

    const frenetFrames = path.computeFrenetFrames(300, false);
    const shipGroup = new Group();
    const shipOrientationGroup = new Group();
    const shipOffset = new Vector3();
    const shipProgressPoint = new Vector3();
    const shipLookAheadPoint = new Vector3();
    const shipEntryPoint = new Vector3();
    const shipEntryBlendPosition = new Vector3();
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

    // ── Track texture/gltf loading independently ──────────────────────────────
    let texturesReady = false;
    let gltfAttempted = false; // true whether load succeeded or failed
    let introStartScheduled = false;

    const checkAndTriggerReady = () => {
      // We're ready once textures are done AND gltf has been attempted (pass or fail)
      if (!texturesReady || !gltfAttempted) return;
      if (hasStartedOutroRef.current || hasCompletedIntroRef.current) return;

      setIsLoading(false);
      updateCameraPercentage(0);
      gsap.set(rootRef.current, { autoAlpha: 1 });
    };

    const texture = textureLoader.load(
      "/3d/start-sphere/space-tunnel-texture.png",
      () => { /* loaded via manager */ },
      undefined,
      () => { /* error — manager still fires onLoad for other assets */ }
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 2);

    const mapHeight = textureLoader.load(
      "/3d/start-sphere/space-tunnel-bump.png",
      () => { /* loaded via manager */ },
      undefined,
      () => { /* error — continue anyway */ }
    );
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
      path,
      150,
      tunnelRadius - 0.6,
      32,
      false
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
    const introState = { shipReveal: 0, shipEntry: 0, shipBoost: 0 };
    const outroState = { shipOpacity: 1 };

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

    const playOutro = () => {
      if (hasStartedOutroRef.current) return;
      hasStartedOutroRef.current = true;

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finishIntro,
      });
      tl.to(outroState, { shipOpacity: 0, duration: 0.7 }, 0);
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.22, ease: "power1.inOut" }, 0);
    };
    playOutroRef.current = playOutro;

    const getFrameVectors = (progress: number) => {
      const normalized = THREE.MathUtils.euclideanModulo(progress, 1);
      const frameIndexFloat = normalized * frenetFrames.tangents.length;
      const frameIndex = Math.floor(frameIndexFloat) % frenetFrames.tangents.length;
      const nextFrameIndex = (frameIndex + 1) % frenetFrames.tangents.length;
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

    // ── GLTF: mark attempted whether it succeeds or fails ────────────────────
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
        // Failed — but don't block the intro
        shipModel = null;
        gltfAttempted = true;
        checkAndTriggerReady();
      }
    );

    const updateCameraPercentage = (percentage: number) => {
      const clamped = Math.min(Math.max(percentage, 0), 0.999);
      const p1 = path.getPointAt(clamped);
      const p2 = path.getPointAt(Math.min(clamped + 0.03, 0.999));
      c.position.set(p1.x, p1.y, p1.z);
      c.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    };

    // Initialise camera on path immediately so first frame looks correct
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
      onComplete: playOutro,
    });

    const startIntro = () => {
      if (
        hasStartedIntroRef.current ||
        hasStartedOutroRef.current ||
        hasCompletedIntroRef.current
      ) return;
      hasStartedIntroRef.current = true;

      gsap.set(introState, { shipReveal: 0, shipEntry: 0, shipBoost: 0 });
      introTween.play(0);

      gsap.to(introState, { shipReveal: 1, duration: 0.55, delay: 0.5, ease: "power2.out" });
      gsap.to(introState, { shipEntry: 1, duration: 1.2, delay: 0.5, ease: "power3.out" });
      gsap.to(introState, { shipBoost: 1, duration: 1.45, delay: 0.5, ease: "expo.out" });
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

    // ── loadingManager covers textures; onLoad fires when both textures done ──
    loadingManager.onLoad = () => {
      texturesReady = true;
      checkAndTriggerReady();
    };

    // Fallback: if loadingManager never fires within 3s, force-ready anyway
    const managerFallback = window.setTimeout(() => {
      if (!texturesReady) {
        texturesReady = true;
        checkAndTriggerReady();
      }
    }, 3000);

    // ── Render loop — ALWAYS renders, no gating ───────────────────────────────
    let frameId = 0;
    let isReady = false; // local mirror, avoids ref reads in hot loop

    const render = () => {
      frameId = requestAnimationFrame(render);

      // Keep checking if we've become ready this frame
      if (!isReady) {
        const ready =
          texturesReady && gltfAttempted && !hasCompletedIntroRef.current;
        if (ready) {
          isReady = true;
          gsap.set(rootRef.current, { autoAlpha: 1 });
          scheduleIntroStart();
        }
        // Still render the tunnel even while loading so there's no freeze
        composer.render();
        return;
      }

      const elapsed = clock.getElapsedTime();
      currentCameraPercentage = cameraTargetPercentage;

      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      const shipPathOffset = THREE.MathUtils.lerp(0.24, 0.045, introState.shipBoost);
      const shipProgress = Math.min(currentCameraPercentage + shipPathOffset, 0.985);
      const shipLookAhead = Math.min(shipProgress + 0.015, 0.995);
      const tunnelProgress = THREE.MathUtils.clamp(currentCameraPercentage / 0.96, 0, 1);
      const orbitPhase = elapsed * 2.4 + tunnelProgress * Math.PI * 1.75;
      const shipExitProgress = THREE.MathUtils.smoothstep(tunnelProgress, 0.91, 0.96);
      const radialDistance = tunnelRadius * 0.26 * (1 - shipExitProgress * 0.92);
      const shipScaleBase = window.innerWidth < 768 ? shipMobileScale : shipDesktopScale;
      const shipScale =
        shipScaleBase *
        THREE.MathUtils.lerp(0.18, 1, introState.shipReveal) *
        THREE.MathUtils.lerp(1.28, 0.86, tunnelProgress) *
        THREE.MathUtils.lerp(0.96, 1.04, (Math.sin(orbitPhase) + 1) / 2) *
        THREE.MathUtils.lerp(1, 0.015, shipExitProgress) *
        THREE.MathUtils.lerp(1, 0.03, 1 - outroState.shipOpacity);
      const shipOpacity =
        introState.shipReveal *
        THREE.MathUtils.lerp(1, 0.22, shipExitProgress) *
        outroState.shipOpacity;

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
      shipEntryPoint
        .copy(c.position)
        .addScaledVector(cameraForward, 10)
        .addScaledVector(shipBinormal, tunnelRadius * 3.6)
        .addScaledVector(shipNormal, -tunnelRadius * 2.2);
      shipEntryBlendPosition.copy(shipEntryPoint).lerp(shipPosition, introState.shipEntry);
      shipPosition.copy(shipEntryBlendPosition);
      shipLookDirection.copy(shipLookAheadPoint).sub(shipPosition).normalize();

      shipGroup.position.copy(shipPosition);
      shipLookTarget.copy(shipPosition).add(shipLookDirection);
      shipOrientationGroup.lookAt(shipLookTarget);
      shipOrientationGroup.rotateY(Math.PI);
      shipOrientationGroup.rotateX(
        THREE.MathUtils.degToRad(-6) + Math.sin(elapsed * 2.2) * 0.08
      );
      shipOrientationGroup.rotateZ(
        Math.cos(orbitPhase) * 0.18 + THREE.MathUtils.degToRad(6)
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
      gsap.killTweensOf(introState);
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