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
  QuadraticBezierCurve3,
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

// ── Props: removed isLoading/setIsLoading — they were dead weight ────────────
interface ThreeSceneProps {
  onFadeOutComplete: () => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onFadeOutComplete }) => {
  const rootRef   = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All state lives in refs — avoids stale closure bugs across frames
  const hasCompletedIntroRef  = useRef(false);
  const hasStartedOutroRef    = useRef(false);
  const hasStartedIntroRef    = useRef(false);
  const introStartScheduledRef = useRef(false); // ← ref, not let — safe in strict mode
  const isReadyRef            = useRef(false);
  const playOutroRef          = useRef<(() => void) | null>(null);
  const finishIntroRef        = useRef<(() => void) | null>(null);
  const onFadeOutCompleteRef  = useRef(onFadeOutComplete);

  // Keep callback ref fresh without re-running the main effect
  useEffect(() => { onFadeOutCompleteRef.current = onFadeOutComplete; }, [onFadeOutComplete]);

  const [showLoader, setShowLoader] = useState(true);

  // ── Safety timeout — ONLY fires if animation never starts at all ──────────
  // Does NOT call finishIntro (which would show content mid-animation).
  // Instead it forces the animation to skip straight to outro.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!hasStartedIntroRef.current && !hasCompletedIntroRef.current) {
        // Animation never started — force complete so content shows
        finishIntroRef.current?.();
      }
    }, 15000); // generous 15s — only fires on genuine failure
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!rootRef.current || !canvasRef.current) return;

    // ── Destroyed flag — prevents any callback from firing after unmount ────
    let destroyed = false;

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
    const fog = new Fog(0x03050b, 0, 100);
    scene.fog = fog;

    let cameraRotationProxyX = 3.14159;
    let cameraRotationProxyY = 0;

    const BASE_FOV  = 45;
    const ENTRY_FOV = 58;
    const camera = new THREE.PerspectiveCamera(ENTRY_FOV, ww / wh, 0.001, 200);
    camera.rotation.y = cameraRotationProxyX;
    camera.rotation.z = cameraRotationProxyY;

    const c = new Group();
    c.add(camera);
    scene.add(c);

    const renderScene = new RenderPass(scene, camera);
    const BASE_BLOOM  = 1.5;
    const ENTRY_BLOOM = 2.8;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(ww, wh),
      ENTRY_BLOOM,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;

    const composer = new EffectComposer(renderer);
    composer.setSize(ww, wh);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const tunnelRadius = 4;

    // ── Load assets individually — no LoadingManager race condition ───────────
    // We track each asset independently so one slow/failed asset
    // doesn't silently block the whole show
    let textureLoaded  = false;
    let bumpLoaded     = false;
    let gltfAttempted  = false;

    const checkReady = () => {
      if (destroyed) return;
      // Ready as soon as both textures done AND gltf attempted (pass or fail)
      if (!textureLoaded || !bumpLoaded || !gltfAttempted) return;
      if (hasStartedOutroRef.current || hasCompletedIntroRef.current) return;
      if (isReadyRef.current) return; // already triggered
      isReadyRef.current = true;
      updateCameraPercentage(0);
      gsap.set(rootRef.current, { autoAlpha: 1 });
    };

    // Individual fallback timers — if any single asset hangs, mark it done
    const textureFallback = window.setTimeout(() => {
      if (!textureLoaded) { textureLoaded = true; checkReady(); }
    }, 4000);
    const bumpFallback = window.setTimeout(() => {
      if (!bumpLoaded) { bumpLoaded = true; checkReady(); }
    }, 4000);
    const gltfFallback = window.setTimeout(() => {
      if (!gltfAttempted) { gltfAttempted = true; checkReady(); }
    }, 6000); // gltf can be larger

    const textureLoader = new TextureLoader();

    const tunnelTexture = textureLoader.load(
      "/3d/start-sphere/space-tunnel-texture.png",
      () => { textureLoaded = true; checkReady(); },
      undefined,
      () => { textureLoaded = true; checkReady(); } // error = mark done anyway
    );
    tunnelTexture.colorSpace = THREE.SRGBColorSpace;
    tunnelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tunnelTexture.wrapS = tunnelTexture.wrapT = THREE.RepeatWrapping;
    tunnelTexture.repeat.set(15, 2);

    const mapHeight = textureLoader.load(
      "/3d/start-sphere/space-tunnel-bump.png",
      () => { bumpLoaded = true; checkReady(); },
      undefined,
      () => { bumpLoaded = true; checkReady(); }
    );
    mapHeight.anisotropy = renderer.capabilities.getMaxAnisotropy();
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.repeat.set(15, 2);

    const material = new MeshPhongMaterial({
      side: THREE.BackSide,
      color: 0x8eb8ff,
      map: tunnelTexture,
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

    const innerTubeGeometry = new TubeGeometry(path, 150, tunnelRadius - 0.6, 32, false);
    const geo  = new EdgesGeometry(innerTubeGeometry);
    const mat  = new LineBasicMaterial({ linewidth: 2, opacity: 0.14, color: 0x8ea7d6, transparent: true });
    const wireframe = new LineSegments(geo, mat);
    scene.add(wireframe);

    const light = new PointLight(0xffffff, 0.35, 4, 0);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const clock = new THREE.Clock();
    clock.start();

    const frenetFrames = path.computeFrenetFrames(300, false);
    const shipGroup            = new Group();
    const shipOrientationGroup = new Group();
    const shipOffset           = new Vector3();
    const shipProgressPoint    = new Vector3();
    const shipLookAheadPoint   = new Vector3();
    const shipPosition         = new Vector3();
    const shipLookDirection    = new Vector3();
    const shipNormal           = new Vector3();
    const shipBinormal         = new Vector3();
    const shipBinormalOffset   = new Vector3();
    const cameraForward        = new Vector3();
    const cameraUp             = new Vector3();
    const shipLookTarget       = new Vector3();
    const shipMobileScale  = 0.12;
    const shipDesktopScale = 0.16;

    scene.add(shipGroup);
    shipGroup.add(shipOrientationGroup);

    const bezierArc   = new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3());
    const bezierPoint = new Vector3();

    const shipState = { reveal: 0, boost: 0, entry: 0, tilt: 0 };

    let shipModel: THREE.Object3D | null = null;

    const setShipOpacity = (opacity: number) => {
      if (!shipModel) return;
      shipModel.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.transparent = true;
          m.opacity     = opacity;
          m.depthWrite  = opacity > 0.2;
          m.needsUpdate = true;
        });
      });
    };

    // ── finishIntro — guarded, destroyed-aware ────────────────────────────────
    const finishIntro = () => {
      if (destroyed) return;
      if (hasCompletedIntroRef.current) return;
      hasCompletedIntroRef.current = true;
      onFadeOutCompleteRef.current();
    };
    finishIntroRef.current = finishIntro;

    // ── Outro ─────────────────────────────────────────────────────────────────
    const playOutro = () => {
      if (destroyed) return;
      if (hasStartedOutroRef.current) return;
      hasStartedOutroRef.current = true;

      const outroStartPercent = cameraTargetPercentage;
      const camProxy = { value: outroStartPercent };

      const tl = gsap.timeline({ onComplete: finishIntro });

      tl.to(camProxy, {
        value: Math.min(outroStartPercent + 0.18, 0.999),
        duration: 0.55,
        ease: "power3.in",
        onUpdate: () => { cameraTargetPercentage = camProxy.value; },
      }, 0);

      tl.to(camera, {
        fov: 75,
        duration: 0.55,
        ease: "power3.in",
        onUpdate: () => { camera.updateProjectionMatrix(); },
      }, 0);

      tl.to(bloomPass, {
        strength: 3.2,
        duration: 0.55,
        ease: "power3.in",
      }, 0);

      tl.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
      }, 0.25);
    };
    playOutroRef.current = playOutro;

    // ── GLTF load ─────────────────────────────────────────────────────────────
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/3d/space_ship_wg-02/space_ship.gltf",
      (gltf) => {
        if (destroyed) return;
        shipModel = gltf.scene;
        const bbox   = new THREE.Box3().setFromObject(shipModel);
        const center = bbox.getCenter(new Vector3());
        shipModel.position.sub(center);
        shipModel.rotation.x = THREE.MathUtils.degToRad(-8);
        shipModel.rotation.y = Math.PI;
        shipModel.rotation.z = THREE.MathUtils.degToRad(8);
        setShipOpacity(0);
        shipOrientationGroup.add(shipModel);
        gltfAttempted = true;
        checkReady();
      },
      undefined,
      () => {
        if (destroyed) return;
        shipModel    = null;
        gltfAttempted = true;
        checkReady();
      }
    );

    const getFrameVectors = (progress: number) => {
      const normalized      = THREE.MathUtils.euclideanModulo(progress, 1);
      const frameIndexFloat = normalized * frenetFrames.tangents.length;
      const frameIndex      = Math.floor(frameIndexFloat) % frenetFrames.tangents.length;
      const nextFrameIndex  = (frameIndex + 1) % frenetFrames.tangents.length;
      const frameAlpha      = frameIndexFloat - frameIndex;
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

    let cameraTargetPercentage  = 0;
    let currentCameraPercentage = 0;
    const tubePerc = { percent: 0 };

    const introTween = gsap.to(tubePerc, {
      percent: 0.96,
      duration: 5,
      ease: "linear",
      paused: true,
      onUpdate: () => { cameraTargetPercentage = tubePerc.percent; },
    });

    // ── startIntro ────────────────────────────────────────────────────────────
    const startIntro = () => {
      if (destroyed) return;
      if (hasStartedIntroRef.current || hasStartedOutroRef.current || hasCompletedIntroRef.current) return;
      hasStartedIntroRef.current = true;

      gsap.set(shipState, { reveal: 0, boost: 0, entry: 0, tilt: 0 });
      introTween.play(0);

      gsap.to(camera, {
        fov: BASE_FOV,
        duration: 1.8,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: () => { camera.updateProjectionMatrix(); },
      });

      gsap.to(fog,       { far: 160, duration: 2.0, delay: 0.5, ease: "power2.out" });
      gsap.to(bloomPass, { strength: BASE_BLOOM, duration: 1.6, delay: 0.5, ease: "power3.out" });

      gsap.to(shipState, { reveal: 1, duration: 0.5, delay: 0.6, ease: "power2.out" });
      gsap.to(shipState, { boost:  1, duration: 1.8, delay: 0.5, ease: "expo.out" });
      gsap.to(shipState, { entry:  1, duration: 1.5, delay: 0.5, ease: "power4.out" });
      gsap.to(shipState, {
        tilt: 1,
        duration: 0.5,
        delay: 0.5,
        ease: "power3.out",
        onComplete: () => {
          if (!destroyed) gsap.to(shipState, { tilt: 0, duration: 1.1, ease: "power2.inOut" });
        },
      });
    };

    // ── scheduleIntroStart — called once from render loop ─────────────────────
    const scheduleIntroStart = () => {
      if (introStartScheduledRef.current || hasCompletedIntroRef.current) return;
      introStartScheduledRef.current = true; // ref — safe under strict mode

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
          if (destroyed) return;
          setShowLoader(false);
          startIntro();
        },
      });
    };

    // ── Render loop ───────────────────────────────────────────────────────────
    let frameId = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);
      if (destroyed) return;

      // Always render the tunnel — visible immediately, no blank frames
      if (!isReadyRef.current) {
        composer.render();
        return;
      }

      // First frame after ready — start intro (once)
      scheduleIntroStart();

      const elapsed = clock.getElapsedTime();

      currentCameraPercentage = hasStartedOutroRef.current
        ? THREE.MathUtils.clamp(cameraTargetPercentage, 0, 0.999)
        : cameraTargetPercentage;

      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      const tunnelProgress = THREE.MathUtils.clamp(currentCameraPercentage / 0.96, 0, 1);

      // Fire outro exactly when ship exit fade begins
      if (tunnelProgress >= 0.91 && !hasStartedOutroRef.current) {
        playOutro();
      }

      const orbitPhase = elapsed * 2.4 + tunnelProgress * Math.PI * 1.75;

      const shipPathOffset  = THREE.MathUtils.lerp(0.24, 0.045, shipState.boost);
      const shipProgress    = Math.min(currentCameraPercentage + shipPathOffset, 0.985);
      const shipLookAhead   = Math.min(shipProgress + 0.015, 0.995);
      const shipExitProgress = THREE.MathUtils.smoothstep(tunnelProgress, 0.91, 0.96);
      const radialDistance  = tunnelRadius * 0.26 * (1 - shipExitProgress * 0.92);
      const shipScaleBase   = window.innerWidth < 768 ? shipMobileScale : shipDesktopScale;
      const shipOpacity     = shipState.reveal * THREE.MathUtils.lerp(1, 0, shipExitProgress);
      const shipScale =
        shipScaleBase *
        THREE.MathUtils.lerp(0.04, 1.0, shipState.boost) *
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
        .add(shipBinormalOffset.copy(shipBinormal).multiplyScalar(Math.sin(orbitPhase) * radialDistance * 0.58));

      const cruiseTarget = shipProgressPoint.clone().add(shipOffset);

      camera.getWorldDirection(cameraForward);
      cameraUp.set(0, 1, 0);
      cameraUp.addScaledVector(cameraForward, -cameraUp.dot(cameraForward)).normalize();

      const spawnPoint = new Vector3()
        .copy(c.position)
        .addScaledVector(cameraForward,  8)
        .addScaledVector(cameraUp,      -tunnelRadius * 8.0)
        .addScaledVector(shipBinormal,   tunnelRadius * 1.2);

      const midPoint = new Vector3()
        .addVectors(spawnPoint, cruiseTarget)
        .multiplyScalar(0.5)
        .addScaledVector(cameraForward, tunnelRadius * 2.5)
        .addScaledVector(cameraUp,      tunnelRadius * 1.5);

      bezierArc.v0.copy(spawnPoint);
      bezierArc.v1.copy(midPoint);
      bezierArc.v2.copy(cruiseTarget);

      if (shipState.entry < 1) {
        bezierArc.getPoint(shipState.entry, bezierPoint);
        shipPosition.copy(bezierPoint);
      } else {
        shipPosition.copy(cruiseTarget);
      }

      const driftY = Math.sin(elapsed * 0.7)  * radialDistance * 0.3;
      const driftX = Math.cos(elapsed * 0.45) * radialDistance * 0.18;
      if (shipState.entry >= 1) {
        shipPosition.addScaledVector(cameraUp,     driftY);
        shipPosition.addScaledVector(shipBinormal, driftX);
      }

      shipLookDirection.copy(shipLookAheadPoint).sub(shipPosition).normalize();
      shipGroup.position.copy(shipPosition);
      shipLookTarget.copy(shipPosition).add(shipLookDirection);
      shipOrientationGroup.lookAt(shipLookTarget);
      shipOrientationGroup.rotateY(Math.PI);
      shipOrientationGroup.rotateX(THREE.MathUtils.degToRad(-6) + Math.sin(elapsed * 2.2) * 0.08);

      const cruiseRoll = Math.cos(orbitPhase) * 0.18 + THREE.MathUtils.degToRad(6);
      const entryPitch = shipState.tilt * THREE.MathUtils.degToRad(-42);
      const entryRoll  = shipState.tilt * THREE.MathUtils.degToRad(28);
      const driftRoll  = Math.cos(elapsed * 0.45) * 0.06;

      shipOrientationGroup.rotateZ(cruiseRoll + entryRoll + driftRoll);
      shipOrientationGroup.rotateX(entryPitch);
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

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      destroyed = true;
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(textureFallback);
      window.clearTimeout(bumpFallback);
      window.clearTimeout(gltfFallback);
      playOutroRef.current  = null;
      finishIntroRef.current = null;
      introTween.kill();
      gsap.killTweensOf(shipState);
      gsap.killTweensOf(camera);
      gsap.killTweensOf(bloomPass);
      gsap.killTweensOf(fog);
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
      tunnelTexture.dispose();
      mapHeight.dispose();
      composer.dispose();
      renderer.dispose();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {showLoader && (
        <div ref={loaderRef} className="fixed inset-0 z-20 bg-black">
          <LoadingPage />
        </div>
      )}
      <div ref={rootRef} className="fixed inset-0 z-10 opacity-0">
        <canvas ref={canvasRef} className="experience absolute inset-0 h-screen w-full" />
        <div className="scrollTarget absolute top-0 z-0 w-24" />
      </div>
    </>
  );
};

export default ThreeScene;