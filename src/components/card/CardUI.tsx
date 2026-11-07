"use client";

import { CardColorSettings, CardFrameMode } from "./Card3D";
import { CardStats } from "./CardHUD";

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
  frameMode: CardFrameMode;
  onChangeFrameMode: (mode: CardFrameMode) => void;
  holoIntensity: number;
  onChangeHoloIntensity: (val: number) => void;
  parallaxStrength: number;
  onChangeParallaxStrength: (val: number) => void;
  onSelectPreset: (colors: CardColorSettings) => void;
  stats: CardStats;
  onChangeStats: (newStats: CardStats) => void;
}

export default function CardUI({
  autoRotate,
  onToggleAutoRotate,
  flipped,
  onToggleFlip,
  frameMode,
  onChangeFrameMode,
  holoIntensity,
  onChangeHoloIntensity,
  parallaxStrength,
  onChangeParallaxStrength,
  onSelectPreset,
  stats,
  onChangeStats,
}: CardUIProps) {
  const updateStat = (key: keyof CardStats, delta: number) => {
    if (key === "title") return;
    const current = Number(stats[key]);
    const nextVal = Math.max(0, current + delta);
    onChangeStats({ ...stats, [key]: nextVal });
  };

  const toggleFrameMode = () => {
    onChangeFrameMode(frameMode === "original" ? "full_art" : "original");
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
      {/* Header Superior */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        {/* Identificador da Face da Carta */}
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/85 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                flipped ? "bg-amber-400" : "bg-purple-400"
              } animate-pulse`}
            />
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {flipped
                ? "Verso: Bart Simpson Holográfico"
                : "Frente: Borda Original (3 Valores Embutidos)"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Valores vazados na borda original (Custo no topo, Ataque e Vida nos cantos inferiores) • Paralaxe 3D
          </p>
        </div>

        {/* Painel de Controle dos 3 Valores Embutidos */}
        {!flipped && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
            {/* Custo (Topo Esquerdo) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Custo (Topo)</span>
              <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-2 py-0.5">
                <button
                  onClick={() => updateStat("cost", -1)}
                  className="h-5 w-5 rounded bg-cyan-600/40 text-xs font-bold text-white hover:bg-cyan-600 active:scale-95 cursor-pointer"
                  title="Diminuir Custo"
                >
                  -
                </button>
                <span className="min-w-4 text-center text-xs font-black text-cyan-200">
                  {stats.cost}
                </span>
                <button
                  onClick={() => updateStat("cost", 1)}
                  className="h-5 w-5 rounded bg-cyan-600/40 text-xs font-bold text-white hover:bg-cyan-600 active:scale-95 cursor-pointer"
                  title="Aumentar Custo"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-7 w-px bg-white/10" />

            {/* Ataque (Inferior Esquerdo - O 13 da borda original) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ataque (13)</span>
              <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/60 px-2 py-0.5">
                <button
                  onClick={() => updateStat("attack", -1)}
                  className="h-5 w-5 rounded bg-amber-600/40 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 cursor-pointer"
                  title="Diminuir Ataque"
                >
                  -
                </button>
                <span className="min-w-4 text-center text-xs font-black text-amber-200">
                  {stats.attack}
                </span>
                <button
                  onClick={() => updateStat("attack", 1)}
                  className="h-5 w-5 rounded bg-amber-600/40 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 cursor-pointer"
                  title="Aumentar Ataque"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-7 w-px bg-white/10" />

            {/* Vida (Inferior Direito) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Vida</span>
              <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/60 px-2 py-0.5">
                <button
                  onClick={() => updateStat("health", -1)}
                  className="h-5 w-5 rounded bg-rose-600/40 text-xs font-bold text-white hover:bg-rose-600 active:scale-95 cursor-pointer"
                  title="Diminuir Vida"
                >
                  -
                </button>
                <span className="min-w-4 text-center text-xs font-black text-rose-200">
                  {stats.health}
                </span>
                <button
                  onClick={() => updateStat("health", 1)}
                  className="h-5 w-5 rounded bg-rose-600/40 text-xs font-bold text-white hover:bg-rose-600 active:scale-95 cursor-pointer"
                  title="Aumentar Vida"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dock de Controles Inferior */}
      <footer className="pointer-events-auto mx-auto flex flex-col items-center gap-2.5 w-full max-w-4xl">
        {/* Seletor de Paleta Holográfica */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-3.5 py-1.5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-medium text-slate-400 mr-1">Cor Holográfica:</span>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSelectPreset(preset.colors)}
              className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-200 transition hover:border-purple-400 hover:text-white cursor-pointer active:scale-95"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${preset.badgeClass}`}
              />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Sliders de Ajuste: Foil e Paralaxe */}
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-2 shadow-xl backdrop-blur-md text-xs text-slate-300">
          {/* Ajuste de Intensidade Foil */}
          <div className="flex items-center gap-2">
            <span>✨ Foil:</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={holoIntensity}
              onChange={(e) => onChangeHoloIntensity(parseFloat(e.target.value))}
              className="w-24 cursor-pointer accent-purple-500"
            />
            <span className="min-w-6 text-[11px] text-slate-400">{holoIntensity.toFixed(1)}x</span>
          </div>

          <div className="h-4 w-px bg-white/15" />

          {/* Ajuste de Intensidade da Paralaxe */}
          <div className="flex items-center gap-2">
            <span>👁️ Paralaxe:</span>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.1"
              value={parallaxStrength}
              onChange={(e) => onChangeParallaxStrength(parseFloat(e.target.value))}
              className="w-24 cursor-pointer accent-cyan-400"
            />
            <span className="min-w-6 text-[11px] text-slate-400">{parallaxStrength.toFixed(1)}x</span>
          </div>
        </div>

        {/* Botões de Ação Principais */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 rounded-2xl border border-white/10 bg-slate-950/90 p-2.5 sm:p-3 shadow-2xl backdrop-blur-lg">
          {/* Virar Carta (180°) */}
          <button
            onClick={onToggleFlip}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition active:scale-95 shadow-md cursor-pointer ${
              flipped
                ? "bg-purple-600 hover:bg-purple-500 shadow-purple-600/30"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
            }`}
          >
            <span>🔄</span>
            {flipped ? "Ver Frente (Anime)" : "Ver Verso (Bart)"}
          </button>

          {/* Alternar Modo de Visualização */}
          <button
            onClick={toggleFrameMode}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <span>🎴</span>
            Estilo: {frameMode === "original" ? "Borda Original (Valores Embutidos)" : "Arte Completa (Full Art)"}
          </button>

          {/* Rotação Automática */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              autoRotate
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 border-white/10"
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
