import { PvZGameState } from "../types/game/gameState";
import { BoardUnit, GameSide } from "../types/game/card";
import { HeroState } from "../types/game/hero";

// Aplica dano a uma unidade considerando Armored
function applyDamageToUnit(target: BoardUnit, rawDamage: number, attackerTraits: string[]): number {
  if (rawDamage <= 0) return 0;
  let finalDamage = rawDamage;

  if (target.traits.includes("Armored")) {
    finalDamage = Math.max(1, finalDamage - 1);
  }

  if (attackerTraits.includes("Deadly")) {
    target.health = 0;
  } else {
    target.health = Math.max(0, target.health - finalDamage);
  }

  return finalDamage;
}

// Aplica dano ao herói considerando o Super-Block Meter do PvZ Heroes
function applyDamageToHero(
  hero: HeroState,
  damage: number,
  attackerTraits: string[]
): { actualDamage: number; blocked: boolean; log: string } {
  if (damage <= 0 || hero.health <= 0) {
    return { actualDamage: 0, blocked: false, log: "" };
  }

  // Bullseye não carrega o Super-Block Meter
  const isBullseye = attackerTraits.includes("Bullseye");

  if (!isBullseye && hero.blockMeter < hero.maxBlockMeter) {
    const charge = 2;
    hero.blockMeter = Math.min(hero.maxBlockMeter, hero.blockMeter + charge);

    // Se atingiu o medidor cheio (8), bloqueia 100% do dano!
    if (hero.blockMeter >= hero.maxBlockMeter) {
      hero.blockMeter = 0; // Consome o escudo
      hero.superpowersAvailable += 1;
      return {
        actualDamage: 0,
        blocked: true,
        log: `🛡️ SUPER-BLOCK ATIVADO! O ataque de ${damage} no Herói ${hero.name} foi totalmente bloqueado!`,
      };
    }
  }

  hero.health = Math.max(0, hero.health - damage);
  return {
    actualDamage: damage,
    blocked: false,
    log: `Herói ${hero.name} recebeu ${damage} de dano (HP restante: ${hero.health}/20).`,
  };
}

// Executa a fase de combate canônica do PvZ Heroes: pista por pista, da esquerda para a direita (0 a 4)
export function resolveCombatPhase(state: PvZGameState): PvZGameState {
  const nextLanes = state.lanes.map((lane) => ({
    ...lane,
    plantUnit: lane.plantUnit ? { ...lane.plantUnit } : null,
    zombieUnit: lane.zombieUnit ? { ...lane.zombieUnit } : null,
  }));

  const plantHero: HeroState = { ...state.plants.hero };
  const zombieHero: HeroState = { ...state.zombies.hero };
  const logs: string[] = [...state.combatLogs, "--- INÍCIO DA FASE DE COMBATE (Pistas 1 a 5) ---"];

  for (let i = 0; i < nextLanes.length; i++) {
    const lane = nextLanes[i];
    const laneNum = i + 1;
    let plant = lane.plantUnit;
    let zombie = lane.zombieUnit;

    if (!plant && !zombie) {
      continue;
    }

    logs.push(`📍 Pista ${laneNum} (${lane.type}):`);

    // Cenário 1: Planta e Zumbi se enfrentam
    if (plant && zombie) {
      const plantAtk = plant.attack;
      const zombieAtk = zombie.attack;

      applyDamageToUnit(zombie, plantAtk, plant.traits);
      applyDamageToUnit(plant, zombieAtk, zombie.traits);

      logs.push(
        `  ${plant.name} (${plantAtk} ATK) atacou ${zombie.name}. ${zombie.name} (${zombieAtk} ATK) contra-atacou simultaneamente.`
      );

      // Trait Strikethrough
      if (plant.traits.includes("Strikethrough") && plantAtk > 0) {
        const res = applyDamageToHero(zombieHero, plantAtk, plant.traits);
        logs.push(`  🌿 [Strikethrough] ${res.log}`);
      }
      if (zombie.traits.includes("Strikethrough") && zombieAtk > 0) {
        const res = applyDamageToHero(plantHero, zombieAtk, zombie.traits);
        logs.push(`  🧟 [Strikethrough] ${res.log}`);
      }

      // Trait Frenzy do Zumbi
      if (zombie.traits.includes("Frenzy") && plant.health <= 0 && zombie.health > 0) {
        logs.push(`  🔥 [Frenzy] ${zombie.name} destruiu o inimigo e ataca novamente direto no Herói das Plantas!`);
        const frenzyRes = applyDamageToHero(plantHero, zombie.attack, zombie.traits);
        logs.push(`  ${frenzyRes.log}`);
      }

      // Remove unidades destruídas
      if (plant.health <= 0) {
        logs.push(`  💀 ${plant.name} foi destruído.`);
        lane.plantUnit = null;
      }
      if (zombie.health <= 0) {
        logs.push(`  💀 ${zombie.name} foi destruído.`);
        lane.zombieUnit = null;
      }
    }
    // Cenário 2: Planta ataca Herói Zumbi diretamente
    else if (plant && !zombie) {
      let atk = plant.attack;
      if (plant.traits.includes("AntiHero")) {
        atk += 2;
        logs.push(`  ⚡ [Anti-Hero] ${plant.name} ganha +2 de ataque por pista vazia!`);
      }
      const res = applyDamageToHero(zombieHero, atk, plant.traits);
      logs.push(`  ${plant.name} atacou o Herói Zumbi diretamente! ${res.log}`);
    }
    // Cenário 3: Zumbi ataca Herói das Plantas diretamente
    else if (zombie && !plant) {
      let atk = zombie.attack;
      if (zombie.traits.includes("AntiHero")) {
        atk += 2;
        logs.push(`  ⚡ [Anti-Hero] ${zombie.name} ganha +2 de ataque por pista vazia!`);
      }
      const res = applyDamageToHero(plantHero, atk, zombie.traits);
      logs.push(`  ${zombie.name} atacou o Herói das Plantas diretamente! ${res.log}`);
    }

    if (plantHero.health <= 0 || zombieHero.health <= 0) {
      break;
    }
  }

  let winner: GameSide | null = null;
  if (zombieHero.health <= 0 && plantHero.health > 0) {
    winner = "PLANTS";
    logs.push("🏆 VITÓRIA DAS PLANTAS! O Herói Zumbi foi derrotado!");
  } else if (plantHero.health <= 0 && zombieHero.health > 0) {
    winner = "ZOMBIES";
    logs.push("🏆 VITÓRIA DOS ZUMBIS! O Herói das Plantas foi derrotado!");
  } else if (plantHero.health <= 0 && zombieHero.health <= 0) {
    winner = null;
    logs.push("EMPATE! Ambos os heróis caíram simultaneamente.");
  }

  return {
    ...state,
    phase: winner ? "GAME_OVER" : "ROUND_END",
    lanes: nextLanes,
    plants: {
      ...state.plants,
      hero: plantHero,
    },
    zombies: {
      ...state.zombies,
      hero: zombieHero,
    },
    winner,
    combatLogs: logs,
  };
}
