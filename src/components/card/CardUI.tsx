"use client";

import { CardColorSettings } from "./Card3D";

export const COLOR_PRESETS: { name: string; colors: CardColorSettings; badgeClass: string }[] = [
  {
    name: "Roxo Místico",
    colors: {
      border: [197, 81, 245],
      base: [65, 0, 170],
      eye: [0, 150, 255],
    },
    badgeClass: "from-purple-500 to-indigo-500",
  },
  {
    name: "Ciano Cyber",
    colors: {
      border: [6, 182, 212],
      base: [30, 58, 138],
      eye: [244, 63, 94],
    },
    badgeClass: "from-cyan-400 to-blue-600",
  },
  {
    name: "Fogo Dourado",
    colors: {
      border: [251, 146, 60],
      base: [180, 83, 9],
      eye: [239, 68, 68],
    },
    badgeClass: "from-amber-400 to-red-600",
  },
  {
    name: "Esmeralda",
    colors: {
      border: [52, 211, 153],
      base: [6, 78, 59],
      eye: [250, 204, 21],
    },
    badgeClass: "from-emerald-400 to-teal-700",
  },
];

interface CardUIProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  flipped: boolean;
  onToggleFlip: () => void;
  backMode: "holographic" | "example_png";
  onToggleBackMode: () => void;
  colors: CardColorSettings;
  onSelectPreset: (colors: CardColorSettings) => void;
  bloomEnabled: boolean;
  onToggleBloom: () => void;
  bloomIntensity: number;
  onChangeBloomIntensity: (val: number) => void;
}

export default function CardUI({
  autoRotate,
  onToggleAutoRotate,
  flipped,
  onToggleFlip,
  backMode,
  onToggleBackMode,
  onSelectPreset,
  bloomEnabled,
  onToggleBloom,
  bloomIntensity,
  onChangeBloomIntensity,
}: CardUIProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/75 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Visualizador de Carta 3D Holográfica
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Shaders GLSL customizados, render-to-texture e iluminação iridescente
          </p>
        </div>

        {/* Instruções */}
        <div className="pointer-events-auto hidden md:block max-w-xs rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <div className="font-semibold text-white mb-1">Controles 3D:</div>
          <ul className="space-y-1 text-slate-400">
            <li>🖱️ <strong className="text-slate-200">Arrastar mouse:</strong> gira a carta em 360°</li>
            <li>✨ <strong className="text-slate-200">Mover cursor:</strong> inclinação holográfica</li>
            <li>🔍 <strong className="text-slate-200">Scroll:</strong> zoom in/out</li>
          </ul>
        </div>
      </header>

      {/* Barra de Controles Inferior */}
      <footer className="pointer-events-auto mx-auto flex flex-col items-center gap-3 w-full max-w-3xl">
        {/* Seletor de Paleta Holográfica */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 shadow-xl backdrop-blur-md">
          <span className="text-xs font-medium text-slate-400 mr-1">Holograma:</span>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSelectPreset(preset.colors)}
              className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 transition hover:border-purple-400 hover:text-white cursor-pointer"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${preset.badgeClass}`}
              />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-lg">
          {/* Virar Carta */}
          <button
            onClick={onToggleFlip}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500 active:scale-95 shadow-md shadow-purple-600/30 cursor-pointer"
          >
            <span>🔄</span>
            {flipped ? "Ver Frente" : "Ver Verso (180°)"}
          </button>

          {/* Alternar Verso */}
          <button
            onClick={onToggleBackMode}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <span>🎴</span>
            Verso: {backMode === "holographic" ? "Holográfico Original" : "CARD_BACK.png"}
          </button>

          {/* Rotação Automática */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              autoRotate
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-white/10"
            }`}
          >
            <span>{autoRotate ? "⏸️" : "▶️"}</span>
            Giro Automático
          </button>

          {/* Brilho Holográfico (Bloom) */}
          <button
            onClick={onToggleBloom}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              bloomEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 border-white/10"
            }`}
          >
            <span>✨</span>
            Glow / Bloom
          </button>

          {bloomEnabled && (
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[11px] text-slate-400">Intensidade:</span>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={bloomIntensity}
                onChange={(e) => onChangeBloomIntensity(parseFloat(e.target.value))}
                className="w-20 cursor-pointer accent-purple-500"
              />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
