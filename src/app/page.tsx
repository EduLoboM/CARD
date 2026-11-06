"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI, { COLOR_PRESETS } from "@/components/card/CardUI";
import { CardColorSettings } from "@/components/card/Card3D";

export default function Home() {
  const [colors, setColors] = useState<CardColorSettings>(COLOR_PRESETS[0].colors);
  const [backMode, setBackMode] = useState<"holographic" | "example_png">("holographic");
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [bloomIntensity, setBloomIntensity] = useState(1.0);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <CardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        flipped={flipped}
        onToggleFlip={() => setFlipped((prev) => !prev)}
        backMode={backMode}
        onToggleBackMode={() =>
          setBackMode((prev) => (prev === "holographic" ? "example_png" : "holographic"))
        }
        colors={colors}
        onSelectPreset={(newColors) => setColors(newColors)}
        bloomEnabled={bloomEnabled}
        onToggleBloom={() => setBloomEnabled((prev) => !prev)}
        bloomIntensity={bloomIntensity}
        onChangeBloomIntensity={(val) => setBloomIntensity(val)}
      />

      <CardSceneContainer
        colors={colors}
        backMode={backMode}
        autoRotate={autoRotate}
        flipped={flipped}
        bloomEnabled={bloomEnabled}
        bloomIntensity={bloomIntensity}
      />
    </main>
  );
}
