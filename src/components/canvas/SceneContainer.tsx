"use client";

import dynamic from "next/dynamic";
import { PhysicsObjectData } from "./Experience";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm font-medium tracking-wide">
          Inicializando Three.js + Rapier WASM...
        </p>
      </div>
    </div>
  ),
});

interface SceneContainerProps {
  debug: boolean;
  objects: PhysicsObjectData[];
  onObjectClick?: (id: string) => void;
}

export default function SceneContainer(props: SceneContainerProps) {
  return <Scene {...props} />;
}
