export interface CardStats {
  cost: number;
  attack: number;
  health: number;
  title: string;
}

export interface CardColorSettings {
  border: [number, number, number];
  base: [number, number, number];
}

export type FrontFrameStyle =
  | "simpsons"
  | "gold_obsidian"
  | "cyber_matrix"
  | "ancient_runic"
  | "retro_synthwave"
  | "comic_manga"
  | "classic"
  | "minimal"
  | "full_art";

export type BackFrameStyle =
  | "simpsons"
  | "gold_obsidian"
  | "cyber_matrix"
  | "ancient_runic"
  | "retro_synthwave"
  | "comic_manga"
  | "minimal"
  | "original";

export type HoloEffectType =
  | "cosmic"
  | "stars"
  | "checker"
  | "cracked_ice"
  | "prismatic"
  | "gold"
  | "glitch";

// Alias para retrocompatibilidade
export type CardFrameMode = FrontFrameStyle;
