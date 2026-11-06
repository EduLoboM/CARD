"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI from "@/components/card/CardUI";

export default function Home() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [frameMode, setFrameMode] = useState<"full_art" | "tcg_frame">("full_art");
  const [holoIntensity, setHoloIntensity] = useState(1.0);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [bloomIntensity, setBloomIntensity] = useState(0.8);

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
        bloomEnabled={bloomEnabled}
        onToggleBloom={() => setBloomEnabled((prev) => !prev)}
        bloomIntensity={bloomIntensity}
        onChangeBloomIntensity={(val) => setBloomIntensity(val)}
      />

      <CardSceneContainer
        autoRotate={autoRotate}
        flipped={flipped}
        holoIntensity={holoIntensity}
        frameMode={frameMode}
        bloomEnabled={bloomEnabled}
        bloomIntensity={bloomIntensity}
      />
    </main>
  );
}
