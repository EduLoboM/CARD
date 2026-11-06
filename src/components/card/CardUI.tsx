"use client";

import { CardColorSettings } from "./Card3D";
import { HearthstoneStats } from "./HearthstoneFrame";

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
  frameMode: "full_art" | "hearthstone";
  onToggleFrameMode: () => void;
  holoIntensity: number;
  onChangeHoloIntensity: (val: number) => void;
  onSelectPreset: (colors: CardColorSettings) => void;
  stats: HearthstoneStats;
  onChangeStats: (newStats: HearthstoneStats) => void;
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
  stats,
  onChangeStats,
}: CardUIProps) {
  const updateStat = (key: keyof HearthstoneStats, delta: number) => {
    const current = Number(stats[key]);
    const nextVal = Math.max(0, current + delta);
    onChangeStats({ ...stats, [key]: nextVal });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      {/* Header Superior */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                flipped ? "bg-amber-400" : "bg-blue-400"
              } animate-pulse`}
            />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {flipped
                ? "Verso daCarta:Bart Simpson (Fundo Completo + Moldura)"
                : "Frente da Carta: Hearthstone Card (3 Valores)"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {flipped
              ? "Bart Simpsonpreenche emoldurado100% peladadepontaaponta, a borda holográfica sobreposta"
              : "Interface clássica de Hearthstone com Custo de Mana, Ataque, Vida e Retrato de Lacaio"}
          </p>
        </div>

        {/* Painel de Controle dos 3 Valores de Hearthstone */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-md">
          {/* Custo de Mana */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Custo</span>
            <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-950/60 px-2 py-1">
              <button
                onClick={() => updateStat("cost", -1)}
                className="h-5 w-5 rounded bg-blue-600/40 text-xs font-bold text-white hover:bg-blue-600 cursor-pointer"
              >
                -
              </button>
              <span className="min-w-5 text-center text-sm font-black text-blue-200">
                {stats.cost}
              </span>
              <button
                onClick={() => updateStat("cost", 1)}
                className="h-5 w-5 rounded bg-blue-600/40 text-xs font-bold text-white hover:bg-blue-600 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Ataque */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ataque</span>
            <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/60 px-2 py-1">
              <button
                onClick={() => updateStat("attack", -1)}
                className="h-5 w-5 rounded bg-amber-600/40 text-xs font-bold text-white hover:bg-amber-600 cursor-pointer"
              >
                -
              </button>
              <span className="min-w-5 text-center text-sm font-black text-amber-200">
                {stats.attack}
              </span>
              <button
                onClick={() => updateStat("attack", 1)}
                className="h-5 w-5 rounded bg-amber-600/40 text-xs font-bold text-white hover:bg-amber-600 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Vida */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Vida</span>
            <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-950/60 px-2 py-1">
              <button
                onClick={() => updateStat("health", -1)}
                className="h-5 w-5 rounded bg-red-600/40 text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
              >
                -
              </button>
              <span className="min-w-5 text-center text-sm font-black text-red-200">
                {stats.health}
              </span>
              <button
                onClick={() => updateStat("health", 1)}
                className="h-5 w-5 rounded bg-red-600/40 text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
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
              className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 transition hover:border-amber-400 hover:text-white cursor-pointer"
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
          <span>✨ Intensidade do Brilho / Foil:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={holoIntensity}
            onChange={(e) => onChangeHoloIntensity(parseFloat(e.target.value))}
            className="w-28 cursor-pointer accent-amber-500"
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
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
            }`}
          >
            <span>🔄</span>
            {flipped ? "Ver Frente (Hearthstone)" : "Ver Verso (Bart Simpson)"}
          </button>

          {/* Alternar Moldura Hearthstone vs Full Art */}
          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <span>🎴</span>
            Estilo: {frameMode === "hearthstone" ? "Moldura Hearthstone" : "Arte Completa (Full Art)"}
          </button>

          {/* Rotação Automática */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              autoRotate
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
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
