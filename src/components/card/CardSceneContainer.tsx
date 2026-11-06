"use client";

import dynamic from "next/dynamic";
import { CardColorSettings } from "./Card3D";

const CardScene = dynamic(() => import("./CardScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black text-slate-300">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        <p className="text-sm font-medium tracking-wide">
          Carregando carta 3D...
        </p>
      </div>
    </div>
  ),
});

interface CardSceneContainerProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  frameMode: "full_art" | "tcg_frame";
  colors: CardColorSettings;
}

export default function CardSceneContainer(props: CardSceneContainerProps) {
  return <CardScene {...props} />;
}
