"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, ArrowDown, ChevronRight, Volume2, VolumeX } from "lucide-react";

export default function LoomLoftStoryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // References for animation state
  const animStateRef = useRef({
    progress: 0,
    time: 0,
    mouseX: 0,
    mouseY: 0,
  });

  const chapters = [
    { id: "01", name: "The Thread", percent: 0 },
    { id: "02", name: "The Weave", percent: 0.2 },
    { id: "03", name: "The Fabric", percent: 0.4 },
    { id: "04", name: "The Craft", percent: 0.6 },
    { id: "05", name: "The Garment", percent: 0.8 },
    { id: "06", name: "LoomLoft", percent: 0.96 },
  ];

  const scrollToChapter = (percent: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTarget = container.offsetTop + percent * (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  const scrollToStore = () => {
    const storeEl = document.getElementById("loom-store-start");
    if (storeEl) {
      storeEl.scrollIntoView({ behavior: "smooth" });
    } else {
      if (containerRef.current) {
        window.scrollTo({
          top: containerRef.current.offsetTop + containerRef.current.offsetHeight,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPrefersReducedMotion(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // --- THREE.JS INITIALIZATION ---
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04160d, 0.038);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.9);
    scene.add(ambientLight);

    // Warm Golden Key Light
    const goldKeyLight = new THREE.SpotLight(0xf5b92e, 4.0, 50, Math.PI / 4, 0.6);
    goldKeyLight.position.set(3, 4, 6);
    scene.add(goldKeyLight);

    // Forest Emerald Rim Light
    const emeraldRimLight = new THREE.DirectionalLight(0x0d3824, 2.2);
    emeraldRimLight.position.set(-5, -2, -3);
    scene.add(emeraldRimLight);

    // Warm Ivory Fill
    const ivoryFill = new THREE.PointLight(0xfff6e5, 1.8, 30);
    ivoryFill.position.set(-2, 2, 4);
    scene.add(ivoryFill);

    // Dynamic Orbiting Specular Light
    const movingGoldLight = new THREE.PointLight(0xffd573, 2.8, 25);
    movingGoldLight.position.set(0, 0, 4);
    scene.add(movingGoldLight);

    // Materials
    const goldYarnMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5a110,
      emissive: 0x422d05,
      roughness: 0.28,
      metalness: 0.88,
    });

    const warpThreadMat = new THREE.MeshStandardMaterial({
      color: 0xdeb841,
      roughness: 0.32,
      metalness: 0.82,
      transparent: true,
      opacity: 0,
    });

    const weftThreadMat = new THREE.MeshStandardMaterial({
      color: 0x0f472d,
      roughness: 0.45,
      metalness: 0.3,
      transparent: true,
      opacity: 0,
    });

    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x072818,
      roughness: 0.38,
      metalness: 0.38,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });

    const garmentSilkMat = new THREE.MeshStandardMaterial({
      color: 0x062416,
      roughness: 0.35,
      metalness: 0.42,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });

    const goldZariTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf5b92e,
      emissive: 0x5a3b02,
      roughness: 0.22,
      metalness: 0.95,
      transparent: true,
      opacity: 0,
    });

    // -------------------------------------------------------------
    // 1. SCENE 01: THE SINGLE GOLDEN THREAD
    // -------------------------------------------------------------
    const threadPoints: THREE.Vector3[] = [];
    const threadPointCount = 20;
    for (let i = 0; i <= threadPointCount; i++) {
      const y = (i / threadPointCount) * 8 - 4;
      threadPoints.push(new THREE.Vector3(0, y, 0));
    }
    const threadCurve = new THREE.CatmullRomCurve3(threadPoints);
    const threadGeo = new THREE.TubeGeometry(threadCurve, 90, 0.048, 8, false);
    const singleThreadMesh = new THREE.Mesh(threadGeo, goldYarnMaterial);
    scene.add(singleThreadMesh);

    // -------------------------------------------------------------
    // 2. SCENE 02: THE WEAVE (WARP & WEFT GRID)
    // -------------------------------------------------------------
    const weaveGroup = new THREE.Group();
    scene.add(weaveGroup);

    const warpMeshes: THREE.Mesh[] = [];
    const weftMeshes: THREE.Mesh[] = [];
    const warpCount = 12;
    const weftCount = 12;

    // Warp (Vertical threads)
    for (let i = 0; i < warpCount; i++) {
      const x = (i / (warpCount - 1)) * 4.6 - 2.3;
      const pts = [];
      for (let j = 0; j <= 16; j++) {
        const y = (j / 16) * 6 - 3;
        // Subtle handloom wave in z
        pts.push(new THREE.Vector3(x, y, 0));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 32, 0.032, 6, false);
      const mesh = new THREE.Mesh(geo, warpThreadMat);
      weaveGroup.add(mesh);
      warpMeshes.push(mesh);
    }

    // Weft (Horizontal threads that weave over and under warp threads)
    for (let i = 0; i < weftCount; i++) {
      const y = (i / (weftCount - 1)) * 5.6 - 2.8;
      const pts = [];
      const phase = (i % 2) * Math.PI;
      for (let j = 0; j <= 24; j++) {
        const x = (j / 24) * 5.2 - 2.6;
        // Undulate over and under warp threads
        const z = Math.sin(j * 1.5 + phase) * 0.07;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 48, 0.032, 6, false);
      const mesh = new THREE.Mesh(geo, weftThreadMat);
      weaveGroup.add(mesh);
      weftMeshes.push(mesh);
    }

    // -------------------------------------------------------------
    // 3. SCENE 03 & 04: THE FABRIC PLANE (WAVING & FOLDING)
    // -------------------------------------------------------------
    const fabricSegsX = 48;
    const fabricSegsY = 56;
    const fabricWidth = 6.8;
    const fabricHeight = 8.4;
    const fabricGeo = new THREE.PlaneGeometry(fabricWidth, fabricHeight, fabricSegsX, fabricSegsY);
    const fabricMesh = new THREE.Mesh(fabricGeo, fabricMaterial);
    fabricMesh.position.set(0, 0, 0);
    scene.add(fabricMesh);

    // Gold zari border edges for fabric
    const zariBorderTop = new THREE.Mesh(
      new THREE.BoxGeometry(fabricWidth, 0.35, 0.04),
      goldZariTrimMat
    );
    zariBorderTop.position.set(0, fabricHeight / 2 - 0.18, 0.03);
    fabricMesh.add(zariBorderTop);

    const zariBorderBottom = new THREE.Mesh(
      new THREE.BoxGeometry(fabricWidth, 0.45, 0.04),
      goldZariTrimMat
    );
    zariBorderBottom.position.set(0, -fabricHeight / 2 + 0.22, 0.03);
    fabricMesh.add(zariBorderBottom);

    // Cache original fabric vertex positions for dynamic morphing
    const posAttr = fabricGeo.attributes.position;
    const originalPositions = new Float32Array(posAttr.array.length);
    for (let i = 0; i < posAttr.array.length; i++) {
      originalPositions[i] = posAttr.array[i];
    }

    // -------------------------------------------------------------
    // 4. SCENE 05: THE GARMENT (FEMALE SAREE SILHOUETTE & DRAPE)
    // -------------------------------------------------------------
    const garmentGroup = new THREE.Group();
    scene.add(garmentGroup);

    // A) Pleated Saree Skirt & Hem
    const skirtHeight = 3.6;
    const skirtGeo = new THREE.CylinderGeometry(0.75, 1.65, skirtHeight, 32, 16, true);
    // Displace vertices to form vertical accordion pleats (authentic Nivi saree pleats)
    const skirtPos = skirtGeo.attributes.position;
    for (let i = 0; i < skirtPos.count; i++) {
      const px = skirtPos.getX(i);
      const py = skirtPos.getY(i);
      const pz = skirtPos.getZ(i);
      const angle = Math.atan2(pz, px);
      const radius = Math.sqrt(px * px + pz * pz);
      // Pleat modulation in front quadrant
      const isFront = pz > -0.2;
      const pleatWave = isFront ? Math.sin(angle * 14) * 0.12 : 0;
      const modRadius = radius + pleatWave;
      skirtPos.setX(i, Math.cos(angle) * modRadius);
      skirtPos.setZ(i, Math.sin(angle) * modRadius);
    }
    skirtGeo.computeVertexNormals();
    const skirtMesh = new THREE.Mesh(skirtGeo, garmentSilkMat);
    skirtMesh.position.set(0, -1.3, 0);
    garmentGroup.add(skirtMesh);

    // Gold zari hem border for saree skirt
    const hemGeo = new THREE.TorusGeometry(1.65, 0.08, 12, 48);
    hemGeo.rotateX(Math.PI / 2);
    const hemMesh = new THREE.Mesh(hemGeo, goldZariTrimMat);
    hemMesh.position.set(0, -1.3 - skirtHeight / 2, 0);
    garmentGroup.add(hemMesh);

    // B) Contoured Waist & Fitted Bodice
    const torsoGeo = new THREE.CylinderGeometry(0.85, 0.72, 1.8, 24, 8, true);
    const torsoMesh = new THREE.Mesh(torsoGeo, garmentSilkMat);
    torsoMesh.position.set(0, 0.9, 0);
    garmentGroup.add(torsoMesh);

    // Gold waist belt / Kamarbandh line
    const waistBeltGeo = new THREE.TorusGeometry(0.74, 0.045, 12, 36);
    waistBeltGeo.rotateX(Math.PI / 2);
    const waistBeltMesh = new THREE.Mesh(waistBeltGeo, goldZariTrimMat);
    waistBeltMesh.position.set(0, 0.2, 0);
    garmentGroup.add(waistBeltMesh);

    // C) The Dramatic Sweeping Saree Pallu (Sash)
    // Curving diagonally from right waist, over left shoulder, and draping backwards into air
    const palluCurvePoints = [
      new THREE.Vector3(0.5, 0.2, 0.7),
      new THREE.Vector3(0.3, 0.7, 0.75),
      new THREE.Vector3(-0.2, 1.2, 0.65),
      new THREE.Vector3(-0.75, 1.7, 0.3),
      new THREE.Vector3(-0.85, 1.6, -0.2),
      new THREE.Vector3(-0.95, 1.0, -0.6),
      new THREE.Vector3(-1.05, 0.0, -0.9),
      new THREE.Vector3(-1.15, -1.2, -1.1),
    ];
    const palluCurve = new THREE.CatmullRomCurve3(palluCurvePoints);
    const palluGeo = new THREE.TubeGeometry(palluCurve, 64, 0.22, 10, false);
    const palluMesh = new THREE.Mesh(palluGeo, goldZariTrimMat);
    garmentGroup.add(palluMesh);

    // D) Floating Gold Zari Textile Particles
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 2.8;
      const y = (Math.random() - 0.5) * 6;
      particlePositions[i * 3] = Math.cos(theta) * r;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(theta) * r;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: 0.004 + Math.random() * 0.008,
        z: (Math.random() - 0.5) * 0.005,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf5b92e,
      size: 0.075,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // -------------------------------------------------------------
    // 5. SCENE 06: LOOMLOFT LOGO TRACE (DYNAMIC SPLINE)
    // -------------------------------------------------------------
    // A flowing thread loop that traces the LoomLoft signature emblem
    const logoTracePoints: THREE.Vector3[] = [];
    const logoPtsCount = 60;
    for (let i = 0; i <= logoPtsCount; i++) {
      const t = (i / logoPtsCount) * Math.PI * 2;
      // Elegant lemniscate (figure 8 / infinity weave loop)
      const scale = 2.2;
      const x = (scale * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
      const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
      const z = Math.sin(t * 3) * 0.35;
      logoTracePoints.push(new THREE.Vector3(x, y, z));
    }
    const logoCurve = new THREE.CatmullRomCurve3(logoTracePoints, true);
    const logoGeo = new THREE.TubeGeometry(logoCurve, 120, 0.05, 8, true);
    const logoThreadMesh = new THREE.Mesh(logoGeo, goldYarnMaterial);
    logoThreadMesh.scale.set(0.001, 0.001, 0.001);
    scene.add(logoThreadMesh);

    // Vertical exit thread pointing straight down towards the store
    const exitCurvePts = [
      new THREE.Vector3(0, 1.2, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -3.5, 0),
      new THREE.Vector3(0, -7.0, 0),
    ];
    const exitCurve = new THREE.CatmullRomCurve3(exitCurvePts);
    const exitGeo = new THREE.TubeGeometry(exitCurve, 40, 0.045, 8, false);
    const exitThreadMesh = new THREE.Mesh(exitGeo, goldYarnMaterial);
    exitThreadMesh.visible = false;
    scene.add(exitThreadMesh);

    // -------------------------------------------------------------
    // GSAP SCROLLTRIGGER MASTER TIMELINE
    // -------------------------------------------------------------
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          animStateRef.current.progress = p;
          setScrollProgress(p);

          // Update active chapter
          if (p < 0.18) setActiveChapter(0);
          else if (p < 0.38) setActiveChapter(1);
          else if (p < 0.58) setActiveChapter(2);
          else if (p < 0.74) setActiveChapter(3);
          else if (p < 0.90) setActiveChapter(4);
          else setActiveChapter(5);
        },
      },
    });

    // Dummy tween to ensure GSAP has a full duration to scrub
    masterTimeline.to(animStateRef.current, {
      duration: 1,
      ease: "none",
    });

    // -------------------------------------------------------------
    // MOUSE PARALLAX
    // -------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      animStateRef.current.mouseX = normX;
      animStateRef.current.mouseY = normY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };
    window.addEventListener("resize", handleResize);

    // -------------------------------------------------------------
    // ANIMATION & RENDER LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      animStateRef.current.time = time;
      const progress = animStateRef.current.progress;

      // Mouse Parallax subtle tilt
      const targetParallaxX = animStateRef.current.mouseX * 0.25;
      const targetParallaxY = animStateRef.current.mouseY * 0.25;

      // Dynamic light tracking
      movingGoldLight.position.x = Math.sin(time * 0.8) * 3 + targetParallaxX;
      movingGoldLight.position.y = Math.cos(time * 0.7) * 2.5 + targetParallaxY;
      movingGoldLight.position.z = 4 + Math.sin(time) * 1.5;

      // Floating textile dust particles
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        let py = posArr[i * 3 + 1];
        py += particleVelocities[i].y * (0.8 + progress * 0.5);
        if (py > 3.5) py = -3.5;
        posArr[i * 3 + 1] = py;

        // subtle spiral orbit
        const px = posArr[i * 3];
        const pz = posArr[i * 3 + 2];
        const angle = 0.005 * particleVelocities[i].speed;
        posArr[i * 3] = px * Math.cos(angle) - pz * Math.sin(angle);
        posArr[i * 3 + 2] = px * Math.sin(angle) + pz * Math.cos(angle);
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.opacity = THREE.MathUtils.lerp(0.2, 0.85, Math.sin(progress * Math.PI));

      // -------------------------------------------------------
      // SCENE STAGE INTERPOLATIONS BASED ON SCROLL PROGRESS
      // -------------------------------------------------------

      // 1. SCENE 01: THE THREAD (0.00 - 0.20)
      if (progress <= 0.22) {
        singleThreadMesh.visible = true;
        const threadAlpha = progress < 0.15 ? 1 : 1 - (progress - 0.15) / 0.07;
        goldYarnMaterial.opacity = Math.max(0, threadAlpha);
        goldYarnMaterial.transparent = true;

        // Subtle organic sine wave along the vertical thread
        const pos = threadGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          const waveX = Math.sin(y * 1.2 + time * 1.5) * 0.12 * (1 - progress * 2);
          const waveZ = Math.cos(y * 1.6 + time * 1.2) * 0.08 * (1 - progress * 2);
          pos.setX(i, waveX);
          pos.setZ(i, waveZ);
        }
        threadGeo.computeVertexNormals();
        threadGeo.attributes.position.needsUpdate = true;

        // Close-up camera
        const targetCamZ = THREE.MathUtils.lerp(4.4, 6.2, progress / 0.2);
        camera.position.set(targetParallaxX * 0.4, targetParallaxY * 0.4, targetCamZ);
        camera.lookAt(0, 0, 0);
      } else {
        singleThreadMesh.visible = false;
      }

      // 2. SCENE 02: THE WEAVE (0.16 - 0.42)
      if (progress >= 0.14 && progress <= 0.45) {
        weaveGroup.visible = true;
        const weaveIn = THREE.MathUtils.clamp((progress - 0.14) / 0.08, 0, 1);
        const weaveOut = THREE.MathUtils.clamp(1 - (progress - 0.36) / 0.08, 0, 1);
        const weaveOpacity = Math.min(weaveIn, weaveOut);

        warpThreadMat.opacity = weaveOpacity;
        weftThreadMat.opacity = weaveOpacity;

        // Threads branch outward from center during 0.14 -> 0.26
        const spreadProgress = THREE.MathUtils.clamp((progress - 0.14) / 0.12, 0, 1);
        warpMeshes.forEach((mesh, idx) => {
          const targetX = (idx / (warpCount - 1)) * 4.6 - 2.3;
          mesh.position.x = THREE.MathUtils.lerp(0, targetX, spreadProgress);
        });

        weftMeshes.forEach((mesh, idx) => {
          const targetY = (idx / (weftCount - 1)) * 5.6 - 2.8;
          mesh.position.y = THREE.MathUtils.lerp(0, targetY, spreadProgress);
          // shuttle weaving motion
          mesh.position.x = Math.sin(time * 2 + idx) * 0.08;
        });

        // Camera pulls back to overhead angle
        const camT = THREE.MathUtils.clamp((progress - 0.18) / 0.2, 0, 1);
        const camY = THREE.MathUtils.lerp(0, 1.2, camT);
        const camZ = THREE.MathUtils.lerp(6.2, 7.8, camT);
        camera.position.set(targetParallaxX, camY + targetParallaxY, camZ);
        camera.lookAt(0, 0, 0);
      } else {
        weaveGroup.visible = false;
      }

      // 3. SCENE 03 & 04: THE FABRIC & FOLDING (0.35 - 0.78)
      if (progress >= 0.34 && progress <= 0.80) {
        fabricMesh.visible = true;
        const fabricIn = THREE.MathUtils.clamp((progress - 0.34) / 0.08, 0, 1);
        const fabricOut = THREE.MathUtils.clamp(1 - (progress - 0.72) / 0.07, 0, 1);
        const fabricOpacity = Math.min(fabricIn, fabricOut);

        fabricMaterial.opacity = fabricOpacity;
        goldZariTrimMat.opacity = fabricOpacity;

        // Wave animation & accordion pleating fold
        const foldProgress = THREE.MathUtils.clamp((progress - 0.54) / 0.18, 0, 1);
        const fPos = fabricGeo.attributes.position;

        for (let i = 0; i < fPos.count; i++) {
          const origX = originalPositions[i * 3];
          const origY = originalPositions[i * 3 + 1];
          const origZ = originalPositions[i * 3 + 2];

          // Silk ripple displacement
          const waveZ =
            Math.sin(origX * 1.5 + time * 1.5) *
            Math.cos(origY * 1.3 + time * 1.2) *
            0.32 *
            (1 - foldProgress * 0.5);

          // Accordion pleats folding inwards as foldProgress increases
          const foldModX = origX * (1 - foldProgress * 0.68) + Math.sin(origX * 14) * foldProgress * 0.18;
          const foldModZ = origZ + waveZ + Math.cos(origX * 14) * foldProgress * 0.28;

          fPos.setX(i, foldModX);
          fPos.setZ(i, foldModZ);
        }
        fabricGeo.computeVertexNormals();
        fabricGeo.attributes.position.needsUpdate = true;

        // Camera perspective on fabric
        const camProgress = THREE.MathUtils.clamp((progress - 0.36) / 0.22, 0, 1);
        const camX = THREE.MathUtils.lerp(0, 2.2, camProgress);
        const camY = THREE.MathUtils.lerp(1.2, -0.4, camProgress);
        const camZ = THREE.MathUtils.lerp(7.8, 6.2, camProgress);
        camera.position.set(camX + targetParallaxX, camY + targetParallaxY, camZ);
        camera.lookAt(0, -0.3, 0);
      } else {
        fabricMesh.visible = false;
      }

      // 4. SCENE 05: THE GARMENT (FEMALE SAREE SILHOUETTE) (0.68 - 0.94)
      if (progress >= 0.66 && progress <= 0.94) {
        garmentGroup.visible = true;
        const gIn = THREE.MathUtils.clamp((progress - 0.66) / 0.08, 0, 1);
        const gOut = THREE.MathUtils.clamp(1 - (progress - 0.88) / 0.06, 0, 1);
        const gOpacity = Math.min(gIn, gOut);

        garmentSilkMat.opacity = gOpacity;
        goldZariTrimMat.opacity = gOpacity;

        // Rotation & Gentle Orbit
        const rotBase = (progress - 0.66) * 4.5 + time * 0.15;
        garmentGroup.rotation.y = rotBase;

        // Camera orbiting around the silhouette
        const orbitAngle = rotBase * 0.6;
        const camRadius = THREE.MathUtils.lerp(6.0, 5.2, (progress - 0.66) / 0.2);
        camera.position.x = Math.sin(orbitAngle) * 1.8 + targetParallaxX;
        camera.position.y = 0.2 + targetParallaxY;
        camera.position.z = camRadius;
        camera.lookAt(0, -0.2, 0);
      } else {
        garmentGroup.visible = false;
      }

      // 5. SCENE 06: LOOMLOFT REVEAL & LOGO TRACE (0.86 - 1.00)
      if (progress >= 0.85) {
        logoThreadMesh.visible = true;
        const logoT = THREE.MathUtils.clamp((progress - 0.85) / 0.12, 0, 1);
        const scaleVal = THREE.MathUtils.lerp(0.001, 1.25, logoT);
        logoThreadMesh.scale.set(scaleVal, scaleVal, scaleVal);
        logoThreadMesh.rotation.z = time * 0.25;
        goldYarnMaterial.opacity = THREE.MathUtils.clamp((progress - 0.85) / 0.05, 0, 1);

        // Camera pull out wide
        const wideZ = THREE.MathUtils.lerp(5.2, 9.2, logoT);
        camera.position.set(targetParallaxX * 0.5, targetParallaxY * 0.5, wideZ);
        camera.lookAt(0, 0, 0);

        if (progress >= 0.96) {
          exitThreadMesh.visible = true;
        } else {
          exitThreadMesh.visible = false;
        }
      } else {
        logoThreadMesh.visible = false;
        exitThreadMesh.visible = false;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (masterTimeline.scrollTrigger) {
        masterTimeline.scrollTrigger.kill();
      }
      masterTimeline.kill();

      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Slide visibility determination based on scrollProgress
  const isSlideActive = (start: number, end: number) => {
    return scrollProgress >= start && scrollProgress <= end;
  };

  return (
    <div
      ref={containerRef}
      id="loom-story-track"
      className="relative w-full bg-[#04140c] text-white selection:bg-[#072618] selection:text-[#f5b92e]"
      style={{ height: "600vh" }}
    >
      {/* Pinned Sticky 3D Experience Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#020d07] via-[#04160d] to-[#020b06]"
      >
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-10 touch-none pointer-events-none"
        />

        {/* Ambient Subtle Emerald & Gold Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0d3824]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#f5b92e]/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* TOP BRAND BAR */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-auto">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f5b92e] animate-pulse shadow-[0_0_8px_#f5b92e]" />
            <span className="font-serif tracking-[0.3em] text-xs uppercase text-[#f5b92e]/90 font-semibold">
              The LoomLoft Story
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={scrollToStore}
              className="btn-loom px-5 py-2.5 rounded-full bg-[#072618]/80 hover:bg-[#0d3824] border border-[#e5a110]/40 text-[#f5b92e] font-serif text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center space-x-2 group"
            >
              <span>Skip to Collection</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#f5b92e] group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT EDITORIAL CHAPTER NAVIGATOR */}
        <div className="hidden lg:flex flex-col items-end space-y-4 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
          <div className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#e5a110]/60 mb-2">
            Timeline
          </div>
          {chapters.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.percent)}
                className="group flex items-center space-x-3 text-right transition-all cursor-pointer"
              >
                <span
                  className={`text-xs font-serif tracking-[0.2em] transition-colors ${
                    isActive
                      ? "text-[#f5b92e] font-semibold"
                      : "text-stone-500 group-hover:text-stone-300"
                  }`}
                >
                  {ch.name}
                </span>
                <span
                  className={`h-[1.5px] transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-[#f5b92e] shadow-[0_0_6px_#f5b92e]"
                      : "w-3 bg-stone-700 group-hover:w-5 group-hover:bg-stone-500"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* STORY OVERLAYS (SYNCHRONIZED BY SCROLL) */}

        {/* SCENE 01: THE THREAD (0% - 18%) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-between p-8 sm:p-16 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0, 0.17)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="text-center mt-16 max-w-xl">
            <span className="text-[11px] font-serif uppercase tracking-[0.35em] text-[#f5b92e] block mb-3 drop-shadow">
              Scene 01 — The Genesis
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.14em] text-white leading-tight uppercase">
              Everything begins with a{" "}
              <span className="font-normal italic text-[#f5b92e] drop-shadow-[0_0_15px_rgba(245,185,46,0.3)]">
                thread.
              </span>
            </h1>
          </div>

          <div className="mb-8 flex flex-col items-center space-y-3">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-[#deb841]/80">
              Scroll to discover the story
            </p>
            <div className="w-5 h-8 rounded-full border border-[#f5b92e]/40 flex items-start justify-center p-1">
              <span className="w-1 h-2 bg-[#f5b92e] rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* SCENE 02: THE WEAVE (18% - 37%) */}
        <div
          className={`absolute inset-0 flex flex-col items-start justify-center p-8 sm:p-20 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0.18, 0.36)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="max-w-xl text-left bg-gradient-to-r from-[#04160d]/80 via-[#04160d]/40 to-transparent p-6 sm:p-10 rounded-3xl backdrop-blur-sm border-l-2 border-[#f5b92e]/60">
            <span className="text-[11px] font-serif uppercase tracking-[0.35em] text-[#f5b92e] block mb-3">
              Scene 02 — The Sacred Weave
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.12em] text-white leading-tight uppercase">
              Threads become{" "}
              <span className="italic font-normal text-[#f5b92e]">patterns.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base font-sans text-stone-300 leading-relaxed max-w-md">
              Warp and weft interlock in sacred rhythm. A single filament multiplies across traditional wooden pit-looms, guided by generations of master artisan hands.
            </p>
            <div className="mt-6 flex items-center space-x-3 text-xs font-serif uppercase tracking-widest text-[#f5b92e]/90">
              <span>Authentic Handloom Geometry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5b92e]" />
              <span>Organic Imperfections</span>
            </div>
          </div>
        </div>

        {/* SCENE 03: THE FABRIC (38% - 56%) */}
        <div
          className={`absolute inset-0 flex flex-col items-end justify-center p-8 sm:p-20 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0.38, 0.54)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="max-w-xl text-right bg-gradient-to-l from-[#04160d]/90 via-[#04160d]/50 to-transparent p-6 sm:p-10 rounded-3xl backdrop-blur-sm border-r-2 border-[#f5b92e]/60">
            <span className="text-[11px] font-serif uppercase tracking-[0.35em] text-[#f5b92e] block mb-3">
              Scene 03 — Liquid Silk
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.12em] text-white leading-tight uppercase">
              Crafted by hand.
              <br />
              <span className="italic font-normal text-[#f5b92e]">
                Designed for today.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base font-sans text-stone-300 leading-relaxed max-w-md ml-auto">
              The woven lattice dissolves into a continuous piece of pure Mulberry silk. Lustrous, undulating with weightless grace, framed in 24k gold zari borders.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3 text-xs font-serif uppercase tracking-widest text-[#f5b92e]/90">
              <span>Mulberry Silk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5b92e]" />
              <span>Zari Brocade Sheen</span>
            </div>
          </div>
        </div>

        {/* SCENE 04: THE TRANSFORMATION (56% - 73%) */}
        <div
          className={`absolute inset-0 flex flex-col items-start justify-center p-8 sm:p-20 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0.56, 0.72)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="max-w-xl text-left bg-gradient-to-r from-[#04160d]/80 via-[#04160d]/40 to-transparent p-6 sm:p-10 rounded-3xl backdrop-blur-sm border-l-2 border-[#f5b92e]/60">
            <span className="text-[11px] font-serif uppercase tracking-[0.35em] text-[#f5b92e] block mb-3">
              Scene 04 — The Metamorphosis
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.12em] text-white leading-tight uppercase">
              From fabric
              <br />
              <span className="italic font-normal text-[#f5b92e]">
                to something you wear.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base font-sans text-stone-300 leading-relaxed max-w-md">
              Watch the cloth fold into royal saree pleats. Century-old drape architecture gathered to celebrate feminine elegance, freedom, and timeless beauty.
            </p>
            <div className="mt-6 inline-flex items-center space-x-2 text-xs font-serif uppercase tracking-[0.25em] text-[#f5b92e]">
              <span>Fabric</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Fold</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Shape</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Garment</span>
            </div>
          </div>
        </div>

        {/* SCENE 05: THE GARMENT (74% - 88%) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-between p-8 sm:p-16 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0.74, 0.88)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="text-center mt-14 max-w-2xl">
            <span className="text-[11px] font-serif uppercase tracking-[0.35em] text-[#f5b92e] block mb-3">
              Scene 05 — The Heirloom Attire
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.12em] text-white leading-tight uppercase">
              The Art of the{" "}
              <span className="italic font-normal text-[#f5b92e]">Drape.</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-sans text-stone-300 tracking-wider">
              Handwoven Banarasi &amp; Kanjivaram Sarees • Mulberry Pure Silk Nighties • Artisan Loungewear
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-4 items-center justify-center pointer-events-auto">
            <button
              onClick={scrollToStore}
              className="btn-loom px-8 py-4 bg-[#f5b92e] hover:bg-[#ffe082] text-[#04160d] font-serif text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(245,185,46,0.4)] flex items-center space-x-3 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <Link
              href="/about"
              className="btn-loom px-8 py-4 bg-[#072618]/90 hover:bg-[#0d3824] border border-[#e5a110]/50 text-[#f5b92e] font-serif text-xs uppercase tracking-[0.25em] font-semibold rounded-xl transition-all shadow-lg flex items-center space-x-2"
            >
              <span>Discover the Craft</span>
            </Link>
          </div>
        </div>

        {/* SCENE 06: LOOMLOFT REVEAL (89% - 100%) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-16 z-20 pointer-events-none transition-all duration-700 ${
            isSlideActive(0.89, 1.0)
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <div className="text-center max-w-2xl flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#f5b92e]/60 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,185,46,0.3)] bg-[#072618]/60">
              <Sparkles className="w-5 h-5 text-[#f5b92e]" />
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.22em] text-white leading-none uppercase">
              LOOM <span className="text-[#f5b92e] font-normal">LOFT</span>
            </h2>

            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#f5b92e] to-transparent my-6" />

            <p className="font-serif text-xs sm:text-sm uppercase tracking-[0.35em] text-[#deb841]">
              Quality in Every Thread
            </p>

            <p className="mt-4 text-xs font-sans text-stone-400 max-w-sm tracking-wide">
              Direct from the master handloom clusters of India to your wardrobe.
            </p>

            <button
              onClick={scrollToStore}
              className="mt-8 pointer-events-auto btn-loom px-8 py-3.5 rounded-full bg-[#072618]/90 hover:bg-[#0d3824] border border-[#f5b92e]/50 text-[#f5b92e] font-serif text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-2 group"
            >
              <span>Enter Store</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Golden Guide Thread Continuing Downwards */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-[1.5px] h-16 bg-gradient-to-b from-[#f5b92e] to-[#f5b92e]/30 shadow-[0_0_8px_#f5b92e]" />
          </div>
        </div>

        {/* BOTTOM PROGRESS INDICATOR BAR */}
        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between z-30 pointer-events-none">
          <div className="flex items-center space-x-3 text-[11px] font-serif tracking-[0.2em] uppercase text-stone-400">
            <span className="text-[#f5b92e] font-semibold">
              {chapters[activeChapter].id}
            </span>
            <span className="text-stone-600">/</span>
            <span>06</span>
            <span className="hidden sm:inline text-stone-500">— {chapters[activeChapter].name}</span>
          </div>

          <div className="w-36 sm:w-64 h-[2px] bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#e5a110] to-[#f5b92e] transition-all duration-150 ease-out shadow-[0_0_8px_#f5b92e]"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          <div className="text-[11px] font-serif tracking-[0.2em] text-[#f5b92e]/90">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
