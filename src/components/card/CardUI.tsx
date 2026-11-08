"use client";

import {
  CardColorSettings,
  CardStats,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
  CardFrameMode,
} from "@/types/card";
import {
  COLOR_PRESETS,
  HOLO_EFFECTS,
  FRONT_FRAME_STYLES,
  BACK_FRAME_STYLES,
} from "@/constants/card.constants";

// Re-exporta para retrocompatibilidade
export { COLOR_PRESETS, HOLO_EFFECTS, FRONT_FRAME_STYLES, BACK_FRAME_STYLES };

export interface CardUIProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  flipped: boolean;
  onToggleFlip: () => void;
  frontFrameStyle?: FrontFrameStyle;
  onChangeFrontFrameStyle?: (style: FrontFrameStyle) => void;
  backFrameStyle?: BackFrameStyle;
  onChangeBackFrameStyle?: (style: BackFrameStyle) => void;
  holoEffect?: HoloEffectType;
  onChangeHoloEffect?: (effect: HoloEffectType) => void;
  holoIntensity: number;
  onChangeHoloIntensity: (val: number) => void;
  parallaxStrength?: number;
  onChangeParallaxStrength?: (val: number) => void;
  onSelectPreset: (colors: CardColorSettings) => void;
  stats: CardStats;
  onChangeStats: (newStats: CardStats) => void;
  frameMode?: CardFrameMode;
  onChangeFrameMode?: (mode: CardFrameMode) => void;
}

export default function CardUI({
  autoRotate,
  onToggleAutoRotate,
  flipped,
  onToggleFlip,
  frontFrameStyle = "simpsons",
  onChangeFrontFrameStyle,
  backFrameStyle = "simpsons",
  onChangeBackFrameStyle,
  holoEffect = "stars",
  onChangeHoloEffect,
  holoIntensity,
  onChangeHoloIntensity,
  onSelectPreset,
  stats,
  onChangeStats,
  frameMode,
  onChangeFrameMode,
}: CardUIProps) {
  const activeFrontStyle: FrontFrameStyle = frameMode || frontFrameStyle;

  // Sincroniza a borda da frente e das costas simultaneamente
  const handleFrontStyleChange = (style: FrontFrameStyle) => {
    if (onChangeFrontFrameStyle) onChangeFrontFrameStyle(style);
    if (onChangeFrameMode) onChangeFrameMode(style);
    if (onChangeBackFrameStyle) {
      const matchingBack: BackFrameStyle =
        style === "full_art" ? "minimal" : (style as BackFrameStyle);
      onChangeBackFrameStyle(matchingBack);
    }
  };

  const updateStat = (key: keyof CardStats, delta: number) => {
    if (key === "title") return;
    const current = Number(stats[key]);
    const nextVal = Math.max(0, current + delta);
    onChangeStats({ ...stats, [key]: nextVal });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Header Superior */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        {/* Identificador da Face da Carta */}
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/85 p-3 sm:p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                flipped ? "bg-amber-400" : "bg-purple-400"
              } animate-pulse`}
            />
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {flipped
                ? "Verso: Bart Simpson 3D Holográfico"
                : "Frente: Carta Anime com Borda Multiestilo"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {flipped
              ? "Borda de Springfield sincronizada • Efeito foil iridescente • Bart 3D"
              : "Ícones temáticos (Custo 🍩, Ataque ⭐, Vida ❤️) • Bordas Frente e Verso Sincronizadas"}
          </p>
        </div>

        {/* Painel de Controle dos 3 Valores Embutidos */}
        {!flipped && activeFrontStyle !== "full_art" && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
            {/* Custo (Topo Esquerdo - Círculo / Donut) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Custo 🔵</span>
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

            {/* Ataque (Inferior Esquerdo - Estrela) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ataque ⭐</span>
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

            {/* Vida (Inferior Direito - Coração) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Vida ❤️</span>
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
      <footer className="pointer-events-auto mx-auto flex flex-col items-center gap-2 w-full max-w-4xl">
        {/* Barra 1: Seletor de Efeitos Holográficos */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/85 px-3 py-1.5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-semibold text-purple-300 mr-1 flex items-center gap-1">
            <span>✨</span> Efeito Foil:
          </span>
          {HOLO_EFFECTS.map((eff) => (
            <button
              key={eff.id}
              onClick={() => onChangeHoloEffect && onChangeHoloEffect(eff.id)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium transition cursor-pointer active:scale-95 border ${
                holoEffect === eff.id
                  ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-purple-400/50 hover:text-white"
              }`}
            >
              <span>{eff.icon}</span>
              {eff.label}
            </button>
          ))}
        </div>

        {/* Barra 2: Estilos de Borda da Carta (Sincroniza Frente e Costas) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/85 px-3 py-1.5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-semibold text-yellow-300 mr-1 flex items-center gap-1">
            <span>🍩</span> Estilo da Borda:
          </span>
          {FRONT_FRAME_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => handleFrontStyleChange(st.id)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium transition cursor-pointer active:scale-95 border ${
                activeFrontStyle === st.id || (!flipped && activeFrontStyle === st.id) || (flipped && backFrameStyle === st.id)
                  ? "bg-yellow-500 text-slate-950 border-yellow-300 font-bold shadow-md shadow-yellow-500/40"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-yellow-400/50 hover:text-white"
              }`}
            >
              <span>{st.icon}</span>
              {st.label}
            </button>
          ))}
        </div>

        {/* Barra 3: Paletas de Cor, Sliders e Rotação */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-2 sm:p-2.5 shadow-2xl backdrop-blur-lg text-xs text-slate-300">
          {/* Virar Carta (180°) */}
          <button
            onClick={onToggleFlip}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-95 shadow-md cursor-pointer ${
              flipped
                ? "bg-yellow-600 hover:bg-yellow-500 shadow-yellow-600/30 text-white"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
            }`}
          >
            <span>🔄</span>
            {flipped ? "Ver Frente (Anime)" : "Ver Verso (Bart Simpson)"}
          </button>

          <div className="h-4 w-px bg-white/15" />

          {/* Paleta Holográfica */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] text-slate-400">Cor:</span>
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onSelectPreset(preset.colors)}
                className="group flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300 transition hover:border-purple-400 hover:text-white cursor-pointer active:scale-95"
                title={preset.name}
              >
                <span
                  className={`h-2 w-2 rounded-full bg-gradient-to-r ${preset.badgeClass}`}
                />
                <span className="hidden sm:inline">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/15" />

          {/* Slider Foil */}
          <div className="flex items-center gap-1.5">
            <span>✨</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={holoIntensity}
              onChange={(e) => onChangeHoloIntensity(parseFloat(e.target.value))}
              className="w-18 sm:w-20 cursor-pointer accent-purple-500"
              title="Intensidade Foil"
            />
            <span className="min-w-5 text-[10px] text-slate-400">{holoIntensity.toFixed(1)}x</span>
          </div>

          {/* Rotação Automática */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
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
