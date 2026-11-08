import { GameSide } from "./card";

export interface HeroState {
  id: string;
  name: string;
  side: GameSide;
  health: number;
  maxHealth: number;
  // Super-Block Meter do PvZ Heroes: 8 seções. Quando atinge 8, bloqueia o dano e ativa superpoder
  blockMeter: number;
  maxBlockMeter: number;
  superpowersAvailable: number;
}
