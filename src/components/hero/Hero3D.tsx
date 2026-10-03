"use client";

import LoomLoftStoryHero from "./LoomLoftStoryHero";

interface Hero3DProps {
  onAnimationComplete?: (completed: boolean) => void;
}

export default function Hero3D({ onAnimationComplete }: Hero3DProps = {}) {
  return <LoomLoftStoryHero onAnimationComplete={onAnimationComplete} />;
}
