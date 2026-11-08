import { PvZGameState, TurnPhase } from "../types/game/gameState";
import { GameCardDefinition, GameSide, BoardUnit } from "../types/game/card";
import { GameLane, LaneType } from "../types/game/lane";

// Cria as 5 pistas clássicas do PvZ Heroes
export function createDefaultLanes(): GameLane[] {
  const laneTypes: LaneType[] = ["HEIGHTS", "GROUND", "GROUND", "GROUND", "WATER"];
  return laneTypes.map((type, index) => ({
    index,
    type,
    plantUnit: null,
    zombieUnit: null,
  }));
}

// Inicializa o estado inicial de jogo
export function createInitialGameState(
  plantDeck: GameCardDefinition[] = [],
  zombieDeck: GameCardDefinition[] = []
): PvZGameState {
  return {
    turnNumber: 1,
    phase: "ZOMBIE_MINIONS",
    lanes: createDefaultLanes(),
    plants: {
      side: "PLANTS",
      hero: {
        id: "hero-plant-1",
        name: "Solar Flare",
        side: "PLANTS",
        health: 20,
        maxHealth: 20,
        blockMeter: 0,
        maxBlockMeter: 8,
        superpowersAvailable: 1,
      },
      sunOrBrains: 1,
      maxSunOrBrains: 1,
      hand: plantDeck.slice(0, 4),
      deck: plantDeck.slice(4),
    },
    zombies: {
      side: "ZOMBIES",
      hero: {
        id: "hero-zombie-1",
        name: "Super Brainz",
        side: "ZOMBIES",
        health: 20,
        maxHealth: 20,
        blockMeter: 0,
        maxBlockMeter: 8,
        superpowersAvailable: 1,
      },
      sunOrBrains: 1,
      maxSunOrBrains: 1,
      hand: zombieDeck.slice(0, 4),
      deck: zombieDeck.slice(4),
    },
    winner: null,
    combatLogs: ["Partida iniciada. Fase: Zumbis jogam criaturas."],
  };
}

// Valida e joga uma carta de criatura em uma pista
export function playCardToLane(
  state: PvZGameState,
  side: GameSide,
  cardId: string,
  laneIndex: number
): { success: boolean; state: PvZGameState; error?: string } {
  if (laneIndex < 0 || laneIndex >= state.lanes.length) {
    return { success: false, state, error: "Pista inválida." };
  }

  const lane = state.lanes[laneIndex];
  const player = side === "PLANTS" ? state.plants : state.zombies;
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);

  if (cardIndex === -1) {
    return { success: false, state, error: "Carta não está na mão." };
  }

  const card = player.hand[cardIndex];

  // Verifica recurso (Sol / Cérebros)
  if (player.sunOrBrains < card.cost) {
    return { success: false, state, error: "Recursos insuficientes." };
  }

  // Verifica se a pista é aquática e a criatura tem o trait Amphibious
  if (lane.type === "WATER" && !card.traits.includes("Amphibious")) {
    return {
      success: false,
      state,
      error: "Somente criaturas Anfíbias podem ser jogadas na pista aquática.",
    };
  }

  // Verifica se a pista já está ocupada para aquele lado
  const currentSlot = side === "PLANTS" ? lane.plantUnit : lane.zombieUnit;
  if (currentSlot !== null && !card.traits.includes("TeamUp")) {
    return { success: false, state, error: "Pista já ocupada." };
  }

  // Cria a unidade no tabuleiro
  const newUnit: BoardUnit = {
    instanceId: `${card.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    cardId: card.id,
    name: card.name,
    side,
    cost: card.cost,
    attack: card.attack,
    baseAttack: card.attack,
    health: card.health,
    maxHealth: card.health,
    traits: [...card.traits],
    laneIndex,
  };

  // Se estiver na pista de altura (HEIGHTS), unidades terrestres podem receber bônus de terreno
  if (lane.type === "HEIGHTS") {
    newUnit.attack += 1;
  }

  // Imutabilidade do estado
  const updatedLanes = state.lanes.map((l, idx) => {
    if (idx !== laneIndex) return l;
    return {
      ...l,
      plantUnit: side === "PLANTS" ? newUnit : l.plantUnit,
      zombieUnit: side === "ZOMBIES" ? newUnit : l.zombieUnit,
    };
  });

  const updatedHand = player.hand.filter((_, idx) => idx !== cardIndex);
  const updatedPlayer = {
    ...player,
    sunOrBrains: player.sunOrBrains - card.cost,
    hand: updatedHand,
  };

  const nextState: PvZGameState = {
    ...state,
    lanes: updatedLanes,
    plants: side === "PLANTS" ? updatedPlayer : state.plants,
    zombies: side === "ZOMBIES" ? updatedPlayer : state.zombies,
    combatLogs: [
      ...state.combatLogs,
      `${side === "PLANTS" ? "Planta" : "Zumbi"} jogou ${card.name} na Pista ${laneIndex + 1} (${lane.type}).`,
    ],
  };

  return { success: true, state: nextState };
}
