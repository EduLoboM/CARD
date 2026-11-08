import test from "node:test";
import assert from "node:assert";

import { createInitialGameState, playCardToLane } from "../../src/engine/gameState";
import { resolveCombatPhase } from "../../src/engine/combat";
import { PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS } from "../../src/data/cards/starterDeck";

test("PvZ Heroes Engine: Inicialização de partida", () => {
  const state = createInitialGameState(PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS);

  assert.strictEqual(state.turnNumber, 1);
  assert.strictEqual(state.lanes.length, 5);
  assert.strictEqual(state.lanes[0].type, "HEIGHTS");
  assert.strictEqual(state.lanes[1].type, "GROUND");
  assert.strictEqual(state.lanes[2].type, "GROUND");
  assert.strictEqual(state.lanes[3].type, "GROUND");
  assert.strictEqual(state.lanes[4].type, "WATER");

  assert.strictEqual(state.plants.hero.health, 20);
  assert.strictEqual(state.zombies.hero.health, 20);
});

test("PvZ Heroes Engine: Restrição de pista aquática (Amphibious)", () => {
  let state = createInitialGameState(PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS);
  state.plants.sunOrBrains = 10;

  // Tenta jogar Disparervilha (não anfíbia) na Lane 4 (Water) -> DEVE FALHAR
  const nonAmphibiousCard = PLANT_STARTER_CARDS.find((c) => c.name === "Disparervilha")!;
  const failResult = playCardToLane(state, "PLANTS", nonAmphibiousCard.id, 4);
  assert.strictEqual(failResult.success, false);

  // Joga Vitória-Régia Aquática (Amphibious) na Lane 4 (Water) -> DEVE TER SUCESSO
  const amphibiousCard = PLANT_STARTER_CARDS.find((c) => c.traits.includes("Amphibious"))!;
  const successResult = playCardToLane(state, "PLANTS", amphibiousCard.id, 4);
  assert.strictEqual(successResult.success, true);
  assert.strictEqual(successResult.state.lanes[4].plantUnit?.name, amphibiousCard.name);
});

test("PvZ Heroes Engine: Bônus de terreno elevado (Heights Lane)", () => {
  let state = createInitialGameState(PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS);
  state.plants.sunOrBrains = 10;

  const warrior = PLANT_STARTER_CARDS.find((c) => c.name === "Girl Warrior")!;
  const result = playCardToLane(state, "PLANTS", warrior.id, 0); // Lane 0 é HEIGHTS

  assert.strictEqual(result.success, true);
  // Ataque base 4 + 1 de bônus de altura = 5
  assert.strictEqual(result.state.lanes[0].plantUnit?.attack, 5);
});

test("PvZ Heroes Engine: Resolução de combate pista por pista com Armored e Bullseye", () => {
  let state = createInitialGameState(PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS);
  state.plants.sunOrBrains = 10;
  state.zombies.sunOrBrains = 10;

  // Planta: Girl Warrior (4 ATK, 4 HP, Bullseye) na Pista 1 (Ground)
  const warrior = PLANT_STARTER_CARDS.find((c) => c.name === "Girl Warrior")!;
  state = playCardToLane(state, "PLANTS", warrior.id, 1).state;

  // Zumbi: Conehead (2 ATK, 3 HP, Armored) na Pista 1 (Ground)
  const conehead = ZOMBIE_STARTER_CARDS.find((c) => c.name === "Zumbi Cone Blindado")!;
  state = playCardToLane(state, "ZOMBIES", conehead.id, 1).state;

  // Combate
  const combatState = resolveCombatPhase(state);

  // Conehead recebe 4 de dano - 1 de Armored = 3 de dano. Vida 3 - 3 = 0 -> Destruído!
  assert.strictEqual(combatState.lanes[1].zombieUnit, null);

  // Girl Warrior recebe 2 de dano. Vida 4 - 2 = 2 -> Sobreviveu!
  assert.strictEqual(combatState.lanes[1].plantUnit?.health, 2);
});

test("PvZ Heroes Engine: Ataque direto ao herói e vitória", () => {
  let state = createInitialGameState(PLANT_STARTER_CARDS, ZOMBIE_STARTER_CARDS);
  state.plants.sunOrBrains = 10;
  // Herói Zumbi com apenas 4 HP
  state.zombies.hero.health = 4;

  const warrior = PLANT_STARTER_CARDS.find((c) => c.name === "Girl Warrior")!;
  state = playCardToLane(state, "PLANTS", warrior.id, 1).state;

  // Ninguém bloqueando na pista 1
  const combatState = resolveCombatPhase(state);

  // Herói Zumbi recebeu 4 de dano e foi a 0
  assert.strictEqual(combatState.zombies.hero.health, 0);
  assert.strictEqual(combatState.winner, "PLANTS");
  assert.strictEqual(combatState.phase, "GAME_OVER");
});
