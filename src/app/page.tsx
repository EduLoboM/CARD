"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI, { COLOR_PRESETS } from "@/components/card/CardUI";
import { CardColorSettings, CardFrameMode } from "@/components/card/Card3D";
import { CardStats } from "@/components/card/CardHUD";

const DEFAULT_STATS: CardStats = {
  cost: 5,
  attack: 13, // O 13 original embutido na borda
  health: 7,
  title: "GIRL WARRIORS",
};

export default function Home() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [frameMode, setFrameMode] = useState<CardFrameMode>("original");
  const [colors, setColors] = useState<CardColorSettings>(COLOR_PRESETS[0].colors);
  const [holoIntensity, setHoloIntensity] = useState(1.0);
  const [parallaxStrength, setParallaxStrength] = useState(1.2);
  const [stats, setStats] = useState<CardStats>(DEFAULT_STATS);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <CardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        flipped={flipped}
        onToggleFlip={() => setFlipped((prev) => !prev)}
        frameMode={frameMode}
        onChangeFrameMode={(mode) => setFrameMode(mode)}
        holoIntensity={holoIntensity}
        onChangeHoloIntensity={(val) => setHoloIntensity(val)}
        parallaxStrength={parallaxStrength}
        onChangeParallaxStrength={(val) => setParallaxStrength(val)}
        onSelectPreset={(newColors) => setColors(newColors)}
        stats={stats}
        onChangeStats={(newStats) => setStats(newStats)}
      />

      <CardSceneContainer
        autoRotate={autoRotate}
        flipped={flipped}
        holoIntensity={holoIntensity}
        parallaxStrength={parallaxStrength}
        frameMode={frameMode}
        colors={colors}
        stats={stats}
      />
    </main>
  );
}
