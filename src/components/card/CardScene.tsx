"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Card3D from "./Card3D";

interface CardSceneProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  frameMode: "full_art" | "tcg_frame";
  bloomEnabled: boolean;
  bloomIntensity: number;
}

export default function CardScene({
  autoRotate,
  flipped,
  holoIntensity,
  frameMode,
  bloomEnabled,
  bloomIntensity,
}: CardSceneProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 24], fov: 42 }}
        className="h-full w-full bg-radial from-slate-900 via-slate-950 to-black"
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[6, 12, 16]} intensity={1.5} />
          <directionalLight position={[-6, -12, -16]} intensity={0.8} />
          <pointLight position={[0, 0, 14]} intensity={1.0} color="#38bdf8" />
          <pointLight position={[0, 0, -14]} intensity={0.8} color="#facc15" />

          <Float
            speed={autoRotate ? 0 : 2}
            rotationIntensity={autoRotate ? 0 : 0.25}
            floatIntensity={autoRotate ? 0 : 0.35}
          >
            <Card3D
              autoRotate={autoRotate}
              flipped={flipped}
              holoIntensity={holoIntensity}
              frameMode={frameMode}
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
                luminanceThreshold={0.2}
                luminanceSmoothing={0.85}
                intensity={bloomIntensity}
                radius={0.7}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
