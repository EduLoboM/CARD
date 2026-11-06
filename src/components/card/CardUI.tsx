"use client";

import { CardColorSettings } from "./Card3D";

export const COLOR_PRESETS: { name: string; colors: CardColorSettings; badgeClass: string }[] = [
  {
    name: "Roxo Místico",
    colors: {
      border: [197, 81, 245],
      base: [65, 0, 170],
    },
    badgeClass: "from-purple-500 to-indigo-500",
  },
  {
    name: "Ciano Cyber",
    colors: {
      border: [6, 182, 212],
      base: [30, 58, 138],
    },
    badgeClass: "from-cyan-400 to-blue-600",
  },
  {
    name: "Fogo Dourado",
    colors: {
      border: [251, 146, 60],
      base: [180, 83, 9],
    },
    badgeClass: "from-amber-400 to-red-600",
  },
  {
    name: "Esmeralda",
    colors: {
      border: [52, 211, 153],
      base: [6, 78, 59],
    },
    badgeClass: "from-emerald-400 to-teal-700",
  },
];

interface CardUIProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  flipped: boolean;
  onToggleFlip: () => void;
  frameMode: "full_art" | "tcg_frame";
  onToggleFrameMode: () => void;
  holoIntensity: number;
  onChangeHoloIntensity: (val: number) => void;
  onSelectPreset: (colors: CardColorSettings) => void;
}

export default function CardUI({
  autoRotate,
  onToggleAutoRotate,
  flipped,
  onToggleFlip,
  frameMode,
  onToggleFrameMode,
  holoIntensity,
  onChangeHoloIntensity,
  onSelectPreset,
}: CardUIProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                flipped ? "bg-amber-400" : "bg-sky-400"
              } animate-pulse`}
            />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Carta 3D: {flipped ? "Verso (Bart Simpson Holográfico)" : "Frente (Animação Anime)"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {flipped
              ? "Bart Simpson emoldurado pela borda holográfica 3D original, girando junto da carta"
              : "Animação fluida da cena anime com acabamento foil iridescente"}
          </p>
        </div>

        {/* Instruções */}
        <div className="pointer-events-auto hidden md:block max-w-xs rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <div className="font-semibold text-white mb-1">Controles 3D:</div>
          <ul className="space-y-1 text-slate-400">
            <li>🖱️ <strong className="text-slate-200">Arrastar mouse:</strong> gira a carta em 360°</li>
            <li>✨ <strong className="text-slate-200">Mover cursor:</strong> inclinação 3D e reflexo holográfico</li>
            <li>🔍 <strong className="text-slate-200">Scroll:</strong> zoom in / out</li>
          </ul>
        </div>
      </header>

      {/* Barra de Controles Inferior */}
      <footer className="pointer-events-auto mx-auto flex flex-col items-center gap-3 w-full max-w-3xl">
        {/* Seletor de Paleta Holográfica */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 shadow-xl backdrop-blur-md">
          <span className="text-xs font-medium text-slate-400 mr-1">Cor da Borda:</span>
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

        {/* Ajuste de Intensidade Foil */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-2 shadow-xl backdrop-blur-md text-xs text-slate-300">
          <span>✨ Efeito Foil / Brilho da Borda:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={holoIntensity}
            onChange={(e) => onChangeHoloIntensity(parseFloat(e.target.value))}
            className="w-28 cursor-pointer accent-sky-500"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-lg">
          {/* Virar Carta (180°) */}
          <button
            onClick={onToggleFlip}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition active:scale-95 shadow-md cursor-pointer ${
              flipped
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                : "bg-sky-600 hover:bg-sky-500 shadow-sky-600/30"
            }`}
          >
            <span>🔄</span>
            {flipped ? "Ver Frente (Animação)" : "Ver Verso (Bart Simpson)"}
          </button>

          {/* Alternar Moldura */}
          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <span>🎴</span>
            Frente: {frameMode === "full_art" ? "Full Art" : "Com Borda TCG"}
          </button>

          {/* Rotação Automática */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              autoRotate
                ? "bg-sky-500/20 text-sky-300 border-sky-500/50"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-white/10"
            }`}
          >
            <span>{autoRotate ? "⏸️" : "▶️"}</span>
            Giro 360°
          </button>
        </div>
      </footer>
    </div>
  );
}
