import { GameCardDefinition, GameSide } from "./card";
import { GameLane } from "./lane";
import { HeroState } from "./hero";

/**
 * Fases de turno canônicas do PvZ Heroes:
 * 1. ZOMBIES_MINIONS: Zumbis jogam criaturas nas pistas
 * 2. PLANT_PLAY: Plantas jogam criaturas e truques nas pistas
 * 3. ZOMBIE_TRICKS: Zumbis jogam seus truques
 * 4. COMBAT: Combate pista por pista da esquerda para a direita (0 a 4)
 */
export type TurnPhase =
  | "START_TURN"
  | "ZOMBIE_MINIONS"
  | "PLANT_PLAY"
  | "ZOMBIE_TRICKS"
  | "COMBAT"
  | "ROUND_END"
  | "GAME_OVER";

export interface PlayerState {
  side: GameSide;
  hero: HeroState;
  sunOrBrains: number;
  maxSunOrBrains: number;
  hand: GameCardDefinition[];
  deck: GameCardDefinition[];
}

export interface PvZGameState {
  turnNumber: number;
  phase: TurnPhase;
  lanes: GameLane[];
  plants: PlayerState;
  zombies: PlayerState;
  winner: GameSide | null;
  combatLogs: string[];
}
