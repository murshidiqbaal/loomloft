"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Compass } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cms } = useStore();
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPrefersReducedMotion(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      // Brand deep forest green fog for immense atmosphere
      scene.fog = new THREE.FogExp2(0x072618, 0.04);

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 0, 14);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xfffaed, 0.8);
      scene.add(ambientLight);

      const goldPointLight = new THREE.PointLight(0xf5b92e, 2.5, 40);
      goldPointLight.position.set(4, 5, 8);
      scene.add(goldPointLight);

      const emeraldBackLight = new THREE.DirectionalLight(0x0d3824, 1.8);
      emeraldBackLight.position.set(-6, -4, -4);
      scene.add(emeraldBackLight);

      // 1. The Golden Thread (Continuous Spline Curve)
      const isMobile = width < 768;
      const curvePoints = [];
      const pointCount = isMobile ? 12 : 24;
      for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 4;
        curvePoints.push(
          new THREE.Vector3(
            (i - pointCount / 2) * 1.2,
            Math.sin(t * 0.8) * 2.2 + Math.cos(t * 0.4) * 0.8,
            Math.sin(t * 1.2) * 2.5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeometry = new THREE.TubeGeometry(
        curve,
        isMobile ? 64 : 128,
        0.05,
        isMobile ? 6 : 8,
        false
      );
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xe5a110,
        emissive: 0x946506,
        roughness: 0.25,
        metalness: 0.9,
      });
      const threadMesh = new THREE.Mesh(tubeGeometry, goldMaterial);
      scene.add(threadMesh);

      // 2. Flowing Fabric Plane (Simulating Liquid Silk)
      const fabricSegs = isMobile ? 24 : 48;
      const fabricGeo = new THREE.PlaneGeometry(24, 16, fabricSegs, fabricSegs);
      const fabricMat = new THREE.MeshStandardMaterial({
        color: 0x0a2f1e,
        roughness: 0.4,
        metalness: 0.35,
        side: THREE.DoubleSide,
        wireframe: false,
      });
      const fabricMesh = new THREE.Mesh(fabricGeo, fabricMat);
      fabricMesh.rotation.x = -Math.PI / 3.5;
      fabricMesh.position.set(0, -3, -2);
      scene.add(fabricMesh);

      // Store original vertices for fabric wave
      const posAttr = fabricGeo.attributes.position;
      const originalPositions = new Float32Array(posAttr.array.length);
      for (let i = 0; i < posAttr.array.length; i++) {
        originalPositions[i] = posAttr.array[i];
      }

      // 3. Golden Zari Particles (Floating Stardust / Micro-threads)
      const particleCount = isMobile ? 70 : 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 25;
        particlePositions[i + 1] = (Math.random() - 0.5) * 16;
        particlePositions[i + 2] = (Math.random() - 0.5) * 16;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xf5b92e,
        size: isMobile ? 0.08 : 0.12,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse Parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      // Resize Listener
      const handleResize = () => {
        if (!camera || !renderer) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Parallax easing
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        if (camera) {
          camera.position.x = targetX * 1.5;
          camera.position.y = -targetY * 1.2;
          camera.lookAt(0, 0, 0);
        }

        // Animate thread rotation
        if (threadMesh) {
          threadMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.15;
          threadMesh.rotation.y = elapsedTime * 0.12;
        }

        // Animate fabric silk wave
        if (fabricGeo) {
          const positions = fabricGeo.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            const u = originalPositions[i * 3];
            const v = originalPositions[i * 3 + 1];
            // Dual sinusoidal silk wave
            const wave =
              Math.sin(u * 0.6 + elapsedTime * 1.2) * 0.45 +
              Math.cos(v * 0.8 + elapsedTime * 0.9) * 0.35;
            positions.setZ(i, wave);
          }
          positions.needsUpdate = true;
        }

        // Rotate particles
        if (particleSystem) {
          particleSystem.rotation.y = elapsedTime * 0.04;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        if (renderer) renderer.dispose();
      };
    } catch {
      setWebGLSupported(false);
    }
  }, [prefersReducedMotion]);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center bg-[#072618] overflow-hidden">
      {/* 3D WebGL Canvas */}
      {webGLSupported && !prefersReducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
      ) : (
        /* Graceful Static Visual Fallback */
        <div className="absolute inset-0 bg-gradient-to-b from-[#072618] via-[#0a2f1e] to-[#04160d] opacity-90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e5a110]/10 via-transparent to-transparent" />
        </div>
      )}

      {/* Atmospheric Vignette & Textures */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04160d] via-transparent to-[#072618]/80 pointer-events-none z-15" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5a110_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16 flex flex-col items-center">
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0d3824]/90 border border-[#e5a110]/40 backdrop-blur-md text-[#f5b92e] text-[11px] font-serif uppercase tracking-[0.25em] mb-6 shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
          <span>India&apos;s Sovereign Handloom Heritage</span>
        </motion.div>

        {/* Brand Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[0.14em] text-white leading-[1.15] max-w-4xl drop-shadow-2xl"
        >
          {cms.hero.headline.split(".")[0]}.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a110] via-[#f5b92e] to-[#e5a110]">
            {cms.hero.headline.split(".")[1] || "THREAD BY THREAD."}
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-6 text-sm sm:text-lg text-stone-300 font-sans max-w-2xl leading-relaxed tracking-wide"
        >
          {cms.hero.subheadline}
        </motion.p>

        {/* Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <Link
            href="/collections"
            className="w-full sm:w-auto px-8 py-4 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-[0.22em] rounded-xl transition-all shadow-2xl flex items-center justify-center space-x-2 group hover:scale-105 active:scale-95"
          >
            <span>{cms.hero.primaryCta}</span>
            <Compass className="w-4 h-4 text-[#04160d] group-hover:rotate-45 transition-transform" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-4 bg-[#0d3824]/80 hover:bg-[#12432c] border border-[#e5a110]/50 text-[#FAF7F2] text-xs font-serif font-semibold uppercase tracking-[0.2em] rounded-xl transition-all backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <span>{cms.hero.secondaryCta}</span>
          </Link>
        </motion.div>

        {/* Subtle Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 sm:mt-20 flex flex-col items-center cursor-pointer group"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.9,
              behavior: "smooth"
            });
          }}
        >
          <span className="font-serif text-[10px] tracking-[0.3em] uppercase text-[#e5a110] group-hover:text-[#f5b92e] transition-colors mb-2">
            {cms.hero.scrollIndicator}
          </span>
          <div className="relative w-5 h-9 rounded-full border border-[#e5a110]/40 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#f5b92e]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
