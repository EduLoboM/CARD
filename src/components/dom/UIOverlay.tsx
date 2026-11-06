"use client";

interface UIOverlayProps {
  objectCount: number;
  debug: boolean;
  onToggleDebug: () => void;
  onSpawn: (type: "box" | "sphere" | "capsule") => void;
  onSpawnMultiple: () => void;
  onReset: () => void;
}

export default function UIOverlay({
  objectCount,
  debug,
  onToggleDebug,
  onSpawn,
  onSpawnMultiple,
  onReset,
}: UIOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <h1 className="text-lg font-bold text-white tracking-wide">
              Next.js + Three.js + R3F + Rapier
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Física em tempo real com WebGL & WebAssembly (WASM)
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-indigo-300">
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 border border-indigo-500/30">
              Objetos ativos: {objectCount}
            </span>
          </div>
        </div>

        {/* Informações e atalhos rápidos */}
        <div className="pointer-events-auto hidden sm:block max-w-xs rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <div className="font-semibold text-white mb-1.5">Como interagir:</div>
          <ul className="space-y-1 text-slate-400">
            <li>🖱️ <strong className="text-slate-200">Clique no objeto:</strong> arremessa com impulso</li>
            <li>🔄 <strong className="text-slate-200">Botão esquerdo + arrastar:</strong> orbita a câmera</li>
            <li>🔍 <strong className="text-slate-200">Scroll do mouse:</strong> zoom in/out</li>
          </ul>
        </div>
      </header>

      {/* Barra de controle inferior */}
      <footer className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-lg">
        <button
          onClick={() => onSpawn("sphere")}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <span>⚪</span>
          Esfera
        </button>

        <button
          onClick={() => onSpawn("box")}
          className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 active:scale-95 shadow-md shadow-violet-600/30 cursor-pointer"
        >
          <span>📦</span>
          Cubo
        </button>

        <button
          onClick={() => onSpawn("capsule")}
          className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-pink-500 active:scale-95 shadow-md shadow-pink-600/30 cursor-pointer"
        >
          <span>💊</span>
          Cápsula
        </button>

        <button
          onClick={onSpawnMultiple}
          className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 active:scale-95 shadow-md shadow-amber-600/30 cursor-pointer"
        >
          <span>🌧️</span>
          Chuva (+8)
        </button>

        <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

        <button
          onClick={onToggleDebug}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer border ${
            debug
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-white/10"
          }`}
        >
          <span>{debug ? "🟢" : "⚪"}</span>
          Debug Wireframes
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl bg-red-600/20 border border-red-500/30 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-600/30 active:scale-95 cursor-pointer"
        >
          <span>🔄</span>
          Resetar
        </button>
      </footer>
    </div>
  );
}
