"use client";

import { useState } from "react";
import CardSceneContainer from "@/components/card/CardSceneContainer";
import CardUI from "@/components/card/CardUI";
import {
  CardColorSettings,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
  CardStats,
} from "@/types/card";
import { COLOR_PRESETS, DEFAULT_STATS } from "@/constants/card.constants";

export default function Home() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [frontFrameStyle, setFrontFrameStyle] = useState<FrontFrameStyle>("simpsons");
  const [backFrameStyle, setBackFrameStyle] = useState<BackFrameStyle>("simpsons");
  const [holoEffect, setHoloEffect] = useState<HoloEffectType>("stars");
  const [colors, setColors] = useState<CardColorSettings>(COLOR_PRESETS[0].colors);
  const [holoIntensity, setHoloIntensity] = useState(1.0);
  const [parallaxStrength, setParallaxStrength] = useState(1.2);
  const [stats, setStats] = useState<CardStats>(DEFAULT_STATS);

  // As alterações de borda alteram a frente e o verso simultaneamente
  const handleFrontFrameStyleChange = (style: FrontFrameStyle) => {
    setFrontFrameStyle(style);
    const matchingBack: BackFrameStyle =
      style === "full_art" ? "minimal" : (style as BackFrameStyle);
    setBackFrameStyle(matchingBack);
  };

  const handleBackFrameStyleChange = (style: BackFrameStyle) => {
    setBackFrameStyle(style);
    const matchingFront: FrontFrameStyle =
      style === "original" ? "classic" : (style as FrontFrameStyle);
    setFrontFrameStyle(matchingFront);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <CardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        flipped={flipped}
        onToggleFlip={() => setFlipped((prev) => !prev)}
        frontFrameStyle={frontFrameStyle}
        onChangeFrontFrameStyle={handleFrontFrameStyleChange}
        backFrameStyle={backFrameStyle}
        onChangeBackFrameStyle={handleBackFrameStyleChange}
        holoEffect={holoEffect}
        onChangeHoloEffect={(effect) => setHoloEffect(effect)}
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
        frontFrameStyle={frontFrameStyle}
        backFrameStyle={backFrameStyle}
        holoEffect={holoEffect}
        colors={colors}
        stats={stats}
      />
    </main>
  );
}
