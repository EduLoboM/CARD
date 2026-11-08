import {
  CardColorSettings,
  CardStats,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
} from "@/types/card";

export const DEFAULT_STATS: CardStats = {
  cost: 5,
  attack: 13,
  health: 7,
  title: "GIRL WARRIORS",
};

export const HOLO_EFFECT_MAP: Record<HoloEffectType, number> = {
  cosmic: 0,
  stars: 1,
  checker: 2,
  cracked_ice: 3,
  prismatic: 4,
  gold: 5,
  glitch: 6,
};

export const COLOR_PRESETS: {
  name: string;
  colors: CardColorSettings;
  badgeClass: string;
}[] = [
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

export const HOLO_EFFECTS: { id: HoloEffectType; label: string; icon: string }[] = [
  { id: "stars", label: "Estrelas Starlight", icon: "⭐" },
  { id: "checker", label: "Xadrez Mosaic", icon: "🏁" },
  { id: "cracked_ice", label: "Gelo Quebrado", icon: "❄️" },
  { id: "prismatic", label: "Colunas Laser", icon: "⚡" },
  { id: "cosmic", label: "Arco-Íris Cósmico", icon: "🌈" },
  { id: "gold", label: "Ouro 3D Relevo", icon: "🌟" },
  { id: "glitch", label: "Cyber Glitch", icon: "👾" },
];

export const FRONT_FRAME_STYLES: { id: FrontFrameStyle; label: string; icon: string }[] = [
  { id: "simpsons", label: "Os Simpsons", icon: "🍩" },
  { id: "gold_obsidian", label: "Ouro & Obsidiana", icon: "👑" },
  { id: "cyber_matrix", label: "Cyberpunk Carbon", icon: "⚡" },
  { id: "ancient_runic", label: "Arcano & Runas", icon: "🔮" },
  { id: "retro_synthwave", label: "Retro Synthwave", icon: "🌆" },
  { id: "comic_manga", label: "Pop-Art Mangá", icon: "💥" },
  { id: "classic", label: "Clássico TCG", icon: "🎴" },
  { id: "minimal", label: "Minimalista Neon", icon: "✨" },
  { id: "full_art", label: "Full Art", icon: "🖼️" },
];

export const BACK_FRAME_STYLES: { id: BackFrameStyle; label: string; icon: string }[] = [
  { id: "simpsons", label: "Os Simpsons", icon: "🍩" },
  { id: "gold_obsidian", label: "Ouro & Obsidiana", icon: "👑" },
  { id: "cyber_matrix", label: "Cyber Shield", icon: "🛡️" },
  { id: "ancient_runic", label: "Arcano & Runas", icon: "🔮" },
  { id: "retro_synthwave", label: "Retro Synthwave", icon: "🌆" },
  { id: "comic_manga", label: "Pop-Art Mangá", icon: "💥" },
  { id: "minimal", label: "Minimalista Neon", icon: "✨" },
  { id: "original", label: "Ornato Barroco", icon: "🏛️" },
];
