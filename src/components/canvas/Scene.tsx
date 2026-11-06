"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Experience, { PhysicsObjectData } from "./Experience";

interface SceneProps {
  debug: boolean;
  objects: PhysicsObjectData[];
  onObjectClick?: (id: string) => void;
}

export default function Scene({ debug, objects, onObjectClick }: SceneProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        camera={{ position: [0, 11, 14], fov: 48 }}
        className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-950"
      >
        <Suspense fallback={null}>
          <Experience
            debug={debug}
            objects={objects}
            onObjectClick={onObjectClick}
          />

          <Grid
            position={[0, 0.01, 0]}
            args={[16, 16]}
            cellSize={1}
            cellThickness={0.8}
            cellColor="#334155"
            sectionSize={4}
            sectionThickness={1.5}
            sectionColor="#6366f1"
            fadeDistance={25}
            fadeStrength={1}
          />

          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2.05}
            minDistance={5}
            maxDistance={30}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
