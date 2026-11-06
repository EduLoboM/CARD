"use client";

interface CardUIProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  flipped: boolean;
  onToggleFlip: () => void;
  frameMode: "full_art" | "tcg_frame";
  onToggleFrameMode: () => void;
  holoIntensity: number;
  onChangeHoloIntensity: (val: number) => void;
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
  frameMode,
  onToggleFrameMode,
  holoIntensity,
  onChangeHoloIntensity,
  bloomEnabled,
  onToggleBloom,
  bloomIntensity,
  onChangeBloomIntensity,
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
              Carta 3D: {flipped ? "Verso (Bart Simpson)" : "Frente (Animação Anime)"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Frente com animação fluida de <code className="text-sky-300">CARD_FRONT.gif</code> e verso com <code className="text-amber-300">CARD_BACK.png</code>
          </p>
        </div>

        {/* Instruções */}
        <div className="pointer-events-auto hidden md:block max-w-xs rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <div className="font-semibold text-white mb-1">Controles 3D:</div>
          <ul className="space-y-1 text-slate-400">
            <li>🖱️ <strong className="text-slate-200">Arrastar mouse:</strong> gira a carta em 360°</li>
            <li>✨ <strong className="text-slate-200">Mover cursor:</strong> reflexo holográfico dinâmico</li>
            <li>🔍 <strong className="text-slate-200">Scroll:</strong> zoom in / out</li>
          </ul>
        </div>
      </header>

      {/* Barra de Controles Inferior */}
      <footer className="pointer-events-auto mx-auto flex flex-col items-center gap-3 w-full max-w-3xl">
        {/* Ajustes de Efeito Holográfico */}
        <div className="flex flex-wrap items-center justify-center gap-5 rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-2.5 shadow-xl backdrop-blur-md text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>✨ Efeito Foil / Brilho:</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={holoIntensity}
              onChange={(e) => onChangeHoloIntensity(parseFloat(e.target.value))}
              className="w-24 cursor-pointer accent-sky-500"
            />
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          {bloomEnabled && (
            <div className="flex items-center gap-2">
              <span>Glow:</span>
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
            Moldura: {frameMode === "full_art" ? "Full Art" : "Moldura TCG"}
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

          {/* Glow / Bloom */}
          <button
            onClick={onToggleBloom}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
              bloomEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 border-white/10"
            }`}
          >
            <span>💡</span>
            Bloom
          </button>
        </div>
      </footer>
    </div>
  );
}
