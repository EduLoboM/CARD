import { CardTrait } from "./traits";
import { FrontFrameStyle, HoloEffectType } from "../card";

export type CardType = "FIGHTER" | "TRICK" | "ENVIRONMENT";
export type GameSide = "PLANTS" | "ZOMBIES";

export interface GameCardDefinition {
  id: string;
  name: string;
  description: string;
  side: GameSide;
  type: CardType;
  cost: number;
  attack: number;
  health: number;
  traits: CardTrait[];
  tribe?: string;
  visual?: {
    frameStyle?: FrontFrameStyle;
    holoEffect?: HoloEffectType;
    mediaUrl?: string;
  };
}

export interface BoardUnit {
  instanceId: string;
  cardId: string;
  name: string;
  side: GameSide;
  cost: number;
  attack: number;
  baseAttack: number;
  health: number;
  maxHealth: number;
  traits: CardTrait[];
  laneIndex: number;
  hasAttackedThisTurn?: boolean;
}
