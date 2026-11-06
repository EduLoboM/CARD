"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI, { COLOR_PRESETS } from "@/components/card/CardUI";
import { CardColorSettings } from "@/components/card/Card3D";

export default function Home() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [frameMode, setFrameMode] = useState<"full_art" | "tcg_frame">("full_art");
  const [colors, setColors] = useState<CardColorSettings>(COLOR_PRESETS[0].colors);
  const [holoIntensity, setHoloIntensity] = useState(1.0);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <CardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        flipped={flipped}
        onToggleFlip={() => setFlipped((prev) => !prev)}
        frameMode={frameMode}
        onToggleFrameMode={() =>
          setFrameMode((prev) => (prev === "full_art" ? "tcg_frame" : "full_art"))
        }
        holoIntensity={holoIntensity}
        onChangeHoloIntensity={(val) => setHoloIntensity(val)}
        onSelectPreset={(newColors) => setColors(newColors)}
      />

      <CardSceneContainer
        autoRotate={autoRotate}
        flipped={flipped}
        holoIntensity={holoIntensity}
        frameMode={frameMode}
        colors={colors}
      />
    </main>
  );
}
