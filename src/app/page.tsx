"use client";

import { useState } from "react";
import SceneContainer from "@/components/canvas/SceneContainer";
import UIOverlay from "@/components/dom/UIOverlay";
import { PhysicsObjectData } from "@/components/canvas/Experience";

const PALETTE = [
  "#38bdf8", // Sky blue
  "#818cf8", // Indigo
  "#c084fc", // Purple
  "#f472b6", // Pink
  "#fb7185", // Rose
  "#f97316", // Orange
  "#facc15", // Yellow
  "#34d399", // Emerald
];

const INITIAL_OBJECTS: PhysicsObjectData[] = [
  { id: "1", type: "sphere", position: [-2, 5, 0], color: "#38bdf8", scale: 1 },
  { id: "2", type: "box", position: [2, 6, 0], color: "#c084fc", scale: 1 },
  { id: "3", type: "capsule", position: [0, 8, -2], color: "#fb7185", scale: 1 },
  { id: "4", type: "sphere", position: [-1.5, 9, 2], color: "#34d399", scale: 0.9 },
  { id: "5", type: "box", position: [1.5, 10, -1], color: "#facc15", scale: 1.1 },
  { id: "6", type: "sphere", position: [0, 12, 1.5], color: "#f97316", scale: 0.8 },
];

export default function Home() {
  const [debug, setDebug] = useState(false);
  const [objects, setObjects] = useState<PhysicsObjectData[]>(INITIAL_OBJECTS);

  const spawnObject = (type: "box" | "sphere" | "capsule") => {
    const randomColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const randomX = (Math.random() - 0.5) * 6;
    const randomZ = (Math.random() - 0.5) * 6;
    const randomY = 7 + Math.random() * 4;
    const randomScale = 0.75 + Math.random() * 0.5;

    const newObj: PhysicsObjectData = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type,
      position: [randomX, randomY, randomZ],
      color: randomColor,
      scale: randomScale,
    };

    setObjects((prev) => [...prev, newObj]);
  };

  const spawnMultiple = () => {
    const types: ("box" | "sphere" | "capsule")[] = ["box", "sphere", "capsule"];
    const newItems: PhysicsObjectData[] = Array.from({ length: 8 }, () => {
      const type = types[Math.floor(Math.random() * types.length)];
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const randomX = (Math.random() - 0.5) * 7;
      const randomZ = (Math.random() - 0.5) * 7;
      const randomY = 8 + Math.random() * 5;
      const scale = 0.7 + Math.random() * 0.5;

      return {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        type,
        position: [randomX, randomY, randomZ],
        color,
        scale,
      };
    });

    setObjects((prev) => [...prev, ...newItems]);
  };

  const handleReset = () => {
    setObjects(
      INITIAL_OBJECTS.map((obj) => ({
        ...obj,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      }))
    );
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 select-none">
      <UIOverlay
        objectCount={objects.length}
        debug={debug}
        onToggleDebug={() => setDebug((prev) => !prev)}
        onSpawn={spawnObject}
        onSpawnMultiple={spawnMultiple}
        onReset={handleReset}
      />
      <SceneContainer debug={debug} objects={objects} />
    </main>
  );
}
