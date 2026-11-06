"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI, { COLOR_PRESETS } from "@/components/card/CardUI";
import { CardColorSettings } from "@/components/card/Card3D";
import { HearthstoneStats } from "@/components/card/HearthstoneSVG";

const DEFAULT_STATS: HearthstoneStats = {
  cost: 5,
  attack: 7,
  health: 7,
  title: "GIRL WARRIORS",
};

export default function Home() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [frameMode, setFrameMode] = useState<"full_art" | "hearthstone">("hearthstone");
  const [colors, setColors] = useState<CardColorSettings>(COLOR_PRESETS[0].colors);
  const [holoIntensity, setHoloIntensity] = useState(1.0);
  const [stats, setStats] = useState<HearthstoneStats>(DEFAULT_STATS);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <CardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        flipped={flipped}
        onToggleFlip={() => setFlipped((prev) => !prev)}
        frameMode={frameMode}
        onToggleFrameMode={() =>
          setFrameMode((prev) => (prev === "hearthstone" ? "full_art" : "hearthstone"))
        }
        holoIntensity={holoIntensity}
        onChangeHoloIntensity={(val) => setHoloIntensity(val)}
        onSelectPreset={(newColors) => setColors(newColors)}
        stats={stats}
        onChangeStats={(newStats) => setStats(newStats)}
      />

      <CardSceneContainer
        autoRotate={autoRotate}
        flipped={flipped}
        holoIntensity={holoIntensity}
        frameMode={frameMode}
        colors={colors}
        stats={stats}
      />
    </main>
  );
}
