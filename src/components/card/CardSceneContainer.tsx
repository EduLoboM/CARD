"use client";

import dynamic from "next/dynamic";
import { CardColorSettings, CardFrameMode } from "./Card3D";
import { CardStats } from "./CardHUD";

const CardScene = dynamic(() => import("./CardScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black text-slate-300">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="text-sm font-medium tracking-wide">
          Carregando Carta 3D Holográfica...
        </p>
      </div>
    </div>
  ),
});

interface CardSceneContainerProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  parallaxStrength: number;
  frameMode: CardFrameMode;
  colors: CardColorSettings;
  stats: CardStats;
}

export default function CardSceneContainer(props: CardSceneContainerProps) {
  return <CardScene {...props} />;
}
