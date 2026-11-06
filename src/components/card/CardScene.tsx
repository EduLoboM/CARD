"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Card3D, { CardColorSettings } from "./Card3D";

interface CardSceneProps {
  colors: CardColorSettings;
  backMode: "holographic" | "example_png";
  autoRotate: boolean;
  flipped: boolean;
  bloomEnabled: boolean;
  bloomIntensity: number;
}

export default function CardScene({
  colors,
  backMode,
  autoRotate,
  flipped,
  bloomEnabled,
  bloomIntensity,
}: CardSceneProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 42 }}
        className="h-full w-full bg-radial from-slate-900 via-slate-950 to-black"
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 10, 15]} intensity={1.2} />
          <directionalLight position={[-5, -10, -15]} intensity={0.6} />
          <pointLight position={[0, 0, 12]} intensity={0.8} color="#c084fc" />

          <Float
            speed={autoRotate ? 0 : 2}
            rotationIntensity={autoRotate ? 0 : 0.3}
            floatIntensity={autoRotate ? 0 : 0.4}
          >
            <Card3D
              colors={colors}
              backMode={backMode}
              autoRotate={autoRotate}
              flipped={flipped}
            />
          </Float>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={45}
            rotateSpeed={0.8}
          />

          {bloomEnabled && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.15}
                luminanceSmoothing={0.85}
                intensity={bloomIntensity}
                radius={0.8}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
