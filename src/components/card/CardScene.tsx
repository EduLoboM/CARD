"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import Card3D from "./Card3D";
import {
  CardColorSettings,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
  CardFrameMode,
  CardStats,
} from "@/types/card";

export interface CardSceneProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  parallaxStrength: number;
  frontFrameStyle?: FrontFrameStyle;
  backFrameStyle?: BackFrameStyle;
  holoEffect?: HoloEffectType;
  frameMode?: CardFrameMode;
  colors: CardColorSettings;
  stats: CardStats;
}

export default function CardScene({
  autoRotate,
  flipped,
  holoIntensity,
  parallaxStrength,
  frontFrameStyle = "simpsons",
  backFrameStyle = "simpsons",
  holoEffect = "stars",
  frameMode,
  colors,
  stats,
}: CardSceneProps) {
  const activeFrontStyle: FrontFrameStyle = frameMode || frontFrameStyle;

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 24], fov: 42 }}
        className="h-full w-full bg-radial from-slate-900 via-slate-950 to-black"
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 12, 16]} intensity={1.5} />
          <directionalLight position={[-6, -12, -16]} intensity={0.8} />
          <pointLight position={[0, 0, 14]} intensity={1.0} color="#38bdf8" />
          <pointLight position={[0, 0, -14]} intensity={1.0} color="#c084fc" />

          <Float
            speed={autoRotate ? 0 : 2}
            rotationIntensity={autoRotate ? 0 : 0.25}
            floatIntensity={autoRotate ? 0 : 0.35}
          >
            <Card3D
              autoRotate={autoRotate}
              flipped={flipped}
              holoIntensity={holoIntensity}
              parallaxStrength={parallaxStrength}
              frontFrameStyle={activeFrontStyle}
              backFrameStyle={backFrameStyle}
              holoEffect={holoEffect}
              colors={colors}
              stats={stats}
            />
          </Float>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={45}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
